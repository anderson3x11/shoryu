'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardTitle } from '@/components/ui/card'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import type { MatchupRow, MatchupVs } from '@/app/api/matchups/route'

interface MatchupChartProps {
  playerId: string
}

function cellStyle(wins: number, total: number): React.CSSProperties {
  const r = wins / total
  const neutral = { backgroundColor: 'rgba(39,39,42,0.5)', color: 'rgb(161,161,170)' }
  if (r >= 0.499 && r <= 0.501) return neutral

  if (r > 0.5) {
    const t = Math.min((r - 0.5) / 0.5, 1)           // 0 → 1 as rate goes 50% → 100%
    const bgAlpha = 0.12 + t * 0.48                   // 0.12 → 0.60
    const textL   = 70 - t * 22                        // 70% → 48% lightness
    const textS   = 65 + t * 25                        // 65% → 90% saturation
    return {
      backgroundColor: `hsla(145,65%,14%,${bgAlpha})`,
      color: `hsl(145,${textS}%,${textL}%)`,
    }
  } else {
    const t = Math.min((0.5 - r) / 0.5, 1)
    const bgAlpha = 0.12 + t * 0.48
    const textL   = 70 - t * 22
    const textS   = 65 + t * 25
    return {
      backgroundColor: `hsla(0,65%,14%,${bgAlpha})`,
      color: `hsl(0,${textS}%,${textL}%)`,
    }
  }
}

function Cell({ vs }: { vs: MatchupVs | undefined }) {
  if (!vs) return <td className="w-14 h-12 border border-zinc-800/60 bg-zinc-900/30" />
  const rate = Math.round((vs.wins / vs.total) * 100)
  return (
    <td className="w-14 h-12 border border-zinc-800/60 text-center align-middle" style={cellStyle(vs.wins, vs.total)}>
      <div className="text-xs font-bold tabular-nums">{rate}%</div>
      <div className="text-[10px] opacity-60 tabular-nums">{vs.wins}/{vs.total}</div>
    </td>
  )
}

export function MatchupChart({ playerId }: MatchupChartProps) {
  const [rows, setRows]         = useState<MatchupRow[] | null>(null)
  const [totalBattles, setTotal] = useState(0)
  const [error, setError]       = useState(false)

  useEffect(() => {
    fetch(`/api/matchups?id=${playerId}`)
      .then(r => r.json())
      .then(data => {
        setRows(data.rows ?? [])
        setTotal(data.totalBattles ?? 0)
      })
      .catch(() => setError(true))
  }, [playerId])

  // Build the union of all opponent characters, sorted by total encounters
  const oppTotals: Record<number, { slug: string; name: string; total: number }> = {}
  if (rows) {
    for (const row of rows) {
      for (const vs of Object.values(row.vs)) {
        if (!oppTotals[vs.charId]) oppTotals[vs.charId] = { slug: vs.charSlug, name: vs.charName, total: 0 }
        oppTotals[vs.charId].total += vs.total
      }
    }
  }
  const oppCols = Object.entries(oppTotals)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([id, info]) => ({ charId: Number(id), ...info }))

  return (
    <Card className="bg-zinc-900 border-zinc-800 py-0 gap-0">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2 flex-wrap">
        <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Matchups</CardTitle>
        {rows !== null && (
          <span className="text-xs text-zinc-600">
            Based on last {totalBattles} ranked matches
          </span>
        )}
      </div>

      {error && (
        <div className="px-4 pb-4 text-sm text-zinc-600">Failed to load matchup data.</div>
      )}

      {!error && rows === null && (
        <div className="px-4 pb-4 flex items-center gap-2 text-sm text-zinc-600">
          <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
          Computing matchups…
        </div>
      )}

      {!error && rows !== null && rows.length === 0 && (
        <div className="px-4 pb-4 text-sm text-zinc-600">No ranked match data found.</div>
      )}

      {!error && rows !== null && rows.length > 0 && oppCols.length > 0 && (
        <div className="overflow-x-auto pb-4">
          {/* border-separate keeps sticky positioning working across browsers */}
          <table className="border-separate border-spacing-0 text-xs">
            <thead>
              <tr>
                {/* top-left corner — z-20 so it covers scrolling column headers */}
                <th className="sticky left-0 z-20 bg-zinc-900 w-44 min-w-44 border-r border-zinc-800" />
                {oppCols.map(col => (
                  <th key={col.charId} className="w-14 min-w-14 pb-2 px-1 align-bottom border-b border-zinc-800">
                    <div className="flex flex-col items-center gap-1">
                      <div className="relative w-9 h-9 overflow-hidden rounded">
                        <Image
                          src={getCharacterImageUrl(col.slug)}
                          alt={col.name}
                          fill
                          className="object-cover object-top"
                          unoptimized
                        />
                      </div>
                      <span className="text-[9px] text-zinc-500 leading-tight text-center w-14 truncate block">
                        {col.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.charId}>
                  <td className="sticky left-0 z-10 bg-zinc-900 border-r border-b border-zinc-800 px-3 py-2">
                    <div className="flex items-center gap-2.5 w-36">
                      <div className="relative w-10 h-10 overflow-hidden rounded flex-shrink-0">
                        <Image
                          src={getCharacterImageUrl(row.charSlug)}
                          alt={row.charName}
                          fill
                          className="object-cover object-top"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-200 truncate">{row.charName}</p>
                        <p className="text-[10px] text-zinc-600">{row.totalGames}g</p>
                      </div>
                    </div>
                  </td>
                  {oppCols.map(col => (
                    <Cell key={col.charId} vs={row.vs[col.charId]} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
