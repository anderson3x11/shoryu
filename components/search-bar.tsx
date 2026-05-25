'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Clock, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { BucklerFighterBanner } from '@/lib/buckler'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import { getRankImageUrl, getRank, getEffectiveRankId } from '@/lib/constants/ranks'
import Image from 'next/image'

const STORAGE_KEY = 'shoryu_recent'
const MAX_RECENT = 5

interface RecentSearch {
  short_id: number
  fighter_id: string
  char_slug: string
  char_name: string
}

function loadRecent(): RecentSearch[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function addToRecent(item: RecentSearch) {
  const existing = loadRecent().filter(r => r.short_id !== item.short_id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...existing].slice(0, MAX_RECENT)))
}

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BucklerFighterBanner[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [recent, setRecent] = useState<RecentSearch[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setRecent(loadRecent())
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return }
    if (/^\d+$/.test(q)) { setResults([]); setOpen(true); return }

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: abortRef.current.signal })
      const data = await res.json()
      setResults(data.results ?? [])
      setOpen(true)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') setResults([])
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
    addToRecent({
      short_id: result.personal_info.short_id,
      fighter_id: result.personal_info.fighter_id,
      char_slug: result.favorite_character_tool_name,
      char_name: result.favorite_character_name,
    })
    setRecent(loadRecent())
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

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (val === '') { setOpen(false); setResults([]) }
  }

  const isNumericQuery = /^\d+$/.test(query) && query.length >= 2

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
          <Input
            value={query}
            onChange={handleQueryChange}
            placeholder="Search by CFN name or paste a player ID..."
            className="pl-12 pr-4 h-14 text-base bg-zinc-900 border-zinc-700 rounded-xl placeholder:text-zinc-500"
            autoComplete="off"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </form>

      {open && isNumericQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <button
            onClick={() => { router.push(`/player/${query}`); setQuery(''); setOpen(false) }}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-800 transition-colors text-left cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-zinc-500 flex-shrink-0" />
            <span className="text-sm text-zinc-300">Go to player <span className="font-mono text-white">#{query}</span></span>
          </button>
        </div>
      )}

      {open && !isNumericQuery && results.length > 0 && (
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

      {open && !isNumericQuery && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 px-4 py-6 text-center text-zinc-500 text-sm">
          No players found for &quot;{query}&quot;
        </div>
      )}

      {query === '' && recent.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-zinc-600 mb-2 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Recent
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r.short_id}
                onClick={() => router.push(`/player/${r.short_id}`)}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="relative w-5 h-5 rounded overflow-hidden bg-zinc-700 flex-shrink-0">
                  {r.char_slug && (
                    <Image
                      src={getCharacterImageUrl(r.char_slug)}
                      alt={r.char_name}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                  )}
                </div>
                <span className="text-sm text-zinc-300">{r.fighter_id}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
