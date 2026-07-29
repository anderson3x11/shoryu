import { unstable_cache } from 'next/cache'

export type Player = {
  name: string
  url: string
  flagUrl: string | null
  flagAlt: string | null
  charUrl: string | null
  charAlt: string | null
}

export type Tournament = {
  name: string
  url: string
  iconUrl: string | null
  date: string
  prizePool: string | null
  location: string | null
  winner: Player | null
  runnerUp: Player | null
}

export type TournamentYear = {
  year: number
  tournaments: Tournament[]
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}="([^"]+)"`))
  return m ? m[1] : null
}

// Upgrade a Liquipedia thumb URL from 18px to 36px for better quality
function thumb2x(src: string): string {
  return src.replace(/\/(\d+)px-/, (_, n) => `/${parseInt(n) * 2}px-`)
}

function extractPlayer(cellHtml: string): Player | null {
  const linkM = cellHtml.match(/<a href="(\/fighters\/[^"]+)"[^>]*>([^<]+)<\/a>/)
  if (!linkM) return null

  const flagM = cellHtml.match(/<span class="flag">(<img[^>]+\/>)<\/span>/)
  const flagSrc = flagM ? attr(flagM[1], 'src') : null
  const flagAlt = flagM ? attr(flagM[1], 'alt') : null

  const charM = cellHtml.match(/<span class="heads-padding-right">(<img[^>]+\/>)<\/span>/)
  const charSrc = charM ? attr(charM[1], 'src') : null
  const charAlt = charM ? attr(charM[1], 'alt') : null

  return {
    name: linkM[2].trim(),
    url: `https://liquipedia.net${linkM[1]}`,
    flagUrl: flagSrc ? `https://liquipedia.net${flagSrc}` : null,
    flagAlt,
    charUrl: charSrc ? `https://liquipedia.net${thumb2x(charSrc)}` : null,
    charAlt,
  }
}

