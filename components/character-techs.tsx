'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { VideoCard } from '@/components/video-card'

export type TechVideo = { title: string; url: string; thumbnail: string | null }
export type TechCategory = { id: string; label: string; videos: TechVideo[] }

// Pick black/white text for legibility against the (possibly light) accent fill.
function readableOn(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#0a0a0b' : '#fafafa'
}

export function CharacterTechs({ categories, accent = '#fbbf24' }: { categories: TechCategory[]; accent?: string }) {
  const [active, setActive] = useState('all')
  const activeText = readableOn(accent)

  const total = categories.reduce((n, c) => n + c.videos.length, 0)
  const chips = [
    { id: 'all', label: 'All', count: total },
    ...categories.map((c) => ({ id: c.id, label: c.label, count: c.videos.length })),
  ]

  const visible =
    active === 'all'
      ? categories.flatMap((c) => c.videos)
      : categories.find((c) => c.id === active)?.videos ?? []

  return (
    <div className="space-y-4">
      {/* Sticky filter row — sits under the navbar (and banner) so categories stay reachable while scrolling. */}
      <div className="sticky top-[calc(3.5rem+1px+var(--banner-h,0px))] z-20 -mx-6 px-6 py-2 bg-zinc-950/85 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => {
            const isActive = active === chip.id
            return (
              <button
                key={chip.id}
                onClick={() => setActive(chip.id)}
                style={isActive ? { background: accent, borderColor: accent, color: activeText } : undefined}
                className={cn(
                  'rounded-none border px-3 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors cursor-pointer',
                  isActive
                    ? ''
                    : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100',
                )}
              >
                {chip.label}{' '}
                <span
                  className={cn('font-normal', isActive ? '' : 'text-zinc-500')}
                  style={isActive ? { color: activeText, opacity: 0.65 } : undefined}
                >
                  {chip.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((v) => (
          <VideoCard key={v.url} href={v.url} title={v.title} thumbnail={v.thumbnail} />
        ))}
      </div>
    </div>
  )
}
