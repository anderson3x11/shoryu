'use client'

import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Picker } from '@/components/picker'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import { countryFlag } from '@/lib/constants/flags'

interface Option { value: string; label: string; count: number }

// Character and country filters for the Master ranking. They write to the URL, so a filtered
// view is shareable and the server does the filtering on the cached snapshot.
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

  const portrait = (slug: string, size: 'sm' | 'tile') => (
    <span className={size === 'sm' ? 'relative w-6 h-6 shrink-0 overflow-hidden bg-zinc-800' : 'absolute inset-0'}>
      <Image src={getCharacterImageUrl(slug)} alt="" fill className="object-cover object-top" unoptimized />
    </span>
  )

  const charValue = params.get('char') ?? ''
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Picker
        grid
        className="sm:w-56"
        label={labels.allCharacters}
        allLabel={labels.allCharacters}
        value={charValue}
        onChange={(v) => set('char', v)}
        options={characters.map((o) => ({ ...o, icon: portrait(o.value, 'tile'), buttonIcon: portrait(o.value, 'sm') }))}
      />
      <Picker
        className="sm:w-56"
        label={labels.allCountries}
        allLabel={labels.allCountries}
        value={params.get('country') ?? ''}
        onChange={(v) => set('country', v)}
        options={countries.map((o) => ({ ...o, icon: <span className="w-5 shrink-0 text-center leading-none">{countryFlag(o.value) || '🌐'}</span> }))}
      />
    </div>
  )
}
