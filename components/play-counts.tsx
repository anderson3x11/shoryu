import { Card } from '@/components/ui/card'
import type { BucklerPlayData } from '@/lib/buckler'

interface PlayCountsProps {
  playData: BucklerPlayData
}


const MODE_NAMES: Record<string, string> = {
  'Ranked Matches':      'Ranked',
  'Casual Matches':      'Casual',
  'Battle Hub':          'Battle Hub',
  'Custom Room Matches': 'Custom Room',
  'Practice':            'Practice',
  'World Tour':          'World Tour',
  'Extreme':             'Extreme',
  'Arcade':              'Arcade',
  'Offline Matches':     'Offline',
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
    .filter((pt) => pt.play_time > 0)
    .sort((a, b) => b.play_time - a.play_time)
    .slice(0, 5)

  const modes = [
    { label: 'Ranked',      count: stats.rank_match_play_count ?? 0,        color: '#ef4444' },
    { label: 'Casual',      count: stats.casual_match_play_count ?? 0,      color: '#60a5fa' },
    { label: 'Battle Hub',  count: stats.battle_hub_match_play_count ?? 0,  color: '#a78bfa' },
    { label: 'Custom Room', count: stats.custom_room_match_play_count ?? 0, color: '#34d399' },
  ]
  const total = modes.reduce((s, m) => s + m.count, 0)

  return (
    <Card className="bg-zinc-900 border-zinc-800 py-0 gap-0 flex flex-col">
      {/* Total */}
      <div className="px-4 pt-4 pb-3 border-b border-zinc-800 flex-shrink-0">
        <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-1">Matches Played</p>
        <p className="text-4xl font-bold text-white tabular-nums">{total.toLocaleString()}</p>
      </div>

      {/* Mode rows */}
      <div className="flex flex-col flex-shrink-0">
        {modes.map(({ label, count, color }) => {
          const pct = total > 0 ? (count / total) * 100 : 0
          return (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800"
            >
              <div className="w-0.5 self-stretch rounded-full flex-shrink-0" style={{ background: color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xs text-zinc-400">{label}</span>
                  <span className="text-sm font-bold text-zinc-200 tabular-nums">
                    {count.toLocaleString()}
                  </span>
                </div>
                <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
              <span className="text-[11px] text-zinc-600 tabular-nums w-7 text-right flex-shrink-0">
                {Math.round(pct)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* Time played */}
      {playtimes.length > 0 && (
        <div className="px-4 py-3 flex-shrink-0">
          <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-2.5">Time Played</p>
          <div className="space-y-1.5">
            {playtimes.map((pt) => (
              <div key={pt.content_type} className="flex justify-between text-xs">
                <span className="text-zinc-500">
                  {MODE_NAMES[pt.content_type_name] ?? pt.content_type_name}
                </span>
                <span className="text-zinc-300 tabular-nums font-medium">
                  {formatTime(pt.play_time)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
