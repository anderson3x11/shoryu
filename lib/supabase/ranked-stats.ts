import type { DBBattle } from './battles'
import type { BucklerPlayData } from '@/lib/buckler'
import { getCharacterByBucklerId } from '@/lib/constants/characters'

// Shared shapes + builders for ranked-derived stats (LP/MR history + matchup matrix).
// Both are computed from the same DBBattle[] set, so a single sync can feed both.

export interface LpPoint {
  at: number   // unix timestamp
  lp: number   // master_rating if master, else league_point
}

export interface LpCharacter {
  charId: number
  charSlug: string
  charName: string
  isMaster: boolean
  points: LpPoint[]
}

export interface MatchupVs {
  charId: number
  charSlug: string
  charName: string
  wins: number
  total: number
}

export interface MatchupRow {
  charId: number
  charSlug: string
  charName: string
  totalGames: number
  vs: Record<number, MatchupVs>
}

export interface SessionChar {
  slug: string
  name: string
  count: number
  rankedCount: number
  delta: number
  deltaCount: number
  isMaster: boolean | null
}

export interface SessionData {
  wins: number
  losses: number
  total: number
  winRate: number
  durationSec: number
  newestAt: number   // unix seconds; the client computes "ended X ago" from this (avoids cache staleness)
  chars: SessionChar[]
}

// Current (post-latest-game) LP/MR per character, from the live profile. Buckler stores the
// PRE-match value on each battle, so a game's delta = (next game's stored value) - (this value);
// for a character's newest game there is no "next", so we fall back to this live value.
export type CurrentByChar = Record<number, { lp: number; mr: number }>

// Resolve the value immediately AFTER battle `atSec` for a character: the first series point newer
// than it, or the live current value when this is the character's newest game.
export function valueAfter(
  series: { isMaster: boolean; points: LpPoint[] },
  atSec: number,
  isMaster: boolean,
  current?: { lp: number; mr: number },
): number | null {
  for (let i = 0; i < series.points.length; i++) {
    if (series.points[i].at > atSec) return series.points[i].lp
  }
  if (current) return isMaster ? current.mr : current.lp
  return null
}

export function buildLpCharacters(battles: DBBattle[]): LpCharacter[] {
  type RawPoint = LpPoint & { isMasterMatch: boolean }
  const byChar: Record<number, { slug: string; name: string; isMaster: boolean; points: RawPoint[] }> = {}

  for (const b of battles) {
    if (!b.char_id) continue
    const isMasterMatch = b.lp_after >= 25000
    const lp = isMasterMatch ? b.mr_after : b.lp_after
    if (lp <= 0) continue

    if (!byChar[b.char_id]) {
      const char = getCharacterByBucklerId(b.char_id)
      byChar[b.char_id] = {
        slug:     char?.slug ?? String(b.char_id),
        name:     char?.name ?? String(b.char_id),
        isMaster: false,
        points:   [],
      }
    }
    if (isMasterMatch) byChar[b.char_id].isMaster = true
    byChar[b.char_id].points.push({
      at: Math.floor(new Date(b.played_at).getTime() / 1000),
      lp,
      isMasterMatch,
    })
  }

  return Object.entries(byChar)
    .map(([idStr, data]) => ({
      charId:   Number(idStr),
      charSlug: data.slug,
      charName: data.name,
      isMaster: data.isMaster,
      points:   (data.isMaster ? data.points.filter(p => p.isMasterMatch) : data.points)
                  .map(({ at, lp }) => ({ at, lp })),
    }))
    .sort((a, b) => b.points.length - a.points.length)
}

const SESSION_GAP_SEC = 4 * 3600

// Most-recent ranked "session": the run of battles whose consecutive gaps stay within 4h.
// Computed from synced DB battles (ranked-only), so no extra Buckler fetch is needed.
// Pass the lpCharacters series so per-match MR/LP deltas match the chart exactly.
export function buildSession(
  battles: DBBattle[],
  lpCharacters: LpCharacter[],
  currentByChar: CurrentByChar = {},
): SessionData | null {
  if (battles.length < 2) return null

  const toSec = (iso: string) => Math.floor(new Date(iso).getTime() / 1000)
  const sorted = [...battles].sort((a, b) => toSec(b.played_at) - toSec(a.played_at))

  const session: DBBattle[] = [sorted[0]]
  for (let i = 1; i < sorted.length; i++) {
    if (toSec(sorted[i - 1].played_at) - toSec(sorted[i].played_at) > SESSION_GAP_SEC) break
    session.push(sorted[i])
  }
  if (session.length < 2) return null

  const seriesByChar = new Map<number, { isMaster: boolean; points: LpPoint[] }>()
  for (const c of lpCharacters) seriesByChar.set(c.charId, { isMaster: c.isMaster, points: c.points })

  let wins = 0, losses = 0
  const charStats = new Map<number, SessionChar>()

  for (const b of session) {
    if (b.result === 1) wins++; else losses++
    if (!b.char_id) continue

    let cs = charStats.get(b.char_id)
    if (!cs) {
      const char = getCharacterByBucklerId(b.char_id)
      cs = {
        slug: char?.slug ?? String(b.char_id),
        name: char?.name ?? String(b.char_id),
        count: 0, rankedCount: 0, delta: 0, deltaCount: 0, isMaster: null,
      }
      charStats.set(b.char_id, cs)
    }
    cs.count++
    cs.rankedCount++

    const isMaster = b.lp_after >= 25000
    const series = seriesByChar.get(b.char_id)
    if (!series || series.isMaster !== isMaster) continue
    const before = isMaster ? b.mr_after : b.lp_after   // Buckler stores the pre-match value
    const after = valueAfter(series, toSec(b.played_at), isMaster, currentByChar[b.char_id])
    if (after === null) continue
    cs.delta += after - before
    cs.deltaCount++
    cs.isMaster = isMaster
  }

  const total = session.length
  const newestAt = toSec(session[0].played_at)
  const oldestAt = toSec(session[session.length - 1].played_at)
  return {
    wins, losses, total,
    winRate: total ? Math.round((wins / total) * 100) : 0,
    durationSec: newestAt - oldestAt,
    newestAt,
    chars: [...charStats.values()].sort((a, b) => b.count - a.count),
  }
}

