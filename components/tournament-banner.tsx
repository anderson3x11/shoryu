import { getTournaments, type Tournament } from '@/lib/liquipedia'
import { TournamentBannerClient } from '@/components/tournament-banner-client'

// How many weeks ahead the banner appears.
// 0 = only during the tournament's own week (Monday onward) — production behavior.
// 2 = show up to 2 weeks early — handy for testing so an upcoming event shows now.
const BANNER_LEAD_WEEKS = 2

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

function startOfWeekMonday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const offset = (x.getDay() + 6) % 7 // Mon=0 ... Sun=6
  x.setDate(x.getDate() - offset)
  return x
}

type ActiveTournament = { t: Tournament; start: Date; end: Date }

function pickTournament(years: { tournaments: Tournament[] }[], today: Date): ActiveTournament | null {
  const todayMonday = startOfWeekMonday(today)

  const candidates = years
    .flatMap(y => y.tournaments)
    .map(t => {
      const range = parseDateRange(t.date)
      return range ? { t, ...range } : null
    })
    .filter((x): x is ActiveTournament => x !== null)
    // still upcoming or in progress, and a weekend-sized event
    .filter(x => x.end >= today && (x.end.getTime() - x.start.getTime()) / DAY_MS <= MAX_EVENT_DAYS)
    // within the lead window (compare by week so it flips on Monday)
    .filter(x => {
      const weeksAhead = Math.round((startOfWeekMonday(x.start).getTime() - todayMonday.getTime()) / (7 * DAY_MS))
      return weeksAhead <= BANNER_LEAD_WEEKS
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  return candidates[0] ?? null
}

function relativeLabel(start: Date, end: Date, today: Date): string {
  if (start <= today && today <= end) return 'Happening now'
  const days = Math.round((start.getTime() - today.getTime()) / DAY_MS)
  if (days <= 0) return 'Starts today'
  if (days === 1) return 'Starts tomorrow'
  return `Starts in ${days} days`
}

export async function TournamentBanner() {
  const years = await getTournaments()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const active = pickTournament(years, today)
  if (!active) return null

  const { t, start, end } = active

  return (
    <TournamentBannerClient
      name={t.name}
      url={t.url}
      date={t.date}
      location={t.location}
      label={relativeLabel(start, end, today)}
    />
  )
}
