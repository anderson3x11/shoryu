import Link from 'next/link'
import { ChangelogLink } from '@/components/changelog-link'

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <ChangelogLink />
        <p className="text-xs text-zinc-700">Not affiliated with Capcom</p>
        <Link href="/about" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          About
        </Link>
      </div>
    </footer>
  )
}
