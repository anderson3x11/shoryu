import { supabase } from './client'
import type {
  BucklerFighterBanner,
  BucklerRankingEntry,
  BucklerUsageRateData,
} from '@/lib/buckler'

// Periodic snapshots written by /api/cron/sync and read by the /pros, /ranking and /stats
// pages. Storing these in the DB means those pages never hit Buckler on render — the only
// Buckler traffic for them is the twice-daily cron.

export interface ProSnapshotEntry {
  short_id: string
  banner: BucklerFighterBanner | null
}

// --- Pros ---

export async function getProSnapshot(): Promise<ProSnapshotEntry[] | null> {
  const { data, error } = await supabase
    .from('pro_snapshot')
    .select('data')
    .order('snapped_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  return data.data as ProSnapshotEntry[]
}

export async function saveProSnapshot(entries: ProSnapshotEntry[]) {
  return supabase.from('pro_snapshot').insert({ data: entries })
}

// --- Ranking ---

export async function getRankingSnapshot(): Promise<BucklerRankingEntry[] | null> {
  const { data, error } = await supabase
    .from('ranking_snapshot')
    .select('data')
    .order('snapped_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  return data.data as BucklerRankingEntry[]
}

export async function saveRankingSnapshot(entries: BucklerRankingEntry[]) {
  return supabase.from('ranking_snapshot').insert({ data: entries })
}

// --- Usage rate ---

export interface UsageSnapshot {
  month: string
  data: BucklerUsageRateData
}

export async function getUsageSnapshot(): Promise<UsageSnapshot | null> {
  const { data, error } = await supabase
    .from('usage_snapshot')
    .select('month, data')
    .order('snapped_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  return { month: data.month, data: data.data } as UsageSnapshot
}

export async function saveUsageSnapshot(month: string, data: BucklerUsageRateData) {
  return supabase.from('usage_snapshot').insert({ month, data })
}

// --- Retention ---

// Snapshot tables gain one row per cron run but the pages only ever read the newest, so old rows
// are pure bloat (ranking_snapshot alone is ~1.5 MB/row). Called at the end of the sync to keep
// just the latest few per table (a small buffer as a fallback if a run writes bad data).
const SNAPSHOT_TABLES = ['ranking_snapshot', 'pro_snapshot', 'usage_snapshot', 'legend_snapshot'] as const
const SNAPSHOT_KEEP = 3

export async function pruneSnapshots(keep = SNAPSHOT_KEEP) {
  for (const table of SNAPSHOT_TABLES) {
    const { data: recent } = await supabase
      .from(table)
      .select('id')
      .order('snapped_at', { ascending: false })
      .limit(keep)
    // Nothing to prune until there are more than `keep` rows.
    if (!recent || recent.length < keep) continue
    const keepIds = recent.map((r) => r.id)
    const { error } = await supabase.from(table).delete().not('id', 'in', `(${keepIds.join(',')})`)
    if (error) console.error(`[sync] prune ${table} error:`, error)
  }
}
