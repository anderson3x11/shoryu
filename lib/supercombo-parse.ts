// Pure wikitext -> snapshot parsers for the SuperCombo SF6 wiki.
// Kept free of IO so it can run under `npx tsx` (scripts/refresh-supercombo.ts)
// and be reasoned about on its own. Nothing here touches the network.

export interface Reason {
  title: string
  text: string
}

export interface Move {
  id: string
  group: MoveGroup
  input: string
  name: string
  damage: string
  startup: string
  active: string
  recovery: string
  total: string
  guard: string
  cancel: string
  hitAdv: string
  blockAdv: string
  punishAdv: string
  invuln: string
  armor: string
  driveBlk: string
  driveGain: string
  notes: string
  /** Wiki path of the move screenshot ("/images/b/b1/…"), empty when there is none. */
  img: string
  /** Wiki paths of the hitbox overlays; a move can have one per active hitbox. */
  hitboxes: string[]
}

export type MoveGroup = 'normal' | 'air' | 'throw' | 'special' | 'super' | 'drive' | 'taunt'

export interface Vitals {
  hp: number
  throwRange: number
  fwdWalkSpd: number
  bwdWalkSpd: number
  fwdDashDist: number
  bwdDashDist: number
  fwdJumpDist: number
  bwdJumpDist: number
  jumpSpd: string
  jumpApex: number
  dRushBlock: number
}

export interface PatchEntry {
  version: string
  /** ISO date of the patch, from the wiki's version table. */
  date: string
  /** The wiki's one-line description of the whole patch. */
  summary: string
  notes: string[]
}

export interface CharacterWiki {
  chara: string
  overview: string[]
  pick: Reason[]
  avoid: Reason[]
  vitals: Vitals | null
  moves: Move[]
  patches: PatchEntry[]
}

// ---------------------------------------------------------------------------
// Inline markup
// ---------------------------------------------------------------------------

// {{clr|X|text}} button-color codes, mirroring Template:Clr's SF6 switch.
const CLR: Record<string, string> = {
  L: 'l', LP: 'l', LK: 'l', '7': 'l',
  M: 'm', MP: 'm', MK: 'm', '8': 'm',
  H: 'h', HP: 'h', HK: 'h', '9': 'h',
  PP: 'dr', KK: 'dr', DR: 'dr', DI: 'dr', EX: 'dr', '4': 'dr',
  OD: 'od', '10': 'od',
  SA: 'sa', '11': 'sa',
  PC: 'pc', '12': 'pc',
}

// Sentinels survive HTML-escaping, so markup is staged as control characters and
// only becomes real tags at the very end. Wiki-supplied text can never inject a tag.
const OPEN = '\x01'
const SEP = '\x02'
const CLOSE = '\x03'

function tag(cls: string, inner: string): string {
  return `${OPEN}${cls}${SEP}${inner}${CLOSE}`
}

/** Find the template starting at `from` (which must point at "{{") and return its raw body. */
function readTemplate(src: string, from: number): { raw: string; end: number } | null {
  if (src.slice(from, from + 2) !== '{{') return null
  let depth = 0
  for (let i = from; i < src.length; i++) {
    if (src.startsWith('{{', i)) { depth++; i++ }
    else if (src.startsWith('}}', i)) {
      depth--
      i++
      if (depth === 0) return { raw: src.slice(from, i + 1), end: i + 1 }
    }
  }
  return null
}

/** Split a template body on top-level pipes (ignoring nested templates / links / tables). */
function splitParams(body: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < body.length; i++) {
    if (body.startsWith('{{', i) || body.startsWith('[[', i) || body.startsWith('{|', i)) { depth++; i++ }
    else if (body.startsWith('}}', i) || body.startsWith(']]', i) || body.startsWith('|}', i)) { depth--; i++ }
    else if (body[i] === '|' && depth === 0) { parts.push(body.slice(start, i)); start = i + 1 }
  }
  parts.push(body.slice(start))
  return parts
}

