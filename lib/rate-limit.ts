// Per-client rate limit for the API routes that can reach Buckler. Every Buckler call shares one
// paced queue (~1 request/s for the whole site), so without this a single client looping over
// random player IDs could fill the queue and stall every other visitor.
//
// In-memory fixed window: fine for a single `next start` process. It resets on redeploy and is
// not shared between instances, which is acceptable for a limit meant to stop floods, not to
// meter usage precisely.
const WINDOW_MS = 60_000
// A profile visit costs ~3 calls, each search keystroke (debounced) one more. 60/min leaves a
// real user plenty of headroom.
const MAX_REQUESTS = 60

const hits = new Map<string, { count: number; resetAt: number }>()

// The reverse proxy appends the address it actually saw to X-Forwarded-For, so the rightmost
// entry is the one a client can't forge. Leftmost entries are whatever the client sent.
function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',').at(-1)!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

// Returns a 429 response when the client is over the limit, null otherwise.
export function rateLimit(req: Request): Response | null {
  const now = Date.now()
  // Drop expired windows once the map grows, so it can't grow without bound.
  if (hits.size > 10_000) {
    for (const [ip, h] of hits) if (h.resetAt <= now) hits.delete(ip)
  }

  const ip = clientIp(req)
  const h = hits.get(ip)
  if (!h || h.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return null
  }
  if (++h.count <= MAX_REQUESTS) return null

  return Response.json(
    { error: 'Too many requests' },
    { status: 429, headers: { 'Retry-After': String(Math.ceil((h.resetAt - now) / 1000)) } },
  )
}
