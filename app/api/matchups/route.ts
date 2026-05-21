import { getBattleLog, getBattleWinner } from '@/lib/buckler'
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

  // Fetch page 1 to discover total_page, then fetch all remaining pages in parallel (cap 20)
  const first = await getBattleLog(id, 1, 'rank')
  const totalPages = Math.min(first?.total_page ?? 1, 20)
  const rest = totalPages > 1
    ? await Promise.all(Array.from({ length: totalPages - 1 }, (_, i) => getBattleLog(id, i + 2, 'rank')))
    : []
  const battles = [
    ...(first?.replay_list ?? []),
    ...rest.flatMap(p => p?.replay_list ?? []),
  ]

  const matrix: Record<number, Record<number, { wins: number; total: number; oppSlug: string; oppName: string }>> = {}

  for (const battle of battles) {
    const isP1 = battle.player1_info.player.short_id === sid
    const me  = isP1 ? battle.player1_info : battle.player2_info
    const opp = isP1 ? battle.player2_info : battle.player1_info
    const winner = getBattleWinner(battle)
    const won = (isP1 && winner === 1) || (!isP1 && winner === 2)

    const myId  = me.playing_character_id
    const oppId = opp.playing_character_id
    if (!myId || !oppId) continue

    if (!matrix[myId]) matrix[myId] = {}
    if (!matrix[myId][oppId]) {
      const oppChar = getCharacterByBucklerId(oppId)
      matrix[myId][oppId] = {
        wins: 0, total: 0,
        oppSlug: oppChar?.slug ?? opp.playing_character_tool_name,
        oppName: oppChar?.name ?? opp.playing_character_name,
      }
    }
    matrix[myId][oppId].total++
    if (won) matrix[myId][oppId].wins++
  }

  const rows: MatchupRow[] = Object.entries(matrix).map(([myIdStr, vsMap]) => {
    const myId   = Number(myIdStr)
    const myChar = getCharacterByBucklerId(myId)
    const vs: Record<number, MatchupVs> = {}
    let totalGames = 0
    for (const [oppIdStr, data] of Object.entries(vsMap)) {
      const oppId = Number(oppIdStr)
      vs[oppId] = { charId: oppId, charSlug: data.oppSlug, charName: data.oppName, wins: data.wins, total: data.total }
      totalGames += data.total
    }
    return {
      charId: myId,
      charSlug: myChar?.slug ?? '',
      charName: myChar?.name ?? String(myId),
      totalGames,
      vs,
    }
  }).sort((a, b) => b.totalGames - a.totalGames)

  return Response.json({ rows, totalBattles: battles.length }, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate' },
  })
}
