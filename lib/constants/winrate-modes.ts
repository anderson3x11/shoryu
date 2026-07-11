// Battle-mode filter for the win-rate data (Overview character list + Stats matchup chart).
// IDs match Buckler's play/act targetModeId. Mode 1 is what the profile payload carries; the
// others are lazy-fetched from /api/winrates. No Extreme battle mode — Buckler doesn't offer it.
// Same labels and order as the Match History mode tabs.
export const WINRATE_MODES = [
  { id: 1, label: 'All' },
  { id: 2, label: 'Ranked' },
  { id: 3, label: 'Casual' },
  { id: 5, label: 'Battle Hub' },
  { id: 4, label: 'Custom Room' },
] as const

export type WinrateModeId = (typeof WINRATE_MODES)[number]['id']

// The Overview and Stats toggles share one persisted preference (a tiny external store backed by
// localStorage, read via useSyncExternalStore), so both selects stay in sync and a player who
// cares about ranked-only sees ranked everywhere on their next visit.
const STORAGE_KEY = 'winrate-mode'
const listeners = new Set<() => void>()
let current: WinrateModeId | null = null

function isModeId(v: number): v is WinrateModeId {
  return WINRATE_MODES.some((m) => m.id === v)
}

export function getWinrateMode(): WinrateModeId {
  if (current != null) return current
  if (typeof window === 'undefined') return 1
  const v = Number(window.localStorage.getItem(STORAGE_KEY))
  current = isModeId(v) ? v : 1
  return current
}

// Server snapshot for useSyncExternalStore: SSR always renders "All Modes".
export function getServerWinrateMode(): WinrateModeId {
  return 1
}

export function setWinrateMode(id: WinrateModeId) {
  current = id
  try {
    window.localStorage.setItem(STORAGE_KEY, String(id))
  } catch {
    // storage full / privacy mode — the in-memory value still works for this visit
  }
  for (const l of listeners) l()
}

export function subscribeWinrateMode(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
