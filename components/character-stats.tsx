'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { Card, CardTitle } from '@/components/ui/card'
import { getRankImageUrl, getRank, TIER_COLORS, showsMasterRating, getEffectiveRankId } from '@/lib/constants/ranks'
import { getCharacterByBucklerId, getCharacterImageUrl } from '@/lib/constants/characters'
import { getWinrateMode, getServerWinrateMode, setWinrateMode, subscribeWinrateMode, type WinrateModeId } from '@/lib/constants/winrate-modes'
import { WinrateModeButtons } from '@/components/winrate-mode-buttons'
import { getSeason, subscribeSeason } from '@/lib/constants/season'
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

export interface WinRateEntry {
  character_id: number
  win_count: number
  battle_count: number
}

interface CharacterStatsProps {
  playerId: string
  phases: PhaseData[]
  winRates?: WinRateEntry[]   // mode "All", straight from the cached profile
}

const VISIBLE_ROWS = 5

function sortByBest(chars: PhaseCharInfo[], winRateMap: Map<number, WinRateEntry>): PhaseCharInfo[] {
  return [...chars]
    .filter((c) => c.is_played)
    .sort((a, b) => {
      const aMR = a.league_info.master_rating
      const bMR = b.league_info.master_rating
      if (bMR !== aMR) return bMR - aMR
      const aLP = a.league_info.league_point
      const bLP = b.league_info.league_point
      if (bLP !== aLP) return bLP - aLP
      const aBattles = winRateMap.get(a.character_id)?.battle_count ?? 0
      const bBattles = winRateMap.get(b.character_id)?.battle_count ?? 0
      return bBattles - aBattles
    })
}

function RankBadge({ li }: { li: BucklerLeagueInfo }) {
  const effectiveId = getEffectiveRankId(li.league_rank, li.master_league, li.master_rating_ranking, li.master_rating)
  const rank = getRank(effectiveId)
  const color = TIER_COLORS[rank.tier] ?? '#ffffff'
  const isLegend = effectiveId === 37
  const hasMR = showsMasterRating(li.league_rank) && li.master_rating > 0

  let subText: string
  if (isLegend && li.master_rating_ranking > 0) {
    subText = `#${li.master_rating_ranking}`
  } else if (hasMR) {
    subText = `${li.master_rating.toLocaleString()} MR`
  } else if (li.league_point > 0) {
    subText = `${li.league_point.toLocaleString()} LP`
  } else {
    subText = 'N/A'
  }

  const w = 88
  const h = 55
  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0" style={{ width: w }}>
      <div className="relative" style={{ width: w, height: h }}>
        <Image
          src={getRankImageUrl(effectiveId)}
          alt={rank.name}
          fill
          className="object-contain drop-shadow-sm"
          unoptimized
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>
        {subText}
      </span>
    </div>
  )
}

