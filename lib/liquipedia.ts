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

const cachedTournaments = unstable_cache(fetchTournamentsFromApi, ['liquipedia-tournaments-v3'], {
  revalidate: 86400,
  tags: ['tournaments'],
})

// The production host cannot reach Liquipedia (its datacenter IP is Cloudflare-
// challenged) even though the API works fine elsewhere, so a live fetch there
// fails. We ship a committed snapshot (regenerate with scripts/refresh-tournaments)
// and only prefer live data when the host can actually reach the API.
export async function getTournaments(): Promise<TournamentYear[]> {
  try {
    const live = await cachedTournaments()
    return live.length ? live : (snapshot as TournamentYear[])
  } catch {
    return snapshot as TournamentYear[]
  }
}
