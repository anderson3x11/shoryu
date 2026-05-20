import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BucklerPlayData } from '@/lib/buckler'

interface PlayCountsProps {
  playData: BucklerPlayData
}

const MODE_NAMES: Record<string, string> = {
  'Ranked Matches':         'Ranked',
  'Casual Matches':         'Casual',
  'Battle Hub':             'Battle Hub',
  'Custom Room Matches':    'Custom Room',
  'Practice':               'Practice',
  'World Tour':             'World Tour',
  'Extreme':                'Extreme',
  'Arcade':                 'Arcade',
  'Offline Matches':        'Offline',
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function PlayCounts({ playData }: PlayCountsProps) {
  const stats = playData.battle_stats
  const playtimes = playData.base_info.content_play_time_list

  const mainModes = [
    { label: 'Ranked',      count: stats.rank_match_play_count },
    { label: 'Casual',      count: stats.casual_match_play_count },
    { label: 'Battle Hub',  count: stats.battle_hub_match_play_count },
    { label: 'Custom Room', count: stats.custom_room_match_play_count },
  ]
  const total = mainModes.reduce((s, m) => s + (m.count ?? 0), 0)

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Matches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-3xl font-bold text-white tabular-nums">
          {total.toLocaleString()}
          <span className="text-base font-normal text-zinc-500 ml-2">total</span>
        </p>

        <div className="grid grid-cols-2 gap-2">
          {mainModes.map(({ label, count }) => (
            <div key={label} className="bg-zinc-800 rounded-lg px-3 py-2">
              <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
              <p className="text-lg font-bold text-zinc-200 tabular-nums">
                {(count ?? 0).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Play time breakdown */}
        <div className="space-y-1.5 pt-1 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Time Played</p>
          {playtimes
            .filter((pt) => pt.play_time > 0)
            .sort((a, b) => b.play_time - a.play_time)
            .map((pt) => (
              <div key={pt.content_type} className="flex justify-between text-sm">
                <span className="text-zinc-400">{MODE_NAMES[pt.content_type_name] ?? pt.content_type_name}</span>
                <span className="text-zinc-300 tabular-nums font-medium">{formatTime(pt.play_time)}</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
