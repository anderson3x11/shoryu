// The phase (Buckler season) a player profile is showing: null = the current one. Shared by the
// Overview character list, the season bar and the Stats matchup chart through a tiny external
// store read with useSyncExternalStore. Scoped to one player, so opening another profile starts
// back on the current phase; not persisted, an old phase is a one-off look back.
const listeners = new Set<() => void>()
let state: { playerId: string; season: number | null } = { playerId: '', season: null }

export function getSeason(playerId: string): number | null {
  return state.playerId === playerId ? state.season : null
}

export function setSeason(playerId: string, season: number | null) {
  state = { playerId, season }
  for (const l of listeners) l()
}

export function subscribeSeason(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
