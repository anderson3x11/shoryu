import { syncAndGetRankedBattles } from '@/lib/supabase/battles'
import { getPlayerProfileResult } from '@/lib/buckler'
import { buildLpCharacters, buildMatchupRows, buildSession, type CurrentByChar } from '@/lib/supabase/ranked-stats'

// Single sync feeding LP/MR history, the matchup matrix, and the latest session. The player
// profile's History and Stats tabs share this one call instead of hitting /api/lp-history (3x)
// + /api/matchups + /api/session (which walked up to 15 Buckler pages).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  // getPlayerProfile is cached (the page fetched it moments ago), so this is a cache hit.
  // It gives the current LP/MR per character, needed to compute the newest game's delta.
  const [battles, profileResult] = await Promise.all([
    syncAndGetRankedBattles(id, Number(id)),
    getPlayerProfileResult(id),
  ])

  if (profileResult.status === 'unavailable') {
    return Response.json({ error: 'Data source temporarily unavailable' }, { status: 503 })
  }
  const profile = profileResult.status === 'ok' ? profileResult.profile : null

  const currentByChar: CurrentByChar = {}
  for (const ci of profile?.play?.character_league_infos ?? []) {
    currentByChar[ci.character_id] = { lp: ci.league_info.league_point, mr: ci.league_info.master_rating }
  }

  const characters = buildLpCharacters(battles)
  const { rows, totalBattles } = buildMatchupRows(battles)
  const session = buildSession(battles, characters, currentByChar)

  return Response.json({ characters, rows, totalBattles, session, currentByChar }, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=900' },
  })
}
