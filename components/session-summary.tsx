'use client'

import Image from 'next/image'
import { Card, CardTitle } from '@/components/ui/card'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import type { SessionData } from '@/lib/supabase/ranked-stats'
import { cn } from '@/lib/utils'

interface SessionSummaryProps {
  session: SessionData | null   // from the shared ranked-stats fetch; null while loading / no session
}

export function SessionSummary({ session }: SessionSummaryProps) {
  if (!session || session.total < 2) return null

  // Computed client-side from newestAt so a cached response never shows a stale "ended X ago".
  const ageSec = Math.max(0, Math.floor(Date.now() / 1000) - session.newestAt)

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <div className="px-4 sm:px-5 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-sm text-zinc-300 uppercase tracking-wider">Last Session</CardTitle>
          <span className="text-xs text-zinc-300 tabular-nums">
            {fmtDuration(session.durationSec)} · ended {fmtAge(ageSec)}
          </span>
        </div>

        <div className="grid gap-3 sm:gap-6 grid-cols-3">
          <Stat value={String(session.wins)} label="Wins" color="emerald" />
          <Stat value={String(session.losses)} label="Losses" color="red" />
          <Stat value={`${session.winRate}%`} label="Win Rate" />
        </div>

        {session.chars.length > 0 && (
          <div className="flex items-center gap-x-4 gap-y-2 flex-wrap pt-3 border-t border-zinc-800/60 -mx-1 px-1 mt-1">
            <span className="text-[10px] text-zinc-300 uppercase tracking-widest">Played</span>
            {session.chars.map(c => {
              const hasDelta = c.deltaCount > 0
              const approx = hasDelta && c.deltaCount < c.rankedCount
              return (
              <div key={c.slug} className="flex items-center gap-1.5 text-xs text-zinc-300">
                <div className="relative w-6 h-6 overflow-hidden flex-shrink-0">
                  <Image
                    src={getCharacterImageUrl(c.slug)}
                    alt={c.name}
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                </div>
                <span>{c.name}</span>
                <span className="text-zinc-300 tabular-nums">×{c.count}</span>
                {hasDelta && (
                  <span className={cn(
                    'tabular-nums font-semibold',
                    c.delta > 0 ? 'text-emerald-400' : c.delta < 0 ? 'text-red-400' : 'text-zinc-300'
                  )}>
                    {approx ? '~' : ''}{c.delta > 0 ? '+' : ''}{c.delta} {c.isMaster ? 'MR' : 'LP'}
                  </span>
                )}
              </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}

function Stat({
  value,
  label,
  color,
}: {
  value: string
  label: string
  color?: 'emerald' | 'red'
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className={cn(
        'text-2xl sm:text-3xl font-bold tabular-nums leading-none',
        color === 'emerald' && 'text-emerald-400',
        color === 'red' && 'text-red-400',
        !color && 'text-zinc-100',
      )}>
        {value}
      </span>
      <span className="text-[10px] text-zinc-300 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function fmtDuration(sec: number): string {
  if (sec <= 0) return 'N/A'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function fmtAge(sec: number): string {
  const m = Math.floor(sec / 60)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
