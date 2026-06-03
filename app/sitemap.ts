import type { MetadataRoute } from 'next'
import { CHARACTERS } from '@/lib/constants/characters'
import { PRO_PLAYERS } from '@/lib/data/pro-players'

const BASE = 'https://shoryu.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE,                   priority: 1.0,  changeFrequency: 'daily'   },
    { url: `${BASE}/ranking`,      priority: 0.9,  changeFrequency: 'hourly'  },
    { url: `${BASE}/tournaments`,  priority: 0.8,  changeFrequency: 'weekly'  },
    { url: `${BASE}/pros`,         priority: 0.7,  changeFrequency: 'weekly'  },
    { url: `${BASE}/streetdle`,    priority: 0.7,  changeFrequency: 'daily'   },
    { url: `${BASE}/about`,        priority: 0.3,  changeFrequency: 'monthly' },
    { url: `${BASE}/changelog`,    priority: 0.3,  changeFrequency: 'weekly'  },
  ] satisfies MetadataRoute.Sitemap

  const characterPages = CHARACTERS
    .filter(c => !c.comingSoon && !c.hidden)
    .map(c => ({
      url: `${BASE}/character/${c.slug}`,
      priority: 0.8 as const,
      changeFrequency: 'monthly' as const,
    }))

  const proPlayerPages = PRO_PLAYERS.map(p => ({
    url: `${BASE}/player/${p.short_id}`,
    priority: 0.6 as const,
    changeFrequency: 'daily' as const,
  }))

  return [...staticPages, ...characterPages, ...proPlayerPages]
}
