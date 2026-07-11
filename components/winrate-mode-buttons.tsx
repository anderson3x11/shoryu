'use client'

import { cn } from '@/lib/utils'
import { WINRATE_MODES, type WinrateModeId } from '@/lib/constants/winrate-modes'

interface WinrateModeButtonsProps {
  value: WinrateModeId
  onChange: (mode: WinrateModeId) => void
}

// Battle-mode filter shared by the Overview character list and the Stats matchup chart.
// Same button style as the Match History mode tabs.
export function WinrateModeButtons({ value, onChange }: WinrateModeButtonsProps) {
  return (
    <div className="flex gap-1 flex-wrap justify-end">
      {WINRATE_MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={cn(
            'text-[11px] px-2 py-0.5 rounded-none border transition-colors cursor-pointer',
            value === m.id
              ? 'bg-zinc-700 border-zinc-600 text-white'
              : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-zinc-200'
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
