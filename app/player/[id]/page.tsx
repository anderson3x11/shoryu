import { notFound } from 'next/navigation'
import { getPlayerProfile } from '@/lib/buckler'
import { PlayerHeader } from '@/components/player-header'
import { CharacterStats, type PhaseData } from '@/components/character-stats'
import { PlayCounts } from '@/components/play-counts'
import { PlayerTabs } from '@/components/player-tabs'

export const revalidate = 300

interface PlayerPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const { id } = await params
  const profile = await getPlayerProfile(id)
  const name = profile?.fighter_banner_info?.personal_info?.fighter_id ?? id
  return { title: name }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params

  // Overview only needs the profile. Battle logs / LP-MR history / matchups are fetched
  // client-side, lazily, when the Recent Battles or Stats tab is first opened.
  const profile = await getPlayerProfile(id)

  if (!profile) notFound()

  const banner = profile.fighter_banner_info
  const shortId = banner?.personal_info?.short_id ?? id

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
