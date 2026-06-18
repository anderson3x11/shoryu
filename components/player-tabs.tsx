'use client'

import { useState, type ReactNode } from 'react'
import { MatchHistory } from '@/components/match-history'
import { SessionSummary } from '@/components/session-summary'
import { LpHistoryChart } from '@/components/lp-history-chart'
import { MatchupChart } from '@/components/matchup-chart'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'history' | 'stats'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'history',  label: 'Recent Battles' },
  { id: 'stats',    label: 'Stats' },
]

interface PlayerTabsProps {
  playerId: string
  shortId: number | string
  header: ReactNode
  overview: ReactNode
}

export function PlayerTabs({ playerId, shortId, header, overview }: PlayerTabsProps) {
  const [tab, setTab] = useState<Tab>('overview')
  // Tabs mount on first activation and stay mounted afterward, so switching back doesn't refetch.
  const [activated, setActivated] = useState<Set<Tab>>(() => new Set<Tab>(['overview']))

  function select(t: Tab) {
    setTab(t)
    setActivated((prev) => (prev.has(t) ? prev : new Set(prev).add(t)))
  }

  return (
    <div className="space-y-4">
      {/* Sticky tab bar — stays under the navbar (h-14) while scrolling. -mx-6 full-bleeds it past
          the main container's px-6 so scrolled content doesn't peek around the edges. */}
      <div className="sticky top-14 z-30 -mx-6 px-6 py-2 bg-zinc-950/85 backdrop-blur-sm">
        <div className="flex justify-center">
          <div className="inline-flex gap-1 rounded-lg bg-zinc-900 border border-zinc-800 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => select(t.id)}
                className={cn(
                  'text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-md transition-colors cursor-pointer whitespace-nowrap',
                  tab === t.id
                    ? 'bg-sky-500 text-white'
                    : 'text-zinc-400 hover:text-zinc-200',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {header}

      <div className={cn(tab !== 'overview' && 'hidden')}>{overview}</div>

      {activated.has('history') && (
        <div className={cn('space-y-4', tab !== 'history' && 'hidden')}>
          <SessionSummary playerId={playerId} currentShortId={shortId} />
          <MatchHistory playerId={playerId} currentShortId={shortId} />
        </div>
      )}

      {activated.has('stats') && (
        <div className={cn('space-y-4', tab !== 'stats' && 'hidden')}>
          <LpHistoryChart playerId={playerId} />
          <MatchupChart playerId={playerId} />
        </div>
      )}
    </div>
  )
}
