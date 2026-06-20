'use client'

import { useState, useTransition, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { getRankImageUrl, getEffectiveRankId } from '@/lib/constants/ranks'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import type { BucklerBattle } from '@/lib/buckler'
import { getBattleWinner } from '@/lib/buckler'
import { valueAfter } from '@/lib/supabase/ranked-stats'
import type { LpCharacter, CurrentByChar } from '@/lib/supabase/ranked-stats'
import { cn } from '@/lib/utils'

interface MatchHistoryProps {
  initialBattles?: BucklerBattle[]
  initialTotalPages?: number
  currentShortId: number | string
  playerId: string
  lpCharacters: LpCharacter[] | null   // shared ranked-stats data (for per-match deltas)
  currentByChar?: CurrentByChar        // live LP/MR per character (for the newest game's delta)
}

type Mode = 'all' | 'rank' | 'casual' | 'hub' | 'custom'

const MODES: { id: Mode; label: string }[] = [
  { id: 'all',    label: 'All'        },
  { id: 'rank',   label: 'Ranked'     },
  { id: 'casual', label: 'Casual'     },
  { id: 'hub',    label: 'Battle Hub' },
  { id: 'custom', label: 'Custom Room'},
]

function ReplayIdCopy({ replayId }: { replayId: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.stopPropagation()
        try {
          await navigator.clipboard.writeText(replayId)
          setCopied(true)
          setTimeout(() => setCopied(false), 1200)
        } catch {}
      }}
      title={copied ? 'Copied!' : 'Click to copy'}
      className={cn(
        'text-[10px] sm:text-xs font-mono tabular-nums tracking-wider mt-0.5 cursor-pointer transition-colors',
        copied ? 'text-emerald-400' : 'text-zinc-300 hover:text-zinc-300',
      )}
    >
      {copied ? 'COPIED' : replayId}
    </button>
  )
}

const MATCH_TYPE_LABELS: Record<string, string> = {
  'Ranked Match':      'Ranked',
  'Casual Match':      'Casual',
  'Battle Hub Match':  'Battle Hub',
  'Custom Room Match': 'Custom Room',
}

