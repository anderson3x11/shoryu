import { NextRequest, NextResponse } from 'next/server'
import { searchPlayers } from '@/lib/buckler'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const results = await searchPlayers(q)
  return NextResponse.json({ results })
}
