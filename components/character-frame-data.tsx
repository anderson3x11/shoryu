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
import { Picker } from '@/components/picker'
import { useT } from '@/lib/i18n/context'
import { fill } from '@/lib/i18n/format'

const WIKI = 'https://wiki.supercombo.gg'

const GROUP_ORDER: MoveGroup[] = ['normal', 'air', 'throw', 'special', 'super', 'drive', 'taunt']

// The in-game frame meter colors: green startup, red active, blue recovery. Labels and every
// other string here live in the dictionary (character.*), keyed by these ids.
const FRAME_KINDS: { kind: FrameKind; className: string }[] = [
  { kind: 'startup', className: 'bg-emerald-500' },
  { kind: 'active', className: 'bg-rose-500' },
  { kind: 'gap', className: 'bg-zinc-700' },
  { kind: 'recovery', className: 'bg-blue-600' },
  { kind: 'landing', className: 'bg-blue-300' },
]
const FRAME_KIND = Object.fromEntries(FRAME_KINDS.map((k) => [k.kind, k])) as Record<FrameKind, (typeof FRAME_KINDS)[number]>

// FAT fields, in reading order. Pairs read "on hit / on block" (explained in character.fatHint).
const FAT_FACTS: (keyof FatExtra)[] = [
  'hitstun', 'blockstun', 'hitstop', 'hitConfirm', 'afterDriveRush', 'perfectParry', 'juggle', 'scaling', 'range', 'superGain',
]

// First number of a frame value ("-13(-28)" -> -13, "KD +29" -> 29); null when there is none.
function frameNumber(v: string): number | null {
  const m = v.match(/[-+]?\d+/)
  return m ? Number(m[0]) : null
}

// Quick filters, combinable. "Safe" is -3 or better on block, the usual unpunishable threshold.
const QUICK_FILTERS: { id: 'plus' | 'safe' | 'invuln' | 'armor'; test: (m: Move) => boolean }[] = [
  { id: 'plus', test: (m) => (frameNumber(m.blockAdv) ?? -99) >= 1 },
  { id: 'safe', test: (m) => (frameNumber(m.blockAdv) ?? -99) >= -3 },
  { id: 'invuln', test: (m) => Boolean(m.invuln) },
  { id: 'armor', test: (m) => Boolean(m.armor) },
]

// Sorting stays within each move group; ties keep the reading order.
const SORTS: { id: 'default' | 'startup' | 'block' | 'hit'; key?: (m: Move) => number }[] = [
  { id: 'default' },
  { id: 'startup', key: (m) => frameNumber(m.startup) ?? 999 },
  { id: 'block', key: (m) => -(frameNumber(m.blockAdv) ?? -999) },
  { id: 'hit', key: (m) => -(frameNumber(m.hitAdv) ?? -999) },
]

/** Notes longer than this start clamped, with a toggle to read the rest. */
const NOTES_CLAMP = 180

export function CharacterFrameData({ moves, extras, accent }: {
  moves: Move[]
  extras: Record<string, FatExtra>
  accent: string
}) {
  const t = useT().character
  const [group, setGroup] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [quick, setQuick] = useState<string[]>([])
  const [sort, setSort] = useState<(typeof SORTS)[number]['id']>('default')

  const chips = useMemo(() => {
    const counts = new Map<MoveGroup, number>()
    for (const m of moves) counts.set(m.group, (counts.get(m.group) ?? 0) + 1)
    return [
      { id: 'all', label: t.all, count: moves.length },
      ...GROUP_ORDER.filter((g) => counts.has(g))
        .map((g) => ({ id: g, label: t.group[g], count: counts.get(g)! })),
    ]
  }, [moves, t])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const tests = QUICK_FILTERS.filter((f) => quick.includes(f.id)).map((f) => f.test)
    return moves.filter((m) => {
      if (group !== 'all' && m.group !== group) return false
      if (!tests.every((t) => t(m))) return false
      if (!q) return true
      // Notes too, so "projectile" or "anti-air" find the moves described that way.
      return [m.input, m.name, m.notes.replace(/<[^>]+>/g, '')].some((v) => v.toLowerCase().includes(q))
    })
  }, [moves, group, query, quick])

  const sortKey = SORTS.find((x) => x.id === sort)?.key
  const sections = GROUP_ORDER
    .map((g) => {
      const ordered = orderMoves(g, visible.filter((m) => m.group === g))
      return { group: g, moves: sortKey ? [...ordered].sort((a, b) => sortKey(a) - sortKey(b)) : ordered }
    })
    .filter((s) => s.moves.length > 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-none border border-zinc-800 bg-zinc-900 pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-[color:var(--accent)] focus:outline-none"
          />
        </label>
        <span className="text-xs text-zinc-400 shrink-0">
          {fill(t.status, { n: visible.length, total: moves.length })}
        </span>
      </div>

      <FilterChips items={chips} active={group} onSelect={setGroup} accent={accent} />

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {QUICK_FILTERS.map((f) => {
            const on = quick.includes(f.id)
            return (
              <button
                key={f.id}
                aria-pressed={on}
                onClick={() => setQuick(on ? quick.filter((x) => x !== f.id) : [...quick, f.id])}
                className={cn(
                  'rounded-none border px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors',
                  on
                    ? 'border-[color:var(--accent)] bg-zinc-900 text-zinc-100'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100',
                )}
              >
                {t.quick[f.id]}
              </button>
            )
          })}
        </div>
        <Picker
          className="sm:w-48"
          label={t.sortLabel}
          value={sort}
          onChange={(v) => setSort(v as typeof sort)}
          options={SORTS.map((x) => ({ value: x.id, label: t.sort[x.id] }))}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400">
        <span className="uppercase tracking-wider text-zinc-500">{t.frameMeter}</span>
        {FRAME_KINDS.map((k) => (
          <span key={k.kind} className="flex items-center gap-1">
            <span className={cn('h-3 w-2', k.className)} />
            {t.frameKind[k.kind]}
          </span>
        ))}
      </div>

      {sections.map((s) => (
        <section key={s.group} className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="block w-1.5 h-5 -skew-x-12 shrink-0" style={{ background: 'var(--accent, #fbbf24)' }} />
            <h3 className="font-bebas text-xl tracking-widest text-zinc-100 leading-none">
              {t.group[s.group]}
            </h3>
            <span className="text-xs text-zinc-500">{s.moves.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {s.moves.map((m) => <MoveCard key={m.id} move={m} extra={extras[m.id]} />)}
          </div>
        </section>
      ))}

      {visible.length === 0 && (
        <p className="text-sm text-zinc-400 py-6 text-center">{t.noMove}</p>
      )}
    </div>
  )
}

