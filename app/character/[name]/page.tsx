import { notFound } from 'next/navigation'
import Image from 'next/image'
import { BookOpen, Swords, FileSpreadsheet, CirclePlay, MessagesSquare, ExternalLink } from 'lucide-react'
import { CHARACTERS, getCharacterImageUrl } from '@/lib/constants/characters'
import { CHARACTER_LINKS } from '@/lib/constants/character-links'

interface CharacterPageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: CharacterPageProps) {
  const { name } = await params
  const char = CHARACTERS.find((c) => c.id === name)
  return { title: char ? `${char.name} - Shoryu` : 'Character - Shoryu' }
}

export function generateStaticParams() {
  return CHARACTERS.map((c) => ({ name: c.id }))
}

interface LinkCardProps {
  href: string
  icon: React.ReactNode
  title: string
  domain: string
  color?: string
}

function LinkCard({ href, icon, title, domain, color }: LinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors"
    >
      <span className="shrink-0" style={color ? { color } : undefined}>{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-zinc-100 leading-tight">{title}</div>
        <div className="text-xs text-zinc-500 truncate mt-0.5">{domain}</div>
      </div>
      <ExternalLink size={14} className="shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
    </a>
  )
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { name } = await params
  const char = CHARACTERS.find((c) => c.id === name)
  if (!char) notFound()

  const links = CHARACTER_LINKS[char.id] ?? {}

  const hasGuides = !!(links.supercombo || links.ufd || links.raidhyn)
  const hasWatch = !!(links.playlist || links.misterCrimson)
  const hasCommunity = !!(links.discords?.length)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="relative w-full h-64 rounded-xl overflow-hidden border border-zinc-800">
        <Image
          src={getCharacterImageUrl(char.slug)}
          alt={char.name}
          fill
          className="object-cover object-center"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <h1
          className="absolute bottom-5 left-6 font-display text-5xl tracking-widest leading-none text-white"
          style={{ textShadow: `0 0 40px ${char.color}60` }}
        >
          {char.name}
        </h1>
      </div>

      <div className="space-y-6">
        {hasGuides && (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Guides & Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {links.supercombo && (
                <LinkCard href={links.supercombo} icon={<BookOpen size={16} />} title="Supercombo Wiki" domain="wiki.supercombo.gg" color="#60a5fa" />
              )}
              {links.ufd && (
                <LinkCard href={links.ufd} icon={<Swords size={16} />} title="Ultimate Frame Data" domain="ultimateframedata.com" color="#f97316" />
              )}
              {links.raidhyn && (
                <LinkCard href={links.raidhyn} icon={<FileSpreadsheet size={16} />} title="Raidhyn's Notes" domain="docs.google.com" color="#34d399" />
              )}
            </div>
          </section>
        )}

        {hasWatch && (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Watch</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {links.playlist && (
                <LinkCard href={links.playlist} icon={<CirclePlay size={16} />} title="SF6 High Level Replays" domain="youtube.com · SF6HighLevelReplays" color="#ef4444" />
              )}
              {links.misterCrimson && (
                <LinkCard href={links.misterCrimson} icon={<CirclePlay size={16} />} title="Matchup Guide — Mister Crimson" domain="youtube.com" color="#ef4444" />
              )}
            </div>
          </section>
        )}

        {hasCommunity && (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Community</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {links.discords!.map((url, i) => (
                <LinkCard
                  key={url}
                  href={url}
                  icon={<MessagesSquare size={16} />}
                  title={links.discords!.length > 1 ? `${char.name} Discord ${i + 1}` : `${char.name} Discord`}
                  domain="discord.gg"
                  color="#7c3aed"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
