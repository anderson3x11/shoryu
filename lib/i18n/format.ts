import { HTML_LANG, type Locale } from './locales'

// "5 min ago" in every locale we ship, via Intl, so there is no wording to translate.
export function formatAge(sec: number, locale: Locale, justNow: string): string {
  const m = Math.floor(sec / 60)
  if (m < 1) return justNow
  const rtf = new Intl.RelativeTimeFormat(HTML_LANG[locale], { numeric: 'auto', style: 'short' })
  if (m < 60) return rtf.format(-m, 'minute')
  const h = Math.floor(m / 60)
  if (h < 24) return rtf.format(-h, 'hour')
  return rtf.format(-Math.floor(h / 24), 'day')
}

/** Fills "{n} of {total}"-style placeholders in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m))
}
