import type { Metadata } from 'next'
import { Barlow, Bebas_Neue } from 'next/font/google'
import localFont from 'next/font/local'
import Image from 'next/image'
import Link from 'next/link'
import { NavSearch } from '@/components/nav-search'
import { NavMenu } from '@/components/nav-menu'
import { TournamentBanner } from '@/components/tournament-banner'
import { SiteFooter } from '@/components/site-footer'
import Script from 'next/script'
import '../globals.css'
import { notFound } from 'next/navigation'
import { DEFAULT_LOCALE, HTML_LANG, isLocale, LOCALES, localeHref } from '@/lib/i18n/locales'
import { getDict } from '@/lib/i18n/dict'
import { LocaleProvider } from '@/lib/i18n/context'
import { LanguageSwitcher } from '@/components/language-switcher'

const martyric = localFont({ src: '../../public/fonts/Martyric_PersonalUse.ttf', variable: '--font-display' })
const titleFont = localFont({ src: '../../public/fonts/CityBrawlersBoldCaps.otf', variable: '--font-title' })
const bebasNeue = Bebas_Neue({ weight: '400', variable: '--font-bebas', subsets: ['latin'] })
const barlow = Barlow({ weight: ['400', '500', '600', '700'], variable: '--font-sans', subsets: ['latin'] })

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://shoryu.site'

const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_ID

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = isLocale(locale) ? locale : DEFAULT_LOCALE
  const t = getDict(l).meta.home
  return {
    title: { default: t.title, template: '%s - Shoryu' },
    description: t.description,
    metadataBase: new URL(BASE),
    alternates: {
      canonical: './',
      // Tell Google these are the same page in other languages, not duplicates.
      languages: Object.fromEntries(LOCALES.map((x) => [HTML_LANG[x], localeHref(x, '/')])),
    },
    openGraph: {
      siteName: 'Shoryu',
      type: 'website',
      locale: HTML_LANG[l].replace('-', '_'),
      title: t.title,
      description: t.description,
      url: localeHref(l, '/'),
      images: [{ url: '/og.png', width: 1200, height: 630, alt: t.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
      images: ['/og.png'],
    },
  }
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDict(locale)
  const href = (path: string) => localeHref(locale, path)
  return (
    <html lang={HTML_LANG[locale]} className={`${barlow.variable} ${martyric.variable} ${titleFont.variable} ${bebasNeue.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-zinc-950 text-zinc-100" suppressHydrationWarning>
        <LocaleProvider locale={locale}>
        <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-[90rem] mx-auto px-3 sm:px-6 h-14 flex items-center gap-2 sm:gap-8">
            <Link href={href('/')} className="flex items-center gap-2 flex-shrink-0">
              <span className="font-display text-2xl tracking-wider leading-none text-zinc-100">Shoryu</span>
              <Image src="/logo.png" alt="Shoryu" width={36} height={36} className="object-contain" />
            </Link>
            <div className="h-5 w-px bg-zinc-700 shrink-0 hidden sm:block" />
            <NavSearch />
            <div className="h-5 w-px bg-zinc-700 shrink-0 hidden sm:block" />
            <Link href={href('/pros')} className="text-base text-zinc-300 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">{t.nav.pros}</Link>
            <Link href={href('/tournaments')} className="text-base text-zinc-300 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">{t.nav.tournaments}</Link>
            <Link href={href('/ranking')} className="text-base text-zinc-300 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">{t.nav.ranking}</Link>
            <Link href={href('/streetdle')} className="text-base text-zinc-300 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">{t.nav.streetdle}</Link>
            <Link href={href('/stats')} className="text-base text-zinc-300 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">{t.nav.stats}</Link>
            <NavMenu />
            <LanguageSwitcher />
          </div>
        </nav>
        <TournamentBanner />
        <main className="flex-1 w-full max-w-[90rem] mx-auto px-6 py-8 flex flex-col">
          {children}
        </main>
        <SiteFooter locale={locale} />
        </LocaleProvider>
        {UMAMI_URL && UMAMI_ID && (
          <Script src={UMAMI_URL} data-website-id={UMAMI_ID} strategy="afterInteractive" />
        )}
      </body>
    </html>
  )
}
