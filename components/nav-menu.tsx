'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { href: '/pros',        label: 'Pros'         },
  { href: '/tournaments', label: 'Tournaments'  },
  { href: '/ranking',     label: 'Ranking'      },
  { href: '/streetdle',   label: 'Streetdle'    },
]

export function NavMenu() {
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
        aria-label="Open menu"
        className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          {LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
