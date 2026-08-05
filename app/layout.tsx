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
import './globals.css'

const martyric = localFont({ src: '../public/fonts/Martyric_PersonalUse.ttf', variable: '--font-display' })
const titleFont = localFont({ src: '../public/fonts/CityBrawlersBoldCaps.otf', variable: '--font-title' })
const bebasNeue = Bebas_Neue({ weight: '400', variable: '--font-bebas', subsets: ['latin'] })
const barlow = Barlow({ weight: ['400', '500', '600', '700'], variable: '--font-sans', subsets: ['latin'] })

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://shoryu.site'

const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_ID

export const metadata: Metadata = {
  title: {
    default: 'Shoryu - SF6 Stats',
    template: '%s - Shoryu',
  },
  description: 'Street Fighter 6 player profiles, Master ranking, matchup charts, match history, and character guides.',
  metadataBase: new URL(BASE),
  alternates: {
    canonical: './',
  },
  openGraph: {
    siteName: 'Shoryu',
    type: 'website',
    locale: 'en_US',
    title: 'Shoryu - SF6 Stats',
    description: 'Street Fighter 6 player profiles, Master ranking, matchup charts, match history, and character guides.',
    url: BASE,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Shoryu - SF6 Stats' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shoryu - SF6 Stats',
    description: 'Street Fighter 6 player profiles, Master ranking, matchup charts, match history, and character guides.',
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${martyric.variable} ${titleFont.variable} ${bebasNeue.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-zinc-950 text-zinc-100" suppressHydrationWarning>
        <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center gap-2 sm:gap-8">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="font-display text-2xl tracking-wider leading-none text-zinc-100">Shoryu</span>
              <Image src="/logo.png" alt="Shoryu" width={36} height={36} className="object-contain" />
            </Link>
            <div className="h-5 w-px bg-zinc-700 shrink-0 hidden sm:block" />
            <NavSearch />
            <div className="h-5 w-px bg-zinc-700 shrink-0 hidden sm:block" />
            <Link href="/pros" className="text-base text-zinc-300 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">
              Pros
            </Link>
            <Link href="/tournaments" className="text-base text-zinc-300 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">
              Tournaments
            </Link>
            <Link href="/ranking" className="text-base text-zinc-300 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">
              Ranking
            </Link>
            <Link href="/streetdle" className="text-base text-zinc-300 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">
              Streetdle
            </Link>
            <Link href="/stats" className="text-base text-zinc-300 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">
              Stats
            </Link>
            <NavMenu />
          </div>
        </nav>
        <TournamentBanner />
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col">
          {children}
        </main>
        <SiteFooter />
        {UMAMI_URL && UMAMI_ID && (
          <Script src={UMAMI_URL} data-website-id={UMAMI_ID} strategy="afterInteractive" />
        )}
      </body>
    </html>
  )
}
