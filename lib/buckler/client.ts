import { getSessionCookie } from './auth'
import type {
  BucklerFighterBanner,
  BucklerProfilePage,
  BucklerBattleLogPage,
  BucklerSearchPage,
  BucklerRankingPage,
  BucklerRankingData,
  BucklerUsageRateData,
} from './types'

const BUCKLER_BASE = 'https://www.streetfighter.com/6/buckler'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// Buckler has no public API, so every call is a scrape on a single shared session.
// Firing them in parallel (the page syncs use Promise.all over many pages) is exactly
// what gets a session flagged as a bot. We funnel all requests through one serial queue
// that keeps a single request in flight and spaces them with jitter, so the traffic looks
// like a person clicking around rather than a script. A cache hit skips the network, but
// still passes through the queue — within one request render that's only a handful of calls.
const MIN_GAP_MS = 500
const JITTER_MS = 600
const REQUEST_TIMEOUT_MS = 20000

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
let requestQueue: Promise<unknown> = Promise.resolve()
let lastStartedAt = 0

function paced<T>(task: () => Promise<T>): Promise<T> {
  const run = requestQueue.then(async () => {
    const wait = lastStartedAt + MIN_GAP_MS + Math.random() * JITTER_MS - Date.now()
    if (wait > 0) await sleep(wait)
    lastStartedAt = Date.now()
    return Promise.race([
      task(),
      sleep(REQUEST_TIMEOUT_MS).then(() => Promise.reject(new Error('buckler request timed out'))),
    ]) as Promise<T>
  })
  requestQueue = run.catch(() => {})
  return run
}

// Thrown when the source itself can't be reached, as opposed to "the record doesn't exist":
// a missing/expired cookie (Buckler serves a login page with no __NEXT_DATA__), a non-200,
// or a network error/timeout. Lets callers show a retry-later fallback instead of a 404.
export class BucklerUnavailableError extends Error {
  constructor(message = 'Buckler data source is unavailable') {
    super(message)
    this.name = 'BucklerUnavailableError'
  }
}

// Thrown when Buckler positively says the record doesn't exist (a 400/404 for an unknown or
// malformed ID), as opposed to BucklerUnavailableError which means our session/source is down.
// Buckler returns 400 for a bogus profile ID and 403 when the session is dead, so the status
// cleanly tells "no such player" apart from "cookie expired".
export class BucklerNotFoundError extends Error {
  constructor(message = 'Buckler record not found') {
    super(message)
    this.name = 'BucklerNotFoundError'
  }
}

// Strict fetch: throws BucklerUnavailableError when Buckler/our session is unreachable, and
// returns the page's (possibly empty) pageProps otherwise. A valid Buckler page that lacks
// the requested record does NOT throw — that's a "not found", which the caller detects from
// the returned shape.
async function fetchPageDataOrThrow<T = unknown>(path: string, revalidate = 60): Promise<T> {
  const cookie = getSessionCookie()
  if (!cookie) {
    console.warn('[buckler] No session cookie — set BUCKLER_COOKIE in .env.local')
    throw new BucklerUnavailableError('No session cookie')
  }

  let res: Response
  try {
    res = await paced(() => fetch(`${BUCKLER_BASE}${path}`, {
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
        Cookie: cookie,
      },
      next: { revalidate },
    }))
  } catch (e) {
    throw new BucklerUnavailableError(`fetch failed: ${e instanceof Error ? e.message : e}`)
  }

  if (!res.ok) {
    // 400/404 = the record doesn't exist (unknown/malformed ID) → not-found, not a source
    // problem. Everything else (notably 403 = dead session) → unavailable.
    if (res.status === 400 || res.status === 404) {
      throw new BucklerNotFoundError(`HTTP ${res.status}`)
    }
    // Expected, handled condition (callers show the unavailable fallback) — warn, not error,
    // so it doesn't trip Next's dev "Console Error" overlay.
    console.warn(`[buckler] ${path} → ${res.status} (source unavailable)`)
    throw new BucklerUnavailableError(`HTTP ${res.status}`)
  }

  const html = await res.text()
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!match) {
    // No app payload = a login / maintenance page: our session is no longer valid.
    throw new BucklerUnavailableError('No __NEXT_DATA__ (session likely expired)')
  }

  try {
    const data = JSON.parse(match[1])
    return data.props?.pageProps as T
  } catch {
    throw new BucklerUnavailableError('Malformed __NEXT_DATA__')
  }
}

