// Regenerates lib/data/supercombo/*.json from the SuperCombo wiki.
// Frame data and character vitals come from the wiki's Cargo tables (structured);
// prose, matchups, combos and patch notes come from raw wikitext.
//   npx tsx scripts/refresh-supercombo.ts [charId ...]
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { CHARACTERS } from '../lib/constants/characters'
import {
  parseIntroduction, parseVersionPage, parseMove, parseVitals, moveImageFiles, plain,
} from '../lib/supercombo-parse'
import type { CharacterWiki, Move, PatchEntry, Vitals } from '../lib/supercombo-parse'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'lib', 'data', 'supercombo')
const API = 'https://wiki.supercombo.gg/api.php'
const UA = 'Shoryu/1.0 (https://shoryu.site; https://x.com/shoryuapp)'

// Our character ids -> the wiki's `chara` key / page name. Only the ones that differ.
const WIKI_NAME: Record<string, string> = {
  aki: 'A.K.I.', gouki: 'Akuma', cviper: 'C.Viper', chunli: 'Chun-Li', deejay: 'Dee_Jay',
  honda: 'E.Honda', vega: 'M.Bison',
}

function wikiName(id: string): string {
  return WIKI_NAME[id] ?? CHARACTERS.find((c) => c.id === id)!.name
}

async function api(params: Record<string, string>): Promise<Record<string, unknown>> {
  const qs = new URLSearchParams({ format: 'json', formatversion: '2', ...params })
  const res = await fetch(`${API}?${qs}`, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${qs.get('page') ?? qs.get('tables')}`)
  return res.json()
}

/** Wikitext of a page, or '' when the page does not exist. */
async function wikitext(page: string): Promise<string> {
  try {
    const d = await api({ action: 'parse', page, prop: 'wikitext' }) as
      { parse?: { wikitext?: string } }
    return d.parse?.wikitext ?? ''
  } catch {
    return ''
  }
}

async function cargo(table: string, fields: string, where: string): Promise<Record<string, string>[]> {
  const d = await api({ action: 'cargoquery', tables: table, fields, where, limit: '500' }) as
    { cargoquery?: { title: Record<string, string> }[] }
  return (d.cargoquery ?? []).map((r) => r.title)
}

const FRAME_FIELDS = [
  'moveId', 'moveType', 'input', 'name', 'damage', 'startup', 'active', 'recovery', 'total',
  'guard', 'cancel', 'hitAdv', 'blockAdv', 'punishAdv', 'invuln', 'armor', 'driveDmgBlk',
  'driveGain', 'notes', 'images', 'hitboxes',
].join(',')

/**
 * Wiki filenames -> their paths on the wiki, e.g. "/images/b/b1/SF6_Ryu_5hk.png".
 *
 * The path can't be guessed from the filename (it's an md5 fan-out) and the wiki's
 * thumbnails are generated per-file, so only the original is dependably there. Files the
 * wiki doesn't have are left out of the map and the move simply shows no image.
 */
async function resolveImages(files: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>()
  const unique = [...new Set(files)]

  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50)
    const d = await api({
      action: 'query',
      titles: batch.map((f) => `File:${f}`).join('|'),
      prop: 'imageinfo',
      iiprop: 'url',
    }) as { query?: { pages?: { title: string; imageinfo?: { url: string }[] }[] } }

    for (const page of d.query?.pages ?? []) {
      const url = page.imageinfo?.[0]?.url
      if (!url) continue
      // The API normalises "File:SF6_Ryu_5hk.png" to "File:SF6 Ryu 5hk.png".
      const file = page.title.replace(/^File:/, '').replace(/ /g, '_')
      out.set(file, new URL(url).pathname)
    }
  }
  return out
}

const VITAL_FIELDS = [
  'chara', 'hp', 'throwRange', 'fwdWalkSpd', 'bwdWalkSpd', 'fwdDashDist', 'bwdDashDist',
  'fwdJumpDist', 'bwdJumpDist', 'jumpSpd', 'jumpApex', 'dRushBlock',
].join(',')

interface Version {
  version: string
  date: string
  summary: string
  /** Normalised character name -> that character's changes in this patch. */
  changes: Map<string, string[]>
}

/**
 * Every released version, newest first, with its per-character changes.
 *
 * These come from the wiki's central version pages rather than each character's Resources
 * page: the per-character tabbers are only updated sporadically and trail the real patch
 * list by years. Recent patches whose pages are still empty stubs simply contribute nothing.
 */
async function fetchVersions(): Promise<Version[]> {
  const rows = await cargo('SF6_Versions', 'gameversion,date,summary', 'gameversion IS NOT NULL')
  const versions = rows
    .map((r) => ({ version: r.gameversion, date: r.date, summary: plain(r.summary) }))
    .sort((a, b) => b.date.localeCompare(a.date))

  return Promise.all(versions.map(async (v) => ({
    ...v,
    changes: parseVersionPage(await wikitext(`Street_Fighter_6/Version/${v.version}`)),
  })))
}

/** The patches that actually touched this character, newest first. */
function patchesFor(name: string, versions: Version[]): PatchEntry[] {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return versions
    .map(({ version, date, summary, changes }) => ({
      version, date, summary, notes: changes.get(key) ?? [],
    }))
    .filter((p) => p.notes.length > 0)
}

async function scrapeCharacter(
  id: string, name: string, vitals: Vitals | null, versions: Version[],
): Promise<CharacterWiki> {
  const chara = wikiName(id)

  const [rows, intro] = await Promise.all([
    cargo('SF6_FrameData', FRAME_FIELDS, `chara="${chara}"`),
    wikitext(`Street_Fighter_6/${chara}/Introduction`),
  ])

  const images = await resolveImages(rows.flatMap(moveImageFiles))
  const moves = rows
    .map((row) => parseMove(row, (f) => images.get(f)))
    .filter((m): m is Move => m !== null)

  return {
    chara,
    ...parseIntroduction(intro),
    vitals,
    moves,
    patches: patchesFor(name, versions),
  }
}

async function main() {
  const only = process.argv.slice(2)
  const targets = CHARACTERS.filter((c) => !c.hidden && !c.comingSoon)
    .filter((c) => only.length === 0 || only.includes(c.id))

  mkdirSync(OUT_DIR, { recursive: true })

  const [vitalRows, versions] = await Promise.all([
    cargo('SF6_CharacterData', VITAL_FIELDS, 'chara IS NOT NULL'),
    fetchVersions(),
  ])
  const vitalsByChara = new Map(vitalRows.map((r) => [r.chara, parseVitals(r)]))
  console.log(`${versions.length} versions, latest ${versions[0]?.version} (${versions[0]?.date})
`)

  for (const char of targets) {
    const vitals = vitalsByChara.get(wikiName(char.id)) ?? null
    const data = await scrapeCharacter(char.id, char.name, vitals, versions)
    writeFileSync(join(OUT_DIR, `${char.id}.json`), JSON.stringify(data), 'utf8')
    console.log(
      `${char.id.padEnd(9)} moves ${String(data.moves.length).padStart(3)}` +
      `  imgs ${String(data.moves.filter((m) => m.img).length).padStart(3)}` +
      `/${String(data.moves.filter((m) => m.hitboxes.length).length).padStart(3)}hb` +
      `  patches ${String(data.patches.length).padStart(2)}` +
      ` (latest ${data.patches[0]?.version ?? '-'})` +
      `  overview ${data.overview.length}/${data.pick.length}/${data.avoid.length}` +
      `${vitals ? '' : '  [NO VITALS]'}`
    )
  }

  console.log(`\nwrote ${targets.length} characters to ${OUT_DIR}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
