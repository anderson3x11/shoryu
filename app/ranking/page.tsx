import Link from 'next/link'
import Image from 'next/image'
import { getRanking } from '@/lib/buckler/client'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import { getRankImageUrl, getRank, getEffectiveRankId } from '@/lib/constants/ranks'
import type { BucklerRankingEntry } from '@/lib/buckler/types'

export const revalidate = 300

export const metadata = {
  title: 'Master Ranking',
  description: 'Top Street Fighter 6 players ranked by Master Rating. Live global leaderboard.',
}

function RankingCard({ entry }: { entry: BucklerRankingEntry }) {
  const banner = entry.fighter_banner_info
  const charSlug = entry.character_tool_name
  const rankId = getEffectiveRankId(
    entry.league_rank,
    entry.master_league ?? 0,
    entry.master_rating_ranking,
    entry.rating
  )
  const rank = getRank(rankId)

  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors">
      <span className="text-xl text-zinc-300 w-8 text-right flex-shrink-0">
        #{entry.master_rating_ranking}
      </span>
      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
        <Image
          src={getCharacterImageUrl(charSlug)}
          alt={entry.character_name}
          fill
          className="object-cover object-top"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <Link
          href={`/player/${banner.personal_info.short_id}`}
          prefetch={false}
          className="font-semibold text-zinc-100 hover:text-white transition-colors leading-tight truncate block"
        >
          {banner.personal_info.fighter_id}
        </Link>
        <p className="text-xs text-zinc-300">{entry.rating} MR</p>
      </div>
      {rank && (
        <div className="relative flex-shrink-0" style={{ width: 80, height: 50 }}>
          <Image
            src={getRankImageUrl(rankId)}
            alt={rank.name}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      )}
    </div>
  )
}

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10))

  const data = await getRanking(page)
  const players = data?.ranking_fighter_list ?? []
  const totalPages = data?.total_page ?? 1

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Master Ranking</h1>
        <span className="text-sm text-zinc-300">Page {page}</span>
      </div>

      {players.length === 0 ? (
        <p className="text-zinc-300">No ranking data available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {players.map((entry) => (
            <RankingCard
              key={`${entry.master_rating_ranking}-${entry.fighter_banner_info.personal_info.short_id}`}
              entry={entry}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-4 pt-2">
        {page > 1 ? (
          <Link
            href={`/ranking?page=${page - 1}`}
            className="px-4 py-2 rounded-md border border-zinc-700 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
          >
            ← Previous
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-md border border-zinc-800 text-sm text-zinc-300 cursor-not-allowed">
            ← Previous
          </span>
        )}

        {page < totalPages ? (
          <Link
            href={`/ranking?page=${page + 1}`}
            className="px-4 py-2 rounded-md border border-zinc-700 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
          >
            Next →
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-md border border-zinc-800 text-sm text-zinc-300 cursor-not-allowed">
            Next →
          </span>
        )}
      </div>
    </div>
  )
}
