'use client'

import { useState, useSyncExternalStore } from 'react'
import { RefreshCw } from 'lucide-react'
import { useT, useLocale } from '@/lib/i18n/context'
import { formatAge } from '@/lib/i18n/format'
import { noSubscribe } from '@/lib/utils'

// Forces a fresh Buckler fetch for this player (bypassing the 12h profile + battle caches), then
// reloads the page with a one-shot ?refreshed token so every tab re-pulls the fresh data instead
// of serving its 12h cache. Rate-limited server-side to once every few minutes.
export function RefreshProfileButton({ playerId, fetchedAt }: { playerId: string; fetchedAt?: number | null }) {
  const t = useT()
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  // Client only (server snapshot null): an age baked into the HTML would already be stale and
  // would not match what the browser computes. The minute-level string is stable between reads.
  const age = useSyncExternalStore(
    noSubscribe,
    () => fetchedAt
      ? formatAge(Math.max(0, Math.floor((Date.now() - fetchedAt) / 1000)), locale, t.player.justNow)
      : null,
    () => null,
  )

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