/** Named params of a template body, keyed lowercase. Positional params get "1", "2", ... */
export function templateParams(raw: string): Record<string, string> {
  const body = raw.replace(/^\{\{/, '').replace(/\}\}$/, '')
  const parts = splitParams(body)
  parts.shift() // template name
  const out: Record<string, string> = {}
  let positional = 0
  for (const part of parts) {
    const eq = part.indexOf('=')
    // An "=" inside a nested construct isn't a param assignment.
    if (eq > 0 && !/[{[]/.test(part.slice(0, eq))) {
      out[part.slice(0, eq).trim().toLowerCase()] = part.slice(eq + 1).trim()
    } else {
      out[String(++positional)] = part.trim()
    }
  }
  return out
}

/** Resolve the inline templates we care about; drop the rest. */
function resolveTemplates(src: string): string {
  let out = ''
  let i = 0
  while (i < src.length) {
    if (src.startsWith('{{{', i)) {
      // Unfilled template placeholder like {{{invuln}}} — the wiki renders nothing.
      const end = src.indexOf('}}}', i)
      i = end === -1 ? src.length : end + 3
      continue
    }
    if (src.startsWith('{{', i)) {
      const t = readTemplate(src, i)
      // Unterminated: the source was sliced mid-template. Drop the braces, keep the text.
      if (!t) { i += 2; continue }
      const p = templateParams(t.raw)
      const name = t.raw.replace(/^\{\{\s*/, '').split(/[|}]/)[0].trim().toLowerCase()
      if (name === 'clr') {
        const cls = CLR[(p['1'] ?? '').toUpperCase()]
        const inner = resolveTemplates(p['2'] ?? '')
        out += cls ? tag(cls, inner) : inner
      } else if (name === 'sf6-adv') {
        out += resolveTemplates(p['2'] ?? '')
      } else if (name === 'drive sf6' || name === 'drive') {
        out += '◈'
      } else if (name === 'clrv' || name === 'nowrap') {
        out += resolveTemplates(p['1'] ?? '')
      }
      // Everything else (Ambox, Documentation, ComboKey-SF6, ...) is chrome — dropped.
      i = t.end
      continue
    }
    out += src[i++]
  }
  return out
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Wikitext -> a tiny, self-generated HTML subset (`<b>`, `<i>`, `<span class="sc-*">`).
 * Wiki text is escaped before any tag is emitted, so the result is safe to inject.
 */
export function rich(src: string): string {
  let s = src
  s = s.replace(/<!--[\s\S]*?-->/g, '')
  // Keep the inner text of colored spans; their meaning is re-derived at render time.
  s = s.replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '')
  s = s.replace(/<br\s*\/?>/gi, ' ')
  s = s.replace(/<\/?(?:big|small|font|code|nowiki|b|i|u|em|strong|sup|sub|div|p|ref)[^>]*>/gi, '')
  s = resolveTemplates(s)
  // [[Page|label]] / [[Page]] -> label; [url label] -> label
  s = s.replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, '$2')
  s = s.replace(/\[\[([^\]]*)\]\]/g, '$1')
  s = s.replace(/\[(?:https?|\/\/)[^\s\]]+\s+([^\]]*)\]/g, '$1')
  s = s.replace(/\[(?:https?|\/\/)[^\s\]]+\]/g, '')
  s = escapeHtml(s)
  s = s.replace(/'''([\s\S]+?)'''/g, `${OPEN}b${SEP}$1${CLOSE}`)
  s = s.replace(/''([\s\S]+?)''/g, `${OPEN}i${SEP}$1${CLOSE}`)
  s = s.replace(/''+/g, '')  // unpaired quote markup left over from the wiki
  s = s.replace(/\s+/g, ' ').trim()
  return emitTags(s)
}

/**
 * Sentinels -> real tags. A stack pairs each closer with its opener, and anything left
 * open at the end is closed there — the wiki is loose about pairing, the output can't be.
 */
