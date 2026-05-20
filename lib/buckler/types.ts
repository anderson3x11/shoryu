// Buckler data is scraped from __NEXT_DATA__ on page HTML.
// Field names match the actual API responses.

export interface BucklerLeagueInfo {
  league_point: number
  league_rank: number
  master_league: number
  master_rating: number
  master_rating_ranking: number
  league_rank_info?: {
    league_rank_name: string
    league_rank_number: number
  }
}

export interface BucklerPersonalInfo {
  fighter_id: string     // CFN / display name
  short_id: number       // Numeric player ID used in profile URLs
  platform_id: number
  platform_name: string
  platform_tool_name: string
}

// The "fighter banner" is the player card shown on search results and profile pages
export interface BucklerFighterBanner {
  personal_info: BucklerPersonalInfo
  favorite_character_id: number
  favorite_character_name: string
  favorite_character_tool_name: string  // slug for character image URL
  favorite_character_league_info: BucklerLeagueInfo
  favorite_character_play_point: {
    battle_hub: number
    fighting_ground: number
    world_tour: number
  }
  home_id: number
  home_name: string           // country / region name
  title_data: {
    title_data_id: number
    title_data_val: string    // title plate text
    title_data_grade_name: string
  }
  last_play_at: number        // Unix timestamp
  online_status_info: {
    online_status: number     // 1 = offline, 2 = online
    online_status_data: {
      online_status_name: string
      online_status_type: number
    }
  }
  enjoy_total_point: number
}

// Profile page pageProps
export interface BucklerProfilePage {
  fighter_banner_info: BucklerFighterBanner
  play: BucklerPlayData
  sid: number
}

export interface BucklerPlayData {
  base_info: {
    content_play_time_list: Array<{
      content_type: number
      play_time: number     // seconds
      content_type_name: string
    }>
    enjoy_fight_point: number
    enjoy_total_point: number
  }
  battle_stats: {
    rank_match_play_count: number
    casual_match_play_count: number
    battle_hub_match_play_count: number
    custom_room_match_play_count: number
    total_all_character_play_point: number
  }
  character_league_infos: Array<{
    character_id: number
    is_played: boolean
    league_info: BucklerLeagueInfo
  }>
}

// Battle log player in a replay
export interface BucklerBattlePlayerInfo {
  player: BucklerPersonalInfo
  character_id: number
  character_name: string
  character_tool_name: string         // character slug (at time of profile)
  playing_character_id: number
  playing_character_name: string
  playing_character_tool_name: string // slug for the character used in THIS match
  league_rank: number
  league_point: number
  master_league: number
  master_rating: number
  round_results: number[]  // 0=loss for this player, 1+=win for this player, per round
  home_id: number
  title_data?: {
    title_data_val: string
  }
}

// A single battle/replay entry
export interface BucklerBattle {
  replay_id: string
  uploaded_at: number      // Unix timestamp
  player1_info: BucklerBattlePlayerInfo
  player2_info: BucklerBattlePlayerInfo
  replay_battle_type: number
  replay_battle_type_name: string
  battle_version: number
}

// Battle log page pageProps
export interface BucklerBattleLogPage {
  fighter_banner_info: BucklerFighterBanner
  replay_list: BucklerBattle[]
  current_page: number
  total_page: number
  sid: number
}

// Search results page pageProps
export interface BucklerSearchPage {
  fighter_banner_list: BucklerFighterBanner[]
  search_params: Record<string, unknown>
  page: number
}

// Determine who won a battle
export function getBattleWinner(battle: BucklerBattle): 1 | 2 | null {
  const p1wins = battle.player1_info.round_results.filter(r => r > 0).length
  const p2wins = battle.player2_info.round_results.filter(r => r > 0).length
  if (p1wins > p2wins) return 1
  if (p2wins > p1wins) return 2
  return null
}
