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
