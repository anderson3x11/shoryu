import Link from 'next/link'
import { DEFAULT_LOCALE, isLocale, localeHref } from '@/lib/i18n/locales'
import { getDict } from '@/lib/i18n/dict'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return { ...getDict(isLocale(locale) ? locale : DEFAULT_LOCALE).meta.faq }
}

function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-zinc-200">{q}</h3>
      <p className="text-sm text-zinc-300 leading-relaxed">{children}</p>
    </div>
  )
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE
  const t = getDict(locale).faq
  const href = (path: string) => localeHref(locale, path)

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-12">

      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="block w-2 h-11 sm:h-14 -skew-x-12 bg-amber-400 shrink-0" />
          <h1 className="font-bebas text-5xl sm:text-7xl">{t.title}</h1>
        </div>
        <p className="text-zinc-300 leading-relaxed">
          {t.introBefore}
          <Link href={href('/about')} className="text-zinc-200 hover:text-white underline underline-offset-2">
            {t.aboutLink}
          </Link>
          {t.introAfter}
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{t.dataUpdates}</h2>
        <QA q={t.freshQ}>{t.freshA}</QA>
        <QA q={t.staleQ}>{t.staleA}</QA>
      </div>

      <div className="space-y-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{t.statsRanks}</h2>
        <QA q={t.phaseQ}>{t.phaseA}</QA>
        <QA q={t.mrlpQ}>{t.mrlpA}</QA>
      </div>

      <div className="space-y-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{t.aboutSite}</h2>

        <QA q={t.sourceQ}>
          {t.sourceA1}
          <a href="https://www.streetfighter.com/6/buckler" target="_blank" rel="noopener noreferrer" className="text-zinc-200 hover:text-white underline underline-offset-2">
            Buckler&apos;s Boot Camp
          </a>
          {t.sourceA2}
          <a href="https://liquipedia.net/fighters/Street_Fighter_6" target="_blank" rel="noopener noreferrer" className="text-zinc-200 hover:text-white underline underline-offset-2">
            Liquipedia
          </a>
          {t.sourceA3}
        </QA>

        <QA q={t.affiliatedQ}>{t.affiliatedA}</QA>
      </div>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <Link href={href('/')} className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
          ← {getDict(locale).about.back}
        </Link>
        <Link href={href('/about')} className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
          {t.aboutLink} →
        </Link>
      </div>

    </div>
  )
}
