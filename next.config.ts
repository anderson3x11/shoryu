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
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://shoryu.site/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
