import { NextResponse } from 'next/server'
import { getRanking } from '@/lib/buckler/client'
import { supabase } from '@/lib/supabase/client'
import type { BucklerRankingEntry } from '@/lib/buckler/types'

export const maxDuration = 60

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const allEntries: BucklerRankingEntry[] = []

  const first = await getRanking(1)
  if (!first) {
    return NextResponse.json({ error: 'Buckler unavailable' }, { status: 503 })
  }

  allEntries.push(...first.ranking_fighter_list)
  const totalPages = Math.min(first.total_page, 25)

  for (let page = 2; page <= totalPages; page++) {
    await new Promise(r => setTimeout(r, 150))
    const data = await getRanking(page)
    if (data) allEntries.push(...data.ranking_fighter_list)
  }

  const counts = new Map<number, number>()
  for (const entry of allEntries) {
    const id = entry.character_id
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  const total = allEntries.length
  const data = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([character_id, count]) => ({
      character_id,
      count,
      percentage: Math.round((count / total) * 1000) / 10,
    }))

  const { error } = await supabase
    .from('legend_snapshot')
    .insert({ data, player_count: total })

  if (error) {
    console.error('[legend-snapshot] Supabase insert error:', error)
    return NextResponse.json({ error: 'DB insert failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, players: total, characters: data.length })
}
