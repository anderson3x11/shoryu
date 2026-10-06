'use client'

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { useT, useLocale } from '@/lib/i18n/context'
import { HTML_LANG } from '@/lib/i18n/locales'

// Forces a fresh Buckler fetch for this player (bypassing the 12h profile + battle caches), then
// reloads the page with a one-shot ?refreshed token so every tab re-pulls the fresh data instead
// of serving its 12h cache. Rate-limited server-side to once every few minutes.
export function RefreshProfileButton({ playerId, fetchedAt }: { playerId: string; fetchedAt?: number | null }) {
  const t = useT()
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  // Rendered after mount only: the page is ISR-cached, so an age baked into the HTML would itself
  // be stale (and would not match what the browser computes, which React flags as a mismatch).
  const [age, setAge] = useState<string | null>(null)
  useEffect(() => {
    if (!fetchedAt) return
    setAge(fmtAge(Math.max(0, Math.floor((Date.now() - fetchedAt) / 1000)), HTML_LANG[locale], t.player.justNow))
  }, [fetchedAt, locale, t])

  async function refresh() {
    setNote(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/player/${playerId}/refresh`, { method: 'POST' })
      if (res.status === 429) { setNote(t.player.justRefreshed); setLoading(false); return }
      if (!res.ok) { setNote(t.player.refreshUnavailable); setLoading(false); return }
      // Reload with a token the tabs append to their fetches, busting the 12h CDN caches once.
      window.location.href = `${window.location.pathname}?refreshed=${Date.now()}`
    } catch {
      setNote(t.player.refreshUnavailable)
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {note
        ? <span className="text-xs text-zinc-400 whitespace-nowrap">{note}</span>
        : age && <span className="hidden sm:inline text-xs text-zinc-500 whitespace-nowrap">{t.player.updated} {age}</span>}
      <button
        onClick={refresh}
        disabled={loading}
        title={t.player.refresh}
        className="flex items-center gap-1.5 rounded-none border border-zinc-700 px-2 sm:px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">{t.player.refresh}</span>
      </button>
    </div>
  )
}

// Intl handles "5 min ago" in every locale we ship, so there is no wording to translate here.
function fmtAge(sec: number, lang: string, justNow: string): string {
  const m = Math.floor(sec / 60)
  if (m < 1) return justNow
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto', style: 'short' })
  if (m < 60) return rtf.format(-m, 'minute')
  const h = Math.floor(m / 60)
  if (h < 24) return rtf.format(-h, 'hour')
  return rtf.format(-Math.floor(h / 24), 'day')
}
