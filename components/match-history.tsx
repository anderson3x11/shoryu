'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { getRankImageUrl, getEffectiveRankId } from '@/lib/constants/ranks'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import type { BucklerBattle } from '@/lib/buckler'
import { getBattleWinner } from '@/lib/buckler'
import { cn } from '@/lib/utils'

interface MatchHistoryProps {
  initialBattles: BucklerBattle[]
  initialTotalPages: number
  currentShortId: number | string
  playerId: string
}

type Mode = 'all' | 'rank' | 'casual' | 'hub' | 'custom'

const MODES: { id: Mode; label: string }[] = [
  { id: 'all',    label: 'All'        },
  { id: 'rank',   label: 'Ranked'     },
  { id: 'casual', label: 'Casual'     },
  { id: 'hub',    label: 'Battle Hub' },
  { id: 'custom', label: 'Custom Room'},
]

const MATCH_TYPE_LABELS: Record<string, string> = {
  'Ranked Match':      'Ranked',
  'Casual Match':      'Casual',
  'Battle Hub Match':  'Battle Hub',
  'Custom Room Match': 'Custom Room',
}

export function MatchHistory({ initialBattles, initialTotalPages, currentShortId, playerId }: MatchHistoryProps) {
  const [mode, setMode]           = useState<Mode>('all')
  const [page, setPage]           = useState(1)
  const [battles, setBattles]     = useState<BucklerBattle[]>(initialBattles)
  const [totalPages, setTotal]    = useState(initialTotalPages)
  const [pending, startTransition] = useTransition()

  async function load(nextMode: Mode, nextPage: number) {
    const res  = await fetch(`/api/battles?id=${playerId}&mode=${nextMode}&page=${nextPage}`)
    const json = await res.json()
    setBattles(json.battles ?? [])
    setTotal(json.totalPages ?? 1)
    setPage(nextPage)
    setMode(nextMode)
  }

  function switchMode(m: Mode) {
    if (m === mode) return
    startTransition(() => { load(m, 1) })
  }

  function goPage(p: number) {
    startTransition(() => { load(mode, p) })
  }

  const sid = Number(currentShortId)

  return (
    <Card className="bg-zinc-900 border-zinc-800 py-0 gap-0">
      {/* Header + tabs */}
      <div className="px-4 pt-4 pb-0 flex items-center justify-between gap-4 flex-wrap">
        <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Match History</CardTitle>
        <div className="flex gap-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={cn(
                'text-xs px-3 py-1 rounded border transition-colors cursor-pointer',
                mode === m.id
                  ? 'bg-zinc-700 border-zinc-600 text-white'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Battles */}
      <div className={cn('mt-3 divide-y divide-zinc-800/60 transition-opacity', pending && 'opacity-40')}>
        {battles.length === 0 ? (
          <div className="px-4 py-6 text-sm text-zinc-600">No matches found.</div>
        ) : battles.map((battle) => {
          const isP1 = battle.player1_info.player.short_id === sid
          const me   = isP1 ? battle.player1_info : battle.player2_info
          const opp  = isP1 ? battle.player2_info : battle.player1_info
          const winner = getBattleWinner(battle)
          const won    = (isP1 && winner === 1) || (!isP1 && winner === 2)

          const mySlug  = me.playing_character_tool_name
          const oppSlug = opp.playing_character_tool_name
          const matchType = MATCH_TYPE_LABELS[battle.replay_battle_type_name] ?? battle.replay_battle_type_name
          const date = battle.uploaded_at
            ? new Date(battle.uploaded_at * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : null
          const rounds = {
            won:  me.round_results.filter(r => r > 0).length,
            lost: opp.round_results.filter(r => r > 0).length,
          }
          const oppRankId = getEffectiveRankId(opp.league_rank, opp.master_league, 0, opp.master_rating)

          return (
            <div
              key={battle.replay_id}
              className="relative flex items-center gap-4 px-4 py-3.5 hover:bg-zinc-800/40 transition-colors"
            >
              <div className={cn('absolute left-0 top-0 bottom-0 w-1', won ? 'bg-emerald-500' : 'bg-red-500')} />

              <span className={cn('text-sm font-bold w-5 text-center flex-shrink-0', won ? 'text-emerald-400' : 'text-red-400')}>
                {won ? 'W' : 'L'}
              </span>

              <div className="relative w-14 h-14 overflow-hidden flex-shrink-0">
                {mySlug && (
                  <Image src={getCharacterImageUrl(mySlug)} alt={me.playing_character_name}
                    fill className="object-cover object-top" unoptimized />
                )}
              </div>

              <div className="flex flex-col items-center gap-0.5 flex-shrink-0 w-10">
                <span className="text-sm font-bold text-zinc-400 tabular-nums">{rounds.won}–{rounds.lost}</span>
                {date && <span className="text-[10px] text-zinc-600 tabular-nums">{date}</span>}
              </div>

              <div className="relative w-14 h-14 overflow-hidden flex-shrink-0">
                {oppSlug && (
                  <Image src={getCharacterImageUrl(oppSlug)} alt={opp.playing_character_name}
                    fill className="object-cover object-top" unoptimized />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/player/${opp.player.short_id}`}
                  className="text-base font-bold text-zinc-100 hover:text-white truncate block leading-tight"
                >
                  {opp.player.fighter_id}
                </Link>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {opp.playing_character_name}
                  {matchType && <span className="text-zinc-600"> · {matchType}</span>}
                </p>
                <p className="text-[10px] text-zinc-700 tabular-nums mt-0.5 font-mono">
                  {battle.replay_id}
                </p>
              </div>

              <div className="self-stretch flex-shrink-0 flex items-center justify-end" style={{ width: 80 }}>
                <div className="relative" style={{ width: 80, height: 50 }}>
                  <Image src={getRankImageUrl(oppRankId)} alt="" fill className="object-contain" unoptimized />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
          <button
            onClick={() => goPage(page - 1)}
            disabled={page <= 1 || pending}
            className="text-xs px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs text-zinc-600">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => goPage(page + 1)}
            disabled={page >= totalPages || pending}
            className="text-xs px-3 py-1.5 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </Card>
  )
}
