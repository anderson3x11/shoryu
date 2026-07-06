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

// Buckler is a Next.js app. Rather than fetch the full HTML page and regex the __NEXT_DATA__
// script out of it (heavier payload, more bot-obvious), we hit Next's own data endpoints:
//   /6/buckler/_next/data/{buildId}/en/{path}.json  →  { pageProps: {...} }
// The buildId changes whenever Buckler redeploys; we scrape it once from the homepage, cache it
// in-process, and reactively re-scrape when a stale buildId surfaces as a 404.
let buildIdPromise: Promise<string> | null = null

async function scrapeBuildId(): Promise<string> {
  const cookie = getSessionCookie()
  const headers: Record<string, string> = {
    'User-Agent': UA,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  }
  if (cookie) headers.Cookie = cookie

  let res: Response
  try {
    // no-store so a redeploy-triggered re-scrape actually sees the new buildId (the in-process
    // promise is what saves us from re-fetching the homepage on every call).
    res = await paced(() => fetch(BUCKLER_BASE, { headers, cache: 'no-store' }))
  } catch (e) {
    throw new BucklerUnavailableError(`buildId fetch failed: ${e instanceof Error ? e.message : e}`)
  }
  if (!res.ok) throw new BucklerUnavailableError(`buildId fetch HTTP ${res.status}`)
  const html = await res.text()
  const m = html.match(/"buildId":"([^"]+)"/)
  if (!m) throw new BucklerUnavailableError('buildId not found on homepage')
  return m[1]
}

function ensureBuildId(): Promise<string> {
  if (!buildIdPromise) {
    buildIdPromise = scrapeBuildId().catch((e) => {
      buildIdPromise = null // don't cache the failure — let the next call retry
      throw e
    })
  }
  return buildIdPromise
}

function refreshBuildId(): Promise<string> {
  buildIdPromise = scrapeBuildId().catch((e) => {
    buildIdPromise = null
    throw e
  })
  return buildIdPromise
}

// Turn a Next route path ("profile/123", "ranking/master?page=1") into its data-endpoint URL,
// inserting ".json" before any query string.
function dataUrl(buildId: string, path: string): string {
  const [pathname, query] = path.split('?')
  return `${BUCKLER_BASE}/_next/data/${buildId}/en/${pathname}.json${query ? `?${query}` : ''}`
}

// Strict fetch: throws BucklerUnavailableError when Buckler/our session is unreachable, and
// returns the endpoint's (possibly empty) pageProps otherwise. A valid request for a record that
// doesn't exist does NOT throw as "unavailable" — Buckler answers a bad id with HTTP 400, which
// we surface as BucklerNotFoundError so callers can tell "no such record" from "source down".
async function fetchPageDataOrThrow<T = unknown>(path: string, revalidate = 60): Promise<T> {
  const cookie = getSessionCookie()
  if (!cookie) {
    console.warn('[buckler] No session cookie — set BUCKLER_COOKIE in .env.local')
    throw new BucklerUnavailableError('No session cookie')
  }
  return fetchData<T>(path, cookie, revalidate, true)
}

async function fetchData<T>(
  path: string,
  cookie: string,
  revalidate: number,
  allowBuildIdRetry: boolean
): Promise<T> {
  const buildId = await ensureBuildId()

  let res: Response
  try {
    res = await paced(() => fetch(dataUrl(buildId, path), {
      headers: {
        'User-Agent': UA,
        Accept: 'application/json, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        Cookie: cookie,
      },
      next: { revalidate },
    }))
  } catch (e) {
    throw new BucklerUnavailableError(`fetch failed: ${e instanceof Error ? e.message : e}`)
  }

  // 404 = the buildId no longer exists (Buckler redeployed). Re-scrape it once and retry; a
  // genuinely missing record answers 400 with a JSON body, not 404.
  if (res.status === 404 && allowBuildIdRetry) {
    await refreshBuildId()
    return fetchData<T>(path, cookie, revalidate, false)
  }

  if (!res.ok) {
    // 400 = the record doesn't exist (unknown/malformed ID) → not-found, not a source problem.
    // Everything else (403 = dead session, a 404 that survived the buildId refresh, 5xx) →
    // unavailable. Warn, not error, so it doesn't trip Next's dev "Console Error" overlay.
    if (res.status === 400) throw new BucklerNotFoundError(`HTTP ${res.status}`)
    console.warn(`[buckler] ${path} → ${res.status} (source unavailable)`)
    throw new BucklerUnavailableError(`HTTP ${res.status}`)
  }

  let json: unknown
  try {
    json = await res.json()
  } catch {
    throw new BucklerUnavailableError('Malformed JSON')
  }
  // A login / maintenance response won't carry pageProps: our session is no longer valid.
  if (!json || typeof json !== 'object' || !('pageProps' in json)) {
    throw new BucklerUnavailableError('No pageProps (session likely expired)')
  }
  return (json as { pageProps: T }).pageProps
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
  const data = await fetchPageData<BucklerSearchPage>(`fighterslist/search/result?${params}`, 600)
  return {
    results: data?.fighter_banner_list ?? [],
    totalPages: data?.total_page ?? 1,
  }
}

export async function getPlayerProfile(shortId: string | number): Promise<BucklerProfilePage | null> {
  return fetchPageData<BucklerProfilePage>(`profile/${shortId}`, 600)
}

export type PlayerProfileResult =
  | { status: 'ok'; profile: BucklerProfilePage }
  | { status: 'notfound' }
  | { status: 'unavailable' }

// Like getPlayerProfile but tells "Buckler/our session is down" apart from "no such player",
// so the page can render a retry-later fallback instead of a 404 when the cookie dies.
export async function getPlayerProfileResult(shortId: string | number): Promise<PlayerProfileResult> {
  try {
    const profile = await fetchPageDataOrThrow<BucklerProfilePage>(`profile/${shortId}`, 600)
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
    `ranking/master?page=${page}`,
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
    const data = await fetchPageDataOrThrow<BucklerRankingPage>(`ranking/master?page=${page}`, 600)
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
    `profile/${shortId}/battlelog/${mode}?page=${page}`,
    300
  )
}
