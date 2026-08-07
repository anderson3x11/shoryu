'use client'

import { Fragment, useMemo, useState } from 'react'
import Image from 'next/image'
import { Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { advTone, TONE_CLASS, type Move, type MoveGroup } from '@/lib/supercombo'
import { FilterChips } from '@/components/filter-chips'

const WIKI = 'https://wiki.supercombo.gg'

const GROUP_LABELS: Record<MoveGroup, string> = {
  normal: 'Normals',
  air: 'Air',
  throw: 'Throws',
  special: 'Specials',
  super: 'Supers',
  drive: 'Drive',
  taunt: 'Taunts',
}

const GROUP_ORDER: MoveGroup[] = ['normal', 'air', 'throw', 'special', 'super', 'drive', 'taunt']

/**
 * Frame data is 18 fields per move, which no phone can show at once. The columns players
 * scan first stay visible at every width and the rest appear as the viewport allows;
 * everything else lives in the expanded row.
 */
interface Column {
  key: 'startup' | 'hitAdv' | 'blockAdv' | 'damage' | 'active' | 'recovery' | 'guard' | 'cancel'
  label: string
  /** Breakpoint classes controlling when the column appears. */
  at: string
  /** Frame advantage, so the value gets tone-colored. */
  adv?: boolean
}

const COLUMNS: Column[] = [
  { key: 'startup', label: 'Start', at: '' },
  { key: 'hitAdv', label: 'Hit', at: '', adv: true },
  { key: 'blockAdv', label: 'Block', at: '', adv: true },
  { key: 'damage', label: 'Dmg', at: 'hidden sm:table-cell' },
  { key: 'active', label: 'Act', at: 'hidden md:table-cell' },
  { key: 'recovery', label: 'Rec', at: 'hidden md:table-cell' },
  { key: 'guard', label: 'Guard', at: 'hidden lg:table-cell' },
  { key: 'cancel', label: 'Cancel', at: 'hidden lg:table-cell' },
]

export function CharacterFrameData({ moves, accent }: { moves: Move[]; accent: string }) {
  const [group, setGroup] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const chips = useMemo(() => {
    const counts = new Map<MoveGroup, number>()
    for (const m of moves) counts.set(m.group, (counts.get(m.group) ?? 0) + 1)
    return [
      { id: 'all', label: 'All', count: moves.length },
      ...GROUP_ORDER.filter((g) => counts.has(g))
        .map((g) => ({ id: g, label: GROUP_LABELS[g], count: counts.get(g)! })),
    ]
  }, [moves])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return moves.filter((m) => {
      if (group !== 'all' && m.group !== group) return false
      if (!q) return true
      return m.input.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
    })
  }, [moves, group, query])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a move, 2MK or Shoryuken"
            className="w-full rounded-none border border-zinc-800 bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <span className="text-xs text-zinc-400 shrink-0">
          {visible.length} of {moves.length} moves · tap a row for images and notes
        </span>
      </div>

      <FilterChips items={chips} active={group} onSelect={setGroup} accent={accent} />

      {/* Sticky move column: border-separate keeps cell borders painted while scrolling.
          Native scrollbar hidden so it doesn't render as a stray bar under the last row. */}
      <div className="overflow-x-auto border border-zinc-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-zinc-900 border-b border-r border-zinc-800 px-2 py-2 text-left text-xs font-bold uppercase tracking-wider text-zinc-400">
                Move
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    'bg-zinc-900 border-b border-zinc-800 px-2 py-2 text-right text-xs font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap',
                    c.at,
                  )}
                >
                  {c.label}
                </th>
              ))}
              <th className="bg-zinc-900 border-b border-zinc-800 w-8" />
            </tr>
          </thead>
          <tbody>
            {visible.map((m, i) => {
              const expanded = open === m.id
              const striped = i % 2 === 1
              return (
                <Fragment key={m.id}>
                  <tr
                    onClick={() => setOpen(expanded ? null : m.id)}
                    className={cn(
                      'cursor-pointer transition-colors',
                      expanded ? 'bg-zinc-800/60' : striped ? 'bg-zinc-900/40 hover:bg-zinc-800/40' : 'hover:bg-zinc-800/40',
                    )}
                  >
                    <td
                      className={cn(
                        'sticky left-0 z-10 border-b border-r border-zinc-800 px-2 py-2 whitespace-nowrap',
                        // Opaque, or the scrolling columns show through the sticky cell.
                        expanded ? 'bg-zinc-800' : striped ? 'bg-[#131316]' : 'bg-zinc-950',
                      )}
                    >
                      <div className="font-bold text-zinc-100">{m.input}</div>
                      {m.name && <div className="text-[11px] text-zinc-500">{m.name}</div>}
                    </td>

                    {COLUMNS.map((c) => {
                      const value = m[c.key]
                      return (
                        <td
                          key={c.key}
                          className={cn(
                            'border-b border-zinc-800 px-2 py-2 text-right tabular-nums whitespace-nowrap',
                            c.adv ? cn('font-semibold', TONE_CLASS[advTone(value)]) : 'text-zinc-200',
                            c.at,
                          )}
                        >
                          {value || <span className="text-zinc-700">–</span>}
                        </td>
                      )
                    })}

                    <td className="border-b border-zinc-800 px-1 text-zinc-600">
                      <ChevronDown size={14} className={cn('transition-transform', expanded && 'rotate-180')} />
                    </td>
                  </tr>

                  {expanded && (
                    // Its own full-width row so the detail isn't trapped in the sticky column.
                    <tr className="bg-zinc-800/60">
                      <td colSpan={COLUMNS.length + 2} className="border-b border-zinc-800 p-0">
                        <div className="sticky left-0 max-w-4xl px-3 py-3">
                          <MoveDetail move={m} />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-zinc-400 py-6 text-center">No move matches that search.</p>
      )}
    </div>
  )
}

/** Move screenshot, hitbox overlays, the secondary frame data and the wiki's notes. */
function MoveDetail({ move }: { move: Move }) {
  const facts = [
    ['Total', move.total],
    ['Punish counter', move.punishAdv],
    ['Invuln', move.invuln],
    ['Armor', move.armor],
    ['Drive dmg (block)', move.driveBlk],
    ['Drive gain', move.driveGain],
  ].filter(([, v]) => v) as [string, string][]

  const shots = [
    ...(move.img ? [{ path: move.img, label: 'Move' }] : []),
    ...move.hitboxes.map((path, i) => ({
      path,
      label: move.hitboxes.length > 1 ? `Hitbox ${i + 1}` : 'Hitbox',
    })),
  ]

  return (
    <div className="space-y-3">
      {shots.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {shots.map((shot) => (
            <a
              key={shot.path}
              href={`${WIKI}${shot.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group shrink-0"
              title="Open full size on the SuperCombo wiki"
            >
              <span className="block relative h-32 w-36 sm:h-40 sm:w-48 border border-zinc-700 bg-zinc-950 group-hover:border-[color:var(--accent)] transition-colors">
                <Image
                  src={`${WIKI}${shot.path}`}
                  alt={`${move.input} ${shot.label}`}
                  fill
                  sizes="192px"
                  className="object-contain"
                />
              </span>
              <span className="mt-1 block text-[11px] uppercase tracking-wider text-zinc-500">
                {shot.label}
              </span>
            </a>
          ))}
        </div>
      )}

      {facts.length > 0 && (
        <dl className="flex flex-wrap gap-x-5 gap-y-1.5">
          {facts.map(([k, v]) => (
            <div key={k} className="flex gap-1.5 text-xs">
              <dt className="text-zinc-500">{k}</dt>
              <dd className="font-medium text-zinc-200">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {move.notes && (
        <p
          className="text-xs leading-relaxed text-zinc-300 whitespace-normal"
          dangerouslySetInnerHTML={{ __html: move.notes }}
        />
      )}
    </div>
  )
}
