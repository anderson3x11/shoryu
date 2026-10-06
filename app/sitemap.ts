import type { MetadataRoute } from 'next'
import { CHARACTERS } from '@/lib/constants/characters'
import { LOCALES, localeHref } from '@/lib/i18n/locales'

const BASE = 'https://shoryu.site'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE,                   priority: 1.0,  changeFrequency: 'daily'   },
    { url: `${BASE}/ranking`,      priority: 0.9,  changeFrequency: 'hourly'  },
    { url: `${BASE}/tournaments`,  priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${BASE}/stats`,         priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/pros`,         priority: 0.7,  changeFrequency: 'weekly'  },
    { url: `${BASE}/streetdle`,    priority: 0.7,  changeFrequency: 'daily'   },
    { url: `${BASE}/guides`,       priority: 0.6,  changeFrequency: 'weekly'  },
    { url: `${BASE}/about`,        priority: 0.3,  changeFrequency: 'monthly' },
    { url: `${BASE}/faq`,          priority: 0.4,  changeFrequency: 'monthly' },
    { url: `${BASE}/changelog`,    priority: 0.3,  changeFrequency: 'weekly'  },
  ] satisfies MetadataRoute.Sitemap

  const characterPages = CHARACTERS
    .filter(c => !c.comingSoon && !c.hidden)
    .map(c => ({
      url: `${BASE}/character/${c.slug}`,
      priority: 0.8 as const,
      changeFrequency: 'monthly' as const,
    }))

  // Individual /player/ pages are intentionally omitted: robots.txt disallows /player/ (so
  // crawlers don't trigger Buckler profile fetches), so sitemapping them would be contradictory.
  // Each page exists in every locale: English unprefixed, the others under /ja and /pt-br.
  return [...staticPages, ...characterPages].flatMap((entry) =>
    LOCALES.map((locale) => ({
      ...entry,
      url: `${BASE}${localeHref(locale, entry.url.slice(BASE.length) || '/')}`,
    })),
  )
}
