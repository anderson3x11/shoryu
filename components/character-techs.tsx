'use client'

import { useState } from 'react'
import { VideoCard } from '@/components/video-card'
import { FilterChips } from '@/components/filter-chips'

export type TechVideo = { title: string; url: string; thumbnail: string | null }
export type TechCategory = { id: string; label: string; videos: TechVideo[] }

export function CharacterTechs({ categories, accent = '#fbbf24' }: { categories: TechCategory[]; accent?: string }) {
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
      <FilterChips items={chips} active={active} onSelect={setActive} accent={accent} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((v) => (
          <VideoCard key={v.url} href={v.url} title={v.title} thumbnail={v.thumbnail} />
        ))}
      </div>
    </div>
  )
}
