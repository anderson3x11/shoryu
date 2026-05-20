import { NextResponse } from 'next/server'
import { getSessionCookie } from '@/lib/buckler/auth'

async function fetchNextData(path: string) {
  const cookie = getSessionCookie()
  const res = await fetch(`https://www.streetfighter.com/6/buckler${path}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,*/*;q=0.9',
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

export async function GET() {
  const data = await fetchNextData('/en/ranking/league') as Record<string, unknown>
  const charList = data?.character_id as Array<{value: string; label: string; tool_name: string; sort: number}>
  const rankList = data?.league_rank as Array<{value: string; label: string; tool_name?: number}>
  return NextResponse.json({ charList, rankList })
}
