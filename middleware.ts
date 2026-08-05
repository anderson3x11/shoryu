import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Canonicalize www.shoryu.site -> shoryu.site (Google was indexing both as duplicates)
  const host = request.headers.get('host') ?? ''
  if (host.startsWith('www.')) {
    const url = request.nextUrl.clone()
    url.host = host.slice(4)
    return NextResponse.redirect(url, 308)
  }

  if (!request.nextUrl.pathname.startsWith('/player/')) {
    return NextResponse.next()
  }

  // Next.js internal requests (RSC navigation, prefetch)
  if (
    request.headers.get('rsc') === '1' ||
    request.headers.get('next-router-prefetch') === '1'
  ) {
    return NextResponse.next()
  }

  // Block bot that passes player ID as nxtPid query param
  if (request.nextUrl.searchParams.has('nxtPid')) {
    return new NextResponse(null, { status: 403 })
  }

  const ua = request.headers.get('user-agent') ?? ''

  // Block known programmatic clients
  if (/python-requests|curl\/|wget\/|go-http-client|scrapy|okhttp|python\//i.test(ua)) {
    return new NextResponse(null, { status: 403 })
  }

  // Real browsers always send Sec-Fetch-Mode on page navigations
  // Programmatic HTTP clients (requests, curl, etc.) never do
  const secFetchMode = request.headers.get('sec-fetch-mode')
  if (!secFetchMode) {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    console.log(`[bot-block] ${ip} → ${request.nextUrl.pathname}`)
    return new NextResponse(null, { status: 403 })
  }

  return NextResponse.next()
}

// Broad enough to catch every page for the www redirect, but skips anything with a file
// extension so the ~70 character portraits and other /public assets don't each pay a
// middleware invocation on top of being served.
export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)'],
}
