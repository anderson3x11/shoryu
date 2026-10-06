import { NextRequest, NextResponse } from 'next/server'
import { searchPlayers } from '@/lib/buckler'
import { rateLimit } from '@/lib/rate-limit'

// Buckler fighter names are short; anything longer is not a real search.
const MAX_QUERY_LENGTH = 32

export async function GET(req: NextRequest) {
  const limited = rateLimit(req)
  if (limited) return limited

  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2 || q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ results: [], totalPages: 0 })
  }

  const { results, totalPages } = await searchPlayers(q)
  return NextResponse.json({ results, totalPages }, {
    headers: { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600' },
  })
}
