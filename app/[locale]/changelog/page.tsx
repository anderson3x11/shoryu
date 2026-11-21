import type { Metadata } from 'next'
import Link from 'next/link'
import { CHANGELOG } from '@/lib/data/changelog'
import { ChangelogSeen } from '@/components/changelog-seen'

export const metadata: Metadata = {
  title: 'Changelog',
}

export default function ChangelogPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-10">
      <ChangelogSeen />
      <div className="flex items-center gap-3">
        <span className="block w-2 h-11 sm:h-14 -skew-x-12 bg-amber-400 shrink-0" />
        <h1 className="font-bebas text-5xl sm:text-7xl">Changelog</h1>
      </div>

      <div className="space-y-8">
        {CHANGELOG.map((entry, i) => (
          <div key={entry.version} className="flex flex-col sm:flex-row gap-3 sm:gap-8">
            <div className="shrink-0 sm:w-32 flex sm:flex-col items-baseline sm:items-start gap-x-3">
              <p className={`font-bebas text-3xl leading-none tracking-wider ${i === 0 ? 'text-amber-400' : 'text-zinc-100'}`}>
                v{entry.version}
              </p>
              <p className="text-xs text-zinc-500 sm:mt-1">
                {new Date(entry.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="font-bebas text-xl tracking-widest text-zinc-100 leading-none">{entry.title}</h2>
              <ul className="space-y-1.5">
                {entry.items.map((item, j) => (
                  <li key={j} className="text-sm text-zinc-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-zinc-800">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
          ← Back
        </Link>
      </div>
    </div>
  )
}
