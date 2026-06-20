'use client'

import { useState, useEffect, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import type { LpCharacter, MatchupRow, SessionData, CurrentByChar } from '@/lib/supabase/ranked-stats'

// Code-split the tab panels: their JS (incl. recharts) loads only when a tab is first opened,
// keeping the overview-only path light.
const MatchHistory   = dynamic(() => import('@/components/match-history').then(m => m.MatchHistory))
const SessionSummary = dynamic(() => import('@/components/session-summary').then(m => m.SessionSummary))
const LpHistoryChart = dynamic(() => import('@/components/lp-history-chart').then(m => m.LpHistoryChart))
const MatchupChart   = dynamic(() => import('@/components/matchup-chart').then(m => m.MatchupChart))

type Tab = 'overview' | 'history' | 'stats'

interface RankedStats {
  characters: LpCharacter[]
  rows: MatchupRow[]
  totalBattles: number
  session: SessionData | null
  currentByChar: CurrentByChar
}

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
  const [stats, setStats] = useState<RankedStats | null>(null)   // null = not loaded yet
  const [statsError, setStatsError] = useState(false)

  function select(t: Tab) {
    setTab(t)
    setActivated((prev) => (prev.has(t) ? prev : new Set(prev).add(t)))
  }

  // Single ranked-stats fetch shared by both History (deltas) and Stats (charts + matchups).
  // Runs once, when either tab is first opened.
  const needStats = activated.has('history') || activated.has('stats')
  useEffect(() => {
    if (!needStats) return
    const ctrl = new AbortController()
    fetch(`/api/ranked-stats?id=${playerId}`, { signal: ctrl.signal })
      .then(r => r.json())
      .then((d: RankedStats) => setStats(d))
      .catch(() => { if (!ctrl.signal.aborted) setStatsError(true) })
    return () => ctrl.abort()
  }, [needStats, playerId])

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
                    : 'text-zinc-300 hover:text-zinc-200',
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
          <SessionSummary session={stats?.session ?? null} />
          <MatchHistory playerId={playerId} currentShortId={shortId} lpCharacters={stats?.characters ?? null} currentByChar={stats?.currentByChar} />
        </div>
      )}

      {activated.has('stats') && (
        <div className={cn('space-y-4', tab !== 'stats' && 'hidden')}>
          <LpHistoryChart characters={stats?.characters ?? null} error={statsError} />
          <MatchupChart rows={stats?.rows ?? null} totalBattles={stats?.totalBattles ?? 0} error={statsError} />
        </div>
      )}
    </div>
  )
}
