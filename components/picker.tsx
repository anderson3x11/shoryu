'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PickerOption {
  value: string
  label: string
  icon?: ReactNode
  buttonIcon?: ReactNode   // shown in the closed button when selected (defaults to icon)
  count?: number
}

// Site-styled replacement for a native <select>: square button, dark panel, amber selection.
// `grid` lays the options out as icon tiles (character portraits) instead of a list.
export function Picker({ label, value, options, allLabel, onChange, grid = false, className }: {
  label: string                 // accessible name of the control
  value: string                 // '' = all
  options: PickerOption[]
  allLabel?: string             // when set, adds a first "all" option with value ''
  onChange: (value: string) => void
  grid?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = options.find((o) => o.value === value)
  const pick = (v: string) => { onChange(v); setOpen(false) }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center gap-2 rounded-none border bg-zinc-900 px-3 h-10 text-sm transition-colors cursor-pointer',
          open ? 'border-amber-400' : 'border-zinc-700 hover:border-zinc-500',
        )}
      >
        {current?.buttonIcon ?? current?.icon}
        <span className={cn('flex-1 truncate text-left', current ? 'text-zinc-100' : 'text-zinc-300')}>
          {current?.label ?? allLabel ?? label}
        </span>
        <ChevronDown size={15} className={cn('shrink-0 text-zinc-400 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className={cn(
            'absolute left-0 z-30 mt-1 border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/60',
            grid ? 'w-[min(22rem,calc(100vw-2rem))] p-2' : 'w-full min-w-56 max-h-80 overflow-y-auto py-1',
          )}
        >
          {allLabel && (
            <button
              type="button"
              role="option"
              aria-selected={value === ''}
              onClick={() => pick('')}
              className={cn(
                'flex w-full items-center justify-between px-3 py-2 text-sm text-left cursor-pointer transition-colors',
                grid && 'mb-2 border border-zinc-800',
                value === '' ? 'text-amber-400' : 'text-zinc-200 hover:bg-zinc-800',
              )}
            >
              {allLabel}
              {value === '' && <Check size={14} />}
            </button>
          )}
          {grid ? (
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  title={o.count != null ? `${o.label} (${o.count})` : o.label}
                  aria-label={o.label}
                  onClick={() => pick(o.value)}
                  className={cn(
                    'relative aspect-square overflow-hidden border bg-zinc-800 cursor-pointer transition-colors',
                    o.value === value ? 'border-amber-400' : 'border-zinc-800 hover:border-zinc-500',
                  )}
                >
                  {o.icon}
                  {o.count != null && (
                    <span className="absolute bottom-0 right-0 bg-black/80 px-1 text-[10px] font-semibold tabular-nums text-zinc-100">
                      {o.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => pick(o.value)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm text-left cursor-pointer transition-colors',
                  o.value === value ? 'text-amber-400' : 'text-zinc-200 hover:bg-zinc-800',
                )}
              >
                {o.icon}
                <span className="flex-1 truncate">{o.label}</span>
                {o.count != null && <span className="tabular-nums text-xs text-zinc-500">{o.count}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
