import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.streetfighter.com',
        pathname: '/6/buckler/assets/**',
      },
    ],
  },
}

export default nextConfig
