import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About - Shoryu',
  description: 'About Shoryu, a Street Fighter 6 stats site.',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-12">

      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="block w-2 h-11 sm:h-14 -skew-x-12 bg-amber-400 shrink-0" />
          <h1 className="font-bebas text-7xl">About Shoryu</h1>
        </div>
        <p className="text-zinc-300 leading-relaxed">
          Shoryu is a fan-made stats site for Street Fighter 6. It tracks player rankings,
          match history, character data, and tournament results. The kind of site I wished
          existed when I started playing.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">How to use Shoryu</h2>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-200">Looking up a player</h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Use the search bar at the top to find any player by their CFN name (their in-game username).
            Results will show their main character, rank, and region. Click on a player to open their full profile.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-200">Player profile</h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            The profile page is split into several sections. At the top you'll find the player's rank
            and main character. Below that, their stats per character and match counts across all game modes.
            The match history shows their recent games with the result, opponent, and LP/MR gained or lost.
            The matchup chart shows their win rate against each character they've faced.
            Finally, the LP/MR history chart lets you track their progression over time.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-200">Master Ranking</h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            The Ranking page shows the global Master Rating leaderboard, featuring the top players in the world
            ranked by MR (Master Rating), the point system used at the highest level of ranked play.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-200">Character pages</h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Each character has a dedicated page with links to external resources: frame data, combo guides,
            tech videos organized by category, and pro players known for that character. Useful whether
            you're picking up a new character or looking to level up your main.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-200">Streetdle</h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            A daily guessing game. Each day a Street Fighter character is chosen at random from a pool of
            72 characters spanning the entire series. Type a name, submit your guess, and use the colored
            clues to narrow it down. A new character is picked every day at midnight.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-200">Tournaments</h3>
          <p className="text-sm text-zinc-300 leading-relaxed">
            The Tournaments page lists Tier 1 SF6 tournaments with results, prize pools, and the players
            who placed. Data comes from Liquipedia and updates automatically.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Data</h2>
        <p className="text-zinc-300 leading-relaxed">
          All player data comes from{' '}
          <a
            href="https://www.streetfighter.com/6/buckler"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 hover:text-white underline underline-offset-2"
          >
            Buckler's Boot Camp
          </a>
          , Capcom's official SF6 companion site. Tournament data comes from{' '}
          <a
            href="https://liquipedia.net/fighters/Street_Fighter_6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 hover:text-white underline underline-offset-2"
          >
            Liquipedia
          </a>
          .
        </p>
        <p className="text-zinc-400 text-sm">
          Shoryu is not affiliated with or endorsed by Capcom. Street Fighter 6 and all
          related assets are property of Capcom Co., Ltd.
        </p>
      </div>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors">
          ← Back to Shoryu
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="https://x.com/shoryuapp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            Follow updates on X →
          </a>
          <p className="text-sm text-zinc-500">Made with love by anderson.</p>
        </div>
      </div>

    </div>
  )
}
