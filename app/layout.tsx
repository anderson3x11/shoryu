import type { Metadata } from 'next'
import { Bebas_Neue, Barlow } from 'next/font/google'
import Image from 'next/image'
import { NavSearch } from '@/components/nav-search'
import './globals.css'

const bebasNeue = Bebas_Neue({ weight: '400', variable: '--font-display', subsets: ['latin'] })
const barlow = Barlow({ weight: ['400', '500', '600', '700'], variable: '--font-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shoryu - Street Fighter 6 Stats',
  description: 'Street Fighter 6 player stats, rankings, and character data',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${bebasNeue.variable}`}>
      <body className="antialiased min-h-screen bg-zinc-950 text-zinc-100" suppressHydrationWarning>
        <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="font-display text-2xl tracking-wider leading-none text-zinc-100">Shoryu</span>
              <Image src="/logo.png" alt="Shoryu" width={36} height={36} className="object-contain" />
            </a>
            <div className="h-5 w-px bg-zinc-700 shrink-0" />
            <NavSearch />
            <div className="h-5 w-px bg-zinc-700 shrink-0" />
            <a href="/pros" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0">
              Pros
            </a>
            <a href="/tournaments" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors shrink-0">
              Tournaments
            </a>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
