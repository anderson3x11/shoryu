import { NextRequest, NextResponse } from 'next/server'
import { getPlayerProfile, getBattleLog } from '@/lib/buckler'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const withBattles = req.nextUrl.searchParams.get('battles') === '1'

  const [profile, battleLog] = await Promise.all([
    getPlayerProfile(id),
    withBattles ? getBattleLog(id) : Promise.resolve(null),
  ])

  if (!profile) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 })
  }

  return NextResponse.json({ profile, battles: battleLog?.replay_list ?? [] })
}
