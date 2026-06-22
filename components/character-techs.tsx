'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { VideoCard } from '@/components/video-card'

export type TechVideo = { title: string; url: string; thumbnail: string | null }
export type TechCategory = { id: string; label: string; videos: TechVideo[] }

export function CharacterTechs({ categories }: { categories: TechCategory[] }) {
  const [active, setActive] = useState('all')

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
          {chips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActive(chip.id)}
              className={cn(
                'rounded-none border px-3 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors cursor-pointer',
                active === chip.id
                  ? 'border-amber-400 bg-amber-400 text-zinc-950'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100',
              )}
            >
              {chip.label}{' '}
              <span className={cn('font-normal', active === chip.id ? 'text-zinc-800' : 'text-zinc-500')}>
                {chip.count}
              </span>
            </button>
          ))}
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
