'use client'

import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import { Trophy, ExternalLink, X } from 'lucide-react'

// How many weeks ahead the banner appears.
// 0 = only during the tournament's own week (Monday onward) — production behavior.
// 2 = show up to 2 weeks early — handy for testing so an upcoming event shows now.
const BANNER_LEAD_WEEKS = 0
const DAY_MS = 86_400_000

// A weekend-sized tournament the server deemed bannerable. start/end are midnight timestamps.
export type BannerCandidate = {
  name: string
  url: string
  date: string
  location: string | null
  start: number
  end: number
}

function startOfWeekMonday(d: Date): number {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const offset = (x.getDay() + 6) % 7 // Mon=0 ... Sun=6
  x.setDate(x.getDate() - offset)
  return x.getTime()
}

// Pick the soonest tournament within the lead window. Runs on the client with the
// real current date, so production stays correct even though the page is static.
function pick(candidates: BannerCandidate[], today: Date): BannerCandidate | null {
  const todayMonday = startOfWeekMonday(today)
  const todayMs = today.getTime()

  return (
    candidates
      .filter((c) => c.end >= todayMs)
      .filter((c) => {
        const weeksAhead = Math.round((startOfWeekMonday(new Date(c.start)) - todayMonday) / (7 * DAY_MS))
        return weeksAhead <= BANNER_LEAD_WEEKS
      })
      .sort((a, b) => a.start - b.start)[0] ?? null
  )
}

function relativeLabel(start: number, end: number, today: number): string {
  if (start <= today && today <= end) return 'Happening now'
  const days = Math.round((start - today) / DAY_MS)
  if (days <= 0) return 'Starts today'
  if (days === 1) return 'Starts tomorrow'
  return `Starts in ${days} days`
}

const subscribe = () => () => {}

export function TournamentBannerClient({ candidates }: { candidates: BannerCandidate[] }) {
  const [hidden, setHidden] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // false during SSR/SSG and on the first client render (so static HTML, which has no
  // banner, hydrates cleanly), then true — letting us decide using the real browser clock.
  const isClient = useSyncExternalStore(subscribe, () => true, () => false)

  let selected: BannerCandidate | null = null
  let label = ''
  if (isClient) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    selected = pick(candidates, today)
    if (selected) label = relativeLabel(selected.start, selected.end, today.getTime())
  }

  // Expose the banner height so sticky chrome below the navbar (e.g. the profile
  // tab bar) can offset itself, and collapse to 0 when hidden or dismissed.
  useEffect(() => {
    const h = hidden || !selected ? 0 : ref.current?.offsetHeight ?? 0
    document.documentElement.style.setProperty('--banner-h', `${h}px`)
  }, [hidden, selected])

  if (hidden || !selected) return null

  const dismiss = () => setHidden(true)

  return (
    <div ref={ref} className="sticky top-[57px] z-30 overflow-hidden border-b-2 border-amber-500/60 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-3 sm:gap-4">
        {/* Skewed countdown tag — echoes the beveled character tiles */}
        <div className="-skew-x-12 bg-amber-400 px-3 sm:px-4 py-1.5 flex items-center shrink-0">
          <span className="skew-x-12 flex items-center gap-1.5 font-bebas text-lg sm:text-xl tracking-wider leading-none text-zinc-950">
            <Trophy className="w-4 h-4" strokeWidth={2.5} />
            {label}
          </span>
        </div>

        <span className="font-bebas text-lg sm:text-xl tracking-wider leading-none text-zinc-100 truncate">
          {selected.name}
        </span>
        {selected.location && (
          <span className="hidden md:inline text-sm text-zinc-300 tracking-wide shrink-0">{selected.location}</span>
        )}
        <span className="hidden sm:inline text-sm text-zinc-400 tabular-nums tracking-wide shrink-0">{selected.date}</span>

        <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={selected.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-amber-400/80 hover:text-amber-400 transition-colors"
          >
            Details
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
