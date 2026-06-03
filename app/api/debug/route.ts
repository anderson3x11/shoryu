import { getSessionCookie } from '@/lib/buckler/auth'
import { NextRequest } from 'next/server'

const BUCKLER_BASE = 'https://www.streetfighter.com/6/buckler'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// Test player: Mister Crimson (known pro player)
const DEFAULT_SHORT_ID = '3921133935'

async function fetchRaw(path: string): Promise<{ ok: boolean; status: number; pageProps: unknown; keys: string[] }> {
  const cookie = getSessionCookie()
  const headers: Record<string, string> = {
    'User-Agent': UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'identity',
  }
  if (cookie) headers.Cookie = cookie

  try {
    const res = await fetch(`${BUCKLER_BASE}${path}`, { headers, cache: 'no-store' })
    if (!res.ok) return { ok: false, status: res.status, pageProps: null, keys: [] }

    const html = await res.text()
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
    if (!match) return { ok: true, status: res.status, pageProps: null, keys: ['NO_NEXT_DATA'] }

    const data = JSON.parse(match[1])
    const pageProps = data.props?.pageProps ?? {}
    const keys = Object.keys(pageProps)
    return { ok: true, status: res.status, pageProps, keys }
  } catch (e) {
    return { ok: false, status: 0, pageProps: String(e), keys: [] }
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const id = searchParams.get('id') ?? DEFAULT_SHORT_ID

  // Mode: raw dump of a specific path
  const rawPath = searchParams.get('path')
  if (rawPath) {
    const result = await fetchRaw(rawPath)
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } })
  }

  // Mode: season dump — fetch profile for a specific season_id
  const season = searchParams.get('season')
  if (season) {
    const [withParam, noParam] = await Promise.all([
      fetchRaw(`/en/profile/${id}?season_id=${season}`),
      fetchRaw(`/en/profile/${id}?season=${season}`),
    ])
    return Response.json({ season, withParam, noParam }, { headers: { 'Cache-Control': 'no-store' } })
  }

  // Default: batch exploration
  const [
    baseProfile,
    rankingLeague,
    usageRate,
    rankingMaster,
    rankHistory,
    lpHistory,
  ] = await Promise.all([
    fetchRaw(`/en/profile/${id}`),
    fetchRaw(`/en/ranking/league`),
    fetchRaw(`/stats/usagerate`),
    fetchRaw(`/en/ranking/master?page=1`),
    fetchRaw(`/en/profile/${id}/rank_history`),
    fetchRaw(`/en/profile/${id}/lp_history`),
  ])

  // Extract season_ids from base profile for further investigation
  const playData = (baseProfile.pageProps as { play?: { season_ids?: number[]; current_season_id?: number } })?.play
  const seasonIds = playData?.season_ids ?? []
  const currentSeasonId = playData?.current_season_id

  // Probe 3 older seasons to see if season-filtered data is available
  const olderSeasons = seasonIds.filter(s => s !== currentSeasonId).slice(0, 3)
  const seasonProbes: Record<string, unknown> = {}
  for (const s of olderSeasons) {
    const result = await fetchRaw(`/en/profile/${id}?season_id=${s}`)
    seasonProbes[`season_${s}`] = {
      keys: result.keys,
      ok: result.ok,
      status: result.status,
      // Only show character_league_infos and play summary — full pageProps is huge
      character_league_infos: (result.pageProps as { play?: { character_league_infos?: unknown } })?.play?.character_league_infos,
      current_season_id: (result.pageProps as { play?: { current_season_id?: unknown } })?.play?.current_season_id,
    }
  }

  return Response.json(
    {
      testPlayer: id,
      currentSeasonId,
      allSeasonIds: seasonIds,
      endpoints: {
        '/en/profile/{id}': { ok: baseProfile.ok, status: baseProfile.status, keys: baseProfile.keys },
        '/en/ranking/league': { ok: rankingLeague.ok, status: rankingLeague.status, keys: rankingLeague.keys },
        '/stats/usagerate': { ok: usageRate.ok, status: usageRate.status, keys: usageRate.keys, data: usageRate.pageProps },
        '/en/ranking/master': { ok: rankingMaster.ok, status: rankingMaster.status, keys: rankingMaster.keys },
        '/en/profile/{id}/rank_history': { ok: rankHistory.ok, status: rankHistory.status, keys: rankHistory.keys, data: rankHistory.pageProps },
        '/en/profile/{id}/lp_history': { ok: lpHistory.ok, status: lpHistory.status, keys: lpHistory.keys, data: lpHistory.pageProps },
      },
      seasonProbes,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
