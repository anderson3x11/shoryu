// Regenerates lib/data/tournaments.json from the Liquipedia API AND downloads the
// referenced flag / character / league images into public/liquipedia, rewriting
// the snapshot to local paths. Run from an environment that can reach Liquipedia
// (a dev machine / GitHub Actions — NOT the Cloudflare-blocked prod VPS):
//   npx tsx scripts/refresh-tournaments.ts
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parse } from '../lib/liquipedia-parse'
import type { TournamentYear } from '../lib/liquipedia-parse'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const IMG_DIR = join(ROOT, 'public', 'liquipedia')
const IMG_PUBLIC = '/liquipedia'

const UA = 'Shoryu/1.0 (https://shoryu.site; https://github.com/anderson3x11/shoryu)'

const API =
  'https://liquipedia.net/fighters/api.php?action=parse&page=' +
  encodeURIComponent('Street_Fighter_6/Tier_1_Tournaments') +
  '&prop=text&format=json'

function localName(url: string): string {
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 16)
  const m = url.match(/\.(png|jpg|jpeg|gif|svg|webp)(?=$|\?)/i)
  const ext = m ? m[1].toLowerCase() : 'png'
  return `${hash}.${ext}`
}

function collectUrls(years: TournamentYear[]): string[] {
  const urls = new Set<string>()
  for (const y of years) {
    for (const t of y.tournaments) {
      if (t.iconUrl) urls.add(t.iconUrl)
      for (const p of [t.winner, t.runnerUp]) {
        if (p?.flagUrl) urls.add(p.flagUrl)
        if (p?.charUrl) urls.add(p.charUrl)
      }
    }
  }
  return [...urls]
}

async function download(url: string): Promise<boolean> {
  const dest = join(IMG_DIR, localName(url))
  if (existsSync(dest)) return true // content-hash filename: same url => already have it
  const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://liquipedia.net/' } })
  if (!res.ok) {
    console.warn(`  image ${res.status}: ${url}`)
    return false
  }
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
  return true
}

function rewrite(years: TournamentYear[], ok: Set<string>): TournamentYear[] {
  const map = (u: string | null) => (u && ok.has(u) ? `${IMG_PUBLIC}/${localName(u)}` : u)
  return years.map((y) => ({
    year: y.year,
    tournaments: y.tournaments.map((t) => ({
      ...t,
      iconUrl: map(t.iconUrl),
      winner: t.winner ? { ...t.winner, flagUrl: map(t.winner.flagUrl), charUrl: map(t.winner.charUrl) } : null,
      runnerUp: t.runnerUp ? { ...t.runnerUp, flagUrl: map(t.runnerUp.flagUrl), charUrl: map(t.runnerUp.charUrl) } : null,
    })),
  }))
}

async function main() {
  const res = await fetch(API, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' } })
  if (!res.ok) {
    console.error('Liquipedia API HTTP', res.status)
    process.exit(1)
  }
  const json = await res.json()
  const html: string | undefined = json?.parse?.text?.['*'] ?? json?.parse?.text
  if (!html) {
    console.error('Liquipedia API returned no HTML')
    process.exit(1)
  }
  const years = parse(html)
  if (!years.length) {
    console.error('Parsed 0 tournaments — aborting (kept previous snapshot)')
    process.exit(1)
  }

  mkdirSync(IMG_DIR, { recursive: true })
  const urls = collectUrls(years)
  const ok = new Set<string>()
  // Modest concurrency to stay polite with Liquipedia.
  for (let i = 0; i < urls.length; i += 6) {
    const batch = urls.slice(i, i + 6)
    const results = await Promise.all(batch.map((u) => download(u).then((r) => [u, r] as const)))
    for (const [u, r] of results) if (r) ok.add(u)
    await new Promise((r) => setTimeout(r, 150))
  }

  const rewritten = rewrite(years, ok)
  const out = join(ROOT, 'lib', 'data', 'tournaments.json')
  writeFileSync(out, JSON.stringify(rewritten, null, 2) + '\n')
  const total = rewritten.reduce((n, y) => n + y.tournaments.length, 0)
  console.log(`wrote ${out}: ${rewritten.length} years, ${total} tournaments; images ${ok.size}/${urls.length}`)
}

main()
