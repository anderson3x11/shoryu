import { syncAndGetRankedBattles } from '@/lib/supabase/battles'
import { buildLpCharacters, buildMatchupRows, buildSession } from '@/lib/supabase/ranked-stats'

// Single sync feeding LP/MR history, the matchup matrix, and the latest session. The player
// profile's History and Stats tabs share this one call instead of hitting /api/lp-history (3x)
// + /api/matchups + /api/session (which walked up to 15 Buckler pages).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  const battles = await syncAndGetRankedBattles(id, Number(id))
  const characters = buildLpCharacters(battles)
  const { rows, totalBattles } = buildMatchupRows(battles)
  const session = buildSession(battles, characters)

  return Response.json({ characters, rows, totalBattles, session }, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  })
}
