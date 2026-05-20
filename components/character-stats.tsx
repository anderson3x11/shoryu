'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardTitle } from '@/components/ui/card'
import { getRankImageUrl, getRank, TIER_COLORS, showsMasterRating } from '@/lib/constants/ranks'
import { getCharacterByBucklerId, getCharacterImageUrl } from '@/lib/constants/characters'
import type { BucklerLeagueInfo } from '@/lib/buckler'

export interface PhaseCharInfo {
  character_id: number
  is_played: boolean
  league_info: BucklerLeagueInfo
}

export interface PhaseData {
  id: string
  label: string
  chars: PhaseCharInfo[]
}

interface CharacterStatsProps {
  phases: PhaseData[]
}

const VISIBLE_ROWS = 5

function sortByBest(chars: PhaseCharInfo[]): PhaseCharInfo[] {
  return [...chars]
    .filter((c) => c.is_played)
    .sort((a, b) => {
      const aMR = a.league_info.master_rating
      const bMR = b.league_info.master_rating
      if (bMR !== aMR) return bMR - aMR
      return b.league_info.league_point - a.league_info.league_point
    })
}

function RankBadge({ li }: { li: BucklerLeagueInfo }) {
  const rank = getRank(li.league_rank)
  const color = TIER_COLORS[rank.tier] ?? '#ffffff'
  const hasMR = showsMasterRating(li.league_rank) && li.master_rating > 0

  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0" style={{ width: 88 }}>
      <div className="relative" style={{ width: 88, height: 44 }}>
        <Image
          src={getRankImageUrl(li.league_rank)}
          alt={rank.name}
          fill
          className="object-contain drop-shadow-sm"
          unoptimized
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>
        {hasMR
          ? `${li.master_rating.toLocaleString()} MR`
          : li.league_point > 0
          ? `${li.league_point.toLocaleString()} LP`
          : '—'}
      </span>
    </div>
  )
}

export function CharacterStats({ phases }: CharacterStatsProps) {
  const [activePhaseId, setActivePhaseId] = useState(phases[0]?.id ?? '')

  const activePhase = phases.find((p) => p.id === activePhaseId) ?? phases[0]
  const displayed = activePhase ? sortByBest(activePhase.chars) : []

  return (
    <Card className="absolute inset-0 bg-zinc-900 border-zinc-800 flex flex-col py-0 gap-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
        <CardTitle className="text-zinc-400 uppercase tracking-wider">Characters</CardTitle>

        {phases.length > 1 && (
          <div className="flex gap-1 flex-wrap justify-end">
            {phases.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePhaseId(p.id)}
                className={`text-[11px] px-2 py-0.5 rounded border border-zinc-700 transition-colors ${
                  activePhaseId === p.id
                    ? 'bg-zinc-600 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List — fills remaining card height, scrolls when content exceeds it */}
      <div className="relative flex-1 min-h-0">
      <div className="overflow-y-auto h-full">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-600">
            <span className="text-2xl">—</span>
            <p className="text-sm">No ranked games this phase</p>
          </div>
        ) : (
          displayed.map((c, i) => {
            const char = getCharacterByBucklerId(c.character_id)
            const color = char?.color ?? '#3f3f46'

            return (
              <div
                key={c.character_id}
                className="flex items-center gap-3 px-4 py-2.5 border-t border-zinc-800"
              >
                <span className="text-xs text-zinc-600 w-4 tabular-nums flex-shrink-0 text-right">
                  {i + 1}
                </span>

                <div
                  className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ background: `linear-gradient(to top, ${color}99 0%, #18181b 100%)` }}
                >
                  {char && (
                    <Image
                      src={getCharacterImageUrl(char.slug)}
                      alt={char.name}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200 truncate">
                    {char?.name ?? `Character ${c.character_id}`}
                  </p>
                </div>

                <RankBadge li={c.league_info} />
              </div>
            )
          })
        )}
      </div>
      {displayed.length > VISIBLE_ROWS && (
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />
      )}
      </div>
    </Card>
  )
}
