import type { Metadata } from 'next'
import Link from 'next/link'
import { CHANGELOG } from '@/lib/data/changelog'
import { ChangelogSeen } from '@/components/changelog-seen'

export const metadata: Metadata = {
  title: 'Changelog - Shoryu',
}

export default function ChangelogPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-10">
      <ChangelogSeen />
      <h1 className="font-bebas text-7xl">Changelog</h1>

      <div className="space-y-8">
        {CHANGELOG.map((entry) => (
          <div key={entry.date} className="flex flex-col sm:flex-row gap-3 sm:gap-8">
            <p className="text-sm text-zinc-400 shrink-0 sm:w-32 sm:pt-0.5">
              {new Date(entry.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <ul className="space-y-1.5">
              {entry.items.map((item, i) => (
                <li key={i} className="text-sm text-zinc-300">
                  {item}
                </li>
              ))}
            </ul>
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