function emitTags(s: string): string {
  const stack: string[] = []
  let out = ''
  for (let i = 0; i < s.length; i++) {
    if (s[i] === OPEN) {
      const sep = s.indexOf(SEP, i)
      if (sep === -1) break
      const cls = s.slice(i + 1, sep)
      stack.push(cls)
      out += cls === 'b' ? '<b>' : cls === 'i' ? '<i>' : `<span class="sc-${cls}">`
      i = sep
    } else if (s[i] === CLOSE) {
      const cls = stack.pop()
      if (cls) out += cls === 'b' ? '</b>' : cls === 'i' ? '</i>' : '</span>'
    } else {
      out += s[i]
    }
  }
  while (stack.length) {
    const cls = stack.pop()!
    out += cls === 'b' ? '</b>' : cls === 'i' ? '</i>' : '</span>'
  }
  return out
}

/** Wikitext -> plain text. Used for table cells and anything sorted/compared. */
export function plain(src: string): string {
  const html = rich(src)
  return html.replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .trim()
}

/** A frame-data cell: empty when the wiki has no value for it. */
function cell(src: string | undefined): string {
  const v = plain(src ?? '')
  return v === '-' || v === '—' ? '' : v
}

// ---------------------------------------------------------------------------
// Frame data (from the Cargo tables, already JSON — just needs cleaning)
// ---------------------------------------------------------------------------

const MOVE_GROUP: Record<string, MoveGroup> = {
  ground_normal: 'normal',
  normal: 'normal',
  air_normal: 'air',
  air_normal8: 'air',
  throw: 'throw',
  special: 'special',
  serenity_stream: 'special',
  super: 'super',
  drive: 'drive',
  taunt: 'taunt',
}

/** The wiki lists images as a comma-separated filename list. */
export function moveImageFiles(row: Record<string, string>): string[] {
  return [row.images, row.hitboxes]
    .flatMap((v) => (v ?? '').split(','))
    .map((f) => f.trim())
    .filter((f) => f && !f.startsWith('{{{'))
}

/**
 * `resolveImage` maps a wiki filename to its path on the wiki ("/images/b/b1/x.png").
 * The script resolves those in batches up front; anything it can't find is skipped.
 */
export function parseMove(
  row: Record<string, string>,
  resolveImage: (file: string) => string | undefined = () => undefined,
): Move | null {
  const input = cell(row.input)
  if (!input) return null
  const paths = (field: string | undefined) =>
    (field ?? '').split(',').map((f) => f.trim())
      .map(resolveImage).filter((p): p is string => !!p)
  // A handful of moves list the same overlay several times; four is plenty to show.
  const hitboxes = [...new Set(paths(row.hitboxes))].slice(0, 4)
  return {
    id: row.moveId ?? input,
    group: MOVE_GROUP[(row.moveType ?? '').toLowerCase()] ?? 'special',
    input,
    name: cell(row.name),
    damage: cell(row.damage),
    startup: cell(row.startup),
    active: cell(row.active),
    recovery: cell(row.recovery),
    total: cell(row.total),
    guard: cell(row.guard),
    cancel: cell(row.cancel),
    hitAdv: cell(row.hitAdv),
    blockAdv: cell(row.blockAdv),
    punishAdv: cell(row.punishAdv),
    invuln: cell(row.invuln),
    armor: cell(row.armor),
    driveBlk: cell(row.driveDmgBlk),
    driveGain: cell(row.driveGain),
    notes: rich(row.notes ?? ''),
    img: paths(row.images)[0] ?? '',
    hitboxes,
  }
}

export function parseVitals(row: Record<string, string>): Vitals {
  const n = (v: string | undefined) => Number(String(v ?? '').replace(/[^\d.-]/g, '')) || 0
  return {
    hp: n(row.hp),
    throwRange: n(row.throwRange),
    fwdWalkSpd: n(row.fwdWalkSpd),
    bwdWalkSpd: n(row.bwdWalkSpd),
    fwdDashDist: n(row.fwdDashDist),
    bwdDashDist: n(row.bwdDashDist),
    fwdJumpDist: n(row.fwdJumpDist),
    bwdJumpDist: n(row.bwdJumpDist),
    jumpSpd: plain(row.jumpSpd ?? ''),
    jumpApex: n(row.jumpApex),
    dRushBlock: n(row.dRushBlock),
  }
}

