import { getBattleLog } from '@/lib/buckler'
import type { BucklerBattle } from '@/lib/buckler'

type BucklerMode = 'rank' | 'casual' | 'hub' | 'custom' | 'extreme'
const ALL_MODES: BucklerMode[] = ['rank', 'casual', 'hub', 'custom']
const PAGE_SIZE = 10
// How many page-deep rounds the merged "All" view will walk (one round = one page of each mode).
// Deeper history is what the per-mode tabs are for.
const MAX_ALL_ROUNDS = 5
// Cap how many Buckler pages we'll scan when a character filter is active. Each "page" of the
// filtered view corresponds to up to MAX_BUCKLER_PAGES of underlying Buckler data, so a sparsely
// played character may surface fewer results past the cap.
const MAX_BUCKLER_PAGES = 10

async function loadPage(
  id: string,
  bucklerPage: number,
  mode: string,
): Promise<{ battles: BucklerBattle[]; maxTotalPage: number }> {
  if (mode === 'all') {
    const [rank, casual, hub, custom] = await Promise.all([
      getBattleLog(id, bucklerPage, 'rank'),
      getBattleLog(id, bucklerPage, 'casual'),
      getBattleLog(id, bucklerPage, 'hub'),
      getBattleLog(id, bucklerPage, 'custom'),
    ])
    return {
      battles: [
        ...(rank?.replay_list ?? []),
        ...(casual?.replay_list ?? []),
        ...(hub?.replay_list ?? []),
        ...(custom?.replay_list ?? []),
      ],
      maxTotalPage: Math.max(
        rank?.total_page ?? 0,
        casual?.total_page ?? 0,
        hub?.total_page ?? 0,
        custom?.total_page ?? 0,
        1,
      ),
    }
  }
  const data = await getBattleLog(id, bucklerPage, mode as BucklerMode)
  return { battles: data?.replay_list ?? [], maxTotalPage: data?.total_page ?? 1 }
}

// Buckler paginates each mode separately, so merged page N is NOT page N of every mode: taking
// the 10 newest of each mode's page N drops every battle that lost the cut on page N-1, and those
// never appear on any page. This walks all four logs until no unread battle could still belong in
// the first `need` merged results, which is exact for the slice we serve.
//
// Unread battles in a mode are always older than what has been read from it, so once a mode's
// oldest read battle is already past the cutoff, nothing left in it can enter the window.
async function collectAll(
  id: string,
  need: number,
): Promise<{ battles: BucklerBattle[]; exhausted: boolean; totalPages: number }> {
  const state = ALL_MODES.map((mode) => ({
    mode,
    page: 0,
    totalPage: 1,
    items: [] as BucklerBattle[],
    oldest: Infinity,
    done: false,
  }))

  for (let round = 0; round < MAX_ALL_ROUNDS; round++) {
    const pending = state.filter((s) => !s.done)
    if (pending.length === 0) break

    await Promise.all(pending.map(async (s) => {
      const data = await getBattleLog(id, s.page + 1, s.mode)
      s.page++
      const list = data?.replay_list ?? []
      s.items.push(...list)
      for (const b of list) s.oldest = Math.min(s.oldest, b.uploaded_at)
      s.totalPage = data?.total_page ?? s.totalPage
      if (!data || list.length === 0 || s.page >= s.totalPage) s.done = true
    }))

    const merged = state.flatMap((s) => s.items)
    if (merged.length < need) continue
    const cutoff = [...merged].sort((a, b) => b.uploaded_at - a.uploaded_at)[need - 1].uploaded_at
    if (state.every((s) => s.done || s.oldest <= cutoff)) break
  }

  return {
    battles: state.flatMap((s) => s.items).sort((a, b) => b.uploaded_at - a.uploaded_at),
    exhausted: state.every((s) => s.done),
    // Upper bound on the merged length: every mode page holds up to PAGE_SIZE battles, same as a
    // merged page. Capped at what the round budget above can actually serve.
    totalPages: Math.min(state.reduce((n, s) => n + s.totalPage, 0), MAX_ALL_ROUNDS),
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const mode = searchParams.get('mode') ?? 'all'
  const page = Number(searchParams.get('page') ?? '1')
  const char = searchParams.get('char')
  const sid = Number(searchParams.get('sid') ?? '0')

  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  // Character filter: walk Buckler pages and accumulate matches with that character until we have
  // enough to fill the requested page (plus one extra to detect whether a next page exists), or
  // until we run out of Buckler data, or until we hit the scan cap.
  if (char && sid) {
    const need = page * PAGE_SIZE + 1
    // 'all' fans out to 4 Buckler requests per page (rank+casual+hub+custom), so cap it tighter
    // than single-mode scans to keep a filtered cache-miss from ballooning Buckler load.
    const maxPages = mode === 'all' ? 3 : MAX_BUCKLER_PAGES
    const collected: BucklerBattle[] = []
    let exhausted = false
    let bucklerPage = 1
    while (collected.length < need && bucklerPage <= maxPages) {
      const { battles, maxTotalPage } = await loadPage(id, bucklerPage, mode)
      for (const b of battles) {
        const isP1 = b.player1_info.player.short_id === sid
        const me = isP1 ? b.player1_info : b.player2_info
        if (me.playing_character_tool_name === char) collected.push(b)
      }
      if (bucklerPage >= maxTotalPage) { exhausted = true; break }
      bucklerPage++
    }
    collected.sort((a, b) => b.uploaded_at - a.uploaded_at)
    const start = (page - 1) * PAGE_SIZE
    const slice = collected.slice(start, start + PAGE_SIZE)
    const hasMore = collected.length > start + PAGE_SIZE || !exhausted
    return Response.json({
      battles: slice,
      totalPages: page + (hasMore ? 1 : 0),
      currentPage: page,
    }, { headers: { 'Cache-Control': 's-maxage=43200, stale-while-revalidate=86400' } })
  }

  // Unfiltered 'all': merge the four sub-logs into one newest-first list and slice the page out.
  if (mode === 'all') {
    const { battles, totalPages } = await collectAll(id, page * PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    return Response.json({
      battles: battles.slice(start, start + PAGE_SIZE),
      totalPages,
      currentPage: page,
    }, { headers: { 'Cache-Control': 's-maxage=43200, stale-while-revalidate=86400' } })
  }

  const { battles, maxTotalPage } = await loadPage(id, page, mode)
  return Response.json({ battles, totalPages: maxTotalPage, currentPage: page }, { headers: { 'Cache-Control': 's-maxage=43200, stale-while-revalidate=86400' } })
}
