import { getBattleLog } from '@/lib/buckler'
import type { BucklerBattle } from '@/lib/buckler'

type BucklerMode = 'rank' | 'casual' | 'hub' | 'custom' | 'extreme'
const PAGE_SIZE = 10
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
    const collected: BucklerBattle[] = []
    let exhausted = false
    let bucklerPage = 1
    while (collected.length < need && bucklerPage <= MAX_BUCKLER_PAGES) {
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
    }, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=900' } })
  }

  // Unfiltered: original behavior — 'all' mode takes top-PAGE_SIZE most recent across all 4 sub-modes.
  if (mode === 'all') {
    const { battles, maxTotalPage } = await loadPage(id, page, 'all')
    const sliced = battles.sort((a, b) => b.uploaded_at - a.uploaded_at).slice(0, PAGE_SIZE)
    return Response.json({ battles: sliced, totalPages: maxTotalPage, currentPage: page }, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=900' } })
  }

  const { battles, maxTotalPage } = await loadPage(id, page, mode)
  return Response.json({ battles, totalPages: maxTotalPage, currentPage: page }, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=900' } })
}
