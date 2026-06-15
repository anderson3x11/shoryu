import { syncAndGetRankedBattles } from '@/lib/supabase/battles'
import { getCharacterByBucklerId } from '@/lib/constants/characters'

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })
  const sid = Number(id)

  const battles = await syncAndGetRankedBattles(id, sid)

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

  const characters: LpCharacter[] = Object.entries(byChar)
    .map(([idStr, data]) => ({
      charId:   Number(idStr),
      charSlug: data.slug,
      charName: data.name,
      isMaster: data.isMaster,
      points:   (data.isMaster ? data.points.filter(p => p.isMasterMatch) : data.points)
                  .map(({ at, lp }) => ({ at, lp })),
    }))
    .sort((a, b) => b.points.length - a.points.length)

  return Response.json({ characters }, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  })
}
