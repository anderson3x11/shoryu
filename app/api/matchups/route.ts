import { syncAndGetRankedBattles } from '@/lib/supabase/battles'
import { getCharacterByBucklerId } from '@/lib/constants/characters'

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  const sid = Number(id)

  const battles = await syncAndGetRankedBattles(id, sid)

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

  return Response.json({ rows, totalBattles: battles.length }, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  })
}
