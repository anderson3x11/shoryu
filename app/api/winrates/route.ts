import { unstable_cache } from 'next/cache'
import { getPlayActWinRates, getPlayActMatchupMatrix, type PlayActModeId } from '@/lib/buckler'
import { getCachedPlayerProfile } from '@/lib/supabase/player-cache'
import { matchupRowsFromMatrix } from '@/lib/supabase/ranked-stats'

// Mode-filtered win rates for the Overview character list (kind=chars) and the Stats matchup
// chart (kind=matrix). Mode 1 ("All") is exactly what the cached profile already carries, so it
// answers from the 12h DB cache with no Buckler request; modes 2-5 hit the play/act API through
// the paced queue, cached 12h per (player, season, mode) so repeat toggles cost nothing.
const MODE_IDS: PlayActModeId[] = [1, 2, 3, 4, 5]

interface SlimWinRate {
  character_id: number
  battle_count: number
  win_count: number
}

function slim(winRates: SlimWinRate[]): SlimWinRate[] {
  return winRates
    .filter((w) => w.battle_count > 0)
    .map(({ character_id, battle_count, win_count }) => ({ character_id, battle_count, win_count }))
}

const cachedWinRates = unstable_cache(
  async (id: string, seasonId: number, mode: PlayActModeId) =>
    slim(await getPlayActWinRates(id, seasonId, mode)),
  ['play-act-winrates'],
  { revalidate: 43200 }
)

const cachedMatchupRows = unstable_cache(
  async (id: string, seasonId: number, mode: PlayActModeId) =>
    matchupRowsFromMatrix(await getPlayActMatchupMatrix(id, seasonId, mode)),
  ['play-act-matchups'],
  { revalidate: 43200 }
)

const CACHE_HEADERS = { 'Cache-Control': 's-maxage=43200, stale-while-revalidate=86400' }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const mode = Number(searchParams.get('mode')) as PlayActModeId
  const kind = searchParams.get('kind')
  if (!id || !MODE_IDS.includes(mode) || (kind !== 'chars' && kind !== 'matrix')) {
    return Response.json({ error: 'id, mode (1-5) and kind (chars|matrix) required' }, { status: 400 })
  }

  const profileResult = await getCachedPlayerProfile(id)
  if (profileResult.status === 'unavailable') {
    return Response.json({ error: 'Data source temporarily unavailable' }, { status: 503 })
  }
  if (profileResult.status !== 'ok') {
    return Response.json({ error: 'Player not found' }, { status: 404 })
  }
  const play = profileResult.profile.play

  if (mode === 1) {
    if (kind === 'chars') {
      return Response.json({ winRates: slim(play?.character_win_rates ?? []) }, { headers: CACHE_HEADERS })
    }
    const { rows, totalBattles } = matchupRowsFromMatrix(play?.character_win_rates_by_rival_character)
    return Response.json({ rows, totalBattles }, { headers: CACHE_HEADERS })
  }

  const seasonId = play?.current_season_id
  if (seasonId == null) {
    return Response.json({ error: 'Data source temporarily unavailable' }, { status: 503 })
  }

  try {
    if (kind === 'chars') {
      const winRates = await cachedWinRates(id, seasonId, mode)
      return Response.json({ winRates }, { headers: CACHE_HEADERS })
    }
    const { rows, totalBattles } = await cachedMatchupRows(id, seasonId, mode)
    return Response.json({ rows, totalBattles }, { headers: CACHE_HEADERS })
  } catch {
    return Response.json({ error: 'Data source temporarily unavailable' }, { status: 503 })
  }
}
