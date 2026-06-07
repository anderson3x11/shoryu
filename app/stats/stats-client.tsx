'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { CHARACTERS } from '@/lib/constants/characters'
import type { BucklerUsageRateData } from '@/lib/buckler/types'

const CHAR_MAP = new Map(CHARACTERS.map(c => [c.slug, c]))

const LEAGUE_LABELS = ['All', 'Rookie', 'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master']
const CONTROL_LABELS = ['Total', 'Modern', 'Classic']

function formatMonth(yyyymm: string): string {
  const year = parseInt(yyyymm.slice(0, 4))
  const month = parseInt(yyyymm.slice(4, 6)) - 1
  return new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function StatsClient({ data, month }: { data: BucklerUsageRateData; month: string }) {
  const [league, setLeague] = useState(0)
  const [control, setControl] = useState(0)

  const chars = useMemo(() => {
    const group = data.usagerateData.find(g => g.operation_type === control)
    const leagueData = group?.val.find(v => v.league_rank === league)
    if (!leagueData) return []
    return [...leagueData.val].sort((a, b) => b.play_rate - a.play_rate)
  }, [data, league, control])

  const maxRate = chars[0]?.play_rate ?? 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Stats</h1>
        <p className="text-zinc-400 text-sm mt-1">Character Usage — {formatMonth(month)}</p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-1.5">
          {CONTROL_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setControl(i)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                control === i
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {LEAGUE_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => setLeague(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors cursor-pointer ${
                league === i
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {chars.map((char, rank) => {
          const character = CHAR_MAP.get(char.character_tool_name)
          const delta = char.play_rate - char.previous_rate
          const barWidth = Math.round((char.play_rate / maxRate) * 100)
          const name = character?.name ?? char.character_alpha
          const color = character?.color ?? '#71717a'

          return (
            <div
              key={char.character_tool_name}
              className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/60 hover:border-zinc-700 transition-colors"
            >
              {/* Portrait */}
              <div className="relative aspect-square" style={{ backgroundColor: `${color}18` }}>
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at 50% 80%, ${color}35 0%, transparent 65%)` }}
                />
                <Image
                  src={`/characters/${char.character_tool_name}.png`}
                  alt={name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-zinc-900 to-transparent" />
                <span className="absolute top-1.5 left-2 text-xs font-bold text-white/50 tabular-nums">
                  #{rank + 1}
                </span>
              </div>

              {/* Info */}
              <div className="px-2.5 pb-2.5 pt-1.5 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-zinc-200 truncate leading-tight">{name}</span>
                  <span
                    className={`text-[10px] flex-shrink-0 tabular-nums font-medium leading-tight ${
                      delta > 0.05 ? 'text-emerald-400' : delta < -0.05 ? 'text-red-400' : 'text-zinc-600'
                    }`}
                  >
                    {delta > 0.05 ? '▲' : delta < -0.05 ? '▼' : '='}{Math.abs(delta).toFixed(2)}
                  </span>
                </div>
                <div className="text-lg font-bold text-white leading-none">
                  {char.play_rate.toFixed(1)}<span className="text-xs font-normal text-zinc-500 ml-0.5">%</span>
                </div>
                <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
