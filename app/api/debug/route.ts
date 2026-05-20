import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from '@/lib/buckler/auth'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

async function fetchRaw(path: string) {
  const cookie = getSessionCookie()
  const res = await fetch(`https://www.streetfighter.com/6/buckler${path}`, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Encoding': 'identity',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    cache: 'no-store',
  })
  const html = await res.text()
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!match) return null
  return JSON.parse(match[1]).props?.pageProps
}

// GET /api/debug?player=SHORT_ID  — dumps full raw pageProps for a player profile
// GET /api/debug                  — dumps league ranking metadata (charList, rankList)
export async function GET(req: NextRequest) {
  const playerId = req.nextUrl.searchParams.get('player')

  if (playerId) {
    const data = await fetchRaw(`/en/profile/${playerId}`)
    return NextResponse.json(data)
  }

  const data = await fetchRaw('/en/ranking/league') as Record<string, unknown>
  const charList = data?.character_id as Array<{ value: string; label: string; tool_name: string; sort: number }>
  const rankList = data?.league_rank as Array<{ value: string; label: string; tool_name?: number }>
  return NextResponse.json({ charList, rankList })
}
