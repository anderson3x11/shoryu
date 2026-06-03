'use client'

import { useEffect } from 'react'
import { CHANGELOG } from '@/lib/data/changelog'

const STORAGE_KEY = 'changelog_seen'

export function ChangelogSeen() {
  useEffect(() => {
    if (CHANGELOG[0]?.date) {
      localStorage.setItem(STORAGE_KEY, CHANGELOG[0].date)
    }
  }, [])

  return null
}
