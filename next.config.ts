import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
