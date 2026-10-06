'use client'

import { createContext, useContext, useCallback } from 'react'
import { DEFAULT_LOCALE, localeHref, type Locale } from './locales'
import { getDict, type Dict } from './dict'

// Client components can't read route params from anywhere, so the locale layout puts the active
// locale in context. The dictionaries are small enough to ship whole rather than loaded per locale.
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

export function useT(): Dict {
  return getDict(useContext(LocaleContext))
}

// Locale-aware href for links inside client components.
export function useHref(): (path: string) => string {
  const locale = useContext(LocaleContext)
  return useCallback((path: string) => localeHref(locale, path), [locale])
}
