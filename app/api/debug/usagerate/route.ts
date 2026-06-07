import { getSessionCookie } from '@/lib/buckler/auth'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const BUCKLER_BASE = 'https://www.streetfighter.com/6/buckler'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

function getYYYYMM(offset = 0): string {
  const d = new Date()
  d.setUTCMonth(d.getUTCMonth() - offset)
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

export async function GET() {
  const cookie = getSessionCookie()
  if (!cookie) return NextResponse.json({ error: 'BUCKLER_COOKIE not set' })

  const months = [getYYYYMM(0), getYYYYMM(1), getYYYYMM(2)]
  const locales = ['fr', 'en']

  const results: Record<string, number | string> = {}

  for (const locale of locales) {
    for (const month of months) {
      const path = `/api/${locale}/stats/usagerate/${month}`
      const url = `${BUCKLER_BASE}${path}`
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': UA, Accept: 'application/json', Cookie: cookie },
          cache: 'no-store',
        })
        results[path] = res.status
        if (res.ok) {
          const data = await res.json()
          return NextResponse.json({ found: true, path, month, charCount: data?.usagerateData?.[0]?.val?.[0]?.val?.length })
        }
      } catch (e) {
        results[path] = String(e)
      }
    }
  }

  return NextResponse.json({ found: false, results })
}
