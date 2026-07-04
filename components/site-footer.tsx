import Link from 'next/link'
import { ChangelogLink } from '@/components/changelog-link'

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <ChangelogLink />
        <p className="text-xs text-zinc-700">Not affiliated with Capcom</p>
        <div className="flex items-center gap-4">
          <a
            href="https://x.com/shoryuapp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            @shoryuapp
          </a>
          <Link href="/faq" prefetch={false} className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors">
            Q&amp;A
          </Link>
          <Link href="/about" prefetch={false} className="text-xs text-zinc-400 hover:text-zinc-300 transition-colors">
            About
          </Link>
        </div>
      </div>
    </footer>
  )
}
