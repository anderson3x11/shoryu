export interface Rank {
  id: number
  name: string
  tier: string
  strength: number
}

// Confirmed from Buckler ranking filter:
// Rookie 1-5 (1-5), Iron 1-5 (6-10), Bronze 1-5 (11-15),
// Silver 1-5 (16-20), Gold 1-5 (21-25), Platinum 1-5 (26-30),
// Diamond 1-5 (31-35), Master (36), Legend (37),
// New Challenger (39), High Master (40), Grand Master (41), Ultimate Master (42)
function buildRanks(): Record<number, Rank> {
  const tiers = [
    { tier: 'rookie',   name: 'Rookie',   start: 1,  count: 5 },
    { tier: 'iron',     name: 'Iron',     start: 6,  count: 5 },
    { tier: 'bronze',   name: 'Bronze',   start: 11, count: 5 },
    { tier: 'silver',   name: 'Silver',   start: 16, count: 5 },
    { tier: 'gold',     name: 'Gold',     start: 21, count: 5 },
    { tier: 'platinum', name: 'Platinum', start: 26, count: 5 },
    { tier: 'diamond',  name: 'Diamond',  start: 31, count: 5 },
  ]
  const result: Record<number, Rank> = {}
  for (const { tier, name, start, count } of tiers) {
    for (let i = 0; i < count; i++) {
      const id = start + i
      result[id] = { id, name: `${name} ${i + 1}`, tier, strength: id }
    }
  }
  result[36] = { id: 36, name: 'Master',           tier: 'master',          strength: 36 }
  result[37] = { id: 37, name: 'Legend',            tier: 'legend',          strength: 50 }
  result[39] = { id: 39, name: 'New Challenger',    tier: 'new_challenger',  strength: 0  }
  result[40] = { id: 40, name: 'High Master',       tier: 'high_master',     strength: 40 }
  result[41] = { id: 41, name: 'Grand Master',      tier: 'grand_master',    strength: 45 }
  result[42] = { id: 42, name: 'Ultimate Master',   tier: 'ultimate_master', strength: 48 }
  return result
}

export const RANKS = buildRanks()

export function getRankImageUrl(rankId: number): string {
  return `/ranks/rank${rankId}.png`
}

export function getRank(rankId: number): Rank {
  return RANKS[rankId] ?? { id: rankId, name: 'Unknown', tier: 'unknown', strength: 0 }
}

// Master sub-tier thresholds by MR. Legend = top 500 by global ranking.
export function getEffectiveRankId(
  leagueRank: number,
  _masterLeague: number,
  masterRatingRanking: number = 0,
  masterRating: number = 0
): number {
  if (leagueRank !== 36) return leagueRank
  if (masterRatingRanking >= 1 && masterRatingRanking <= 500) return 37 // Legend
  if (masterRating >= 1800) return 42 // Ultimate Master
  if (masterRating >= 1700) return 41 // Grand Master
  if (masterRating >= 1600) return 40 // High Master
  return 36 // Master
}

export function showsMasterRating(rankId: number): boolean {
  return rankId >= 36
}

export const TIER_COLORS: Record<string, string> = {
  rookie:          '#9e9e9e',
  iron:            '#a0714e',
  bronze:          '#cd7f32',
  silver:          '#c0c0c0',
  gold:            '#ffd700',
  platinum:        '#00bcd4',
  diamond:         '#4fc3f7',
  master:          '#a855f7',
  high_master:     '#c084fc',
  grand_master:    '#e879f9',
  ultimate_master: '#f472b6',
  legend:          '#f97316',
  new_challenger:  '#64748b',
  unknown:         '#3f3f46',
}
