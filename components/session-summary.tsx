'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { Card, CardTitle } from '@/components/ui/card'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import type { BucklerBattle } from '@/lib/buckler'
import { getBattleWinner } from '@/lib/buckler'
import type { LpCharacter } from '@/lib/supabase/ranked-stats'
import { cn } from '@/lib/utils'

interface SessionSummaryProps {
  playerId: string
  currentShortId: number | string
  lpCharacters: LpCharacter[] | null   // shared ranked-stats data (for per-match deltas)
}

type LpSeries = { isMaster: boolean; points: { at: number; lp: number }[] }

export function SessionSummary({ playerId, currentShortId, lpCharacters }: SessionSummaryProps) {
  const sid = Number(currentShortId)
  const [sessionBattles, setSessionBattles] = useState<BucklerBattle[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`/api/session?id=${playerId}`, { signal: ctrl.signal })
      .then(r => r.json())
      .then((s: { battles?: BucklerBattle[] }) => setSessionBattles(s.battles ?? []))
      .catch(() => {})
      .finally(() => setLoaded(true))
    return () => ctrl.abort()
  }, [playerId])

  const lpHistory = useMemo(() => {
    const m = new Map<number, LpSeries>()
    for (const c of lpCharacters ?? []) m.set(c.charId, { isMaster: c.isMaster, points: c.points })
    return m
  }, [lpCharacters])

  const session = useMemo(() => {
    if (sessionBattles.length === 0) return null

    // Defensive: only keep battles that actually involve the viewed player. A stale/mis-served
    // /api/session response could otherwise surface another player's data (wrong character + age).
    const chain = sessionBattles.filter(
      b => b.player1_info.player.short_id === sid || b.player2_info.player.short_id === sid,
    )
    if (chain.length === 0) return null

    type CharStat = {
      slug: string
      name: string
      count: number          // total matches with this character in session
      rankedCount: number    // ranked subset
      delta: number          // summed per-match MR/LP delta
      deltaCount: number     // how many ranked matches actually contributed a delta
      isMaster: boolean | null
    }

    let wins = 0, losses = 0
    const charStats = new Map<string, CharStat>()

    for (const battle of chain) {
      const isP1 = battle.player1_info.player.short_id === sid
      const me = isP1 ? battle.player1_info : battle.player2_info
      const winner = getBattleWinner(battle)
      const won = (isP1 && winner === 1) || (!isP1 && winner === 2)
      if (won) wins++; else losses++

      const slug = me.playing_character_tool_name
      if (!slug) continue
      let cs = charStats.get(slug)
      if (!cs) {
        cs = {
          slug, name: me.playing_character_name,
          count: 0, rankedCount: 0, delta: 0, deltaCount: 0, isMaster: null,
        }
        charStats.set(slug, cs)
      }
      cs.count++

      if (battle.replay_battle_type_name !== 'Ranked Match') continue
      cs.rankedCount++
      if (!me.playing_character_id) continue
      const isMaster = me.league_point >= 25000
      const series = lpHistory.get(me.playing_character_id)
      if (!series || series.isMaster !== isMaster) continue
      const current = isMaster ? me.master_rating : me.league_point
      let prior: { at: number; lp: number } | null = null
      for (let i = series.points.length - 1; i >= 0; i--) {
        if (series.points[i].at < battle.uploaded_at) { prior = series.points[i]; break }
      }
      if (!prior) continue
      cs.delta += current - prior.lp
      cs.deltaCount++
      cs.isMaster = isMaster
    }

    const newest = chain[0].uploaded_at
    const oldest = chain[chain.length - 1].uploaded_at
    const total = chain.length
    return {
      wins, losses, total,
      winRate: total ? Math.round((wins / total) * 100) : 0,
      durationSec: newest - oldest,
      ageSec: Math.max(0, Math.floor(Date.now() / 1000) - newest),
      chars: [...charStats.values()].sort((a, b) => b.count - a.count),
    }
  }, [sessionBattles, lpHistory, sid])

  if (!loaded || !session || session.total < 2) return null

  const title = session.ageSec < 6 * 3600 ? 'Current Session' : 'Latest Session'

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <div className="px-4 sm:px-5 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">{title}</CardTitle>
          <span className="text-xs text-zinc-400 tabular-nums">
            {fmtDuration(session.durationSec)} · ended {fmtAge(session.ageSec)}
          </span>
        </div>

        <div className="grid gap-3 sm:gap-6 grid-cols-3">
          <Stat value={String(session.wins)} label="Wins" color="emerald" />
          <Stat value={String(session.losses)} label="Losses" color="red" />
          <Stat value={`${session.winRate}%`} label="Win Rate" />
        </div>

        {session.chars.length > 0 && (
          <div className="flex items-center gap-x-4 gap-y-2 flex-wrap pt-3 border-t border-zinc-800/60 -mx-1 px-1 mt-1">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Played</span>
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
                <span className="text-zinc-400 tabular-nums">×{c.count}</span>
                {hasDelta && (
                  <span className={cn(
                    'tabular-nums font-semibold',
                    c.delta > 0 ? 'text-emerald-400' : c.delta < 0 ? 'text-red-400' : 'text-zinc-400'
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
      <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{label}</span>
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
