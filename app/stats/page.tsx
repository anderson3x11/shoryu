import { getUsageRate } from '@/lib/buckler/client'
import { getLatestLegendSnapshot } from '@/lib/supabase/legend'
import { StatsClient } from './stats-client'
import { LegendSnapshotChart } from '@/components/legend-snapshot-chart'

export const revalidate = 3600

export const metadata = {
  title: 'Stats',
  description: 'Street Fighter 6 character usage rates across all rank tiers.',
}

export default async function StatsPage() {
  const [result, snapshot] = await Promise.all([
    getUsageRate(),
    getLatestLegendSnapshot(),
  ])

  return (
    <div className="space-y-12">
      {result ? (
        <StatsClient data={result.data} month={result.month} />
      ) : (
        <div className="space-y-4">
          <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Stats</h1>
          <p className="text-zinc-400">Stats data unavailable. Check back later.</p>
        </div>
      )}

      {snapshot && (
        <div className="border-t border-zinc-800 pt-10">
          <LegendSnapshotChart snapshot={snapshot} />
        </div>
      )}
    </div>
  )
}