export function buildMatchupRows(battles: DBBattle[]): { rows: MatchupRow[]; totalBattles: number } {
  const matrix: Record<number, Record<number, { wins: number; total: number }>> = {}

  for (const b of battles) {
    if (!b.char_id || !b.opp_char_id) continue
    if (!matrix[b.char_id]) matrix[b.char_id] = {}
    if (!matrix[b.char_id][b.opp_char_id]) matrix[b.char_id][b.opp_char_id] = { wins: 0, total: 0 }
    matrix[b.char_id][b.opp_char_id].total++
    if (b.result === 1) matrix[b.char_id][b.opp_char_id].wins++
  }

  const rows: MatchupRow[] = Object.entries(matrix).map(([myIdStr, vsMap]) => {
    const myId   = Number(myIdStr)
    const myChar = getCharacterByBucklerId(myId)
    const vs: Record<number, MatchupVs> = {}
    let totalGames = 0
    for (const [oppIdStr, data] of Object.entries(vsMap)) {
      const oppId   = Number(oppIdStr)
      const oppChar = getCharacterByBucklerId(oppId)
      vs[oppId] = {
        charId:   oppId,
        charSlug: oppChar?.slug ?? String(oppId),
        charName: oppChar?.name ?? String(oppId),
        wins:     data.wins,
        total:    data.total,
      }
      totalGames += data.total
    }
    return {
      charId:     myId,
      charSlug:   myChar?.slug ?? '',
      charName:   myChar?.name ?? String(myId),
      totalGames,
      vs,
    }
  }).sort((a, b) => b.totalGames - a.totalGames)

  return { rows, totalBattles: battles.length }
}

// Buckler's per-character arrays include aggregate pseudo-characters that must be skipped or every
// game double-counts: 253 = "Any/All" (the row/rival total), 254 = Random.
const MATCHUP_AGGREGATE_IDS = new Set([253, 254])
type CharRivalRow = BucklerPlayData['character_win_rates_by_rival_character'][number]

// Build MatchupRow[] from Buckler's server-computed current-phase matchup matrix
// (profile.play.character_win_rates_by_rival_character) — thousands of games, not our ~100
// synced battles. Same output shape as buildMatchupRows so the chart is source-agnostic.
export function matchupRowsFromMatrix(
  matrix: CharRivalRow[] | null | undefined,
): { rows: MatchupRow[]; totalBattles: number } {
  const acc: Record<number, Record<number, { wins: number; total: number }>> = {}

  for (const row of matrix ?? []) {
    if (MATCHUP_AGGREGATE_IDS.has(row.character_id)) continue
    for (const rv of row.rival_character_win_rates ?? []) {
      if (MATCHUP_AGGREGATE_IDS.has(rv.rival_character_id) || rv.battle_count <= 0) continue
      ;(acc[row.character_id] ??= {})[rv.rival_character_id] ??= { wins: 0, total: 0 }
      acc[row.character_id][rv.rival_character_id].wins += rv.win_count
      acc[row.character_id][rv.rival_character_id].total += rv.battle_count
    }
  }

  let totalBattles = 0
  const rows: MatchupRow[] = Object.entries(acc)
    .map(([myIdStr, vsMap]) => {
      const myId = Number(myIdStr)
      const myChar = getCharacterByBucklerId(myId)
      const vs: Record<number, MatchupVs> = {}
      let totalGames = 0
      for (const [oppIdStr, d] of Object.entries(vsMap)) {
        const oppId = Number(oppIdStr)
        const oppChar = getCharacterByBucklerId(oppId)
        vs[oppId] = {
          charId: oppId,
          charSlug: oppChar?.slug ?? String(oppId),
          charName: oppChar?.name ?? String(oppId),
          wins: d.wins,
          total: d.total,
        }
        totalGames += d.total
      }
      totalBattles += totalGames
      return { charId: myId, charSlug: myChar?.slug ?? '', charName: myChar?.name ?? String(myId), totalGames, vs }
    })
    .sort((a, b) => b.totalGames - a.totalGames)

  return { rows, totalBattles }
}
