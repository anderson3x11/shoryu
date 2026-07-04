import Image from 'next/image'
import Link from 'next/link'
import { CHARACTERS, getCharacterImageUrl } from '@/lib/constants/characters'

const CLIP = 'polygon(0% 0%, 84% 0%, 100% 16%, 100% 100%, 16% 100%, 0% 84%)'

function Tile({ href, src, alt, color, contain }: { href: string; src: string; alt: string; color?: string; contain?: boolean }) {
  return (
    <Link href={href} prefetch={false} className="group relative aspect-square block" title={alt}>
      {/* Border — grise au repos, couleur du perso au hover */}
      <div
        className="absolute inset-0 bg-zinc-700 transition-colors duration-300 group-hover:bg-[var(--char-color,#fbbf24)]"
        style={{ '--char-color': color, clipPath: CLIP } as React.CSSProperties}
      />
      {/* Background zinc-950 + portrait (or a centered icon for non-character tiles) */}
      <div className="absolute inset-[2px] overflow-hidden bg-zinc-950" style={{ clipPath: CLIP }}>
        {contain ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src={src} alt={alt} width={72} height={76} className="w-[80%] h-auto object-contain" unoptimized />
          </div>
        ) : (
          <Image src={src} alt={alt} fill className="object-cover object-top" unoptimized />
        )}
      </div>
    </Link>
  )
}

export function CharacterGrid() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-2">
      {CHARACTERS.filter((c) => !c.comingSoon && !c.hidden).map((char) => (
        <Tile key={char.id} href={`/character/${char.id}`} src={getCharacterImageUrl(char.slug)} alt={char.name} color={char.color} />
      ))}
      <Tile href="/guides" src={getCharacterImageUrl('guides')} alt="Guides" color="#fbbf24" contain />
    </div>
  )
}
