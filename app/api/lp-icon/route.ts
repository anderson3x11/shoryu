import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOST = 'liquipedia.net'
const IMAGE_PATH = /^\/[a-z]+\/images\//
const MAX_BYTES = 1024 * 1024 // icons are a few KB

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return new NextResponse(null, { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  // Exact host or a subdomain of it. A bare endsWith would also accept "evilliquipedia.net",
  // turning this into an open image proxy for any domain with that suffix.
  const host = parsed.hostname.toLowerCase()
  if (host !== ALLOWED_HOST && !host.endsWith(`.${ALLOWED_HOST}`)) {
    return new NextResponse(null, { status: 403 })
  }
  // Only wiki image files (/commons/images/..., /fighters/images/...), never regular pages:
  // otherwise any Liquipedia HTML page could be served from our origin.
  if (parsed.protocol !== 'https:' || !IMAGE_PATH.test(parsed.pathname)) {
    return new NextResponse(null, { status: 403 })
  }

  let upstream: Response
  try {
    upstream = await fetch(parsed, {
      headers: { Referer: 'https://liquipedia.net/' },
      // A redirect could point anywhere, which would undo the host check above.
      redirect: 'error',
      next: { revalidate: 604800 }, // 1 week, icons don't change
    })
  } catch {
    return new NextResponse(null, { status: 502 })
  }

  if (!upstream.ok) return new NextResponse(null, { status: upstream.status })

  // Raster images only: SVG can carry script, and anything else has no business here.
  const contentType = upstream.headers.get('content-type') ?? ''
  if (!/^image\/(png|jpeg|gif|webp)$/i.test(contentType.split(';')[0].trim())) {
    return new NextResponse(null, { status: 415 })
  }
  const body = await upstream.arrayBuffer()
  if (body.byteLength > MAX_BYTES) return new NextResponse(null, { status: 413 })

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=604800, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
