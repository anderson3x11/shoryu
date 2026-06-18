import type { DBBattle } from './battles'
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
