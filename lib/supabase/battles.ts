import { supabase } from './client'
import { getBattleLog, getBattleWinner } from '@/lib/buckler'
import type { BucklerBattle } from '@/lib/buckler'

export interface DBBattle {
  replay_id: string
  player_id: number
  char_id: number
  opp_player_id: number
  opp_char_id: number
  result: number       // 1=win, 0=loss
  mode: string
  lp_after: number     // league_point at time of match (>= 25000 means master)
  mr_after: number     // master_rating at time of match (0 if not master)
  played_at: string    // ISO timestamp
}

async function getLatestBattleAt(playerId: number): Promise<number | null> {
  const { data } = await supabase
    .from('battles')
    .select('played_at')
    .eq('player_id', playerId)
    .eq('mode', 'rank')
    .order('played_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data ? Math.floor(new Date(data.played_at).getTime() / 1000) : null
}

async function insertBattles(playerId: number, sid: number, battles: BucklerBattle[]) {
  if (battles.length === 0) return

  const rows = battles
    .filter(b => b.player1_info?.playing_character_id && b.player2_info?.playing_character_id && b.player1_info.league_point >= 0 && b.player2_info.league_point >= 0)
    .map(b => {
      const isP1 = b.player1_info.player.short_id === sid
      const me  = isP1 ? b.player1_info : b.player2_info
      const opp = isP1 ? b.player2_info : b.player1_info
      const winner = getBattleWinner(b)
      const won = winner !== null && ((isP1 && winner === 1) || (!isP1 && winner === 2))
      return {
        replay_id:     b.replay_id,
        player_id:     playerId,
        char_id:       me.playing_character_id,
        opp_player_id: opp.player.short_id,
        opp_char_id:   opp.playing_character_id,
        result:        won ? 1 : 0,
        mode:          'rank',
        lp_after:      me.league_point ?? 0,
        mr_after:      me.master_rating ?? 0,
        played_at:     new Date(b.uploaded_at * 1000).toISOString(),
      }
    })

  await supabase.from('battles').upsert(rows, { onConflict: 'replay_id', ignoreDuplicates: true })
  const firstName = battles[0]
  const firstMe = firstName.player1_info.player.short_id === sid ? firstName.player1_info : firstName.player2_info
  await supabase.from('players').upsert(
    { player_id: playerId, fighter_id: firstMe.player.fighter_id, last_synced_at: new Date().toISOString() },
    { onConflict: 'player_id' }
  )
}

// Called by matchups and lp-history routes.
// First visit: full sync up to 10 pages. Subsequent visits: incremental (usually 1 page).
// Returns all ranked battles from DB for this player.
export async function syncAndGetRankedBattles(playerId: string, sid: number): Promise<DBBattle[]> {
  const numId = Number(playerId)
  const latestAt = await getLatestBattleAt(numId)

  if (latestAt === null) {
    // First time — fetch all available pages up to cap
    const first = await getBattleLog(playerId, 1, 'rank')
    const totalPages = Math.min(first?.total_page ?? 1, 10)
    const rest = totalPages > 1
      ? await Promise.all(Array.from({ length: totalPages - 1 }, (_, i) => getBattleLog(playerId, i + 2, 'rank')))
      : []
    await insertBattles(numId, sid, [
      ...(first?.replay_list ?? []),
      ...rest.flatMap(p => p?.replay_list ?? []),
    ])
  } else {
    // Incremental — scan until we hit battles already in DB (usually just page 1)
    const fresh: BucklerBattle[] = []
    for (let page = 1; page <= 3; page++) {
      const data = await getBattleLog(playerId, page, 'rank')
      if (!data?.replay_list?.length) break
      const newOnes = data.replay_list.filter(b => b.uploaded_at > latestAt)
      fresh.push(...newOnes)
      if (newOnes.length < data.replay_list.length || page >= data.total_page) break
    }
    await insertBattles(numId, sid, fresh)
  }

  const { data } = await supabase
    .from('battles')
    .select('*')
    .eq('player_id', numId)
    .eq('mode', 'rank')
    .order('played_at', { ascending: true })

  return (data ?? []) as DBBattle[]
}
