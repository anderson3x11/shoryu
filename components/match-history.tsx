import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RankIcon } from '@/components/rank-icon'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import type { BucklerBattle } from '@/lib/buckler'
import { getBattleWinner } from '@/lib/buckler'
import { cn } from '@/lib/utils'

interface MatchHistoryProps {
  battles: BucklerBattle[]
  currentShortId: number | string
}

export function MatchHistory({ battles, currentShortId }: MatchHistoryProps) {
  if (battles.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Match History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 text-sm">No recent matches found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Match History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {battles.map((battle) => {
          const sid = Number(currentShortId)
          const isP1 = battle.player1_info.player.short_id === sid
          const me = isP1 ? battle.player1_info : battle.player2_info
          const opp = isP1 ? battle.player2_info : battle.player1_info
          const winner = getBattleWinner(battle)
          const won = (isP1 && winner === 1) || (!isP1 && winner === 2)

          const mySlug = me.playing_character_tool_name
          const oppSlug = opp.playing_character_tool_name

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
              className={cn(
                'flex items-center gap-3 px-4 py-3 border-l-4 hover:bg-zinc-800/50 transition-colors',
                won ? 'border-emerald-500' : 'border-red-500'
              )}
            >
              <span className={cn('text-xs font-bold w-6 flex-shrink-0', won ? 'text-emerald-400' : 'text-red-400')}>
                {won ? 'W' : 'L'}
              </span>

              {/* My character */}
              <div className="relative w-10 h-10 rounded bg-zinc-800 overflow-hidden flex-shrink-0">
                {mySlug && (
                  <Image src={getCharacterImageUrl(mySlug)} alt={me.playing_character_name} fill className="object-cover object-top" unoptimized />
                )}
              </div>

              {/* Score */}
              <span className="text-xs font-bold text-zinc-400 flex-shrink-0 tabular-nums">
                {rounds.won} – {rounds.lost}
              </span>

              {/* Opponent character */}
              <div className="relative w-10 h-10 rounded bg-zinc-800 overflow-hidden flex-shrink-0">
                {oppSlug && (
                  <Image src={getCharacterImageUrl(oppSlug)} alt={opp.playing_character_name} fill className="object-cover object-top" unoptimized />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/player/${opp.player.short_id}`}
                  className="text-sm font-medium text-zinc-200 hover:text-white truncate block"
                >
                  {opp.player.fighter_id}
                </Link>
                <p className="text-xs text-zinc-500 truncate">
                  {opp.playing_character_name}
                  {battle.replay_battle_type_name && ` · ${battle.replay_battle_type_name}`}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <RankIcon rankId={opp.league_rank} size={36} showMR={false} />
                {date && <span className="text-[10px] text-zinc-600">{date}</span>}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
