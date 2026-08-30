import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_HOST = 'liquipedia.net'

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

  const upstream = await fetch(url, {
    headers: { Referer: 'https://liquipedia.net/' },
    next: { revalidate: 604800 }, // 1 week — icons don't change
  })

  if (!upstream.ok) return new NextResponse(null, { status: upstream.status })

  const contentType = upstream.headers.get('content-type') ?? 'image/png'
  const body = await upstream.arrayBuffer()

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=604800, immutable',
    },
  })
}