// Best-effort variant: collapses source-unavailable into null. Used by list/aggregate
// endpoints (search, ranking, battle log, usage) that should degrade to empty rather than error.
async function fetchPageData<T = unknown>(path: string, revalidate = 60): Promise<T | null> {
  try {
    return await fetchPageDataOrThrow<T>(path, revalidate)
  } catch (e) {
    if (!(e instanceof BucklerUnavailableError) && !(e instanceof BucklerNotFoundError)) {
      console.error(`[buckler] ${path} failed:`, e instanceof Error ? e.message : e)
    }
    return null
  }
}

export async function searchPlayers(
  query: string,
  page = 1
): Promise<{ results: BucklerFighterBanner[]; totalPages: number }> {
  const params = new URLSearchParams({ fighter_id: query, page: String(page) })
  const data = await fetchPageData<BucklerSearchPage>(`/en/fighterslist/search/result?${params}`, 600)
  return {
    results: data?.fighter_banner_list ?? [],
    totalPages: data?.total_page ?? 1,
  }
}

export async function getPlayerProfile(shortId: string | number): Promise<BucklerProfilePage | null> {
  return fetchPageData<BucklerProfilePage>(`/en/profile/${shortId}`, 600)
}

export type PlayerProfileResult =
  | { status: 'ok'; profile: BucklerProfilePage }
  | { status: 'notfound' }
  | { status: 'unavailable' }

// Like getPlayerProfile but tells "Buckler/our session is down" apart from "no such player",
// so the page can render a retry-later fallback instead of a 404 when the cookie dies.
export async function getPlayerProfileResult(shortId: string | number): Promise<PlayerProfileResult> {
  try {
    const profile = await fetchPageDataOrThrow<BucklerProfilePage>(`/en/profile/${shortId}`, 600)
    if (!profile?.fighter_banner_info) return { status: 'notfound' }
    return { status: 'ok', profile }
  } catch (e) {
    if (e instanceof BucklerNotFoundError) return { status: 'notfound' }
    if (e instanceof BucklerUnavailableError) return { status: 'unavailable' }
    throw e
  }
}

export async function getRanking(page = 1): Promise<BucklerRankingData | null> {
  const data = await fetchPageData<BucklerRankingPage>(
    `/en/ranking/master?page=${page}`,
    600
  )
  return data?.master_rating_ranking ?? null
}

export type RankingResult =
  | { status: 'ok'; data: BucklerRankingData }
  | { status: 'empty' }
  | { status: 'unavailable' }

// Like getRanking but tells "Buckler/our session is down" apart from "no rows", so the page
// can show a retry-later fallback instead of a misleading "no data" message.
export async function getRankingResult(page = 1): Promise<RankingResult> {
  try {
    const data = await fetchPageDataOrThrow<BucklerRankingPage>(`/en/ranking/master?page=${page}`, 600)
    const ranking = data?.master_rating_ranking
    if (!ranking || (ranking.ranking_fighter_list?.length ?? 0) === 0) return { status: 'empty' }
    return { status: 'ok', data: ranking }
  } catch (e) {
    if (e instanceof BucklerNotFoundError) return { status: 'empty' }
    if (e instanceof BucklerUnavailableError) return { status: 'unavailable' }
    throw e
  }
}

async function fetchBucklerJson<T = unknown>(path: string, revalidate = 3600): Promise<T | null> {
  const cookie = getSessionCookie()
  if (!cookie) {
    console.warn('[buckler] No session cookie — set BUCKLER_COOKIE in .env.local')
    return null
  }

  try {
    const res = await paced(() => fetch(`${BUCKLER_BASE}${path}`, {
      headers: {
        'User-Agent': UA,
        Accept: 'application/json, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        Cookie: cookie,
      },
      next: { revalidate },
    }))

    if (!res.ok) return null
    return await res.json() as T
  } catch {
    return null
  }
}

function getYYYYMM(monthOffset = 0): string {
  const d = new Date()
  d.setUTCMonth(d.getUTCMonth() - monthOffset)
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

export async function getUsageRate(): Promise<{ data: BucklerUsageRateData; month: string } | null> {
  for (const offset of [0, 1, 2]) {
    const month = getYYYYMM(offset)
    for (const path of [`/api/en/stats/usagerate/${month}`, `/api/fr/stats/usagerate/${month}`]) {
      const data = await fetchBucklerJson<BucklerUsageRateData>(path, 3600)
      if (data?.usagerateData) return { data, month }
    }
  }
  return null
}

export async function getBattleLog(
  shortId: string | number,
  page = 1,
  mode: 'rank' | 'casual' | 'hub' | 'custom' | 'extreme' = 'rank'
): Promise<BucklerBattleLogPage | null> {
  return fetchPageData<BucklerBattleLogPage>(
    `/en/profile/${shortId}/battlelog/${mode}?page=${page}`,
    300
  )
}
