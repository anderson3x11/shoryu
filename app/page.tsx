import Image from 'next/image'
import { SearchBar } from '@/components/search-bar'
import { CharacterGrid } from '@/components/character-grid'

export default async function HomePage() {
  return (
    <div className="space-y-12">
      <section className="flex flex-col items-center justify-center space-y-6 min-h-[40vh]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <h1 className="font-display text-7xl tracking-widest leading-none text-zinc-100">Shoryu</h1>
            <Image src="/logo.png" alt="Shoryu" width={80} height={80} className="object-contain" />
          </div>
          <p className="text-zinc-400 mt-3 text-sm tracking-wide">Street Fighter 6 stats, player profiles, and rankings</p>
        </div>
        <SearchBar />
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Characters</h2>
        <CharacterGrid />
      </section>
    </div>
  )
}
