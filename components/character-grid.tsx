import Image from 'next/image'
import Link from 'next/link'
import { CHARACTERS, getCharacterImageUrl } from '@/lib/constants/characters'

export function CharacterGrid() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-2">
      {CHARACTERS.filter((c) => !c.comingSoon && !c.hidden).map((char) => (
        <Link
          key={char.id}
          href={`/character/${char.id}`}
          className="group relative aspect-square rounded-lg overflow-hidden border border-zinc-800 transition-colors duration-300 hover:border-[var(--char-color)]"
          style={{ '--char-color': char.color } as React.CSSProperties}
          title={char.name}
        >
          <Image
            src={getCharacterImageUrl(char.slug)}
            alt={char.name}
            fill
            className="object-cover object-top"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold text-white px-1 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
            {char.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
