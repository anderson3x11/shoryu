'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import type { Rival, RivalsData } from '@/lib/supabase/ranked-stats'
import { cn } from '@/lib/utils'

interface RivalsProps {
  data: RivalsData | null   // null = still loading
  error?: boolean
}

type Variant = 'played' | 'victim' | 'tormentor'

export function Rivals({ data, error = false }: RivalsProps) {
  const empty = data !== null && data.mostPlayed.length === 0

  return (
    <Card className="bg-zinc-900 border-zinc-800 py-0 gap-0">
      <div className="px-4 pt-4 pb-3 flex items-center gap-2">
        <span className="block w-1.5 h-5 -skew-x-12 bg-amber-400" />
        <CardTitle className="font-bebas text-xl tracking-widest text-zinc-100 leading-none">Rivals</CardTitle>
      </div>

      {data === null && !error && (
        <div className="px-4 pb-5 text-sm text-zinc-400">Loading…</div>
      )}
      {error && (
        <div className="px-4 pb-5 text-sm text-zinc-400">Couldn&apos;t load rivals.</div>
      )}
      {empty && (
        <div className="px-4 pb-5 text-sm text-zinc-400">No ranked battles synced yet.</div>
      )}

      {data !== null && !empty && (
        <div className="px-4 pb-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Section title="Most Played" variant="played" rivals={data.mostPlayed} />
          <Section title="Victims" variant="victim" rivals={data.victims} hint="you beat most" />
          <Section title="Tormentors" variant="tormentor" rivals={data.tormentors} hint="beat you most" />
        </div>
      )}
    </Card>
  )
}

function Section({
  title,
  variant,
  rivals,
  hint,
}: {
  title: string
  variant: Variant
  rivals: Rival[]
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2 border-b border-zinc-800 pb-1.5">
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">{title}</span>
        {hint && <span className="text-[10px] text-zinc-500 lowercase tracking-wide">{hint}</span>}
      </div>
      {rivals.length === 0 ? (
        <span className="text-xs text-zinc-500 py-1">Not enough games.</span>
      ) : (
        <ul className="flex flex-col">
          {rivals.map((r) => (
            <RivalRow key={r.playerId} rival={r} variant={variant} />
          ))}
        </ul>
      )}
    </div>
  )
}

function RivalRow({ rival, variant }: { rival: Rival; variant: Variant }) {
  const diff = rival.wins - rival.losses

  return (
    <li>
      <Link
        href={`/player/${rival.playerId}`}
        prefetch={false}
        className="flex items-center gap-2.5 py-1.5 -mx-1 px-1 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="relative w-8 h-8 overflow-hidden flex-shrink-0 bg-zinc-800">
          <Image
            src={getCharacterImageUrl(rival.charSlug)}
            alt={rival.charName}
            fill
            className="object-cover object-top"
            unoptimized
          />
        </div>
        <span className={cn('flex-1 min-w-0 truncate text-sm text-zinc-200', !rival.name && 'text-zinc-500 italic')}>
          {rival.name ?? 'Unknown'}
        </span>
        <span className="flex items-center gap-2 flex-shrink-0 tabular-nums text-xs">
          {variant === 'played' && (
            <span className="text-zinc-500">{rival.total}g</span>
          )}
          <span className="text-zinc-400">
            <span className="text-emerald-400">{rival.wins}</span>
            <span className="text-zinc-600">-</span>
            <span className="text-red-400">{rival.losses}</span>
          </span>
          {variant !== 'played' && (
            <span className={cn('font-semibold w-7 text-right', diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-zinc-400')}>
              {diff > 0 ? '+' : ''}{diff}
            </span>
          )}
        </span>
      </Link>
    </li>
  )
}
