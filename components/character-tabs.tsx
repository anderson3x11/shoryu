'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { readableOn } from '@/components/filter-chips'

export interface CharacterTab {
  id: string
  label: string
  count?: number
  content: ReactNode
}

/**
 * Every panel is server-rendered and stays in the DOM (hidden, not unmounted) so the
 * frame data, matchups and combos are all in the static HTML for crawlers.
 */
export function CharacterTabs({ tabs, accent }: { tabs: CharacterTab[]; accent: string }) {
  const [active, setActive] = useState(tabs[0]?.id ?? '')
  const activeText = readableOn(accent)

  return (
    <div className="space-y-5">
      {/* Sticky under the navbar (h-14) + any tournament banner, matching the player page. */}
      <div className="sticky top-[calc(3.5rem+1px+var(--banner-h,0px))] z-30 -mx-6 px-6 py-2 bg-zinc-950/85 backdrop-blur-sm">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const isActive = active === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                style={isActive ? { background: accent, borderColor: accent, color: activeText } : undefined}
                className={cn(
                  'shrink-0 rounded-none border px-3.5 py-1.5 text-sm font-semibold uppercase tracking-wide cursor-pointer transition-colors',
                  !isActive && 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100',
                )}
              >
                {t.label}
                {t.count !== undefined && (
                  <span
                    className={cn('ml-1.5 font-normal', !isActive && 'text-zinc-600')}
                    style={isActive ? { color: activeText, opacity: 0.65 } : undefined}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {tabs.map((t) => (
        <div key={t.id} hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  )
}
