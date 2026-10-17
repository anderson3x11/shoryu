'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
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

// The data comes sorted by input string (2HK before 5LP). Normals and air moves read better in
// the usual frame data order: standing, crouching, then command normals, light to heavy.
const STANCE = ['5', '2', '6', '4', '3', '1', 'j.']
const BUTTON = ['LP', 'MP', 'HP', 'LK', 'MK', 'HK']

function normalRank(input: string): number {
  const stance = STANCE.findIndex((s) => input.startsWith(s))
  const button = BUTTON.findIndex((b) => input.slice(stance < 0 ? 0 : STANCE[stance].length).startsWith(b))
  return (stance < 0 ? STANCE.length : stance) * 100 + (button < 0 ? BUTTON.length : button) * 10
    + (input.includes('~') ? 1 : 0)
}

function sortMoves(group: MoveGroup, moves: Move[]): Move[] {
  if (group !== 'normal' && group !== 'air') return moves
  return [...moves].sort((a, b) => normalRank(a.input) - normalRank(b.input))
}

/** Notes longer than this start clamped, with a toggle to read the rest. */
const NOTES_CLAMP = 180

export function CharacterFrameData({ moves, accent }: { moves: Move[]; accent: string }) {
  const [group, setGroup] = useState<string>('all')
  const [query, setQuery] = useState('')

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

  const sections = GROUP_ORDER
    .map((g) => ({ group: g, moves: sortMoves(g, visible.filter((m) => m.group === g)) }))
    .filter((s) => s.moves.length > 0)

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
          {visible.length} of {moves.length} moves · tap an image for full size
        </span>
      </div>

      <FilterChips items={chips} active={group} onSelect={setGroup} accent={accent} />

      {sections.map((s) => (
        <section key={s.group} className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="block w-1.5 h-5 -skew-x-12 shrink-0" style={{ background: 'var(--accent, #fbbf24)' }} />
            <h3 className="font-bebas text-xl tracking-widest text-zinc-100 leading-none">
              {GROUP_LABELS[s.group]}
            </h3>
            <span className="text-xs text-zinc-500">{s.moves.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {s.moves.map((m) => <MoveCard key={m.id} move={m} />)}
          </div>
        </section>
      ))}

      {visible.length === 0 && (
        <p className="text-sm text-zinc-400 py-6 text-center">No move matches that search.</p>
      )}
    </div>
  )
}

/** One move, laid out like a frame data card: hitbox image first, the core numbers big, the rest below. */
function MoveCard({ move }: { move: Move }) {
  // Hitbox first: seeing where the move hits is the point of the image.
  const shots = [
    ...move.hitboxes.map((path, i) => ({
      path,
      label: move.hitboxes.length > 1 ? `Hitbox ${i + 1}` : 'Hitbox',
    })),
    ...(move.img ? [{ path: move.img, label: 'Move' }] : []),
  ]
  const [shot, setShot] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const current = shots[shot]

  const stats: { label: string; value: string; adv?: boolean }[] = [
    { label: 'Startup', value: move.startup },
    { label: 'Active', value: move.active },
    { label: 'Recovery', value: move.recovery },
    { label: 'On hit', value: move.hitAdv, adv: true },
    { label: 'On block', value: move.blockAdv, adv: true },
    { label: 'Damage', value: move.damage },
  ]

  const facts = [
    ['Guard', move.guard],
    ['Cancel', move.cancel],
    ['Total', move.total],
    ['Punish counter', move.punishAdv],
    ['Invuln', move.invuln],
    ['Armor', move.armor],
    ['Drive dmg (block)', move.driveBlk],
    ['Drive gain', move.driveGain],
  ].filter(([, v]) => v) as [string, string][]

  const longNotes = move.notes.length > NOTES_CLAMP

  return (
    <article className="flex flex-col border border-zinc-800 bg-zinc-900/60">
      {current && (
        <div className="relative aspect-[4/3] border-b border-zinc-800 bg-zinc-950">
          <a
            href={`${WIKI}${current.path}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open full size on the SuperCombo wiki"
            className="absolute inset-0"
          >
            <Image
              src={`${WIKI}${current.path}`}
              alt={`${move.input} ${current.label}`}
              fill
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
              className="object-contain"
            />
          </a>
          {shots.length > 1 && (
            <div className="absolute bottom-1.5 left-1.5 flex gap-1">
              {shots.map((s, i) => (
                <button
                  key={s.path}
                  onClick={() => setShot(i)}
                  className={cn(
                    'rounded-none border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors',
                    i === shot
                      ? 'border-[color:var(--accent)] bg-zinc-950 text-zinc-100'
                      : 'border-zinc-700 bg-zinc-950/80 text-zinc-400 hover:text-zinc-100',
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-3">
        <header>
          <div className="text-base font-bold text-zinc-100 leading-tight">{move.input}</div>
          {move.name && <div className="text-xs text-zinc-500">{move.name}</div>}
        </header>

        <dl className="grid grid-cols-3 gap-px border border-zinc-800 bg-zinc-800">
          {stats.map((s) => (
            <div key={s.label} className="bg-zinc-950 px-2 py-1.5">
              <dt className="text-[10px] uppercase tracking-wider text-zinc-500">{s.label}</dt>
              <dd
                className={cn(
                  'text-sm font-semibold tabular-nums',
                  s.adv ? TONE_CLASS[advTone(s.value)] : 'text-zinc-100',
                )}
              >
                {s.value || <span className="text-zinc-700">–</span>}
              </dd>
            </div>
          ))}
        </dl>

        {facts.length > 0 && (
          <dl className="flex flex-wrap gap-x-4 gap-y-1">
            {facts.map(([k, v]) => (
              <div key={k} className="flex gap-1.5 text-xs">
                <dt className="text-zinc-500">{k}</dt>
                <dd className="font-medium text-zinc-200">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {move.notes && (
          <div className="mt-auto border-t border-zinc-800 pt-2">
            <p
              className={cn('text-xs leading-relaxed text-zinc-300', longNotes && !showNotes && 'line-clamp-3')}
              dangerouslySetInnerHTML={{ __html: move.notes }}
            />
            {longNotes && (
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-100 cursor-pointer"
              >
                {showNotes ? 'Less' : 'More'}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
