import { NextRequest, NextResponse } from 'next/server'
import { getPlayerProfileResult, getBattleLog } from '@/lib/buckler'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const withBattles = req.nextUrl.searchParams.get('battles') === '1'

  const [result, battleLog] = await Promise.all([
    getPlayerProfileResult(id),
    withBattles ? getBattleLog(id) : Promise.resolve(null),
  ])

  if (result.status === 'unavailable') {
    return NextResponse.json({ error: 'Data source temporarily unavailable' }, { status: 503 })
  }
  if (result.status === 'notfound') {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 })
  }

  return NextResponse.json({ profile: result.profile, battles: battleLog?.replay_list ?? [] }, {
    headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=1200' },
  })
}
