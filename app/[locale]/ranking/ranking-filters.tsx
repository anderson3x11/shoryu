'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

interface Option { value: string; label: string; count: number }

const SELECT = 'w-full sm:w-auto rounded-none border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 focus:border-amber-400 focus:outline-none cursor-pointer'

// Character and country filters for the Master ranking. Plain selects writing to the URL, so a
// filtered view is shareable and the server does the filtering on the cached snapshot.
export function RankingFilters({ characters, countries, labels }: {
  characters: Option[]
  countries: Option[]
  labels: { allCharacters: string; allCountries: string }
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  function set(key: 'char' | 'country', value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    const qs = next.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <select aria-label={labels.allCharacters} className={SELECT} value={params.get('char') ?? ''} onChange={(e) => set('char', e.target.value)}>
        <option value="">{labels.allCharacters}</option>
        {characters.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.count})</option>)}
      </select>
      <select aria-label={labels.allCountries} className={SELECT} value={params.get('country') ?? ''} onChange={(e) => set('country', e.target.value)}>
        <option value="">{labels.allCountries}</option>
        {countries.map((o) => <option key={o.value} value={o.value}>{o.label} ({o.count})</option>)}
      </select>
    </div>
  )
}
