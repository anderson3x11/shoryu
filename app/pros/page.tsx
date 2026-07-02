import Link from 'next/link'
import Image from 'next/image'
import { getProPlayer, type ProPlayer } from '@/lib/data/pro-players'
import { getProSnapshot } from '@/lib/supabase/snapshots'
import { ServiceUnavailable } from '@/components/service-unavailable'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import { getRankImageUrl, getRank, getEffectiveRankId } from '@/lib/constants/ranks'
import type { BucklerFighterBanner } from '@/lib/buckler'

export const revalidate = 300

export const metadata = {
  title: 'Pro Players & Creators',
  description: 'Top Street Fighter 6 pro players and content creators with their Buckler profiles.',
}

function ProCard({ player, banner }: { player: ProPlayer; banner: BucklerFighterBanner | null }) {
  const charSlug = banner?.favorite_character_tool_name
  const li = banner?.favorite_character_league_info
  const rankId = li
    ? getEffectiveRankId(li.league_rank, li.master_league ?? 0, li.master_rating_ranking, li.master_rating)
    : null
  const rank = rankId != null ? getRank(rankId) : null

  return (
    <div className="flex items-center gap-3 rounded-none border border-zinc-800 bg-zinc-900 px-4 py-3 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors">

      {/* Character portrait — links to profile */}
      <Link href={`/player/${player.short_id}`} prefetch={false} className="relative w-12 h-12 rounded-none overflow-hidden bg-zinc-800 flex-shrink-0 block">
        {charSlug && (
          <Image
            src={getCharacterImageUrl(charSlug)}
            alt={banner?.favorite_character_name ?? ''}
            fill
            className="object-cover object-top"
            unoptimized
          />
        )}
      </Link>

      {/* Name + socials */}
      <div className="flex-1 min-w-0 space-y-1">
        <Link href={`/player/${player.short_id}`} prefetch={false} className="font-semibold text-zinc-100 hover:text-white transition-colors leading-tight truncate block">
          {player.name}
        </Link>
        <div className="flex items-center gap-1.5 flex-wrap">
          {player.twitch && (
            <a href={`https://twitch.tv/${player.twitch}`} target="_blank" rel="noopener noreferrer"
              className="text-xs px-2 py-0.5 rounded-none bg-purple-900/60 text-purple-300 hover:bg-purple-800/60 transition-colors">
              Twitch
            </a>
          )}
          {player.twitter && (
            <a href={`https://x.com/${player.twitter}`} target="_blank" rel="noopener noreferrer"
              className="text-xs px-2 py-0.5 rounded-none bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-colors">
              Twitter
            </a>
          )}
          {player.youtube && (
            <a href={`https://youtube.com/@${player.youtube}`} target="_blank" rel="noopener noreferrer"
              className="text-xs px-2 py-0.5 rounded-none bg-red-900/60 text-red-300 hover:bg-red-800/60 transition-colors">
              YouTube
            </a>
          )}
        </div>
      </div>

      {/* Rank icon */}
      {rankId && rank && (
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

export default async function ProsPage() {
  // Banners come from the twice-daily sync snapshot in Supabase, not a live Buckler fetch —
  // this page used to fire one request per pro on every render. If the snapshot is missing
  // (sync never ran), show the retry-later fallback. Order follows PRO_PLAYERS.
  const snapshot = await getProSnapshot()
  if (!snapshot) return <ServiceUnavailable />

  const withProfiles: { player: ProPlayer; banner: BucklerFighterBanner | null }[] = snapshot
    .map(({ short_id, banner }) => {
      const player = getProPlayer(short_id)
      return player ? { player, banner } : null
    })
    .filter((x): x is { player: ProPlayer; banner: BucklerFighterBanner | null } => x !== null)

  const pros     = withProfiles.filter(({ player }) => player.category === 'pro')
  const creators = withProfiles.filter(({ player }) => player.category === 'creator')

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="block w-2 h-10 sm:h-12 -skew-x-12 bg-amber-400 shrink-0" />
        <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Pro Players & Creators</h1>
      </div>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Pro Players</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pros.map(({ player, banner }) => (
            <ProCard key={player.short_id} player={player} banner={banner} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Content Creators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {creators.map(({ player, banner }) => (
            <ProCard key={player.short_id} player={player} banner={banner} />
          ))}
        </div>
      </section>
    </div>
  )
}
