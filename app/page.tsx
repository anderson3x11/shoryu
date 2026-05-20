import { SearchBar } from '@/components/search-bar'
import { CharacterGrid } from '@/components/character-grid'
import { GlobalStats } from '@/components/global-stats'

export default async function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-6 py-10">
        <div>
          <h1 className="font-display text-7xl tracking-widest leading-none">
            <span className="text-red-500">U</span>
            <span className="text-zinc-100">SF6</span>
          </h1>
          <p className="text-zinc-400 mt-3 text-sm tracking-wide">Street Fighter 6 stats, player profiles, and rankings</p>
        </div>
        <SearchBar />
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Global Stats</h2>
        <GlobalStats />
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Characters</h2>
        <CharacterGrid />
      </section>
    </div>
  )
}
