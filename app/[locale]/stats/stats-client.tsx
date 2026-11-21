'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { CHARACTERS } from '@/lib/constants/characters'
import type { BucklerUsageRateData } from '@/lib/buckler/types'

const CHAR_MAP = new Map(CHARACTERS.map(c => [c.slug, c]))

const LEAGUES = [
  { label: 'All',      rankId: null },
  { label: 'Rookie',   rankId: 3    },
  { label: 'Iron',     rankId: 8    },
  { label: 'Bronze',   rankId: 13   },
  { label: 'Silver',   rankId: 18   },
  { label: 'Gold',     rankId: 23   },
  { label: 'Platinum', rankId: 28   },
  { label: 'Diamond',  rankId: 33   },
  { label: 'Master',   rankId: 36   },
]

const CONTROLS = [
  { label: 'Total',   icon: null },
  { label: 'Classic', icon: 'https://www.streetfighter.com/6/buckler/assets/images/stats/icon_controltype0.png' },
  { label: 'Modern',  icon: 'https://www.streetfighter.com/6/buckler/assets/images/stats/icon_controltype1.png' },
]

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
        <div className="flex items-center gap-3">
          <span className="block w-2 h-10 sm:h-12 -skew-x-12 bg-amber-400 shrink-0" />
          <h1 className="font-bebas text-4xl sm:text-6xl tracking-widest text-zinc-100">Stats</h1>
        </div>
        <p className="text-zinc-300 text-sm mt-1">Character Usage - {formatMonth(month)}</p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          {CONTROLS.map(({ label, icon }, i) => (
            <button
              key={i}
              onClick={() => setControl(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-none text-sm font-medium transition-colors cursor-pointer ${
                control === i
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-300 hover:text-zinc-200'
              }`}
            >
              {icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={icon} alt={label} className="h-5 w-auto" />
              )}
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {LEAGUES.map(({ label, rankId }, i) => (
            <button
              key={i}
              onClick={() => setLeague(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-none text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors cursor-pointer ${
                league === i
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-300 hover:text-zinc-200'
              }`}
            >
              {rankId && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/ranks/rank${rankId}.png`} alt={label} className="h-5 w-auto" />
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-zinc-800/60">
        {chars.map((char, rank) => {
          const character = CHAR_MAP.get(char.character_tool_name)
          const delta = char.play_rate - char.previous_rate
          const barWidth = Math.round((char.play_rate / maxRate) * 100)
          const name = character?.name ?? char.character_alpha
          const color = character?.color ?? '#71717a'

          return (
            <div key={char.character_tool_name} className="flex items-center gap-3 sm:gap-4 py-2.5">
              {/* Rank */}
              <span className="text-sm text-zinc-400 tabular-nums w-6 text-right flex-shrink-0">
                {rank + 1}
              </span>

              {/* Portrait */}
              <div className="relative w-10 h-10 flex-shrink-0 rounded-none overflow-hidden" style={{ backgroundColor: `${color}20` }}>
                <Image
                  src={`/characters/${char.character_tool_name}.png`}
                  alt={name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Name + bar */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-zinc-100 uppercase tracking-wide truncate">{name}</span>
                  <span className={`text-xs tabular-nums flex-shrink-0 ${delta > 0.05 ? 'text-emerald-400' : delta < -0.05 ? 'text-red-400' : 'text-zinc-500'}`}>
                    {delta > 0.05 ? '▲' : delta < -0.05 ? '▼' : '='}{Math.abs(delta).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-zinc-800 overflow-hidden" style={{ clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}>
                    <div className="h-full bg-emerald-500" style={{ width: `${barWidth}%` }} />
                  </div>
                  <span className="text-sm font-bold text-white tabular-nums w-10 text-right flex-shrink-0">
                    {char.play_rate.toFixed(1)}<span className="text-xs font-normal text-zinc-400">%</span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
