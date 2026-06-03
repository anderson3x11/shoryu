'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CHANGELOG } from '@/lib/data/changelog'

const STORAGE_KEY = 'changelog_seen'
const LATEST = CHANGELOG[0]?.date ?? ''

export function ChangelogLink() {
  const [dot, setDot] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY) ?? ''
    setDot(LATEST > seen)
  }, [])

  return (
    <Link href="/changelog" className="relative text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
      Changelog
      {dot && (
        <span className="absolute -top-0.5 -right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
      )}
    </Link>
  )
}
