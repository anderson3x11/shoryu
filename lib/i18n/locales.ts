// Japan and Brazil are the top two countries in the analytics, so those are the two translations
// that exist. English stays unprefixed (`/ranking`) to keep the already-indexed URLs working;
// the others are path-prefixed (`/ja/ranking`) so Google sees them as separate pages.
export const LOCALES = ['en', 'ja', 'pt-br'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  'pt-br': 'Português',
}

// The `lang` attribute and OG locale want the full tag, not our path segment.
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  ja: 'ja',
  'pt-br': 'pt-BR',
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

// Prefix a root-relative path for the given locale. English keeps the bare path.
export function localeHref(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}
