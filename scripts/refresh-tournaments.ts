// Regenerates lib/data/tournaments.json from the Liquipedia API. Run from an
// environment that can reach Liquipedia (e.g. a dev machine / CI):
//   npx tsx scripts/refresh-tournaments.ts
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { parse } from '../lib/liquipedia-parse'

const API =
  'https://liquipedia.net/fighters/api.php?action=parse&page=' +
  encodeURIComponent('Street_Fighter_6/Tier_1_Tournaments') +
  '&prop=text&format=json'

async function main() {
  const res = await fetch(API, {
    headers: {
      'User-Agent': 'Shoryu/1.0 (https://shoryu.site; https://x.com/shoryuapp)',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  })
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
  const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'data', 'tournaments.json')
  writeFileSync(out, JSON.stringify(years, null, 2) + '\n')
  const total = years.reduce((n, y) => n + y.tournaments.length, 0)
  console.log(`wrote ${out}: ${years.length} years, ${total} tournaments`)
}

main()
