import { unstable_cache } from 'next/cache'

export type Tournament = {
  name: string
  url: string
  iconUrl: string | null
  date: string
  prizePool: string | null
  location: string | null
  winner: string | null
  winnerUrl: string | null
  runnerUp: string | null
  runnerUpUrl: string | null
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

function extractPlayer(cellHtml: string): { name: string; url: string } | null {
  const m = cellHtml.match(/<a href="(\/fighters\/[^"]+)"[^>]*>([^<]+)<\/a>/)
  if (!m) return null
  return { name: m[2].trim(), url: `https://liquipedia.net${m[1]}` }
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

  // Location cells: Right-60
  const locEntries: { location: string; pos: number }[] = []
  const locRegex = /class="divCell EventDetails-Right-60[^"]*">([\s\S]*?)<\/div>/g
  while ((m = locRegex.exec(html)) !== null) {
    const loc = stripHtml(m[1])
    if (loc) locEntries.push({ location: loc, pos: m.index })
  }

  // Placement cells — match from opening class to </div> (no nested divs in these cells)
  const firstEntries: { player: ReturnType<typeof extractPlayer>; pos: number }[] = []
  const firstRegex = /class="divCell Placement FirstPlace">([\s\S]*?)<\/div>/g
  while ((m = firstRegex.exec(html)) !== null) {
    firstEntries.push({ player: extractPlayer(m[1]), pos: m.index })
  }

  const secondEntries: { player: ReturnType<typeof extractPlayer>; pos: number }[] = []
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
    const first = inRange(firstEntries)?.player ?? null
    const second = inRange(secondEntries)?.player ?? null

    // Icon appears before the tournament name in the same row — find the last
    // usable icon between the previous name position and this name position
    const prevPos = nameEntries[i - 1]?.pos ?? 0
    const iconEntry = iconEntries.filter(e => e.pos < pos && e.pos > prevPos).pop()
    const iconUrl = iconEntry?.iconUrl ?? null

    // Nearest preceding year heading
    let rowYear: number | null = null
    for (let j = yearPositions.length - 1; j >= 0; j--) {
      if (yearPositions[j].pos <= pos) { rowYear = yearPositions[j].year; break }
    }
    if (!rowYear) continue

    if (!yearMap.has(rowYear)) yearMap.set(rowYear, [])
    yearMap.get(rowYear)!.push({
      name, url, iconUrl, date, prizePool, location,
      winner: first?.name ?? null,
      winnerUrl: first?.url ?? null,
      runnerUp: second?.name ?? null,
      runnerUpUrl: second?.url ?? null,
    })
  }

  return [...yearMap.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, tournaments]) => ({ year, tournaments }))
}

export const getTournaments = unstable_cache(
  async (): Promise<TournamentYear[]> => {
    try {
      const res = await fetch(
        'https://liquipedia.net/fighters/Street_Fighter_6/Tier_1_Tournaments',
        {
          cache: 'no-store',
          headers: {
            'User-Agent': 'Shoryu/1.0 (+https://shoryu.vercel.app)',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }
      )
      if (!res.ok) return []
      const html = await res.text()
      return parse(html)
    } catch {
      return []
    }
  },
  ['liquipedia-tournaments'],
  { revalidate: 86400, tags: ['tournaments'] }
)
