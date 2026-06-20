import Image from 'next/image'
import { BookOpen, Swords, Info, ExternalLink, CirclePlay } from 'lucide-react'

export const metadata = {
  title: 'Guides - Shoryu',
  description: 'Street Fighter 6 guides, frame data, mechanics, and learning resources.',
}

const TECHS = [
  { title: 'Tips',                    url: 'https://www.youtube.com/watch?v=hpsOwdzfWag' },
  { title: 'Choose a main',           url: 'https://www.youtube.com/watch?v=t7WcJbVt1a4' },
  { title: 'Warmup Drills',           url: 'https://www.youtube.com/watch?v=KTIeXU96IeE' },
  { title: 'Drive Rush OS',           url: 'https://www.youtube.com/watch?v=EZ5pL0qopAE' },
  { title: 'Delay Tech on wakeup',    url: 'https://www.youtube.com/watch?v=g8LYoF0S-Lo' },
  { title: 'Concept of delaying',     url: 'https://www.youtube.com/watch?v=54FCpNJrJ1o' },
  { title: 'Starter Guide',           url: 'https://www.youtube.com/watch?v=MK-AJyD1XKk' },
  { title: 'Beginners Guide',         url: 'https://www.youtube.com/watch?v=seXtzdiKi4Y' },
  { title: 'Neutral Guide',           url: 'https://www.youtube.com/watch?v=rUNWK7Aq73c' },
]

function getVideoId(url: string): string | null {
  const m = url.match(/[?&]v=([^&]+)/)
  return m ? m[1] : null
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
        <div className="text-xs text-zinc-300 truncate mt-0.5">{domain}</div>
      </div>
      <ExternalLink size={14} className="shrink-0 text-zinc-300 group-hover:text-zinc-200 transition-colors" />
    </a>
  )
}

function VideoCard({ href, title, thumbnail }: { href: string; title: string; thumbnail: string | null }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-600 transition-colors"
    >
      <div className="relative w-full aspect-video bg-zinc-800">
        {thumbnail && <Image src={thumbnail} alt={title} fill className="object-cover" unoptimized />}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
          <CirclePlay size={36} className="text-white/80" />
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2 gap-2">
        <span className="text-sm font-medium text-zinc-100 leading-tight truncate">{title}</span>
        <ExternalLink size={13} className="shrink-0 text-zinc-300 group-hover:text-zinc-200 transition-colors" />
      </div>
    </a>
  )
}

export default async function GuidesPage() {
  const thumbMap = Object.fromEntries(
    TECHS.map((v) => {
      const id = getVideoId(v.url)
      return [v.url, id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null]
    })
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Guides</h1>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Guides & Data</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <LinkCard href="https://wiki.supercombo.gg/w/Street_Fighter_6" icon={<BookOpen size={16} />} title="Supercombo Wiki" domain="wiki.supercombo.gg" color="#60a5fa" />
            <LinkCard href="https://ultimateframedata.com/sf6" icon={<Swords size={16} />} title="Ultimate Frame Data" domain="ultimateframedata.com" color="#f97316" />
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Glossary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <LinkCard href="https://glossary.infil.net/" icon={<Info size={16} />} title="Fighting Game Glossary" domain="glossary.infil.net" color="#a78bfa" />
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Techs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TECHS.map((v) => (
              <VideoCard key={v.url} href={v.url} title={v.title} thumbnail={thumbMap[v.url]} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
