import { getCachedPlayerProfile, getProfileFetchedAt } from '@/lib/supabase/player-cache'

// Manual "Refresh" for a player profile: forces one Buckler fetch (bypassing the 12h cache)
// and updates the stored copy. Rate-limited to once per 5 min per player to stop the button
// from being used to hammer Buckler.
const MIN_INTERVAL_MS = 5 * 60 * 1000

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const numId = Number(id)
  if (!Number.isFinite(numId)) return Response.json({ error: 'bad id' }, { status: 400 })

  const fetchedAt = await getProfileFetchedAt(numId)
  if (fetchedAt && Date.now() - fetchedAt < MIN_INTERVAL_MS) {
    return Response.json({ error: 'Too soon' }, { status: 429 })
  }

  const result = await getCachedPlayerProfile(id, true)
  if (result.status === 'unavailable') return Response.json({ error: 'unavailable' }, { status: 503 })
  if (result.status === 'notfound') return Response.json({ error: 'notfound' }, { status: 404 })
  return Response.json({ ok: true })
}
