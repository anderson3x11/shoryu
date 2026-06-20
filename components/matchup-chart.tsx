'use client'

import Image from 'next/image'
import { Card, CardTitle } from '@/components/ui/card'
import { getCharacterImageUrl, getCharacterByBucklerId } from '@/lib/constants/characters'
import type { MatchupRow, MatchupVs } from '@/lib/supabase/ranked-stats'

interface MatchupChartProps {
  rows: MatchupRow[] | null   // null = still loading
  totalBattles: number
  error?: boolean
}

// Skewed bar matching the Stats-page usage bars
const BAR_CLIP = 'polygon(3px 0%, 100% 0%, calc(100% - 3px) 100%, 0% 100%)'

// Win-rate driven colors: green above 50%, red below, deepening toward the extremes.
function matchupColors(wins: number, total: number): { bar: string; text: string } {
  const r = wins / total
  if (r > 0.501) {
    const t = Math.min((r - 0.5) / 0.5, 1)
    return { bar: `hsl(145, ${58 + t * 22}%, ${40 + t * 8}%)`, text: `hsl(145, ${65 + t * 25}%, ${62 - t * 8}%)` }
  }
  if (r < 0.499) {
    const t = Math.min((0.5 - r) / 0.5, 1)
    return { bar: `hsl(0, ${58 + t * 22}%, ${46 + t * 6}%)`, text: `hsl(0, ${65 + t * 25}%, ${64 - t * 8}%)` }
  }
  return { bar: 'rgb(113,113,122)', text: 'rgb(161,161,170)' }
}

function MatchupBar({ vs }: { vs: MatchupVs }) {
  const rate = Math.round((vs.wins / vs.total) * 100)
  const losses = vs.total - vs.wins
  const { bar, text } = matchupColors(vs.wins, vs.total)

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-9 h-9 overflow-hidden flex-shrink-0 bg-zinc-800">
        <Image
          src={getCharacterImageUrl(vs.charSlug)}
          alt={vs.charName}
          fill
          className="object-cover object-top"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="text-xs text-zinc-200 uppercase tracking-wide truncate">{vs.charName}</span>
          <span className="text-xs font-bold tabular-nums flex-shrink-0" style={{ color: text }}>
            {rate}%
            <span className="text-[10px] font-normal text-zinc-400 ml-1">{vs.wins}-{losses}</span>
          </span>
        </div>
        <div className="h-1.5 bg-zinc-800 overflow-hidden" style={{ clipPath: BAR_CLIP }}>
          <div className="h-full" style={{ width: `${rate}%`, background: bar }} />
        </div>
      </div>
    </div>
  )
}

export function MatchupChart({ rows, totalBattles, error = false }: MatchupChartProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 py-0 gap-0">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="block w-1.5 h-5 -skew-x-12 bg-amber-400" />
          <CardTitle className="font-bebas text-xl tracking-widest text-zinc-100 leading-none">Matchups</CardTitle>
        </div>
        {rows !== null && (
          <span className="text-xs text-zinc-400">
            Based on last {totalBattles} ranked matches
          </span>
        )}
      </div>

      {error && (
        <div className="px-4 pb-4 text-sm text-zinc-300">Failed to load matchup data.</div>
      )}

      {!error && rows === null && (
        <div className="px-4 pb-4 flex items-center gap-2 text-sm text-zinc-300">
          <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
          Computing matchups…
        </div>
      )}

      {!error && rows !== null && rows.length === 0 && (
        <div className="px-4 pb-4 text-sm text-zinc-300">No ranked match data found.</div>
      )}

      {!error && rows !== null && rows.length > 0 && (
        <div className="px-4 pb-4 space-y-5">
          {rows.map(row => {
            const matchups = Object.values(row.vs).sort((a, b) => b.total - a.total)
            const charColor = getCharacterByBucklerId(row.charId)?.color ?? '#fbbf24'
            return (
              <div key={row.charId} className="space-y-3.5">
                {/* Main character this block of matchups belongs to */}
                <div className="flex items-center gap-3 bg-zinc-800/40 px-3 py-2.5">
                  <span className="block w-1.5 h-9 -skew-x-12 flex-shrink-0" style={{ background: charColor }} />
                  <div className="relative w-12 h-12 overflow-hidden flex-shrink-0 bg-zinc-900">
                    <Image
                      src={getCharacterImageUrl(row.charSlug)}
                      alt={row.charName}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bebas text-2xl tracking-widest text-zinc-100 leading-none">{row.charName}</div>
                    <div className="text-[11px] text-zinc-400 tabular-nums mt-1.5">{row.totalGames} ranked games</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 px-1">
                  {matchups.map(vs => (
                    <MatchupBar key={vs.charId} vs={vs} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
