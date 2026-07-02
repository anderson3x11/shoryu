import { getUsageSnapshot } from '@/lib/supabase/snapshots'
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
    getUsageSnapshot(),
    getLatestLegendSnapshot(),
  ])

  return (
    <div className="space-y-12">
      {result ? (
        <StatsClient data={result.data} month={result.month} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="block w-2 h-10 sm:h-12 -skew-x-12 bg-amber-400 shrink-0" />
            <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Stats</h1>
          </div>
          <p className="text-zinc-300">Stats data unavailable. Check back later.</p>
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
