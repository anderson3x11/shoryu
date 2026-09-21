import { NextResponse } from 'next/server'
import { getRanking, getPlayerProfileResult, getUsageRate } from '@/lib/buckler/client'
import { supabase } from '@/lib/supabase/client'
import { saveProSnapshot, saveRankingSnapshot, saveUsageSnapshot, pruneSnapshots, type ProSnapshotEntry } from '@/lib/supabase/snapshots'
import { PRO_PLAYERS } from '@/lib/data/pro-players'
import type { BucklerRankingEntry } from '@/lib/buckler/types'

export const maxDuration = 300

// Single periodic sync (run every 12h by an external scheduler). One pass fetches every
// aggregate the site needs — master ranking, pro banners, usage rate — and stores them in
// Supabase. The /pros, /ranking and /stats pages then read the DB and never touch Buckler.
// All Buckler calls go through the pacing queue in lib/buckler/client.ts.
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const result: Record<string, unknown> = {}

  // --- Master ranking: one fetch feeds both the legend snapshot and the ranking list. ---
  const rankingEntries: BucklerRankingEntry[] = []
  const first = await getRanking(1)
  if (!first) {
    // Session is down — bail before firing 20+ more doomed requests.
    return NextResponse.json({ error: 'Buckler unavailable' }, { status: 503 })
  }
  rankingEntries.push(...first.ranking_fighter_list)
  const totalPages = Math.min(first.total_page, 25)
  for (let page = 2; page <= totalPages; page++) {
    const data = await getRanking(page)
    if (data) rankingEntries.push(...data.ranking_fighter_list)
  }

  // Ranking list for /ranking.
  const { error: rankErr } = await saveRankingSnapshot(rankingEntries)
  if (rankErr) console.error('[sync] ranking_snapshot insert error:', rankErr)
  result.ranking = rankingEntries.length

  // Character distribution for /stats (legend snapshot), derived from the same entries.
  const counts = new Map<number, number>()
  for (const entry of rankingEntries) counts.set(entry.character_id, (counts.get(entry.character_id) ?? 0) + 1)
  const legendData = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([character_id, count]) => ({
      character_id,
      count,
      percentage: Math.round((count / rankingEntries.length) * 1000) / 10,
    }))
  const { error: legendErr } = await supabase
    .from('legend_snapshot')
    .insert({ data: legendData, player_count: rankingEntries.length })
  if (legendErr) console.error('[sync] legend_snapshot insert error:', legendErr)
  result.legend = legendData.length

  // --- Pro / creator banners for /pros. ---
  const proEntries: ProSnapshotEntry[] = []
  for (const player of PRO_PLAYERS) {
    const profileResult = await getPlayerProfileResult(player.short_id)
    if (profileResult.status === 'unavailable') {
      // Cookie died mid-run — keep the ranking we already stored, skip the rest.
      return NextResponse.json({ error: 'Buckler unavailable during pros', ...result }, { status: 503 })
    }
    proEntries.push({
      short_id: player.short_id,
      banner: profileResult.status === 'ok' ? profileResult.profile.fighter_banner_info ?? null : null,
    })
  }
  const { error: proErr } = await saveProSnapshot(proEntries)
  if (proErr) console.error('[sync] pro_snapshot insert error:', proErr)
  result.pros = proEntries.length

  // --- Usage rate for /stats. ---
  const usage = await getUsageRate()
  if (usage) {
    const { error: usageErr } = await saveUsageSnapshot(usage.month, usage.data)
    if (usageErr) console.error('[sync] usage_snapshot insert error:', usageErr)
    result.usage = usage.month
  }

  // Drop stale snapshot rows so these tables don't grow unbounded (pages read only the newest).
  await pruneSnapshots()

  return NextResponse.json({ ok: true, ...result })
}
