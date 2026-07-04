import { notFound } from 'next/navigation'
import { BookOpen, Swords, FileSpreadsheet, MessagesSquare, ExternalLink, Trophy } from 'lucide-react'
import type { TechSection } from '@/lib/constants/character-links'
import { VideoCard } from '@/components/video-card'
import { CharacterTechs } from '@/components/character-techs'
import { LinkCard } from '@/components/link-card'
import { SectionHeader } from '@/components/section-header'

const TECH_ORDER = ['guides', 'combos', 'pressure', 'oki', 'matchup', 'techs'] as const
const TECH_LABELS: Record<string, string> = { guides: 'Guides', combos: 'Combos', pressure: 'Pressure', oki: 'Okizeme', matchup: 'Matchups', techs: 'Tech' }
import { CHARACTERS, getCharacterFullImageUrl, getCharacterHeaderY } from '@/lib/constants/characters'
import { CHARACTER_LINKS } from '@/lib/constants/character-links'

interface CharacterPageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: CharacterPageProps) {
  const { name } = await params
  const char = CHARACTERS.find((c) => c.id === name)
  if (!char) return { title: 'Character - Shoryu' }
  return {
    title: char.name,
    description: `${char.name} guides, frame data, combos, tech videos, and top players in Street Fighter 6.`,
    openGraph: {
      title: `${char.name} - SF6 - Shoryu`,
      description: `${char.name} guides, frame data, combos, tech videos, and top players in Street Fighter 6.`,
    },
  }
}

export function generateStaticParams() {
  return CHARACTERS.filter((c) => !c.hidden).map((c) => ({ name: c.id }))
}

async function getYoutubeThumbnail(url: string): Promise<string | null> {
  const videoMatch = url.match(/[?&]v=([^&]+)/)
  if (videoMatch) return `https://img.youtube.com/vi/${videoMatch[1]}/mqdefault.jpg`

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { next: { revalidate: 86400 } }
    )
    if (res.ok) {
      const data = await res.json()
      return data.thumbnail_url ?? null
    }
  } catch {}
  return null
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { name } = await params
  const char = CHARACTERS.find((c) => c.id === name)
  if (!char) notFound()

  const links = CHARACTER_LINKS[char.id] ?? {}

  // Collect all YouTube URLs and fetch thumbnails in parallel
  const watchItems = [
    links.playlist && { title: 'SF6 High Level Replays', url: links.playlist },
  ].filter(Boolean) as { title: string; url: string }[]

  const allTechs: TechSection = { ...links.techs }
  if (links.misterCrimson) allTechs.matchup = [...(allTechs.matchup ?? []), { title: 'Matchup Guide by Mister Crimson', url: links.misterCrimson }]
  if (links.videoGuides?.length) allTechs.guides = [...(allTechs.guides ?? []), ...links.videoGuides]
  if (links.techVideos?.length) allTechs.guides = [...(allTechs.guides ?? []), ...links.techVideos]

  const allTechVideos = TECH_ORDER.flatMap(cat => allTechs[cat] ?? [])
  const hasTechs = allTechVideos.length > 0

  const allYtItems = [...watchItems, ...allTechVideos]
  const thumbnails = await Promise.all(allYtItems.map((item) => getYoutubeThumbnail(item.url)))
  const thumbMap = Object.fromEntries(allYtItems.map((item, i) => [item.url, thumbnails[i]]))

  const techCategories = TECH_ORDER
    .map((cat) => ({
      id: cat,
      label: TECH_LABELS[cat],
      videos: (allTechs[cat] ?? []).map((v) => ({ title: v.title, url: v.url, thumbnail: thumbMap[v.url] ?? null })),
    }))
    .filter((c) => c.videos.length > 0)

  const hasGuides = !!(links.supercombo || links.ufd || links.raidhyn)
  const hasCommunity = !!(links.discords?.length)
  const players = links.players ?? []

  // Secondary color accents this page (ticks, active chips, hover) in place of the amber Shoryu accent.
  const accent = char.colorSecondary ?? '#fbbf24'

  return (
    <div className="space-y-6" style={{ ['--accent']: accent } as React.CSSProperties}>
      <div>
        <div className="relative w-full h-72 sm:h-80 rounded-none overflow-hidden border border-zinc-800">
          <div
            className="absolute inset-0 bg-no-repeat bg-cover"
            style={{
              backgroundImage: `url(${getCharacterFullImageUrl(char.slug)})`,
              backgroundPosition: `center ${getCharacterHeaderY(char.id)}%`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <h1
            className="absolute bottom-1 left-6 font-title text-9xl leading-none text-white uppercase"
            style={{ letterSpacing: '0.1em' }}
          >
            {char.name}
          </h1>
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: char.color }} />
        </div>

        {/* Signature-color accent + at-a-glance resource counts */}
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <span className="block w-10 h-2 -skew-x-12 shrink-0" style={{ background: char.color }} />
          <div className="flex items-center gap-2.5 text-sm text-zinc-300 flex-wrap">
            {hasGuides && <span>Frame data &amp; wiki</span>}
            {allTechVideos.length > 0 && (
              <>
                <span className="text-zinc-600">·</span>
                <span>{allTechVideos.length} tech videos</span>
              </>
            )}
            {players.length > 0 && (
              <>
                <span className="text-zinc-600">·</span>
                <span>{players.length} players to watch</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {hasGuides && (
          <section className="space-y-3">
            <SectionHeader>Guides &amp; Data</SectionHeader>
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

        {players.length > 0 && (
          <section className="space-y-3">
            <SectionHeader>Players to Watch</SectionHeader>
            {links.playersNote && <p className="text-sm italic text-zinc-300">{links.playersNote}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {players.map((player) => {
                const inner = (
                  <>
                    <Trophy size={15} className="shrink-0" style={{ color: 'var(--accent)' }} />
                    <span className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors truncate">{player.name}</span>
                    {player.liquipedia && <ExternalLink size={13} className="shrink-0 ml-auto text-zinc-300 group-hover:text-zinc-200 transition-colors" />}
                  </>
                )
                return player.liquipedia ? (
                  <a key={player.name} href={player.liquipedia} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-none border border-zinc-800 bg-zinc-900 px-4 py-3 hover:border-[color:var(--accent)] hover:bg-zinc-800/60 transition-colors">
                    {inner}
                  </a>
                ) : (
                  <div key={player.name} className="flex items-center gap-3 rounded-none border border-zinc-800 bg-zinc-900 px-4 py-3">
                    {inner}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {hasCommunity && (
          <section className="space-y-3">
            <SectionHeader>Community</SectionHeader>
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

        {watchItems.length > 0 && (
          <section className="space-y-3">
            <SectionHeader>Replays</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {watchItems.map((item) => (
                <VideoCard key={item.url} href={item.url} title={item.title} thumbnail={thumbMap[item.url]} />
              ))}
            </div>
          </section>
        )}

        {hasTechs && (
          <section className="space-y-3">
            <SectionHeader>Techs</SectionHeader>
            <CharacterTechs categories={techCategories} accent={accent} />
          </section>
        )}
      </div>
    </div>
  )
}
