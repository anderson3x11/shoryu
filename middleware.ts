import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Next.js internal requests (RSC navigation, prefetch)
  if (
    request.headers.get('rsc') === '1' ||
    request.headers.get('next-router-prefetch') === '1'
  ) {
    return NextResponse.next()
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
    return new NextResponse(null, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/player/:path*',
}