export function CharacterStats({ playerId, phases, winRates }: CharacterStatsProps) {
  const [activePhaseId, setActivePhaseId] = useState(phases[0]?.id ?? '')

  // Battle-mode filter and phase (season bar). The current phase in mode 1 ("All") is the
  // winRates prop; anything else is fetched once and kept per (phase, mode), so toggling back and
  // forth costs a single request each. A past phase also loads where each character ended it.
  const mode = useSyncExternalStore(subscribeWinrateMode, getWinrateMode, getServerWinrateMode)
  const season = useSyncExternalStore(subscribeSeason, () => getSeason(playerId), () => null)
  const key = `${season ?? 'current'}:${mode}`
  const [byKey, setByKey] = useState<Record<string, WinRateEntry[]>>({})
  const [leagues, setLeagues] = useState<Record<number, PhaseCharInfo[]>>({})
  const [failedKey, setFailedKey] = useState<string | null>(null)
  const failed = failedKey === key
  const own = season === null && mode === 1

  useEffect(() => {
    if (own || byKey[key] || failed) return
    const ctrl = new AbortController()
    const seasonQs = season === null ? '' : `&season=${season}`
    fetch(`/api/winrates?id=${playerId}&mode=${mode}&kind=chars${seasonQs}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d: { winRates: WinRateEntry[] }) => setByKey((prev) => ({ ...prev, [key]: d.winRates })))
      .catch(() => { if (!ctrl.signal.aborted) setFailedKey(key) })
    return () => ctrl.abort()
  }, [own, key, byKey, failed, mode, season, playerId])

  useEffect(() => {
    if (season === null || leagues[season]) return
    const ctrl = new AbortController()
    fetch(`/api/winrates?id=${playerId}&kind=league&season=${season}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d: { league: PhaseCharInfo[] }) => setLeagues((prev) => ({ ...prev, [season]: d.league })))
      .catch(() => { if (!ctrl.signal.aborted) setFailedKey(key) })
    return () => ctrl.abort()
  }, [season, leagues, key, playerId])

  function selectMode(m: WinrateModeId) {
    setFailedKey(null)
    setWinrateMode(m)
  }

  const activeWinRates = own ? winRates : byKey[key]
  const seasonChars = season === null ? null : leagues[season]
  const loading = !failed && (!activeWinRates || (season !== null && !seasonChars))
  const winRateMap = new Map(activeWinRates?.map(w => [w.character_id, w]) ?? [])

  const activePhase = phases.find((p) => p.id === activePhaseId) ?? phases[0]
  const chars = season === null ? activePhase?.chars : seasonChars
  const displayed = chars ? sortByBest(chars, winRateMap) : []

  return (
    <Card className="absolute inset-0 bg-zinc-900 border-zinc-800 flex flex-col py-0 gap-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="block w-1.5 h-5 -skew-x-12 bg-amber-400" />
          <CardTitle className="font-bebas text-xl tracking-widest text-zinc-100 leading-none">Characters</CardTitle>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {phases.length > 1 &&
            phases.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePhaseId(p.id)}
                className={`text-[11px] px-2 py-0.5 rounded-none border border-zinc-700 transition-colors ${
                  activePhaseId === p.id
                    ? 'bg-zinc-600 text-white'
                    : 'bg-zinc-900 text-zinc-300 hover:text-zinc-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          {loading && (
            <div className="w-3 h-3 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
          )}
          <WinrateModeButtons value={mode} onChange={selectMode} />
        </div>
      </div>

      {failed && (
        <p className="px-4 pb-2 text-xs text-zinc-400 flex-shrink-0">Win rates unavailable for this mode.</p>
      )}

      {/* List — fills remaining card height, scrolls when content exceeds it */}
      <div className="relative flex-1 min-h-0">
      <div className="overflow-y-auto h-full">
        {displayed.length === 0 && loading ? null : displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-300">
            <span className="text-2xl text-zinc-500">?</span>
            <p className="text-sm">No ranked games this phase</p>
          </div>
        ) : (
          displayed.map((c, i) => {
            const char = getCharacterByBucklerId(c.character_id)

            return (
              <div
                key={c.character_id}
                className="flex items-center gap-3 px-4 py-2.5 border-t border-zinc-800"
              >
                <span className="text-xs text-zinc-300 w-4 tabular-nums flex-shrink-0 text-right">
                  {i + 1}
                </span>

                <div className="relative w-14 h-14 overflow-hidden flex-shrink-0">
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

                <div className="flex-1 grid grid-cols-3 items-center min-w-0">
                  <p className="text-base font-semibold text-zinc-200 truncate uppercase tracking-wide">
                    {char?.name ?? `Character ${c.character_id}`}
                  </p>

                  {(() => {
                    const wr = winRateMap.get(c.character_id)
                    if (loading) return <div />
                    if (!wr || wr.battle_count === 0) {
                      return (
                        <div className="flex items-center justify-center">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">No games</p>
                        </div>
                      )
                    }
                    const losses = wr.battle_count - wr.win_count
                    const rate = (wr.win_count / wr.battle_count) * 100
                    return (
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-sm font-semibold tabular-nums whitespace-nowrap">
                          <span className="text-emerald-400">{wr.win_count}W</span>
                          <span className="text-zinc-400"> / </span>
                          <span className="text-red-400">{losses}L</span>
                        </p>
                        <p className="text-[11px] font-semibold tabular-nums uppercase tracking-wide text-zinc-400 leading-tight">{wr.battle_count} games</p>
                        <p className="text-sm font-semibold tabular-nums text-zinc-100">{rate.toFixed(1)}%</p>
                      </div>
                    )
                  })()}

                  <div className="flex justify-end">
                    <RankBadge li={c.league_info} />
                  </div>
                </div>
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