// ---------------------------------------------------------------------------
// Introduction page: overview prose, reasons to pick / avoid
// ---------------------------------------------------------------------------

/** Bullet lines of a ReasonsToPick column: `* '''Title:''' body`. */
function parseReasons(src: string): Reason[] {
  const out: Reason[] = []
  for (const line of src.split('\n')) {
    const m = line.match(/^\*\s*(.+)$/)
    if (!m) continue
    const bold = m[1].match(/^'''(.+?):?'''\s*:?\s*([\s\S]*)$/)
    if (bold) out.push({ title: plain(bold[1]).replace(/:$/, ''), text: rich(bold[2]) })
    else out.push({ title: '', text: rich(m[1]) })
  }
  return out.filter((r) => r.title || r.text)
}

export function parseIntroduction(wikitext: string): Pick<CharacterWiki, 'overview' | 'pick' | 'avoid'> {
  let pick: Reason[] = []
  let avoid: Reason[] = []

  const at = wikitext.search(/\{\{\s*ReasonsToPick/i)
  if (at !== -1) {
    const t = readTemplate(wikitext, at)
    if (t) {
      const p = templateParams(t.raw)
      pick = parseReasons(p.pick ?? '')
      avoid = parseReasons(p.avoid ?? '')
    }
  }

  // Prose = everything under "== Introduction ==" up to the first template block or subheading.
  const heading = wikitext.match(/==\s*Introduction\s*==/i)
  const body = heading ? wikitext.slice(heading.index! + heading[0].length) : wikitext
  const stop = Math.min(
    ...[body.search(/\{\{\s*ReasonsToPick/i), body.search(/\n===/), body.length]
      .map((i) => (i < 0 ? body.length : i))
  )
  const paras = body.slice(0, stop)
    .split(/\n\s*\n/)
    .map((p) => rich(p))
    .filter((p) => p.replace(/<[^>]*>/g, '').length > 40)
    // Editors leave bracketed TODOs in place of unwritten paragraphs ("[st HP, cr LK, etc]").
    // They read as broken copy on the page, so they don't survive the snapshot.
    .filter((p) => !/^\[[^\]]*\]$/.test(p.replace(/<[^>]*>/g, '').trim()))

  // The wiki opens by quoting Capcom's in-game character blurb. It isn't the wiki's own
  // writeup, so it's dropped rather than shown as body copy.
  const overview = paras.length > 1 ? paras.slice(1) : paras
  return { overview, pick, avoid }
}

// ---------------------------------------------------------------------------
// Patch notes
// ---------------------------------------------------------------------------

/** Bullet list under one heading, with nesting carried as 3 spaces per wiki level. */
function bullets(src: string): string[] {
  return src.split('\n')
    .filter((l) => /^\*+\s*\S/.test(l))
    .map((l) => {
      const depth = (l.match(/^\*+/) ?? [''])[0].length
      return ' '.repeat((depth - 1) * 3) + plain(l.replace(/^\*+\s*/, ''))
    })
    .filter((l) => l.trim() && l.trim() !== '-')
}

/**
 * One version's patch page (Street Fighter 6/Version/X) -> that patch's changes per
 * character, keyed by the character's name with punctuation and case stripped so the
 * wiki's spellings ("Dee Jay", "E. Honda", "A.K.I.") match our roster names.
 *
 * Characters sit at heading level 3 under "Character Changes"; sections that are just an
 * empty bullet (the wiki stubs every character out when a patch page is created) drop out.
 */
export function parseVersionPage(wikitext: string): Map<string, string[]> {
  const out = new Map<string, string[]>()
  const headings = [...wikitext.matchAll(/^(={2,6})\s*(.+?)\s*={2,6}\s*$/gm)]

  headings.forEach((h, i) => {
    if (h[1].length !== 3) return
    const start = h.index! + h[0].length
    const end = i + 1 < headings.length ? headings[i + 1].index! : wikitext.length
    const notes = bullets(wikitext.slice(start, end))
    if (!notes.length) return
    const key = plain(h[2]).toLowerCase().replace(/[^a-z0-9]/g, '')
    if (key) out.set(key, notes)
  })

  return out
}

