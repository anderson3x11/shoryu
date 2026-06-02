import { getBattleLog } from '@/lib/buckler'
import type { BucklerBattle } from '@/lib/buckler'

const SESSION_GAP_HOURS = 4
// A long ranked session caps out at this many pages of ranked battle log fetched.
// 15 pages × 10 matches = 150 ranked matches; beyond that the session is truncated.
const MAX_RANKED_PAGES = 15
// Batch size for ranked-page fetches. Higher = more parallelism but more wasted requests when
// a gap is found mid-batch. 3 strikes a good balance.
const RANKED_BATCH = 3

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  // Fire ranked page 1 alongside the other three modes' page 1. The "session" boundary is
  // determined purely from the ranked timeline below — casual/hub/custom are just opportunistic
  // additions for completeness, so we don't paginate them. This sidesteps the fake-gap problem
  // caused by sparse non-ranked modes whose page 1 spans days.
  const [rankedP1, casualP1, hubP1, customP1] = await Promise.all([
    getBattleLog(id, 1, 'rank'),
    getBattleLog(id, 1, 'casual'),
    getBattleLog(id, 1, 'hub'),
    getBattleLog(id, 1, 'custom'),
  ])

  const ranked: BucklerBattle[] = [...(rankedP1?.replay_list ?? [])]
  const rankedTotalPages = rankedP1?.total_page ?? 1
  let nextPage = 2
  let gapFound = hasGap(ranked)
  let exhausted = rankedTotalPages <= 1

  while (!gapFound && !exhausted && nextPage <= MAX_RANKED_PAGES) {
    const end = Math.min(nextPage + RANKED_BATCH - 1, MAX_RANKED_PAGES, rankedTotalPages)
    const pages = Array.from({ length: end - nextPage + 1 }, (_, i) => nextPage + i)
    const results = await Promise.all(pages.map(p => getBattleLog(id, p, 'rank')))
    for (const r of results) {
      if (r?.replay_list?.length) ranked.push(...r.replay_list)
    }
    nextPage = end + 1
    if (nextPage > rankedTotalPages) exhausted = true
    gapFound = hasGap(ranked)
  }

  if (ranked.length === 0) {
    return Response.json(
      { battles: [], truncated: false },
      { headers: { 'Cache-Control': 's-maxage=120, stale-while-revalidate' } },
    )
  }

  const sortedRanked = [...ranked].sort((a, b) => b.uploaded_at - a.uploaded_at)
  const sessionRanked: BucklerBattle[] = [sortedRanked[0]]
  for (let i = 1; i < sortedRanked.length; i++) {
    if (sortedRanked[i - 1].uploaded_at - sortedRanked[i].uploaded_at > SESSION_GAP_HOURS * 3600) break
    sessionRanked.push(sortedRanked[i])
  }

  const windowStart = sessionRanked[sessionRanked.length - 1].uploaded_at
  const windowEnd = sessionRanked[0].uploaded_at

  // Add non-ranked matches from page 1 of each, only if they fall inside the ranked session window.
  const seen = new Set(sessionRanked.map(b => b.replay_id))
  const others: BucklerBattle[] = []
  for (const list of [casualP1?.replay_list, hubP1?.replay_list, customP1?.replay_list]) {
    for (const b of list ?? []) {
      if (seen.has(b.replay_id)) continue
      if (b.uploaded_at >= windowStart && b.uploaded_at <= windowEnd) {
        others.push(b)
        seen.add(b.replay_id)
      }
    }
  }

  const final = [...sessionRanked, ...others].sort((a, b) => b.uploaded_at - a.uploaded_at)

  // truncated = ranked walk hit the cap without finding a gap (session may extend further).
  const truncated = !gapFound && !exhausted

  return Response.json(
    { battles: final, truncated },
    { headers: { 'Cache-Control': 's-maxage=120, stale-while-revalidate' } },
  )
}

function hasGap(battles: BucklerBattle[]): boolean {
  if (battles.length < 2) return false
  const sorted = [...battles].sort((a, b) => b.uploaded_at - a.uploaded_at)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1].uploaded_at - sorted[i].uploaded_at > SESSION_GAP_HOURS * 3600) return true
  }
  return false
}
