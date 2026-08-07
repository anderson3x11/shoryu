// Read side of the SuperCombo snapshot in lib/data/supercombo/.
// Regenerate it with `npx tsx scripts/refresh-supercombo.ts`.
import type { CharacterWiki, Vitals } from '@/lib/supercombo-parse'

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
