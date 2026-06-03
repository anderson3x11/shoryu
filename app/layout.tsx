import type { Metadata } from 'next'
import { Permanent_Marker, Barlow, Bebas_Neue } from 'next/font/google'
import localFont from 'next/font/local'
import Image from 'next/image'
import { NavSearch } from '@/components/nav-search'
import { NavMenu } from '@/components/nav-menu'
import { SiteFooter } from '@/components/site-footer'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const permanentMarker = Permanent_Marker({ weight: '400', variable: '--font-display', subsets: ['latin'] })
const titleFont = localFont({ src: '../public/fonts/CityBrawlersBoldCaps.otf', variable: '--font-title' })
const bebasNeue = Bebas_Neue({ weight: '400', variable: '--font-bebas', subsets: ['latin'] })
const barlow = Barlow({ weight: ['400', '500', '600', '700'], variable: '--font-sans', subsets: ['latin'] })

const BASE = 'https://shoryu.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'Shoryu — SF6 Stats',
    template: '%s | Shoryu',
  },
  description: 'Street Fighter 6 player profiles, Master ranking, matchup charts, match history, and character guides.',
  metadataBase: new URL(BASE),
  openGraph: {
    siteName: 'Shoryu',
    type: 'website',
    locale: 'en_US',
    title: 'Shoryu — SF6 Stats',
    description: 'Street Fighter 6 player profiles, Master ranking, matchup charts, match history, and character guides.',
    url: BASE,
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Shoryu — SF6 Stats' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shoryu — SF6 Stats',
    description: 'Street Fighter 6 player profiles, Master ranking, matchup charts, match history, and character guides.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${permanentMarker.variable} ${titleFont.variable} ${bebasNeue.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-zinc-950 text-zinc-100" suppressHydrationWarning>
        <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center gap-2 sm:gap-8">
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="font-display text-2xl tracking-wider leading-none text-zinc-100">Shoryu</span>
              <Image src="/logo.png" alt="Shoryu" width={36} height={36} className="object-contain" />
            </a>
            <div className="h-5 w-px bg-zinc-700 shrink-0 hidden sm:block" />
            <NavSearch />
            <div className="h-5 w-px bg-zinc-700 shrink-0 hidden sm:block" />
            <a href="/pros" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">
              Pros
            </a>
            <a href="/tournaments" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">
              Tournaments
            </a>
            <a href="/ranking" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">
              Ranking
            </a>
            <a href="/streetdle" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0 hidden sm:block">
              Streetdle
            </a>
            <NavMenu />
          </div>
        </nav>
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