/** One move, laid out like a frame data card: hitbox image first, the core numbers big, the rest below. */
// hitboxShots labels come out in English ("Full hitbox", "Hitbox 2", "Preview 2"); swap the words.
function hitboxLabel(label: string, t: ReturnType<typeof useT>['character']): string {
  if (label === 'Full hitbox') return t.fullHitbox
  return label.replace(/^Hitbox/, t.hitbox).replace(/^Preview/, t.preview)
}

function MoveCard({ move, extra }: { move: Move; extra?: FatExtra }) {
  const t = useT().character
  // Hitbox first: seeing where the move hits is the point of the image.
  const shots = [
    ...hitboxShots(move.hitboxes).map((h) => ({ ...h, label: hitboxLabel(h.label, t) })),
    ...(move.img ? [{ path: move.img, label: t.hideHitbox }] : []),
  ]
  const [shot, setShot] = useState(0)
  const [showNotes, setShowNotes] = useState(false)
  const current = shots[shot]

  const stats: { label: string; value: string; adv?: boolean }[] = [
    { label: t.stat.startup, value: move.startup },
    { label: t.stat.active, value: move.active },
    { label: t.stat.recovery, value: move.recovery },
    { label: t.stat.onHit, value: move.hitAdv, adv: true },
    { label: t.stat.onBlock, value: move.blockAdv, adv: true },
    { label: t.stat.damage, value: move.damage },
  ]

  const facts = [
    [t.fact.guard, move.guard],
    [t.fact.cancel, move.cancel],
    [t.fact.total, move.total],
    [t.fact.punish, move.punishAdv],
    [t.fact.invuln, move.invuln],
    [t.fact.armor, move.armor],
    [t.fact.driveBlock, move.driveBlk],
    [t.fact.driveGain, move.driveGain],
  ].filter(([, v]) => v) as [string, string][]
  const fatFacts = FAT_FACTS
    .map((key) => ({ label: t.fat[key], hint: key in t.fatHint ? t.fatHint[key as keyof typeof t.fatHint] : undefined, value: extra?.[key] }))
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
            title={t.openWiki}
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
                {showNotes ? t.less : t.more}
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
 * those blocks are grouped so a wrap never splits a number across two rows. Sized like FAT: 12x24
 * blocks in 2px black borders (outlines overlapping in the 2px gaps, so a wrapped row keeps them).
 */
function FrameMeter({ segments }: { segments: FrameSegment[] }) {
  const t = useT().character
  const summary = segments.map((s) => `${t.frameKind[s.kind]} ${s.frames}`).join(', ')
  return (
    <div role="img" aria-label={`${t.frameMeter}: ${summary}`} title={summary} className="flex flex-wrap gap-0.5 p-0.5">
      {segments.flatMap((s, i) => {
        const digits = String(s.frames)
        const block = (key: string, digit?: string) => (
          <span
            key={key}
            className={cn(
              'flex h-6 w-3 items-center justify-center outline-2 outline-black',
              'text-[17px] font-semibold leading-none tabular-nums text-white',
              // A black outline (a stroke drawn under the fill, not a text shadow) keeps the digits
              // readable on every block color.
              '[-webkit-text-stroke:2px_#000] [paint-order:stroke_fill]',
              FRAME_KIND[s.kind].className,
            )}
          >
            {digit}
          </span>
        )
        return [
          ...Array.from({ length: s.frames - digits.length }, (_, j) => block(`${i}-${j}`)),
          <span key={`${i}-n`} className="flex gap-0.5">
            {[...digits].map((d, j) => block(`${i}-d${j}`, d))}
          </span>,
        ]
      })}
    </div>
  )
}
