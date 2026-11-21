'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  advTone, frameMeter, hitboxShots, orderMoves, TONE_CLASS,
  type FrameKind, type FrameSegment, type Move, type MoveGroup,
} from '@/lib/supercombo'
import type { FatExtra } from '@/lib/fat'
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

// The in-game frame meter colors: green startup, red active, blue recovery.
const FRAME_KINDS: { kind: FrameKind; label: string; className: string }[] = [
  { kind: 'startup', label: 'Startup', className: 'bg-emerald-500' },
  { kind: 'active', label: 'Active', className: 'bg-rose-500' },
  { kind: 'gap', label: 'Gap', className: 'bg-zinc-700' },
  { kind: 'recovery', label: 'Recovery', className: 'bg-blue-600' },
  { kind: 'landing', label: 'Landing', className: 'bg-blue-300' },
]
const FRAME_KIND = Object.fromEntries(FRAME_KINDS.map((k) => [k.kind, k])) as Record<FrameKind, (typeof FRAME_KINDS)[number]>

// FAT fields, in reading order. Pairs read "on hit / on block".
const FAT_FACTS: [keyof FatExtra, string, string?][] = [
  ['hitstun', 'Hitstun'],
  ['blockstun', 'Blockstun'],
  ['hitstop', 'Hitstop'],
  ['hitConfirm', 'Hit confirm', 'Frames to confirm into a special or super'],
  ['afterDriveRush', 'After drive rush', 'Advantage on hit / on block after a drive rush'],
  ['perfectParry', 'On perfect parry'],
  ['juggle', 'Juggle', 'Juggle start / increase / limit'],
  ['scaling', 'Scaling'],
  ['range', 'Range'],
  ['superGain', 'Super gain', 'Super meter gained on hit / on block'],
]

/** Notes longer than this start clamped, with a toggle to read the rest. */
const NOTES_CLAMP = 180

export function CharacterFrameData({ moves, extras, accent }: {
  moves: Move[]
  extras: Record<string, FatExtra>
  accent: string
}) {
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
    .map((g) => ({ group: g, moves: orderMoves(g, visible.filter((m) => m.group === g)) }))
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

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400">
        <span className="uppercase tracking-wider text-zinc-500">Frame meter</span>
        {FRAME_KINDS.map((k) => (
          <span key={k.kind} className="flex items-center gap-1">
            <span className={cn('h-3 w-2', k.className)} />
            {k.label}
          </span>
        ))}
      </div>

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
            {s.moves.map((m) => <MoveCard key={m.id} move={m} extra={extras[m.id]} />)}
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
function MoveCard({ move, extra }: { move: Move; extra?: FatExtra }) {
  // Hitbox first: seeing where the move hits is the point of the image.
  const shots = [
    ...hitboxShots(move.hitboxes),
    ...(move.img ? [{ path: move.img, label: 'Hide hitbox' }] : []),
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
  const fatFacts = FAT_FACTS
    .map(([key, label, hint]) => ({ label, hint, value: extra?.[key] }))
    .filter((f) => f.value)
  const meter = frameMeter(move)

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
            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-wrap gap-1">
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

        {meter && <FrameMeter segments={meter} />}

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

        {fatFacts.length > 0 && (
          <dl className="flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-800 pt-2">
            {fatFacts.map((f) => (
              <div key={f.label} className="flex gap-1.5 text-xs" title={f.hint}>
                <dt className="text-zinc-500">{f.label}</dt>
                <dd className="font-medium text-zinc-200">{f.value}</dd>
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

/**
 * One block per frame, like the in-game meter. Wraps on long moves instead of shrinking the blocks.
 * Each segment's frame count sits in its last blocks, one digit per block ("13" spans two), like FAT;
 * those blocks are grouped so a wrap never splits a number across two rows.
 */
function FrameMeter({ segments }: { segments: FrameSegment[] }) {
  const summary = segments.map((s) => `${FRAME_KIND[s.kind].label} ${s.frames}`).join(', ')
  return (
    <div role="img" aria-label={`Frame meter: ${summary}`} title={summary} className="flex flex-wrap gap-px">
      {segments.flatMap((s, i) => {
        const digits = String(s.frames)
        const block = (key: string, digit?: string) => (
          <span
            key={key}
            className={cn(
              'flex h-4 w-3 items-center justify-center text-[10px] font-bold leading-none tabular-nums',
              FRAME_KIND[s.kind].className,
              s.kind === 'landing' ? 'text-zinc-900' : 'text-white',
            )}
          >
            {digit}
          </span>
        )
        return [
          ...Array.from({ length: s.frames - digits.length }, (_, j) => block(`${i}-${j}`)),
          <span key={`${i}-n`} className="flex gap-px">
            {[...digits].map((d, j) => block(`${i}-d${j}`, d))}
          </span>,
        ]
      })}
    </div>
  )
}
