'use client'

import Link from 'next/link'
import { useHref } from '@/lib/i18n/context'
import { useSyncExternalStore } from 'react'
import { noSubscribe } from '@/lib/utils'
import { CHANGELOG } from '@/lib/data/changelog'

const STORAGE_KEY = 'changelog_seen'
const LATEST = CHANGELOG[0]?.date ?? ''

export function ChangelogLink() {
  const href = useHref()
  // localStorage is read as an external store: no dot on the server, the real value on the client.
  const dot = useSyncExternalStore(
    noSubscribe,
    () => LATEST > (localStorage.getItem(STORAGE_KEY) ?? ''),
    () => false,
  )

  return (
    <Link href={href('/changelog')} prefetch={false} className="relative text-xs text-zinc-400 hover:text-zinc-300 transition-colors">
      Changelog
      {dot && (
        <span className="absolute -top-0.5 -right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
      )}
    </Link>
  )
}
