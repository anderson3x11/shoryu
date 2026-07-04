import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getCachedPlayerProfile } from '@/lib/supabase/player-cache'
import { ServiceUnavailable } from '@/components/service-unavailable'
import { PlayerHeader } from '@/components/player-header'
import { RefreshProfileButton } from '@/components/refresh-profile-button'
import { CharacterStats, type PhaseData } from '@/components/character-stats'
import { PlayCounts } from '@/components/play-counts'
import { PlayerTabs } from '@/components/player-tabs'

export const revalidate = 600

// Dedupe the profile read across generateMetadata + the page render: React cache() memoizes it
// for the request, so a single view is one Supabase hit (and at most one Buckler fetch on a miss).
const getProfile = cache((id: string) => getCachedPlayerProfile(id))

interface PlayerPageProps {
  params: Promise<{ id: string }>
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
  const { id } = await params

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

  // Build phase list — currently only one phase available from profile page.
  // When Buckler exposes per-phase endpoints, add more PhaseData entries here.
  const phases: PhaseData[] = profile.play
    ? [{ id: 'current', label: 'Current', chars: profile.play.character_league_infos ?? [] }]
    : []

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <RefreshProfileButton playerId={String(shortId)} />
      </div>
      <PlayerTabs
        playerId={String(shortId)}
        shortId={shortId}
        header={<PlayerHeader banner={banner} />}
        overview={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Relative wrapper: min-height on mobile (absolute child has no intrinsic height), desktop row height = PlayCounts height */}
            <div className="relative min-h-[360px] md:min-h-0">
              <CharacterStats phases={phases} winRates={profile.play?.character_win_rates} />
            </div>
            {profile.play && <PlayCounts playData={profile.play} />}
          </div>
        }
      />
    </div>
  )
}
