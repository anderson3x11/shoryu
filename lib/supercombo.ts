// Read side of the SuperCombo snapshot in lib/data/supercombo/.
// Regenerate it with `npx tsx scripts/refresh-supercombo.ts`.
import type { CharacterWiki, Move, MoveGroup, Vitals } from '@/lib/supercombo-parse'

export type { CharacterWiki, Move, MoveGroup, Vitals, Reason, PatchEntry } from '@/lib/supercombo-parse'

/** Snapshot for one character id, or null when the wiki has no page for them. */
export async function getCharacterWiki(id: string): Promise<CharacterWiki | null> {
  try {
    const mod = await import(`@/lib/data/supercombo/${id}.json`)
    return (mod.default ?? mod) as CharacterWiki
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Frame advantage
// ---------------------------------------------------------------------------

export type Tone = 'vp' | 'p' | 'e' | 'm' | 'vm' | 'kd' | 'none'

/**
 * Classify a frame-advantage cell the way the wiki does: very plus (+4 or better),
 * plus, even, minus, very minus (-4 or worse, i.e. punishable). Knockdowns are their
 * own thing — the number is knockdown duration, not advantage.
 */
export function advTone(value: string): Tone {
  if (!value) return 'none'
  if (/KD/i.test(value)) return 'kd'
  const m = value.match(/-?\d+/)
  if (!m) return 'none'
  const n = Number(m[0])
  if (n >= 4) return 'vp'
  if (n >= 1) return 'p'
  if (n === 0) return 'e'
  if (n >= -3) return 'm'
  return 'vm'
}

export const TONE_CLASS: Record<Tone, string> = {
  vp: 'text-emerald-300',
  p: 'text-emerald-400/80',
  e: 'text-zinc-300',
  m: 'text-orange-300',
  vm: 'text-red-400',
  kd: 'text-amber-300',
  none: 'text-zinc-500',
}

// ---------------------------------------------------------------------------
// Vitals
// ---------------------------------------------------------------------------

export interface VitalRow {
  key: string
  label: string
  value: string
  hint: string
}

type VitalKey = keyof Omit<Vitals, 'jumpSpd'>

const VITAL_SPECS: { key: VitalKey; label: string; digits: number; hint: string }[] = [
  { key: 'fwdWalkSpd', label: 'Fwd Walk', digits: 3, hint: 'Distance covered per frame walking forward' },
  { key: 'bwdWalkSpd', label: 'Back Walk', digits: 3, hint: 'Distance covered per frame walking back' },
  { key: 'fwdDashDist', label: 'Fwd Dash', digits: 2, hint: 'Distance covered by a forward dash' },
  { key: 'bwdDashDist', label: 'Back Dash', digits: 2, hint: 'Distance covered by a back dash' },
  { key: 'fwdJumpDist', label: 'Fwd Jump', digits: 2, hint: 'Distance covered by a forward jump' },
  { key: 'bwdJumpDist', label: 'Back Jump', digits: 2, hint: 'Distance covered by a back jump' },
  { key: 'jumpApex', label: 'Jump Height', digits: 2, hint: 'Peak height of a neutral jump' },
  { key: 'throwRange', label: 'Throw Range', digits: 2, hint: 'Reach of a normal throw' },
  { key: 'dRushBlock', label: 'Drive Rush', digits: 2, hint: 'Distance a Drive Rush covers before it is blocked' },
]

/** Movement vitals, formatted for display. HP is shown separately. */
export function vitalRows(vitals: Vitals): VitalRow[] {
  return VITAL_SPECS.map(({ key, label, digits, hint }) => ({
    key,
    label,
    value: vitals[key].toFixed(digits),
    hint,
  }))
}

// ---------------------------------------------------------------------------
// Move order
// ---------------------------------------------------------------------------

// The snapshot is sorted by input string (2HK before 5LP, 214 before 236). These put each group in
// the usual frame data order, from the input alone, so a new character needs nothing extra.
const STANCE = ['5', '2', '6', '4', '3', '1']
const BUTTON = ['LP', 'MP', 'HP', 'LK', 'MK', 'HK']
const MOTION = ['236', '623', '214', '41236', '63214', '22', '[4]6', '[2]8', '360', '720']
const PREFIX = ['', 'D.', 'W.', 'pf.', 'j.']

function buttonRank(s: string): number {
  const i = BUTTON.findIndex((b) => s.startsWith(b))
  return i < 0 ? BUTTON.length : i
}

// Standing, crouching, then command normals, light to heavy; target combos (5MP~LK) after them all.
function normalRank(input: string): number {
  const body = input.startsWith('j.') ? input.slice(2) : input
  const stance = STANCE.findIndex((s) => body.startsWith(s))
  return (body.includes('~') ? 10000 : 0)
    + (stance < 0 ? STANCE.length : stance) * 100
    + buttonRank(stance < 0 ? body : body.slice(1)) * 10
}

// One special with all its versions, then the next: 236P (L, M, H, OD, holds, follow-ups), 236K,
// 623P... Denjin (D.), Windclad (W.) and air (j.) versions come right after the grounded one.
function specialKey(input: string): (number | string)[] {
  const prefix = input.match(/^(?:[A-Za-z]+\.)*/)![0]
  const root = input.slice(prefix.length).split('~')[0]
  const motion = root.match(/^(?:\[\d\])?\d*/)![0]
  const btn = root.slice(motion.length).match(/([LMH])?([PK])([PK])?/)
  const motionRank = MOTION.indexOf(motion)
  const strength = !btn ? 1.5 : btn[3] ? 3 : btn[1] ? 'LMH'.indexOf(btn[1]) : 1.5
  const held = /[[{]/.test(root.slice(motion.length)) ? 5 : 0
  return [
    motionRank < 0 ? MOTION.length : motionRank,
    motion,
    !btn ? 2 : btn[2] === 'P' ? 0 : 1,
    PREFIX.includes(prefix) ? PREFIX.indexOf(prefix) : PREFIX.length,
    (input.includes('~') ? 10 : 0) + strength + held,
  ]
}

function compareKeys(a: (number | string)[], b: (number | string)[]): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1
  }
  return 0
}

/** Moves of one group in frame data reading order (sort is stable, so ties keep the wiki order). */
export function orderMoves(group: MoveGroup, moves: Move[]): Move[] {
  if (group === 'normal' || group === 'air') {
    return [...moves].sort((a, b) => normalRank(a.input) - normalRank(b.input))
  }
  if (group === 'special') {
    return [...moves].sort((a, b) => compareKeys(specialKey(a.input), specialKey(b.input)))
  }
  return moves
}

// ---------------------------------------------------------------------------
// Hitbox images
// ---------------------------------------------------------------------------

/**
 * Labels for a move's hitbox images, read from the wiki file names: "_preview" is the whole move
 * (shown first as "Full hitbox"), "_hitbox_2" or "kk2_hitbox" is hit 2, "_preview_2_3" covers hits
 * 2 and 3, "_hitbox_2_preview" is the overview of hit 2. The first image is not always the full
 * move, so position alone can't be trusted.
 */
export function hitboxShots(paths: string[]): { path: string; label: string }[] {
  const unique = [...new Set(paths)]
  if (unique.length <= 1) return unique.map((path) => ({ path, label: 'Hitbox' }))

  const parsed = unique.map((path) => {
    const file = decodeURIComponent(path.split('/').pop()!).toLowerCase().replace(/\.\w+$/, '')
    const at = file.indexOf('hitbox')
    if (at < 0) return { path, full: false, preview: false, hits: null as number[] | null }
    const hits = (file.slice(at).match(/\d+/g) ?? []).map(Number)
    // A number stuck to the button (214kk2_hitbox) is the hit; dl4_ (a delay) is not.
    const suffix = file.slice(0, at).match(/[pk](\d+)_$/)
    const preview = file.includes('preview')
    if (!hits.length && suffix && !preview) hits.push(Number(suffix[1]))
    return { path, full: preview && !hits.length, preview, hits }
  })
  const numbered = parsed.some((p) => p.hits?.length)
  const labelled = parsed.map((p) => ({
    path: p.path,
    full: p.full,
    label: p.full ? 'Full hitbox'
      : !p.hits ? ''
      : p.hits.length > 1 ? `Hitbox ${p.hits[0]}-${p.hits[p.hits.length - 1]}`
      : p.preview ? `Preview ${p.hits[0]}`
      : `Hitbox ${p.hits[0] ?? (numbered ? 1 : '')}`.trim(),
  }))

  // Names the pattern can't place, or two images landing on one label: fall back to plain numbering.
  const labels = labelled.map((s) => s.label)
  if (labels.includes('') || new Set(labels).size !== labels.length) {
    return unique.map((path, i) => ({ path, label: `Hitbox ${i + 1}` }))
  }
  return [...labelled.filter((s) => s.full), ...labelled.filter((s) => !s.full)]
    .map(({ path, label }) => ({ path, label }))
}
