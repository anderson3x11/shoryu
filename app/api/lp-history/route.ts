import { getBattleLog } from '@/lib/buckler'
import { getCharacterByBucklerId } from '@/lib/constants/characters'

export interface LpPoint {
  at: number   // unix timestamp
  lp: number   // master_rating if master+, else league_point
}

export interface LpCharacter {
  charId: number
  charSlug: string
  charName: string
  isMaster: boolean
  points: LpPoint[]
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  const sid = Number(id)

  const first = await getBattleLog(id, 1, 'rank')
  const totalPages = Math.min(first?.total_page ?? 1, 10)
  const rest = totalPages > 1
    ? await Promise.all(Array.from({ length: totalPages - 1 }, (_, i) => getBattleLog(id, i + 2, 'rank')))
    : []

  const battles = [
    ...(first?.replay_list ?? []),
    ...rest.flatMap(p => p?.replay_list ?? []),
  ].sort((a, b) => a.uploaded_at - b.uploaded_at)

  type RawPoint = { at: number; lp: number; isMasterMatch: boolean }
  const byChar: Record<number, { slug: string; name: string; isMaster: boolean; points: RawPoint[] }> = {}

  for (const battle of battles) {
    const isP1 = battle.player1_info.player.short_id === sid
    const me = isP1 ? battle.player1_info : battle.player2_info
    if (!me.playing_character_id) continue

    const isMasterMatch = me.league_point >= 25000
    const lp = isMasterMatch ? me.master_rating : me.league_point
    const charId = me.playing_character_id

    if (!byChar[charId]) {
      const char = getCharacterByBucklerId(charId)
      byChar[charId] = {
        slug: char?.slug ?? me.playing_character_tool_name,
        name: char?.name ?? me.playing_character_name,
        isMaster: isMasterMatch,
        points: [],
      }
    }
    if (isMasterMatch) byChar[charId].isMaster = true
    byChar[charId].points.push({ at: battle.uploaded_at, lp, isMasterMatch })
  }

  const characters: LpCharacter[] = Object.entries(byChar)
    .map(([idStr, data]) => {
      const rawPoints = data.isMaster
        ? data.points.filter(p => p.isMasterMatch)
        : data.points
      return {
        charId: Number(idStr),
        charSlug: data.slug,
        charName: data.name,
        isMaster: data.isMaster,
        points: rawPoints.map(({ at, lp }) => ({ at, lp })),
      }
    })
    .sort((a, b) => b.points.length - a.points.length)

  return Response.json({ characters }, {
    headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate' },
  })
}
