import Link from 'next/link'
import Image from 'next/image'
import { searchPlayers } from '@/lib/buckler'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import { getRankImageUrl, getRank, getEffectiveRankId, TIER_COLORS } from '@/lib/constants/ranks'
import type { BucklerFighterBanner } from '@/lib/buckler'

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  return { title: q ? `"${q}" on Shoryu` : 'Search - Shoryu' }
}

function PlayerCard({ banner }: { banner: BucklerFighterBanner }) {
  const info = banner.personal_info
  const li = banner.favorite_character_league_info
  const charSlug = banner.favorite_character_tool_name
  const rankId = li
    ? getEffectiveRankId(li.league_rank, li.master_league ?? 0, li.master_rating_ranking, li.master_rating)
    : null
  const rank = rankId != null ? getRank(rankId) : null
  const rankColor = rank ? (TIER_COLORS[rank.tier] ?? '#ffffff') : '#ffffff'
  const hasMR = li && li.league_rank >= 36 && li.master_rating > 0

  return (
    <Link
      href={`/player/${info.short_id}`}
      prefetch={false}
      className="flex items-center gap-3 rounded-none border border-zinc-800 bg-zinc-900 px-4 py-3 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors"
    >
      <div className="relative w-12 h-12 rounded-none overflow-hidden bg-zinc-800 flex-shrink-0">
        {charSlug && (
          <Image
            src={getCharacterImageUrl(charSlug)}
            alt={banner.favorite_character_name}
            fill
            className="object-cover object-top"
            unoptimized
          />
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="font-semibold text-zinc-100 truncate leading-tight">{info.fighter_id}</p>
        <p className="text-xs text-zinc-300 truncate">
          {banner.home_name && <span>{banner.home_name} · </span>}
          {banner.favorite_character_name}
        </p>
      </div>

      {rankId && rank && (
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
          <div className="relative w-16 h-10">
            <Image src={getRankImageUrl(rankId)} alt={rank.name} fill className="object-contain" unoptimized />
          </div>
          {hasMR && (
            <span className="text-[10px] font-bold tabular-nums" style={{ color: rankColor }}>
              {li!.master_rating.toLocaleString()} MR
            </span>
          )}
        </div>
      )}
    </Link>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page: pageParam } = await searchParams
  const query = q?.trim() ?? ''
  const parsedPage = Number(pageParam ?? 1)
  const page = Number.isFinite(parsedPage) ? Math.max(1, Math.floor(parsedPage)) : 1

  const { results, totalPages } = query.length >= 2
    ? await searchPlayers(query, page)
    : { results: [], totalPages: 0 }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="block w-2 h-10 sm:h-12 -skew-x-12 bg-amber-400 shrink-0" />
          <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Search</h1>
        </div>
        {query && (
          <p className="text-sm text-zinc-300">
            {results.length > 0
              ? `Results for "${query}"${totalPages > 1 ? ` (page ${page} of ${totalPages})` : ''}`
              : `No results for "${query}"`}
          </p>
        )}
      </div>

      {!query && (
        <p className="text-zinc-300 text-sm">Enter a player name in the search bar above.</p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {results.map((banner) => (
            <PlayerCard key={banner.personal_info.short_id} banner={banner} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          {page > 1 ? (
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
              className="text-xs px-3 py-1.5 rounded-none border border-zinc-700 text-zinc-300 hover:text-zinc-200 transition-colors"
            >
              ← Prev
            </Link>
          ) : <span />}
          <span className="text-xs text-zinc-300">Page {page} / {totalPages}</span>
          {page < totalPages ? (
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
              className="text-xs px-3 py-1.5 rounded-none border border-zinc-700 text-zinc-300 hover:text-zinc-200 transition-colors"
            >
              Next →
            </Link>
          ) : <span />}
        </div>
      )}
    </div>
  )
}
