import type { NextConfig } from 'next'

// Umami is the only third-party script, and it also posts its events back to its own origin.
const UMAMI_ORIGIN = process.env.NEXT_PUBLIC_UMAMI_URL ? new URL(process.env.NEXT_PUBLIC_UMAMI_URL).origin : ''

// 'unsafe-inline' for scripts is required by the App Router's inline bootstrap scripts unless
// every page is rendered with a per-request nonce, which would turn off static/ISR caching.
// The policy still blocks scripts from any other origin, plugins, <base> hijacking and framing.
// 'unsafe-eval' is only needed by React's dev tooling.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? `'unsafe-eval' ` : ''}${UMAMI_ORIGIN}`,
  `style-src 'self' 'unsafe-inline'`,
  // Video thumbnails are loaded straight from their host (unoptimized).
  `img-src 'self' data: https:`,
  `font-src 'self'`,
  `connect-src 'self' ${UMAMI_ORIGIN}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  // No includeSubDomains: other subdomains (analytics, the hosting panel) are managed separately.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.streetfighter.com',
        pathname: '/6/buckler/assets/**',
      },
      {
        // Move screenshots and hitbox overlays on the character pages. The wiki only
        // serves full-size PNGs (its thumbnails are generated per-file and often absent),
        // so these go through the Next image optimizer: it pulls each original once,
        // caches it, and serves a resized WebP.
        protocol: 'https',
        hostname: 'wiki.supercombo.gg',
        pathname: '/images/**',
      },
    ],
  },
}

export default nextConfig
