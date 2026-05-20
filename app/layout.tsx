import type { Metadata } from 'next'
import { Bebas_Neue, Barlow } from 'next/font/google'
import { NavSearch } from '@/components/nav-search'
import './globals.css'

const bebasNeue = Bebas_Neue({ weight: '400', variable: '--font-display', subsets: ['latin'] })
const barlow = Barlow({ weight: ['400', '500', '600', '700'], variable: '--font-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'USF6 - Street Fighter 6 Stats',
  description: 'Street Fighter 6 player stats, rankings, and character data',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${bebasNeue.variable}`}>
      <body className="antialiased min-h-screen bg-zinc-950 text-zinc-100">
        <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
            <a href="/" className="flex items-center gap-0.5 font-display text-2xl tracking-wider leading-none flex-shrink-0">
              <span className="text-red-500">U</span>
              <span className="text-zinc-100">SF6</span>
            </a>
            <NavSearch />
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-zinc-800 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-xs text-zinc-600">
            Not affiliated with Capcom. Data sourced from Buckler&apos;s Boot Camp.
          </div>
        </footer>
      </body>
    </html>
  )
}
