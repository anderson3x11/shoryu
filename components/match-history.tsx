import Image from 'next/image'
import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/card'
import { getRankImageUrl } from '@/lib/constants/ranks'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import type { BucklerBattle } from '@/lib/buckler'
import { getBattleWinner } from '@/lib/buckler'
import { cn } from '@/lib/utils'

interface MatchHistoryProps {
  battles: BucklerBattle[]
  currentShortId: number | string
}

const MATCH_TYPE_LABELS: Record<string, string> = {
  'Ranked Match':      'Ranked',
  'Casual Match':      'Casual',
  'Battle Hub Match':  'Battle Hub',
  'Custom Room Match': 'Custom Room',
}

export function MatchHistory({ battles, currentShortId }: MatchHistoryProps) {
  if (battles.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800 py-0 gap-0">
        <div className="px-4 pt-4 pb-3">
          <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Match History</CardTitle>
        </div>
        <div className="px-4 pb-4">
          <p className="text-zinc-500 text-sm">No recent matches found</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 py-0 gap-0">
      <div className="px-4 pt-4 pb-3">
        <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Match History</CardTitle>
      </div>

      <div className="divide-y divide-zinc-800/60">
        {battles.map((battle) => {
          const sid = Number(currentShortId)
          const isP1 = battle.player1_info.player.short_id === sid
          const me = isP1 ? battle.player1_info : battle.player2_info
          const opp = isP1 ? battle.player2_info : battle.player1_info
          const winner = getBattleWinner(battle)
          const won = (isP1 && winner === 1) || (!isP1 && winner === 2)

          const mySlug = me.playing_character_tool_name
          const oppSlug = opp.playing_character_tool_name

          const matchType = MATCH_TYPE_LABELS[battle.replay_battle_type_name] ?? battle.replay_battle_type_name

          const date = battle.uploaded_at
            ? new Date(battle.uploaded_at * 1000).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric',
              })
            : null

          const rounds = {
            won: me.round_results.filter(r => r > 0).length,
            lost: opp.round_results.filter(r => r > 0).length,
          }

          return (
            <div
              key={battle.replay_id}
              className="relative flex items-center gap-4 px-4 py-3.5 hover:bg-zinc-800/40 transition-colors"
            >
              {/* Left accent bar — absolute so border-color doesn't bleed into divide-y borders */}
              <div className={cn('absolute left-0 top-0 bottom-0 w-1', won ? 'bg-emerald-500' : 'bg-red-500')} />

              {/* W/L */}
              <span className={cn('text-sm font-bold w-5 text-center flex-shrink-0', won ? 'text-emerald-400' : 'text-red-400')}>
                {won ? 'W' : 'L'}
              </span>

              {/* My character */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                {mySlug && (
                  <Image
                    src={getCharacterImageUrl(mySlug)}
                    alt={me.playing_character_name}
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                )}
              </div>

              {/* Score */}
              <span className="text-sm font-bold text-zinc-400 flex-shrink-0 tabular-nums w-10 text-center">
                {rounds.won}–{rounds.lost}
              </span>

              {/* Opponent character */}
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                {oppSlug && (
                  <Image
                    src={getCharacterImageUrl(oppSlug)}
                    alt={opp.playing_character_name}
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                )}
              </div>

              {/* Opponent info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/player/${opp.player.short_id}`}
                  className="text-base font-bold text-zinc-100 hover:text-white truncate block leading-tight"
                >
                  {opp.player.fighter_id}
                </Link>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {opp.playing_character_name}
                  {matchType && <span className="text-zinc-600"> · {matchType}</span>}
                </p>
              </div>

              {/* Rank centered, date pinned to bottom-right */}
              <div className="self-stretch flex-shrink-0 relative flex items-center justify-end" style={{ width: 80 }}>
                <div className="relative" style={{ width: 80, height: 40 }}>
                  <Image
                    src={getRankImageUrl(opp.league_rank)}
                    alt=""
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                {date && (
                  <span className="absolute bottom-0 right-0 text-[10px] text-zinc-600 tabular-nums">
                    {date}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
