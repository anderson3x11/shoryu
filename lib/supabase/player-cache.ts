import { supabase } from './client'
import { getPlayerProfileResult, type PlayerProfileResult } from '@/lib/buckler/client'
import type { BucklerProfilePage } from '@/lib/buckler'

// TTL for a stored profile before a visit triggers a fresh Buckler fetch. Within this window
// every /player/[id] view is served from Supabase, so traffic no longer maps to Buckler load.
const TTL_MS = 12 * 60 * 60 * 1000

interface CachedProfile {
  profile: BucklerProfilePage
  fetchedAt: number
}

async function readCached(playerId: number): Promise<CachedProfile | null> {
  const { data } = await supabase
    .from('player_profiles')
    .select('profile, fetched_at')
    .eq('player_id', playerId)
    .maybeSingle()
  if (!data) return null
  return { profile: data.profile as BucklerProfilePage, fetchedAt: new Date(data.fetched_at).getTime() }
}

async function writeCached(playerId: number, profile: BucklerProfilePage) {
  await supabase
    .from('player_profiles')
    .upsert({ player_id: playerId, profile, fetched_at: new Date().toISOString() }, { onConflict: 'player_id' })
}

// DB-cached wrapper around getPlayerProfileResult. Returns the stored profile when it is fresh
// (or when Buckler is down but we have any stored copy), otherwise fetches once and stores it.
// `force` bypasses the TTL — used by the manual refresh route.
export async function getCachedPlayerProfile(
  shortId: string | number,
  force = false,
): Promise<PlayerProfileResult> {
  const numId = Number(shortId)
  const hasNumId = Number.isFinite(numId)
  const cached = hasNumId ? await readCached(numId) : null

  if (!force && cached && Date.now() - cached.fetchedAt < TTL_MS) {
    return { status: 'ok', profile: cached.profile }
  }

  const live = await getPlayerProfileResult(shortId)
  if (live.status === 'ok') {
    if (hasNumId) await writeCached(numId, live.profile)
    return live
  }
  // Buckler unreachable (e.g. dead cookie) but we have a stored copy → serve it stale rather
  // than an error screen. A positive "notfound" still falls through unchanged.
  if (live.status === 'unavailable' && cached) {
    return { status: 'ok', profile: cached.profile }
  }
  return live
}

// When the profile was last refreshed, in ms since epoch, or null if never cached.
// Used by the refresh route to rate-limit forced refreshes.
export async function getProfileFetchedAt(playerId: number): Promise<number | null> {
  const cached = await readCached(playerId)
  return cached?.fetchedAt ?? null
}
