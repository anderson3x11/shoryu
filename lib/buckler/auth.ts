// Buckler uses Next.js SSR - all player data is in __NEXT_DATA__ on page HTML.
// Auth requires Capcom ID OAuth (Auth0), which can't be automated without a headless browser.
//
// To authenticate:
// 1. Log in at https://www.streetfighter.com/6/buckler
// 2. Open DevTools → Application → Cookies → www.streetfighter.com
// 3. Copy the `buckler_id` cookie value
// 4. Set BUCKLER_COOKIE=buckler_id=<value> in .env.local

let cachedCookie: string | null = null

export function getSessionCookie(): string | null {
  if (cachedCookie) return cachedCookie

  const envCookie = (process.env.BUCKLER_COOKIE ?? '').trim()
  if (envCookie) {
    // Accept either "buckler_id=VALUE" or just "VALUE"
    cachedCookie = envCookie.includes('=') ? envCookie : `buckler_id=${envCookie}`
    return cachedCookie
  }

  return null
}