function parse(html: string): TournamentYear[] {
  const yearMap = new Map<number, Tournament[]>()

  // Year headings: <h3 id="2026">
  const yearPositions: { year: number; pos: number }[] = []
  const yearRegex = /<h3 id="(20\d\d)">/g
  let m: RegExpExecArray | null
  while ((m = yearRegex.exec(html)) !== null) {
    const y = parseInt(m[1])
    if (y >= 2023) yearPositions.push({ year: y, pos: m.index })
  }

  // Tournament names: <b><a href="/fighters/...">Name</a></b>
  const nameEntries: { name: string; url: string; pos: number }[] = []
  const nameRegex = /<b><a href="(\/fighters\/[^"]+)"[^>]*>([^<]+)<\/a><\/b>/g
  while ((m = nameRegex.exec(html)) !== null) {
    nameEntries.push({ url: `https://liquipedia.net${m[1]}`, name: m[2].trim(), pos: m.index })
  }

  // League icons: allmode or darkmode (skip lightmode — dark-themed site)
  const iconEntries: { iconUrl: string; pos: number }[] = []
  const iconRegex = /class="league-icon-small-image(?! lightmode)[^"]*"[\s\S]*?<img[^>]+src="([^"]+)"[^>]*\/>/g
  while ((m = iconRegex.exec(html)) !== null) {
    iconEntries.push({ iconUrl: `https://liquipedia.net${m[1]}`, pos: m.index })
  }

  // Date cells
  const dateEntries: { date: string; pos: number }[] = []
  const dateRegex = /class="divCell EventDetails-Left-55[^"]*">([^<]+)<\/div>/g
  while ((m = dateRegex.exec(html)) !== null) {
    dateEntries.push({ date: m[1].trim(), pos: m.index })
  }

  // Prize cells
  const prizeEntries: { prize: string; pos: number }[] = []
  const prizeRegex = /class="divCell EventDetails-Right-45[^"]*">([^<]*)<\/div>/g
  while ((m = prizeRegex.exec(html)) !== null) {
    prizeEntries.push({ prize: m[1].trim(), pos: m.index })
  }

  // Location cells
  const locEntries: { location: string; pos: number }[] = []
  const locRegex = /class="divCell EventDetails-Right-60[^"]*">([\s\S]*?)<\/div>/g
  while ((m = locRegex.exec(html)) !== null) {
    const loc = stripHtml(m[1])
    if (loc) locEntries.push({ location: loc, pos: m.index })
  }

  // Placement cells
  const firstEntries: { player: Player | null; pos: number }[] = []
  const firstRegex = /class="divCell Placement FirstPlace">([\s\S]*?)<\/div>/g
  while ((m = firstRegex.exec(html)) !== null) {
    firstEntries.push({ player: extractPlayer(m[1]), pos: m.index })
  }

  const secondEntries: { player: Player | null; pos: number }[] = []
  const secondRegex = /class="divCell Placement SecondPlace">([\s\S]*?)<\/div>/g
  while ((m = secondRegex.exec(html)) !== null) {
    secondEntries.push({ player: extractPlayer(m[1]), pos: m.index })
  }

  for (let i = 0; i < nameEntries.length; i++) {
    const { name, url, pos } = nameEntries[i]
    const nextPos = nameEntries[i + 1]?.pos ?? Infinity

    const inRange = <T extends { pos: number }>(arr: T[]) =>
      arr.find(e => e.pos > pos && e.pos < nextPos)

    const date = inRange(dateEntries)?.date ?? ''
    if (!date) continue

    const prizeRaw = inRange(prizeEntries)?.prize ?? ''
    const prizePool =
      prizeRaw && prizeRaw !== '-' && prizeRaw !== '—' && prizeRaw !== '–'
        ? prizeRaw
        : null

    const location = inRange(locEntries)?.location ?? null
    const winner = inRange(firstEntries)?.player ?? null
    const runnerUp = inRange(secondEntries)?.player ?? null

    const prevPos = nameEntries[i - 1]?.pos ?? 0
    const iconEntry = iconEntries.filter(e => e.pos < pos && e.pos > prevPos).pop()
    const iconUrl = iconEntry?.iconUrl ?? null

    let rowYear: number | null = null
    for (let j = yearPositions.length - 1; j >= 0; j--) {
      if (yearPositions[j].pos <= pos) { rowYear = yearPositions[j].year; break }
    }
    if (!rowYear) continue

    if (!yearMap.has(rowYear)) yearMap.set(rowYear, [])
    yearMap.get(rowYear)!.push({ name, url, iconUrl, date, prizePool, location, winner, runnerUp })
  }

  return [...yearMap.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, tournaments]) => ({ year, tournaments }))
}

// Liquipedia now puts the raw HTML pages behind a Cloudflare challenge (403).
// Their MediaWiki API is the sanctioned path and returns the same rendered page
// HTML in parse.text['*']. A descriptive User-Agent with contact is required.
// Throws on failure so unstable_cache does NOT cache an empty result for a day.
async function fetchTournamentsFromApi(): Promise<TournamentYear[]> {
  const page = encodeURIComponent('Street_Fighter_6/Tier_1_Tournaments')
  const res = await fetch(
    `https://liquipedia.net/fighters/api.php?action=parse&page=${page}&prop=text&format=json`,
    {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Shoryu/1.0 (https://shoryu.site; https://x.com/shoryuapp)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }
  )
  if (!res.ok) throw new Error(`Liquipedia API ${res.status}`)
  const json = await res.json()
  const html: string | undefined = json?.parse?.text?.['*'] ?? json?.parse?.text
  if (!html) throw new Error('Liquipedia API returned no HTML')
  const years = parse(html)
  if (years.length === 0) throw new Error('Liquipedia API parsed to 0 tournaments')
  return years
}

// v2 key busts any stale empty result cached by the previous (HTML-scraping) build.
const cachedTournaments = unstable_cache(fetchTournamentsFromApi, ['liquipedia-tournaments-v2'], {
  revalidate: 86400,
  tags: ['tournaments'],
})

export async function getTournaments(): Promise<TournamentYear[]> {
  try {
    return await cachedTournaments()
  } catch {
    // Failures are not cached, so the next request retries instead of showing
    // empty for a full day.
    return []
  }
}