export function MatchHistory({ initialBattles = [], initialTotalPages = 1, currentShortId, playerId, lpCharacters, currentByChar }: MatchHistoryProps) {
  const [mode, setMode]           = useState<Mode>('all')
  const [page, setPage]           = useState(1)
  const [battles, setBattles]     = useState<BucklerBattle[]>(initialBattles)
  const [totalPages, setTotal]    = useState(initialTotalPages)
  const [charFilter, setCharFilter] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // True while the lazy first-page fetch is in flight (no server-provided battles).
  const [initialLoading, setInitialLoading] = useState(initialBattles.length === 0)

  // When mounted without server-provided battles (lazy tab open), fetch the first 'all' page.
  useEffect(() => {
    if (initialBattles.length > 0) return
    const ctrl = new AbortController()
    fetch(`/api/battles?id=${playerId}&mode=all&page=1`, { signal: ctrl.signal })
      .then(r => r.json())
      .then((json: { battles?: BucklerBattle[]; totalPages?: number }) => {
        setBattles(json.battles ?? [])
        setTotal(json.totalPages ?? 1)
        setInitialLoading(false)
      })
      .catch(() => { if (!ctrl.signal.aborted) setInitialLoading(false) })
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId])

  // Player-wide ranked LP/MR series per character, from the shared ranked-stats fetch.
  // Used as a reference for computing per-match deltas — including the oldest match on each page.
  type LpSeries = { isMaster: boolean; points: { at: number; lp: number }[] }
  const lpHistory = useMemo(() => {
    const m = new Map<number, LpSeries>()
    for (const c of lpCharacters ?? []) m.set(c.charId, { isMaster: c.isMaster, points: c.points })
    return m
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lpCharacters])

  const sid = Number(currentShortId)

  async function load(nextMode: Mode, nextPage: number, filter: string | null = charFilter) {
    const params = new URLSearchParams({ id: playerId, mode: nextMode, page: String(nextPage) })
    if (filter) {
      params.set('char', filter)
      params.set('sid', String(sid))
    }
    const res  = await fetch(`/api/battles?${params}`)
    const json = await res.json()
    setBattles(json.battles ?? [])
    setTotal(json.totalPages ?? 1)
    setPage(nextPage)
    setMode(nextMode)
  }

  function switchMode(m: Mode) {
    if (m === mode) return
    setCharFilter(null)
    startTransition(() => { load(m, 1, null) })
  }

  function selectChar(slug: string | null) {
    const next = slug === null ? null : (charFilter === slug ? null : slug)
    setCharFilter(next)
    startTransition(() => { load(mode, 1, next) })
  }

  function goPage(p: number) {
    startTransition(() => { load(mode, p) })
  }

  // Accumulated set of characters this player has been seen using across loaded pages. Keeping it
  // stable means filtering by a character (which collapses the visible roster to that one char) does
  // not erase the other character buttons from the toolbar.
  const [knownChars, setKnownChars] = useState<Map<string, string>>(() => {
    const m = new Map<string, string>()
    const seedSid = Number(currentShortId)
    for (const battle of initialBattles) {
      const isP1 = battle.player1_info.player.short_id === seedSid
      const me = isP1 ? battle.player1_info : battle.player2_info
      if (me.playing_character_tool_name) {
        m.set(me.playing_character_tool_name, me.playing_character_name)
      }
    }
    return m
  })

  useEffect(() => {
    if (charFilter) return // a filtered page can't reveal new characters — skip
    setKnownChars(prev => {
      let added = false
      const next = new Map(prev)
      for (const battle of battles) {
        const isP1 = battle.player1_info.player.short_id === sid
        const me = isP1 ? battle.player1_info : battle.player2_info
        if (me.playing_character_tool_name && !next.has(me.playing_character_tool_name)) {
          next.set(me.playing_character_tool_name, me.playing_character_name)
          added = true
        }
      }
      return added ? next : prev
    })
  }, [battles, sid, charFilter])

  const myChars = useMemo(
    () => [...knownChars.entries()].map(([slug, name]) => ({ slug, name })),
    [knownChars],
  )

  // Per-replay LP/MR deltas. Buckler stores the PRE-match value on each battle, so a game's change
  // is (value after) - (value before) where "after" is the next-newer point in the player-wide
  // series, or the live current value for the character's newest game. Skip across a Master
  // promotion, where the metric flips between LP and MR.
  const deltasByReplay = useMemo(() => {
    const out = new Map<string, { delta: number; isMaster: boolean }>()
    for (const battle of battles) {
      if (battle.replay_battle_type_name !== 'Ranked Match') continue
      const isP1 = battle.player1_info.player.short_id === sid
      const me = isP1 ? battle.player1_info : battle.player2_info
      if (!me.playing_character_id) continue
      const isMaster = me.league_point >= 25000
      const series = lpHistory.get(me.playing_character_id)
      if (!series || series.isMaster !== isMaster) continue
      const before = isMaster ? me.master_rating : me.league_point
      const after = valueAfter(series, battle.uploaded_at, isMaster, currentByChar?.[me.playing_character_id])
      if (after === null) continue
      out.set(battle.replay_id, { delta: after - before, isMaster })
    }
    return out
  }, [battles, sid, lpHistory, currentByChar])

  return (
    <Card className="bg-zinc-900 border-zinc-800 py-0 gap-0">
      {/* Header + tabs */}
      <div className="px-4 pt-4 pb-0 flex items-center justify-between gap-4 flex-wrap">
        <CardTitle className="text-sm text-zinc-300 uppercase tracking-wider">Match History</CardTitle>
        <div className="flex gap-1 flex-wrap justify-end">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              className={cn(
                'text-xs px-3 py-1 rounded border transition-colors cursor-pointer',
                mode === m.id
                  ? 'bg-zinc-700 border-zinc-600 text-white'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-zinc-300'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Character filter */}
      {myChars.length > 1 && (
        <div className="px-4 pt-2.5 pb-0 flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => selectChar(null)}
            className={cn(
              'text-xs px-2.5 py-0.5 rounded border transition-colors cursor-pointer',
              charFilter === null
                ? 'bg-zinc-700 border-zinc-600 text-white'
                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-zinc-300'
            )}
          >
            All
          </button>
          {myChars.map(({ slug, name }) => (
            <button
              key={slug}
              onClick={() => selectChar(slug)}
              title={name}
              className={cn(
                'relative w-7 h-7 rounded overflow-hidden border transition-all cursor-pointer flex-shrink-0',
                charFilter === slug ? 'border-zinc-400 opacity-100' : 'border-zinc-700 opacity-50 hover:opacity-90'
              )}
            >
              <Image src={getCharacterImageUrl(slug)} alt={name} fill className="object-cover object-top" unoptimized />
            </button>
          ))}
        </div>
      )}

      {/* Battles */}
      <div className={cn('mt-3 divide-y divide-zinc-800/60 transition-opacity', pending && 'opacity-40')}>
        {initialLoading ? (
          <div className="px-4 py-10 flex items-center justify-center gap-2 text-sm text-zinc-300">
            <span className="w-4 h-4 rounded-full border-2 border-zinc-600 border-t-sky-400 animate-spin" />
            Loading matches…
          </div>
        ) : battles.length === 0 ? (
          <div className="px-4 py-6 text-sm text-zinc-300">
            {charFilter ? 'No more matches with this character.' : 'No matches found.'}
          </div>
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
          const myRankId  = getEffectiveRankId(me.league_rank,  me.master_league,  0, me.master_rating)
          const oppRankId = getEffectiveRankId(opp.league_rank, opp.master_league, 0, opp.master_rating)
          const lpDelta   = deltasByReplay.get(battle.replay_id)

          return (
            <div
              key={battle.replay_id}
              className="relative grid grid-cols-[1fr_auto_1fr] sm:grid-cols-[1fr_380px_1fr] items-center gap-3 sm:gap-6 px-3 sm:px-5 py-4 hover:bg-zinc-800/40 transition-colors"
            >
              <div className={cn('absolute left-0 top-0 bottom-0 w-1', won ? 'bg-emerald-500' : 'bg-red-500')} />

              {/* LEFT — player side: W/L, rank, char name */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
                <span className={cn('text-sm font-bold w-5 text-center flex-shrink-0', won ? 'text-emerald-400' : 'text-red-400')}>
                  {won ? 'W' : 'L'}
                </span>

                <div className="relative w-14 h-[35px] sm:w-20 sm:h-[50px] flex-shrink-0">
                  <Image src={getRankImageUrl(myRankId)} alt="" fill className="object-contain" unoptimized />
                </div>

                <div className="hidden md:block min-w-0">
                  <p className="text-sm font-bold text-zinc-100 truncate leading-tight">
                    {me.player.fighter_id}
                  </p>
                  <p className="text-xs text-zinc-300 truncate mt-0.5">
                    {me.playing_character_name}
                  </p>
                </div>
              </div>

              {/* CENTER — portraits flanking date/match-type/score/replay */}
              <div className="flex items-center gap-3 sm:gap-5 px-2 sm:px-4 flex-shrink-0">
                <div className={cn(
                  'relative w-14 h-14 sm:w-16 sm:h-16 overflow-hidden flex-shrink-0 transition-all',
                  !won && 'grayscale opacity-50'
                )}>
                  {mySlug && (
                    <Image src={getCharacterImageUrl(mySlug)} alt={me.playing_character_name}
                      fill className="object-cover object-top" unoptimized />
                  )}
                </div>

                <div className="flex flex-col items-center gap-0.5 w-[140px] sm:w-[180px]">
                  <span className="text-[11px] text-zinc-300 tabular-nums uppercase tracking-widest whitespace-nowrap">
                    {date && <span>{date}</span>}
                    {date && (lpDelta || matchType) && <span className="text-zinc-400 mx-1.5">·</span>}
                    {lpDelta ? (
                      <span className={cn(
                        'font-semibold',
                        lpDelta.delta > 0 ? 'text-emerald-400' : lpDelta.delta < 0 ? 'text-red-400' : 'text-zinc-300'
                      )}>
                        {lpDelta.delta > 0 ? '+' : ''}{lpDelta.delta} {lpDelta.isMaster ? 'MR' : 'LP'}
                      </span>
                    ) : matchType ? (
                      <span>{matchType}</span>
                    ) : null}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-zinc-100 tabular-nums leading-none">
                    {rounds.won}
                    <span className="text-zinc-500 mx-2">–</span>
                    {rounds.lost}
                  </span>
                  {me.round_results.length > 0 && (
                    <div className="flex items-center gap-1 mt-1" aria-label="Round results">
                      {me.round_results.map((r, i) => (
                        <span
                          key={i}
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            r > 0 ? 'bg-emerald-400' : 'bg-red-400',
                          )}
                        />
                      ))}
                    </div>
                  )}
                  <ReplayIdCopy replayId={battle.replay_id} />
                </div>

                <div className={cn(
                  'relative w-14 h-14 sm:w-16 sm:h-16 overflow-hidden flex-shrink-0 transition-all',
                  won && 'grayscale opacity-50'
                )}>
                  {oppSlug && (
                    <Image src={getCharacterImageUrl(oppSlug)} alt={opp.playing_character_name}
                      fill className="object-cover object-top" unoptimized />
                  )}
                </div>
              </div>

              {/* RIGHT — opponent side: name, rank */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden justify-end">
                <div className="hidden md:block min-w-0 text-right">
                  <Link
                    href={`/player/${opp.player.short_id}`}
                    className="text-sm font-bold text-zinc-100 hover:text-white truncate block leading-tight"
                  >
                    {opp.player.fighter_id}
                  </Link>
                  <p className="text-xs text-zinc-300 truncate mt-0.5">
                    {opp.playing_character_name}
                  </p>
                </div>

                <Link
                  href={`/player/${opp.player.short_id}`}
                  className="md:hidden text-sm font-bold text-zinc-100 hover:text-white truncate min-w-0"
                >
                  {opp.player.fighter_id}
                </Link>

                <div className="relative w-14 h-[35px] sm:w-20 sm:h-[50px] flex-shrink-0">
                  <Image src={getRankImageUrl(oppRankId)} alt="" fill className="object-contain" unoptimized />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {mounted && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
          <button
            onClick={() => goPage(page - 1)}
            disabled={page <= 1 || pending}
            className="text-xs px-3 py-1.5 rounded border border-zinc-700 text-zinc-300 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs text-zinc-300">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => goPage(page + 1)}
            disabled={page >= totalPages || pending}
            className="text-xs px-3 py-1.5 rounded border border-zinc-700 text-zinc-300 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </Card>
  )
}
