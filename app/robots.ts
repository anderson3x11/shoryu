import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/player/', '/api/'] },
    ],
    sitemap: 'https://shoryu.site/sitemap.xml',
  }
}
