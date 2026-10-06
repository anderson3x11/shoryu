'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Languages } from 'lucide-react'
import { DEFAULT_LOCALE, isLocale, LOCALES, LOCALE_NAMES, localeHref } from '@/lib/i18n/locales'
import { useLocale, useT } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'

// Switches language while staying on the same page. A plain <a> on purpose: a soft navigation
// would keep the current locale's rendered tree around, and the whole point is to re-render it.
export function LanguageSwitcher() {
  const current = useLocale()
  const t = useT()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Strip the locale segment so each option links to this same page in its own language.
  const segments = pathname.split('/')
  const bare = isLocale(segments[1] ?? '') ? `/${segments.slice(2).join('/')}` : pathname

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.nav.language}
        title={t.nav.language}
        className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
      >
        <Languages className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-zinc-900 border border-zinc-800 rounded-none shadow-2xl z-50 overflow-hidden">
          {LOCALES.map((l) => (
            <a
              key={l}
              href={localeHref(l, bare === '/' || bare === '' ? '/' : bare)}
              hrefLang={l === DEFAULT_LOCALE ? 'en' : l}
              className={cn(
                'block px-4 py-3 text-sm transition-colors hover:bg-zinc-800',
                l === current ? 'text-amber-400' : 'text-zinc-300 hover:text-zinc-100',
              )}
            >
              {LOCALE_NAMES[l]}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
