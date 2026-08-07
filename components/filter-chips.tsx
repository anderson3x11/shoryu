'use client'

import { cn } from '@/lib/utils'

export interface Chip {
  id: string
  label: string
  count: number
}

/** Pick black/white text for legibility against the (possibly light) accent fill. */
export function readableOn(hex: string): string {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#0a0a0b' : '#fafafa'
}

/** Single-select filter row, filled with the character accent when active. */
export function FilterChips({
  items, active, onSelect, accent = '#fbbf24',
}: {
  items: Chip[]
  active: string
  onSelect: (id: string) => void
  accent?: string
}) {
  const activeText = readableOn(accent)
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((chip) => {
        const isActive = active === chip.id
        return (
          <button
            key={chip.id}
            onClick={() => onSelect(chip.id)}
            style={isActive ? { background: accent, borderColor: accent, color: activeText } : undefined}
            className={cn(
              'rounded-none border px-3 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors cursor-pointer',
              !isActive && 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100',
            )}
          >
            {chip.label}{' '}
            <span
              className={cn('font-normal', !isActive && 'text-zinc-500')}
              style={isActive ? { color: activeText, opacity: 0.65 } : undefined}
            >
              {chip.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
