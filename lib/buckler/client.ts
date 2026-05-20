import { getSessionCookie } from './auth'
import type {
  BucklerFighterBanner,
  BucklerProfilePage,
  BucklerBattleLogPage,
  BucklerSearchPage,
} from './types'

const BUCKLER_BASE = 'https://www.streetfighter.com/6/buckler'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

async function fetchPageData<T = unknown>(path: string, revalidate = 60): Promise<T | null> {
  const cookie = getSessionCookie()
  if (!cookie) {
    console.warn('[buckler] No session cookie — set BUCKLER_COOKIE in .env.local')
    return null
  }

  const res = await fetch(`${BUCKLER_BASE}${path}`, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'identity',
      Cookie: cookie,
    },
    next: { revalidate },
  })

  if (!res.ok) {
    console.error(`[buckler] ${path} → ${res.status}`)
    return null
  }

  const html = await res.text()
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!match) return null

  try {
    const data = JSON.parse(match[1])
    return data.props?.pageProps as T
  } catch {
    return null
  }
}

export async function searchPlayers(query: string): Promise<BucklerFighterBanner[]> {
  const params = new URLSearchParams({ fighter_id: query, page: '1' })
  const data = await fetchPageData<BucklerSearchPage>(`/en/fighterslist/search/result?${params}`)
  return data?.fighter_banner_list ?? []
}

export async function getPlayerProfile(shortId: string | number): Promise<BucklerProfilePage | null> {
  return fetchPageData<BucklerProfilePage>(`/en/profile/${shortId}`)
}

export async function getBattleLog(
  shortId: string | number,
  page = 1,
  mode: 'rank' | 'casual' | 'hub' | 'extreme' = 'rank'
): Promise<BucklerBattleLogPage | null> {
  return fetchPageData<BucklerBattleLogPage>(
    `/en/profile/${shortId}/battlelog/${mode}?page=${page}`,
    30
  )
}
