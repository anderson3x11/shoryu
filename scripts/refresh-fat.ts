// Regenerates lib/data/fat/*.json: the frame data fields SuperCombo doesn't have (hitstun,
// juggle, hit confirm window...) from FAT, matched onto our SuperCombo moves. Run it after
// refresh-supercombo.ts, since the output is keyed by SuperCombo move id.
//   npx tsx scripts/refresh-fat.ts
// FAT (https://github.com/D4RKONION/FAT) is GPL-3.0; its data must stay credited and linked.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import type { Move } from '../lib/supercombo-parse'
import type { FatExtra } from '../lib/fat'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SC_DIR = join(ROOT, 'lib', 'data', 'supercombo')
const OUT_DIR = join(ROOT, 'lib', 'data', 'fat')
const SOURCE = 'https://raw.githubusercontent.com/D4RKONION/FAT/HEAD/src/js/constants/framedata/SF6FrameData.json'

type FatMove = Record<string, unknown> & { numCmd?: string; moveName?: string }

// Our character ids -> FAT's character keys, when lowercasing and dropping punctuation isn't enough.
const FAT_NAME: Record<string, string> = { gouki: 'Akuma', honda: 'E.Honda', vega: 'M.Bison' }

// One spelling for both sources. FAT writes "8LP", "5LP > 5LP", "46LP", "214K (air)",
// "236HK (hold)" and "236P (charged)" where SuperCombo writes "j.LP", "5LP~LP", "[4]6LP", "j.214K",
// "236[HK]" and "D.236P". Other bracketed notes ("(burst)", "(CA)") are left to the name tie-break.
function inputKey(input: string): string {
  const up = input.toUpperCase()
  const air = /\(AIR\)/.test(up)
  const hold = /\(HOLD\)/.test(up) || /\[[LMH]?[PK]{1,2}\]/.test(up)
  const charged = /\(CHARGED\)/.test(up) || up.startsWith('D.')
  let k = up.replace(/\(.*?\)/g, '').replace(/\s+/g, '').replace(/>/g, '~')
    .replace(/^D\./, '')
    .replace(/\[(\d)\]/g, '$1')
    .replace(/\[([LMH]?[PK]{1,2})\]/g, '$1')
    .replace(/^[789]~?(?=\d?[LMH]?[PK])/, 'J.')
    .replace(/~5(?=[LMH]?[PK])/g, '~')
  if (air && !k.startsWith('J.')) k = 'J.' + k
  return k + (hold ? '#hold' : '') + (charged ? '#charged' : '')
}

const words = (s: string) => new Set(s.toLowerCase().match(/[a-z0-9]+/g) ?? [])
function nameScore(a: string, b: string): number {
  const wb = words(b)
  return [...words(a)].filter((w) => wb.has(w)).length
}

// FAT writes "?" for unknown values and "20*13" for one value per hit (shown as "20,13", like
// SuperCombo's "2,8"). The super meter "gain" of a super is its (negative) cost, so it's dropped.
const str = (v: unknown) =>
  v === undefined || v === null || v === '' || v === '?' ? undefined : String(v).replace(/\*/g, ',')

function extra(m: FatMove): FatExtra {
  const juggle = [m.jugStart, m.jugIncr, m.jugLimit].map(str)
  const out: FatExtra = {
    hitstun: str(m.hitstun),
    blockstun: str(m.blockstun),
    hitstop: str(m.hitstop),
    range: str(m.range),
    hitConfirm: str(m.hcWinSpCa),
    scaling: str(m.dmgScaling),
    juggle: juggle.some(Boolean) ? juggle.map((j) => j ?? '-').join(' / ') : undefined,
    afterDriveRush: m.DRoH !== undefined ? `${str(m.DRoH) ?? '-'} / ${str(m.DRoB) ?? '-'}` : undefined,
    perfectParry: str(m.onPP),
    superGain: Number(m.SelfSoH) > 0 ? `${str(m.SelfSoH) ?? '-'} / ${str(m.SelfSoB) ?? '-'}` : undefined,
  }
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined)) as FatExtra
}

async function main() {
  const res = await fetch(SOURCE)
  if (!res.ok) throw new Error(`${res.status} fetching FAT data`)
  const fat = await res.json() as Record<string, { moves: Record<string, Record<string, FatMove>> }>
  const fatKey = (n: string) => n.toLowerCase().replace(/[^a-z]/g, '')

  mkdirSync(OUT_DIR, { recursive: true })
  let total = 0, matched = 0
  const skipped: string[] = []
  for (const file of readdirSync(SC_DIR)) {
    const id = file.replace(/\.json$/, '')
    const name = FAT_NAME[id] ?? Object.keys(fat).find((n) => fatKey(n) === id)
    if (!name || !fat[name]) { console.warn(`no FAT character for ${id}`); continue }

    const byKey = new Map<string, FatMove[]>()
    for (const m of Object.values(fat[name].moves).flatMap((g) => Object.values(g))) {
      if (!m.numCmd) continue
      const k = inputKey(m.numCmd)
      byKey.set(k, [...(byKey.get(k) ?? []), m])
    }

    const out: Record<string, FatExtra> = {}
    const moves = (JSON.parse(readFileSync(join(SC_DIR, file), 'utf8')) as { moves: Move[] }).moves
    for (const move of moves) {
      if (!move.startup) continue
      total++
      const candidates = byKey.get(inputKey(move.input))
      if (!candidates) continue
      // Several FAT moves on one input (a plain and a "burst" version): keep the closest name.
      const best = [...candidates].sort((a, b) =>
        nameScore(move.name, String(b.moveName ?? '')) - nameScore(move.name, String(a.moveName ?? '')))[0]
      // A wrong pairing shows up as a different startup; skip those rather than show wrong data.
      // 1-2 frames apart is the two sources counting a follow-up differently or one being a patch behind.
      const first = (v: unknown) => String(v ?? '').match(/\d+/)?.[0]
      const [ours, theirs] = [first(move.startup), first(best.startup)]
      if (ours && theirs && Math.abs(Number(ours) - Number(theirs)) > 2) { skipped.push(`${id} ${move.input} ${ours}/${theirs}`); continue }
      const e = extra(best)
      if (Object.keys(e).length) { out[move.id] = e; matched++ }
    }
    writeFileSync(join(OUT_DIR, `${id}.json`), JSON.stringify(out, null, 1) + '\n')
  }
  console.log(`FAT data matched on ${matched} of ${total} moves, ${skipped.length} skipped on a startup mismatch`)
  if (process.env.VERBOSE) console.log(skipped.join('\n'))
}

main().catch((e) => { console.error(e); process.exit(1) })
