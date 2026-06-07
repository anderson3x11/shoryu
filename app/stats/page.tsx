import { getUsageRate } from '@/lib/buckler/client'
import { StatsClient } from './stats-client'

export const metadata = {
  title: 'Stats',
  description: 'Street Fighter 6 character usage rates across all rank tiers.',
}

export default async function StatsPage() {
  const result = await getUsageRate()

  if (!result) {
    return (
      <div className="space-y-4">
        <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Stats</h1>
        <p className="text-zinc-400">Stats data unavailable. Check back later.</p>
      </div>
    )
  }

  return <StatsClient data={result.data} month={result.month} />
}
