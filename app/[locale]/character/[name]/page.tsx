import { notFound } from 'next/navigation'
import { BookOpen, Swords, FileSpreadsheet, MessagesSquare, ExternalLink, Trophy, Plus, Minus } from 'lucide-react'
import type { TechSection } from '@/lib/constants/character-links'
import { VideoCard } from '@/components/video-card'
import { CharacterTechs } from '@/components/character-techs'
import { LinkCard } from '@/components/link-card'
import { SectionHeader } from '@/components/section-header'
import { CharacterTabs, type CharacterTab } from '@/components/character-tabs'
import { CharacterVitals } from '@/components/character-vitals'
import { CharacterFrameData } from '@/components/character-frame-data'
import { CharacterPatches } from '@/components/character-patches'
import { getCharacterWiki, type Reason } from '@/lib/supercombo'

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
  const description = `${char.name} frame data, combos, matchups, guides, tech videos and top players in Street Fighter 6.`
  return {
    title: char.name,
    description,
    openGraph: { title: `${char.name} - SF6 - Shoryu`, description },
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
  const wiki = await getCharacterWiki(char.id)

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

  // The right-hand rail: reference numbers first, then everything that links out.
  const sidebar = (
    <>
      {wiki?.vitals && (
        <section className="space-y-3">
          <SectionHeader>Vitals</SectionHeader>
          <div className="border border-zinc-800 bg-zinc-900/40 px-4 py-3">
            <CharacterVitals vitals={wiki.vitals} />
          </div>
        </section>
      )}

      {hasGuides && (
        <section className="space-y-3">
          <SectionHeader>Guides &amp; Data</SectionHeader>
          <div className="grid grid-cols-1 gap-2">
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
          {links.playersNote && <p className="text-sm italic leading-relaxed text-zinc-300">{links.playersNote}</p>}
          <div className="grid grid-cols-1 gap-2">
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
          <div className="grid grid-cols-1 gap-2">
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
    </>
  )

  const overviewTab = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          {wiki && wiki.overview.length > 0 && (
            <section className="space-y-3">
              <SectionHeader>Who is {char.name}?</SectionHeader>
              <div className="space-y-3">
                {wiki.overview.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: p }}
                  />
                ))}
              </div>
            </section>
          )}

          {wiki && (wiki.pick.length > 0 || wiki.avoid.length > 0) && (
            <section className="space-y-3">
              <SectionHeader>Pick / Avoid</SectionHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ReasonList title={`Play ${char.name} if…`} reasons={wiki.pick} positive />
                <ReasonList title="Think twice if…" reasons={wiki.avoid} positive={false} />
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">{sidebar}</div>
      </div>

      {wiki && wiki.patches.length > 0 && (
        <section className="space-y-3">
          <SectionHeader>Patch History</SectionHeader>
          <CharacterPatches patches={wiki.patches} accent={accent} />
        </section>
      )}
    </div>
  )

  const videoTab = (
    <div className="space-y-8">
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
  )

  const tabs: CharacterTab[] = [{ id: 'overview', label: 'Overview', content: overviewTab }]
  if (wiki?.moves.length) {
    tabs.push({
      id: 'frames', label: 'Frame Data', count: wiki.moves.length,
      content: <CharacterFrameData moves={wiki.moves} accent={accent} />,
    })
  }
  if (watchItems.length || hasTechs) {
    tabs.push({ id: 'videos', label: 'Videos', count: allTechVideos.length, content: videoTab })
  }

  return (
    <div className="space-y-6" style={{ ['--accent']: accent } as React.CSSProperties}>
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

      <CharacterTabs tabs={tabs} accent={accent} />

      {wiki && (
        <p className="text-xs text-zinc-500">
          Character data, frame data and patch notes are mirrored from the{' '}
          <a
            href={links.supercombo ?? 'https://wiki.supercombo.gg/w/Street_Fighter_6'}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-300"
          >
            SuperCombo wiki
          </a>
          , maintained by the community under CC BY-SA.
        </p>
      )}
    </div>
  )
}

function ReasonList({ title, reasons, positive }: { title: string; reasons: Reason[]; positive: boolean }) {
  if (!reasons.length) return null
  const Icon = positive ? Plus : Minus
  return (
    <div className="border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</h3>
      <ul className="space-y-2.5">
        {reasons.map((r, i) => (
          <li key={i} className="flex gap-2.5">
            <Icon
              size={14}
              strokeWidth={3}
              className={`mt-1 shrink-0 ${positive ? 'text-emerald-400' : 'text-red-400'}`}
            />
            <p className="text-sm leading-snug text-zinc-300">
              {r.title && <span className="font-semibold text-zinc-100">{r.title}: </span>}
              <span dangerouslySetInnerHTML={{ __html: r.text }} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
