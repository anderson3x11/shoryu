import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Q&A - Shoryu',
  description: 'Common questions about Shoryu: how fresh the data is, why stats cover the current phase only, what MR and LP mean, and where the data comes from.',
}

function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-zinc-200">{q}</h3>
      <p className="text-sm text-zinc-300 leading-relaxed">{children}</p>
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-12">

      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="block w-2 h-11 sm:h-14 -skew-x-12 bg-amber-400 shrink-0" />
          <h1 className="font-bebas text-7xl">Q&amp;A</h1>
        </div>
        <p className="text-zinc-300 leading-relaxed">
          Answers to the questions that come up most often. For a walkthrough of each page, see the{' '}
          <Link href="/about" className="text-zinc-200 hover:text-white underline underline-offset-2">About</Link> page.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Data &amp; updates</h2>

        <QA q="How fresh is the data?">
          Player stats are cached for 12 hours. Within that window everyone sees the same stored
          snapshot, which keeps the load on Capcom's servers low. If you want the latest numbers, open
          a profile and press Refresh, which pulls fresh data straight from the source. Refresh is
          limited to once every few minutes per player.
        </QA>

        <QA q="A profile looks out of date or won't load. Why?">
          Shoryu reads from Buckler, so when Buckler's session is briefly unavailable we serve the last
          copy we stored instead of showing an error. Try the Refresh button, or check back a little later.
        </QA>
      </div>

      <div className="space-y-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Stats &amp; ranks</h2>

        <QA q="Why do matchups and win rates only cover the current phase?">
          Buckler only exposes a player's stats for the current ranked phase. It does not let us read
          past phases, so the matchup chart and per-character win rates reflect the current phase only,
          and reset along with the game when a new phase begins. This is a limitation on Buckler's side,
          not a choice.
        </QA>

        <QA q="What do MR and LP mean?">
          LP (League Points) is the ranking currency from Rookie up to Diamond. Once a character reaches
          Master it earns MR (Master Rating) instead, the rating used for the global leaderboard. On
          profiles we show MR above the Master threshold and LP below it.
        </QA>
      </div>

      <div className="space-y-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">About the site</h2>

        <QA q="Where does the data come from?">
          Player data comes from{' '}
          <a href="https://www.streetfighter.com/6/buckler" target="_blank" rel="noopener noreferrer" className="text-zinc-200 hover:text-white underline underline-offset-2">Buckler's Boot Camp</a>,
          Capcom's official SF6 companion site. Tournament data comes from{' '}
          <a href="https://liquipedia.net/fighters/Street_Fighter_6" target="_blank" rel="noopener noreferrer" className="text-zinc-200 hover:text-white underline underline-offset-2">Liquipedia</a>.
        </QA>

        <QA q="Is Shoryu affiliated with Capcom?">
          No. Shoryu is a fan-made project, not affiliated with or endorsed by Capcom. Street Fighter 6
          and all related assets are property of Capcom Co., Ltd.
        </QA>
      </div>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
          ← Back to Shoryu
        </Link>
        <Link href="/about" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
          About →
        </Link>
      </div>

    </div>
  )
}
