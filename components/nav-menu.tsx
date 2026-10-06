'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useT, useHref } from '@/lib/i18n/context'

const LINKS = ['pros', 'tournaments', 'ranking', 'streetdle', 'stats'] as const

export function NavMenu() {
  const t = useT()
  const href = useHref()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative sm:hidden flex-shrink-0">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={t.nav.openMenu}
        className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          {LINKS.map((key) => (
            <Link
              key={key}
              href={href(`/${key}`)}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {t.nav[key]}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
