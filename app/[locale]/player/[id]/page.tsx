import { cache } from 'react'
import Link from 'next/link'
import { DEFAULT_LOCALE, isLocale, localeHref } from '@/lib/i18n/locales'
import { getDict } from '@/lib/i18n/dict'
import { notFound } from 'next/navigation'
import { getCachedPlayerProfile } from '@/lib/supabase/player-cache'
import { ServiceUnavailable } from '@/components/service-unavailable'
import { PlayerHeader } from '@/components/player-header'
import { RefreshProfileButton } from '@/components/refresh-profile-button'
import { CharacterStats, type PhaseData } from '@/components/character-stats'
import { PlayCounts } from '@/components/play-counts'
import { PlayerTabs } from '@/components/player-tabs'
import { SeasonBar } from '@/components/season-bar'

export const revalidate = 600

// Dedupe the profile read across generateMetadata + the page render: React cache() memoizes it
// for the request, so a single view is one Supabase hit (and at most one Buckler fetch on a miss).
const getProfile = cache((id: string) => getCachedPlayerProfile(id))

interface PlayerPageProps {
  params: Promise<{ id: string; locale: string }>
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const { id } = await params
  const result = await getProfile(id)
  const name = result.status === 'ok'
    ? result.profile.fighter_banner_info?.personal_info?.fighter_id ?? id
    : id
  return { title: name }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id, locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE

  // Overview only needs the profile. Battle logs / LP-MR history / matchups are fetched
  // client-side, lazily, when the Recent Battles or Stats tab is first opened.
  // Served from the Supabase profile cache (12h TTL) — see getCachedPlayerProfile.
  const result = await getProfile(id)

  // Cookie expired / Buckler down: show a retry-later fallback instead of a 404 that would
  // read like the player doesn't exist.
  if (result.status === 'unavailable') return <ServiceUnavailable />
  if (result.status === 'notfound') notFound()
  const profile = result.profile

  const banner = profile.fighter_banner_info
  const shortId = banner?.personal_info?.short_id ?? id

  // Age of the copy being shown (just now when this view refetched it), for the Refresh button.
  const fetchedAt = result.fetchedAt ?? null

  // Build phase list — currently only one phase available from profile page.
  // When Buckler exposes per-phase endpoints, add more PhaseData entries here.
  const phases: PhaseData[] = profile.play
    ? [{ id: 'current', label: 'Current', chars: profile.play.character_league_infos ?? [] }]
    : []

  return (
    <div className="space-y-4">
      <PlayerTabs
        playerId={String(shortId)}
        shortId={shortId}
        header={<PlayerHeader banner={banner} />}
        action={
          <div className="flex items-center gap-2">
            <Link
              href={localeHref(locale, `/compare?a=${shortId}`)}
              prefetch={false}
              className="rounded-none border border-zinc-700 px-2 sm:px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
            >
              {getDict(locale).compare.button}
            </Link>
            <RefreshProfileButton playerId={String(shortId)} fetchedAt={fetchedAt} />
          </div>
        }
        seasonBar={profile.play?.current_season_id != null && (
          <SeasonBar
            playerId={String(shortId)}
            seasonIds={profile.play.season_ids ?? [profile.play.current_season_id]}
            current={profile.play.current_season_id}
          />
        )}
        overview={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Relative wrapper: min-height on mobile (absolute child has no intrinsic height), desktop row height = PlayCounts height */}
            <div className="relative min-h-[360px] md:min-h-0">
              <CharacterStats playerId={String(shortId)} phases={phases} winRates={profile.play?.character_win_rates} />
            </div>
            {profile.play && <PlayCounts playData={profile.play} />}
          </div>
        }
      />
    </div>
  )
}
