import { notFound } from 'next/navigation'
import { getPlayerProfile, getBattleLog } from '@/lib/buckler'
import { PlayerHeader } from '@/components/player-header'
import { CharacterStats, type PhaseData } from '@/components/character-stats'
import { PlayCounts } from '@/components/play-counts'
import { MatchHistory } from '@/components/match-history'

interface PlayerPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const { id } = await params
  const profile = await getPlayerProfile(id)
  const name = profile?.fighter_banner_info?.personal_info?.fighter_id ?? id
  return { title: `${name} - USF6` }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params

  const [profile, battleLog] = await Promise.all([
    getPlayerProfile(id),
    getBattleLog(id),
  ])

  if (!profile) notFound()

  const banner = profile.fighter_banner_info
  const shortId = banner?.personal_info?.short_id ?? id

  // Build phase list — currently only one phase available from profile page.
  // When Buckler exposes per-phase endpoints, add more PhaseData entries here.
  const phases: PhaseData[] = profile.play
    ? [{ id: 'current', label: 'Current', chars: profile.play.character_league_infos ?? [] }]
    : []

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <PlayerHeader banner={banner} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <CharacterStats phases={phases} />
        {profile.play && <PlayCounts playData={profile.play} />}
      </div>

      <MatchHistory
        battles={battleLog?.replay_list ?? []}
        currentShortId={shortId}
      />
    </div>
  )
}
