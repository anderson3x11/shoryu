import Link from 'next/link'
import { DEFAULT_LOCALE, isLocale, localeHref } from '@/lib/i18n/locales'
import { getDict } from '@/lib/i18n/dict'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return { ...getDict(isLocale(locale) ? locale : DEFAULT_LOCALE).meta.about }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE
  const t = getDict(locale).about
  const href = (path: string) => localeHref(locale, path)

  const sections = [t.lookup, t.profile, t.ranking, t.characters, t.streetdle, t.tournaments]

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-12">

      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="block w-2 h-11 sm:h-14 -skew-x-12 bg-amber-400 shrink-0" />
          <h1 className="font-bebas text-5xl sm:text-7xl">{t.title}</h1>
        </div>
        <p className="text-zinc-300 leading-relaxed">{t.intro}</p>
      </div>

      <div className="space-y-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{t.howToUse}</h2>

        {sections.map((s) => (
          <div key={s.h} className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-200">{s.h}</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{s.p}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{t.questions}</h2>
        <p className="text-zinc-300 leading-relaxed">
          {t.qaBefore}
          <Link href={href('/faq')} className="text-zinc-200 hover:text-white underline underline-offset-2">
            {getDict(locale).footer.qa}
          </Link>
          {t.qaAfter}
        </p>
      </div>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <Link href={href('/')} className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
          ← {t.back}
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/anderson3x11/shoryu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            {t.source} →
          </a>
          <p className="text-sm text-zinc-500">{t.madeBy}</p>
        </div>
      </div>

    </div>
  )
}
