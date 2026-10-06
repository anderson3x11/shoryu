import Image from 'next/image'
import { SearchBar } from '@/components/search-bar'
import { CharacterGrid } from '@/components/character-grid'

export default async function HomePage() {
  return (
    <div className="flex flex-col flex-1 space-y-12">
      <section className="flex flex-1 flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <h1 className="font-display text-5xl sm:text-7xl tracking-widest leading-none text-zinc-100">Shoryu</h1>
            <Image src="/logo.png" alt="Shoryu" width={80} height={80} className="object-contain" />
          </div>
          <p className="text-zinc-300 mt-3 text-sm tracking-wide">Street Fighter 6 stats, player profiles, and rankings</p>
        </div>
        <SearchBar />
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Characters</h2>
        <CharacterGrid />
      </section>
    </div>
  )
}
