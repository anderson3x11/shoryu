import { unstable_cache } from 'next/cache'
import {
  getPlayActLeagueInfo, getPlayActWinRates, getPlayActMatchupMatrix, isShortId, type PlayActModeId,
} from '@/lib/buckler'
import { rateLimit } from '@/lib/rate-limit'
import { getCachedPlayerProfile } from '@/lib/supabase/player-cache'
import { matchupRowsFromMatrix } from '@/lib/supabase/ranked-stats'
import type { BucklerLeagueInfo } from '@/lib/buckler'

// Mode-filtered win rates for the Overview character list (kind=chars) and the Stats matchup
// chart (kind=matrix), for the current phase or a past one (?season=). Current phase, mode 1
// ("All") is exactly what the cached profile already carries, so it answers from the 12h DB cache
// with no Buckler request; everything else hits the play/act API through the paced queue.
// kind=league is where each character ended a past phase, kind=peak each character's best MR.
// A past phase never changes again, so its answers are cached for good; the current one for 12h.
const MODE_IDS: PlayActModeId[] = [1, 2, 3, 4, 5]
const KINDS = ['chars', 'matrix', 'league', 'peak']

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

type LeagueRow = { character_id: number; is_played: boolean; league_info: BucklerLeagueInfo }
const slimLeague = (rows: LeagueRow[]): LeagueRow[] =>
  rows.map(({ character_id, is_played, league_info }) => ({ character_id, is_played, league_info }))

// One cache per lifetime: 12h for the live phase, forever (revalidate: false) for past phases.
function cached<A extends unknown[], R>(fn: (...a: A) => Promise<R>, key: string) {
  const live = unstable_cache(fn, [key], { revalidate: 43200 })
  const frozen = unstable_cache(fn, [`${key}-past`], { revalidate: false })
  return (past: boolean, ...a: A) => (past ? frozen : live)(...a)
}

const cachedWinRates = cached(
  async (id: string, seasonId: number, mode: PlayActModeId) => slim(await getPlayActWinRates(id, seasonId, mode)),
  'play-act-winrates',
)
const cachedMatchupRows = cached(
  async (id: string, seasonId: number, mode: PlayActModeId) =>
    matchupRowsFromMatrix(await getPlayActMatchupMatrix(id, seasonId, mode)),
  'play-act-matchups',
)
const cachedLeague = cached(
  async (id: string, seasonId: number, peak: boolean) => slimLeague(await getPlayActLeagueInfo(id, seasonId, peak)),
  'play-act-league',
)

const CACHE_HEADERS = { 'Cache-Control': 's-maxage=43200, stale-while-revalidate=86400' }

export async function GET(req: Request) {
  const limited = rateLimit(req)
  if (limited) return limited

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const mode = Number(searchParams.get('mode')) as PlayActModeId
  const kind = searchParams.get('kind')
  const seasonParam = searchParams.get('season')
  const needsMode = kind === 'chars' || kind === 'matrix'
  if (!id || !isShortId(id) || !KINDS.includes(kind ?? '') || (needsMode && !MODE_IDS.includes(mode))) {
    return Response.json({ error: 'id, kind (chars|matrix|league|peak) and mode (1-5) required' }, { status: 400 })
  }

  const profileResult = await getCachedPlayerProfile(id)
  if (profileResult.status === 'unavailable') {
    return Response.json({ error: 'Data source temporarily unavailable' }, { status: 503 })
  }
  if (profileResult.status !== 'ok') {
    return Response.json({ error: 'Player not found' }, { status: 404 })
  }
  const play = profileResult.profile.play
  const current = play?.current_season_id
  if (current == null) {
    return Response.json({ error: 'Data source temporarily unavailable' }, { status: 503 })
  }
  // Only phases this player's profile lists, so the id can't be used to probe arbitrary seasons.
  const season = seasonParam == null ? current : Number(seasonParam)
  if (!Number.isInteger(season) || !(play?.season_ids ?? [current]).includes(season)) {
    return Response.json({ error: 'unknown season' }, { status: 400 })
  }
  const past = season !== current

  if (kind === 'league' || kind === 'peak') {
    try {
      const league = await cachedLeague(past, id, season, kind === 'peak')
      return Response.json({ league }, { headers: CACHE_HEADERS })
    } catch {
      return Response.json({ error: 'Data source temporarily unavailable' }, { status: 503 })
    }
  }

  if (!past && mode === 1) {
    if (kind === 'chars') {
      return Response.json({ winRates: slim(play?.character_win_rates ?? []) }, { headers: CACHE_HEADERS })
    }
    const { rows, totalBattles } = matchupRowsFromMatrix(play?.character_win_rates_by_rival_character)
    return Response.json({ rows, totalBattles }, { headers: CACHE_HEADERS })
  }

  try {
    if (kind === 'chars') {
      const winRates = await cachedWinRates(past, id, season, mode)
      return Response.json({ winRates }, { headers: CACHE_HEADERS })
    }
    const { rows, totalBattles } = await cachedMatchupRows(past, id, season, mode)
    return Response.json({ rows, totalBattles }, { headers: CACHE_HEADERS })
  } catch {
    return Response.json({ error: 'Data source temporarily unavailable' }, { status: 503 })
  }
}
