'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { PatchEntry } from '@/lib/supercombo'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-03-17" -> "17 Mar 2026". Formatted by hand so the date can't shift by timezone. */
function formatDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return iso
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`
}

/** Patch history, newest version open and the rest behind their version number. */
export function CharacterPatches({ patches, accent }: { patches: PatchEntry[]; accent: string }) {
  const [open, setOpen] = useState(patches[0]?.version ?? '')
  const active = patches.find((p) => p.version === open) ?? patches[0]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {patches.map((p) => (
          <button
            key={p.version}
            onClick={() => setOpen(p.version)}
            style={open === p.version ? { background: accent, color: '#0a0a0b', borderColor: accent } : undefined}
            className={cn(
              'rounded-none border px-2.5 py-1 text-xs font-semibold tabular-nums cursor-pointer transition-colors',
              open !== p.version && 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100',
            )}
          >
            {p.version}
          </button>
        ))}
      </div>

      {active && (
        <div className="border border-zinc-800 bg-zinc-900/40">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 border-b border-zinc-800 px-3 py-2">
            <span className="text-sm font-bold tabular-nums text-zinc-100">{active.version}</span>
            <span className="text-xs text-zinc-500">{formatDate(active.date)}</span>
            {active.summary && (
              <span className="text-xs text-zinc-400 basis-full sm:basis-auto">{active.summary}</span>
            )}
          </div>

          <ul className="divide-y divide-zinc-800/60">
            {active.notes.map((note, i) => {
              // Nesting is carried as leading spaces (3 per wiki bullet level).
              const depth = Math.floor((note.length - note.trimStart().length) / 3)
              return (
                <li
                  key={i}
                  className={cn(
                    'py-1.5 pr-3 text-sm leading-snug',
                    depth === 0 ? 'font-semibold text-zinc-100' : 'text-zinc-300',
                  )}
                  style={{ paddingLeft: `${0.75 + depth}rem` }}
                >
                  {note.trim()}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
