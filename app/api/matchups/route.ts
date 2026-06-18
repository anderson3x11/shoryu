import { syncAndGetRankedBattles } from '@/lib/supabase/battles'
import { buildMatchupRows } from '@/lib/supabase/ranked-stats'

export type { MatchupVs, MatchupRow } from '@/lib/supabase/ranked-stats'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  const battles = await syncAndGetRankedBattles(id, Number(id))
  const { rows, totalBattles } = buildMatchupRows(battles)

  return Response.json({ rows, totalBattles }, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  })
}
