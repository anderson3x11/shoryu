import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/locales'

export function middleware(request: NextRequest) {
  // Canonicalize www.shoryu.site -> shoryu.site (Google was indexing both as duplicates)
  const host = request.headers.get('host') ?? ''
  if (host.startsWith('www.')) {
    const url = request.nextUrl.clone()
    // Assign hostname, not host: the `host` setter keeps the existing port when the value
    // it's given has none, and behind the proxy nextUrl carries the container's internal
    // listen port, which then leaked into the redirect as shoryu.site:3000.
    url.hostname = host.slice(4).split(':')[0]
    url.port = ''
    return NextResponse.redirect(url, 308)
  }

  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1] ?? ''

  // Routes live under app/[locale]. English is unprefixed in the URL, so /ranking is rewritten to
  // the internal /en/ranking — a rewrite, not a redirect, which keeps one cache entry per locale
  // path. /en/... is a duplicate of the bare path, so it redirects to it.
  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }
  const locale = isLocale(first) ? first : DEFAULT_LOCALE
  // The path as the app sees it, locale segment removed, for the checks below.
  const bare = isLocale(first) ? pathname.slice(first.length + 1) || '/' : pathname
  const rewrite = () => {
    if (locale !== DEFAULT_LOCALE) return NextResponse.next()
    const url = request.nextUrl.clone()
    url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
    return NextResponse.rewrite(url)
  }

  if (pathname.startsWith('/api/')) return NextResponse.next()

  if (!bare.startsWith('/player/')) {
    return rewrite()
  }

  // Next.js internal requests (RSC navigation, prefetch)
  if (
    request.headers.get('rsc') === '1' ||
    request.headers.get('next-router-prefetch') === '1'
  ) {
    return rewrite()
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

  return rewrite()
}

// Broad enough to catch every page for the www redirect, but skips anything with a file
// extension so the ~70 character portraits and other /public assets don't each pay a
// middleware invocation on top of being served.
export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)'],
}
