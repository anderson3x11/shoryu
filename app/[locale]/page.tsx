import Image from 'next/image'
import { SearchBar } from '@/components/search-bar'
import { CharacterGrid } from '@/components/character-grid'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/locales'
import { getDict } from '@/lib/i18n/dict'

// Tells Google the site is called "Shoryu" (shown above the result instead of "shoryu.site").
const SITE_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Shoryu',
  alternateName: ['Shoryu SF6', 'shoryu.site'],
  url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://shoryu.site'}/`,
}).replace(/</g, '\\u003c')

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE
  const t = getDict(locale).home
  return (
    <div className="flex flex-col flex-1 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: SITE_JSON_LD }} />
      <section className="flex flex-1 flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <h1 className="font-display text-5xl sm:text-7xl tracking-widest leading-none text-zinc-100">Shoryu</h1>
            <Image src="/logo.png" alt="Shoryu" width={80} height={80} className="object-contain" />
          </div>
          <p className="text-zinc-300 mt-3 text-sm tracking-wide">{t.tagline}</p>
        </div>
        <SearchBar />
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">{t.characters}</h2>
        <CharacterGrid locale={locale} />
      </section>
    </div>
  )
}
