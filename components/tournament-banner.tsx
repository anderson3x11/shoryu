import { getTournaments } from '@/lib/liquipedia'
import { TournamentBannerClient, type BannerCandidate } from '@/components/tournament-banner-client'

// Longer events (online leagues, group stages) aren't "weekend tournament" banners.
const MAX_EVENT_DAYS = 10
const DAY_MS = 86_400_000
const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
}

// Parse Liquipedia date strings: "Nov 12 - 15, 2026", "Jul 29 - Aug 1, 2026", "May 16, 2026".
// The year shown belongs to the end date; if the start month is later, the start is the prior year.
function parseDateRange(s: string): { start: Date; end: Date } | null {
  const yearM = s.match(/(\d{4})\s*$/)
  if (!yearM) return null
  const year = parseInt(yearM[1])
  const body = s.replace(/,?\s*\d{4}\s*$/, '').trim()
  const parts = body.split('-').map(p => p.trim())

  const startTok = parts[0].match(/^([A-Za-z]{3})[a-z]*\s+(\d{1,2})$/)
  if (!startTok) return null
  const startMonth = MONTHS[startTok[1]]
  const startDay = parseInt(startTok[2])
  if (startMonth === undefined) return null

  let endMonth = startMonth
  let endDay = startDay
  if (parts[1]) {
    const withMonth = parts[1].match(/^([A-Za-z]{3})[a-z]*\s+(\d{1,2})$/)
    const dayOnly = parts[1].match(/^(\d{1,2})$/)
    if (withMonth && MONTHS[withMonth[1]] !== undefined) {
      endMonth = MONTHS[withMonth[1]]
      endDay = parseInt(withMonth[2])
    } else if (dayOnly) {
      endDay = parseInt(dayOnly[1])
    }
  }

  const startYear = startMonth > endMonth ? year - 1 : year
  return {
    start: new Date(startYear, startMonth, startDay),
    end: new Date(year, endMonth, endDay),
  }
}

export async function TournamentBanner() {
  const years = await getTournaments()

  // Build the list of weekend-sized candidates on the server (the data is cached and
  // slow-changing). The client picks which one to show using the real current date,
  // so the banner stays correct even though pages are statically rendered.
  const candidates: BannerCandidate[] = years
    .flatMap(y => y.tournaments)
    .map((t) => {
      const range = parseDateRange(t.date)
      if (!range) return null
      if ((range.end.getTime() - range.start.getTime()) / DAY_MS > MAX_EVENT_DAYS) return null
      return {
        name: t.name,
        url: t.url,
        date: t.date,
        location: t.location,
        start: range.start.getTime(),
        end: range.end.getTime(),
      }
    })
    .filter((x): x is BannerCandidate => x !== null)

  if (candidates.length === 0) return null

  return <TournamentBannerClient candidates={candidates} />
}
