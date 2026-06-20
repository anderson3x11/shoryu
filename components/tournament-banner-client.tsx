'use client'

import { useState, useEffect, useRef } from 'react'
import { Trophy, ExternalLink, X } from 'lucide-react'

type Props = {
  name: string
  url: string
  date: string
  location: string | null
  label: string
}

export function TournamentBannerClient({ name, url, date, location, label }: Props) {
  const [hidden, setHidden] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Expose the banner height so sticky chrome below the navbar (e.g. the profile
  // tab bar) can offset itself, and collapse to 0 when dismissed.
  useEffect(() => {
    const h = hidden ? 0 : (ref.current?.offsetHeight ?? 0)
    document.documentElement.style.setProperty('--banner-h', `${h}px`)
  }, [hidden])

  if (hidden) return null

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
          {name}
        </span>
        {location && (
          <span className="hidden md:inline text-sm text-zinc-300 tracking-wide shrink-0">{location}</span>
        )}
        <span className="hidden sm:inline text-sm text-zinc-400 tabular-nums tracking-wide shrink-0">{date}</span>

        <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={url}
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
