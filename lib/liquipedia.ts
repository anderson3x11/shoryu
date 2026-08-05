import { unstable_cache } from 'next/cache'
import { parse } from './liquipedia-parse'
import type { TournamentYear } from './liquipedia-parse'
import snapshot from './data/tournaments.json'

export type { Player, Tournament, TournamentYear } from './liquipedia-parse'

// Liquipedia serves its raw HTML pages behind a Cloudflare challenge (403); the
// MediaWiki API is the sanctioned path and returns the same rendered HTML in
// parse.text['*']. Throws on failure so unstable_cache never caches an empty
// result. undici sends/decodes gzip automatically — do NOT set Accept-Encoding
// manually (that disables auto-decompression).
async function fetchTournamentsFromApi(): Promise<TournamentYear[]> {
  const page = encodeURIComponent('Street_Fighter_6/Tier_1_Tournaments')
  const res = await fetch(
    `https://liquipedia.net/fighters/api.php?action=parse&page=${page}&prop=text&format=json`,
    {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Shoryu/1.0 (https://shoryu.site; https://x.com/shoryuapp)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }
  )
  if (!res.ok) throw new Error(`Liquipedia API ${res.status}`)
  const json = await res.json()
  const html: string | undefined = json?.parse?.text?.['*'] ?? json?.parse?.text
  if (!html) throw new Error('Liquipedia API returned no HTML')
  const years = parse(html)
  if (years.length === 0) throw new Error('Liquipedia API parsed to 0 tournaments')
  return years
}

// The fallback to the committed snapshot has to happen INSIDE the cached function.
// unstable_cache stores nothing when its callback rejects, so catching the failure
// outside meant every dynamic render re-ran the fetch — and Liquipedia holds the
// connection ~5.5s before answering 429, so that stall was paid on every request to
// every non-prerendered page (the banner renders in the root layout). Returning the
// snapshot instead of throwing gives the cache something to keep, capping the cost at
// one slow render per revalidate window.
const cachedTournaments = unstable_cache(
  async (): Promise<TournamentYear[]> => {
    try {
      const live = await fetchTournamentsFromApi()
      if (live.length) return live
    } catch {
      // fall through to the snapshot
    }
    return snapshot as TournamentYear[]
  },
  ['liquipedia-tournaments-v4'],
  { revalidate: 86400, tags: ['tournaments'] }
)

// Live Liquipedia data when the host can reach the API, the committed snapshot
// otherwise (regenerate it with scripts/refresh-tournaments).
export async function getTournaments(): Promise<TournamentYear[]> {
  return cachedTournaments()
}
