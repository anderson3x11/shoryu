import { notFound } from 'next/navigation'
import { getPlayerProfile, getBattleLog } from '@/lib/buckler'
import { PlayerHeader } from '@/components/player-header'
import { CharacterStats, type PhaseData } from '@/components/character-stats'
import { PlayCounts } from '@/components/play-counts'
import { MatchHistory } from '@/components/match-history'
import { MatchupChart } from '@/components/matchup-chart'

interface PlayerPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const { id } = await params
  const profile = await getPlayerProfile(id)
  const name = profile?.fighter_banner_info?.personal_info?.fighter_id ?? id
  return { title: `${name} - Shoryu` }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { id } = await params

  const [profile, rankLog, casualLog, hubLog, customLog] = await Promise.all([
    getPlayerProfile(id),
    getBattleLog(id, 1, 'rank'),
    getBattleLog(id, 1, 'casual'),
    getBattleLog(id, 1, 'hub'),
    getBattleLog(id, 1, 'custom'),
  ])

  const allBattles = [
    ...(rankLog?.replay_list ?? []),
    ...(casualLog?.replay_list ?? []),
    ...(hubLog?.replay_list ?? []),
    ...(customLog?.replay_list ?? []),
  ].sort((a, b) => b.uploaded_at - a.uploaded_at).slice(0, 10)

  const allTotalPages = Math.max(
    rankLog?.total_page ?? 1,
    casualLog?.total_page ?? 1,
    hubLog?.total_page ?? 1,
    customLog?.total_page ?? 1,
  )

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Relative wrapper with no in-flow content → row height = PlayCounts height */}
        <div className="relative">
          <CharacterStats phases={phases} />
        </div>
        {profile.play && <PlayCounts playData={profile.play} />}
      </div>

      <MatchupChart playerId={String(shortId)} />

      <MatchHistory
        initialBattles={allBattles}
        initialTotalPages={allTotalPages}
        currentShortId={shortId}
        playerId={String(shortId)}
      />
    </div>
  )
}
