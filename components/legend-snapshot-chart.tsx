import Image from 'next/image'
import { CHARACTERS } from '@/lib/constants/characters'
import type { LegendSnapshot } from '@/lib/supabase/legend'

const CHAR_BY_ID = new Map(CHARACTERS.map(c => [c.bucklerCharId, c]))

const MAX_BAR_HEIGHT = 110

export function LegendSnapshotChart({ snapshot }: { snapshot: LegendSnapshot }) {
  const { data, snapped_at, player_count } = snapshot
  if (!data.length) return null

  const date = new Date(snapped_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const maxCount = data[0].count

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-bebas text-4xl tracking-widest text-zinc-100">Legend Snapshot</h2>
        <span className="text-xs text-zinc-400 flex-shrink-0">{date} · {player_count} players</span>
      </div>

      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="min-w-max">
          {/* Bar row */}
          <div className="flex items-end gap-1" style={{ height: `${MAX_BAR_HEIGHT + 28}px` }}>
            {data.map(entry => {
              const char = CHAR_BY_ID.get(entry.character_id)
              if (!char) return null
              const barHeight = Math.max(6, Math.round((entry.count / maxCount) * MAX_BAR_HEIGHT))

              return (
                <div
                  key={entry.character_id}
                  className="flex flex-col items-center justify-end w-10 h-full gap-1"
                >
                  <span className="text-xs font-bold text-zinc-100 tabular-nums leading-none">
                    {entry.count}
                  </span>
                  <div
                    className="w-8 rounded-t-sm flex-shrink-0"
                    style={{ height: `${barHeight}px`, backgroundColor: char.color }}
                  />
                </div>
              )
            })}
          </div>

          {/* Portrait row */}
          <div className="flex gap-1 border-t border-zinc-800 pt-2">
            {data.map(entry => {
              const char = CHAR_BY_ID.get(entry.character_id)
              if (!char) return null

              return (
                <div key={entry.character_id} className="flex flex-col items-center w-10 gap-0.5">
                  <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0" style={{ backgroundColor: `${char.color}20` }}>
                    <Image
                      src={`/characters/${char.slug}.png`}
                      alt={char.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 tabular-nums">{entry.percentage}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
