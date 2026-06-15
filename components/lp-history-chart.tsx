'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { Card, CardTitle } from '@/components/ui/card'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import type { LpCharacter } from '@/app/api/lp-history/route'

interface LpHistoryChartProps {
  playerId: string
}

function fmt(ts: number) {
  const d = new Date(ts * 1000)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtFull(ts: number) {
  const d = new Date(ts * 1000)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function CustomTooltip({ active, payload, isMaster }: { active?: boolean; payload?: Array<{ value: number; payload: { at: number } }>; isMaster: boolean }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-xs">
      <p className="text-zinc-400 mb-1">{fmtFull(payload[0].payload.at)}</p>
      <p className="text-sky-400 font-bold tabular-nums">{payload[0].value.toLocaleString()} {isMaster ? 'MR' : 'LP'}</p>
    </div>
  )
}

export function LpHistoryChart({ playerId }: LpHistoryChartProps) {
  const [characters, setCharacters] = useState<LpCharacter[] | null>(null)
  const [selected, setSelected]     = useState<number | null>(null)
  const [error, setError]           = useState(false)

  useEffect(() => {
    fetch(`/api/lp-history?id=${playerId}`)
      .then(r => r.json())
      .then(data => {
        const chars: LpCharacter[] = data.characters ?? []
        setCharacters(chars)
        if (chars.length > 0) setSelected(chars[0].charId)
      })
      .catch(() => setError(true))
  }, [playerId])

  const char = characters?.find(c => c.charId === selected)

  // Deduplicate by timestamp, filter zeros (pre-placement MR)
  const points = char
    ? char.points
        .reduce<Array<{ at: number; lp: number }>>((acc, p) => {
          const last = acc[acc.length - 1]
          if (last && last.at === p.at) { last.lp = p.lp } else { acc.push({ ...p }) }
          return acc
        }, [])
        .filter(p => p.lp > 0)
    : []

  // First non-zero point after each zero-sequence = season reset
  const resetMarkers = char
    ? char.points.reduce<number[]>((acc, p, i, arr) => {
        if (p.lp > 0 && i > 0 && arr[i - 1].lp === 0) acc.push(p.at)
        return acc
      }, [])
    : []

  return (
    <Card className="bg-zinc-900 border-zinc-800 py-0 gap-0">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2 flex-wrap">
        <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">{char?.isMaster ? 'MR' : 'LP'} History</CardTitle>
        {characters !== null && characters.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {characters.map(c => (
              <button
                key={c.charId}
                onClick={() => setSelected(c.charId)}
                className={[
                  'flex items-center gap-1.5 px-2 py-1 rounded border text-xs transition-colors cursor-pointer',
                  selected === c.charId
                    ? 'bg-zinc-700 border-zinc-600 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-300',
                ].join(' ')}
              >
                <div className="relative w-5 h-5 overflow-hidden rounded-sm flex-shrink-0">
                  <Image src={getCharacterImageUrl(c.charSlug)} alt={c.charName} fill className="object-cover object-top" unoptimized />
                </div>
                {c.charName}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 pb-4 text-sm text-zinc-400">Failed to load LP history.</div>
      )}

      {!error && characters === null && (
        <div className="px-4 pb-4 flex items-center gap-2 text-sm text-zinc-400">
          <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
          Loading history…
        </div>
      )}

      {!error && characters !== null && characters.length === 0 && (
        <div className="px-4 pb-4 text-sm text-zinc-400">No ranked match data found.</div>
      )}

      {!error && points.length > 0 && (() => {
        const vals = points.map(p => p.lp)
        const minVal = Math.min(...vals)
        const maxVal = Math.max(...vals)
        const pad = char?.isMaster ? Math.max(50, Math.round((maxVal - minVal) * 0.1)) : Math.max(500, Math.round((maxVal - minVal) * 0.1))
        const domainMin = char?.isMaster ? Math.max(1000, minVal - pad) : Math.max(0, minVal - pad)
        const domainMax = char?.isMaster ? Math.min(2500, maxVal + pad) : Math.min(25000, maxVal + pad)

        return (
        <div className="px-4 pb-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={points} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,63,70,0.5)" />
              <XAxis
                dataKey="at"
                tickFormatter={fmt}
                tick={{ fill: '#d4d4d8', fontSize: 10 }}
                axisLine={{ stroke: '#3f3f46' }}
                tickLine={false}
                minTickGap={60}
              />
              <YAxis
                domain={[domainMin, domainMax]}
                tick={{ fill: '#d4d4d8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => v.toLocaleString()}
                width={56}
              />
              <Tooltip content={<CustomTooltip isMaster={char?.isMaster ?? false} />} />
              {resetMarkers.map(ts => (
                <ReferenceLine key={ts} x={ts} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.5}
                  label={{ value: 'Reset', position: 'insideTopRight', fill: '#f59e0b', fontSize: 9 }}
                />
              ))}
              <Line
                type="monotone"
                dataKey="lp"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ r: 3, fill: '#38bdf8', strokeWidth: 0 }}
                activeDot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-zinc-500 text-right mt-1">Showing {points.length} of {char?.points.length} ranked matches · {char?.isMaster ? 'Master Rating' : 'League Points'}</p>
        </div>
        )
      })()}
    </Card>
  )
}
