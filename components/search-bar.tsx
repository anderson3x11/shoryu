'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { BucklerFighterBanner } from '@/lib/buckler'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import { getRankImageUrl, getRank, getEffectiveRankId } from '@/lib/constants/ranks'
import Image from 'next/image'

export function SearchBar() {
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
      return
    }
    if (results.length === 1) handleSelect(results[0])
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by CFN name or paste a player ID..."
            className="pl-12 pr-4 h-14 text-base bg-zinc-900 border-zinc-700 rounded-xl placeholder:text-zinc-500"
            autoComplete="off"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {results.slice(0, 8).map((r) => {
            const li = r.favorite_character_league_info
            const rankId = li ? getEffectiveRankId(li.league_rank, 0, li.master_rating_ranking, li.master_rating) : null
            const rank = rankId != null ? getRank(rankId) : null
            const charSlug = r.favorite_character_tool_name

            return (
              <button
                key={r.personal_info.short_id}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors text-left cursor-pointer"
              >
                <div className="relative w-9 h-9 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
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
                  <p className="font-semibold text-white truncate">{r.personal_info.fighter_id}</p>
                  <p className="text-xs text-zinc-400 truncate">
                    {r.home_name} · {r.favorite_character_name}
                  </p>
                </div>

                {rankId && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Image
                      src={getRankImageUrl(rankId)}
                      alt={rank?.name ?? ''}
                      width={28}
                      height={28}
                      unoptimized
                      className="object-contain"
                    />
                    <span className="text-xs text-zinc-400 hidden sm:block">{rank?.name}</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 px-4 py-6 text-center text-zinc-500 text-sm">
          No players found for &quot;{query}&quot;
        </div>
      )}
    </div>
  )
}
