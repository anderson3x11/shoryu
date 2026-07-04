import { syncAndGetRankedBattles } from '@/lib/supabase/battles'
import { getCachedPlayerProfile } from '@/lib/supabase/player-cache'
import { buildLpCharacters, buildMatchupRows, buildSession, matchupRowsFromMatrix, type CurrentByChar } from '@/lib/supabase/ranked-stats'

// Single sync feeding LP/MR history, the matchup matrix, and the latest session. The player
// profile's History and Stats tabs share this one call instead of hitting /api/lp-history (3x)
// + /api/matchups + /api/session (which walked up to 15 Buckler pages).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  // The profile (matchup matrix + current LP/MR per char) is served from the 12h DB cache, so a
  // revisit within the TTL returns the stored snapshot with no Buckler request. The page rendered
  // moments ago through the same cache, so this is normally a DB hit.
  const [battles, profileResult] = await Promise.all([
    syncAndGetRankedBattles(id, Number(id)),
    getCachedPlayerProfile(id),
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

  // Matchups come from Buckler's full current-phase matrix (thousands of server-side games),
  // not our ~100 synced battles. Fall back to the battle-derived matrix only if the profile
  // lacks the matchup data (e.g. an older cached profile shape).
  const seasonId = profile?.play?.current_season_id ?? null
  let { rows, totalBattles } = matchupRowsFromMatrix(profile?.play?.character_win_rates_by_rival_character)
  if (rows.length === 0) ({ rows, totalBattles } = buildMatchupRows(battles))

  const session = buildSession(battles, characters, currentByChar)

  return Response.json({ characters, rows, totalBattles, seasonId, session, currentByChar }, {
    headers: { 'Cache-Control': 's-maxage=43200, stale-while-revalidate=86400' },
  })
}
