'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { getCharacterByBucklerId, getCharacterImageUrl } from '@/lib/constants/characters'
import { getSeason, setSeason, subscribeSeason } from '@/lib/constants/season'
import { useT } from '@/lib/i18n/context'
import type { BucklerLeagueInfo } from '@/lib/buckler'

interface Peak { characterId: number; mr: number; ranking: number }

// Phase picker for a player profile, plus the best MR reached in the picked phase (the play/act
// highest/master_rating_info action, cached server-side: 12h for the live phase, forever for past ones).
export function SeasonBar({ playerId, seasonIds, current }: {
  playerId: string
  seasonIds: number[]
  current: number
}) {
  const t = useT().season
  const season = useSyncExternalStore(subscribeSeason, () => getSeason(playerId), () => null)
  const shown = season ?? current
  // Keyed by phase; undefined = not fetched yet, null = no Master rank (or the fetch failed).
  const [peaks, setPeaks] = useState<Record<number, Peak | null>>({})

  useEffect(() => {
    if (shown in peaks) return
    const ctrl = new AbortController()
    fetch(`/api/winrates?id=${playerId}&kind=peak&season=${shown}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : { league: [] }))
      .then((d: { league: { character_id: number; league_info: BucklerLeagueInfo }[] }) => {
        const best = [...d.league].sort((a, b) => b.league_info.master_rating - a.league_info.master_rating)[0]
        setPeaks((p) => ({
          ...p,
          [shown]: best && best.league_info.master_rating > 0
            ? { characterId: best.character_id, mr: best.league_info.master_rating, ranking: best.league_info.master_rating_ranking }
            : null,
        }))
      })
      .catch(() => { if (!ctrl.signal.aborted) setPeaks((p) => ({ ...p, [shown]: null })) })
    return () => ctrl.abort()
  }, [shown, peaks, playerId])

  const peak = peaks[shown]
  const char = peak ? getCharacterByBucklerId(peak.characterId) : null

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <select
        aria-label={t.phase}
        value={shown}
        onChange={(e) => {
          const v = Number(e.target.value)
          setSeason(playerId, v === current ? null : v)
        }}
        className="w-full sm:w-auto rounded-none border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-400 focus:outline-none cursor-pointer"
      >
        {seasonIds.map((id) => (
          <option key={id} value={id}>
            {t.phase} {id}{id === current ? ` (${t.current})` : ''}
          </option>
        ))}
      </select>

      {peak === undefined ? null : peak && char ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-zinc-400">{t.peak}</span>
          <span className="relative w-6 h-6 overflow-hidden bg-zinc-800 shrink-0">
            <Image src={getCharacterImageUrl(char.slug)} alt={char.name} fill className="object-cover object-top" unoptimized />
          </span>
          <span className="font-semibold text-zinc-100 tabular-nums">{peak.mr.toLocaleString()} MR</span>
          {peak.ranking > 0 && <span className="text-zinc-400 tabular-nums">#{peak.ranking.toLocaleString()}</span>}
        </div>
      ) : (
        <span className="text-sm text-zinc-500">{t.noPeak}</span>
      )}
    </div>
  )
}
