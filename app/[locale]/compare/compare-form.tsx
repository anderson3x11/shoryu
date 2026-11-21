'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SearchBar } from '@/components/search-bar'

// The two player slots of the compare page. A filled slot shows the player with a Change button;
// an empty one is the search bar in picker mode. Picks go to the URL (?a=&b=), so a comparison is
// a shareable link and the server page does the loading.
export function CompareForm({ players, labels }: {
  players: { a: string | null; b: string | null }
  labels: { pickA: string; pickB: string; change: string }
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  function set(slot: 'a' | 'b', id: number | null) {
    const next = new URLSearchParams(params)
    if (id === null) next.delete(slot)
    else next.set(slot, String(id))
    router.push(`${pathname}?${next}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {(['a', 'b'] as const).map((slot) =>
        players[slot] ? (
          <div key={slot} className="flex items-center justify-between gap-3 border border-zinc-800 bg-zinc-900 px-4 h-14">
            <span className="truncate font-semibold text-zinc-100">{players[slot]}</span>
            <button
              onClick={() => set(slot, null)}
              className="shrink-0 rounded-none border border-zinc-700 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              {labels.change}
            </button>
          </div>
        ) : (
          <SearchBar key={slot} onPick={(id) => set(slot, id)} placeholder={slot === 'a' ? labels.pickA : labels.pickB} />
        ),
      )}
    </div>
  )
}
