import { notFound } from 'next/navigation'
import { CHARACTERS } from '@/lib/constants/characters'
import Image from 'next/image'
import { getCharacterImageUrl } from '@/lib/constants/characters'

interface CharacterPageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: CharacterPageProps) {
  const { name } = await params
  const char = CHARACTERS.find((c) => c.id === name)
  return { title: char ? `${char.name} - SF6GG` : 'Character - SF6GG' }
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { name } = await params
  const char = CHARACTERS.find((c) => c.id === name)
  if (!char) notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
          <Image
            src={getCharacterImageUrl(char.slug)}
            alt={char.name}
            fill
            className="object-cover object-top"
            unoptimized
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{char.name}</h1>
          <p className="text-zinc-500 mt-1 text-sm">Character guide coming soon</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
        <p className="text-zinc-500">
          Guide content for {char.name} is in progress. Check back later.
        </p>
      </div>
    </div>
  )
}
