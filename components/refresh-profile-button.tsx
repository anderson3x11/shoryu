'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'

// Forces a fresh Buckler fetch for this player (bypassing the 12h profile cache), then
// re-renders the server component. Rate-limited server-side to once every couple of minutes.
export function RefreshProfileButton({ playerId }: { playerId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  const busy = loading || isPending

  async function refresh() {
    setNote(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/player/${playerId}/refresh`, { method: 'POST' })
      if (res.status === 429) {
        setNote('Déjà à jour, réessaie dans un instant.')
        return
      }
      if (!res.ok) {
        setNote('Rafraîchissement indisponible.')
        return
      }
      startTransition(() => router.refresh())
    } catch {
      setNote('Rafraîchissement indisponible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {note && <span className="text-xs text-zinc-400">{note}</span>}
      <button
        onClick={refresh}
        disabled={busy}
        className="flex items-center gap-1.5 rounded-none border border-zinc-700 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
        Rafraîchir
      </button>
    </div>
  )
}
