import { supabase } from './client'

export interface LegendSnapshotEntry {
  character_id: number
  count: number
  percentage: number
}

export interface LegendSnapshot {
  snapped_at: string
  player_count: number
  data: LegendSnapshotEntry[]
}

export async function getLatestLegendSnapshot(): Promise<LegendSnapshot | null> {
  const { data, error } = await supabase
    .from('legend_snapshot')
    .select('snapped_at, player_count, data')
    .order('snapped_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null
  return data as LegendSnapshot
}
