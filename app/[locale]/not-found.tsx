'use client'

import Link from 'next/link'
import { SearchBar } from '@/components/search-bar'
import { useLocale, useT } from '@/lib/i18n/context'
import { localeHref } from '@/lib/i18n/locales'

// Shown for notFound() (unknown player or character) and, through [...rest], for any unknown URL,
// inside the site layout so the navbar and footer stay.
export default function NotFound() {
  const t = useT().notFound
  const locale = useLocale()
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="flex items-center gap-3">
        <span className="block w-2 h-12 sm:h-16 -skew-x-12 shrink-0 bg-amber-400" />
        <h1 className="font-bebas text-6xl sm:text-8xl tracking-widest leading-none text-zinc-100">{t.title}</h1>
      </div>
      <p className="max-w-md text-sm sm:text-base text-zinc-300">{t.text}</p>
      <div className="w-full max-w-2xl">
        <SearchBar />
      </div>
      <Link
        href={localeHref(locale, '/')}
        className="rounded-none border border-zinc-700 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-zinc-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
      >
        {t.home}
      </Link>
    </section>
  )
}
