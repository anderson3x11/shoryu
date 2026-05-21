'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import Image from 'next/image'
import type { BucklerFighterBanner } from '@/lib/buckler'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import { getRankImageUrl, getRank, getEffectiveRankId } from '@/lib/constants/ranks'

export function NavSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BucklerFighterBanner[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return }
    if (/^\d+$/.test(q)) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results ?? [])
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 350)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(result: BucklerFighterBanner) {
    setOpen(false)
    setQuery('')
    router.push(`/player/${result.personal_info.short_id}`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (/^\d+$/.test(trimmed) && trimmed.length > 0) {
      router.push(`/player/${trimmed}`)
      setQuery('')
      setOpen(false)
      return
    }
    if (results.length === 1) handleSelect(results[0])
  }

  return (
    <div ref={containerRef} className="relative w-56">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search player..."
            autoComplete="off"
            className="w-full h-8 pl-8 pr-3 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          {loading && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {results.slice(0, 6).map((r) => {
            const li = r.favorite_character_league_info
            const rankId = li ? getEffectiveRankId(li.league_rank, 0, li.master_rating_ranking, li.master_rating) : null
            const rank = rankId != null ? getRank(rankId) : null
            const charSlug = r.favorite_character_tool_name

            return (
              <button
                key={r.personal_info.short_id}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-800 transition-colors text-left cursor-pointer"
              >
                <div className="relative w-7 h-7 rounded overflow-hidden bg-zinc-800 flex-shrink-0">
                  {charSlug && (
                    <Image
                      src={getCharacterImageUrl(charSlug)}
                      alt={r.favorite_character_name}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate leading-tight">{r.personal_info.fighter_id}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{r.favorite_character_name}</p>
                </div>
                {rankId && (
                  <Image
                    src={getRankImageUrl(rankId)}
                    alt={rank?.name ?? ''}
                    width={24}
                    height={24}
                    unoptimized
                    className="object-contain flex-shrink-0"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
