import Link from 'next/link'
import { BookOpen, Swords, Info, Dumbbell, Users, ArrowRight } from 'lucide-react'
import { LinkCard } from '@/components/link-card'
import { SectionHeader } from '@/components/section-header'
import { VideoCard } from '@/components/video-card'

export const metadata = {
  title: 'Guides - Shoryu',
  description: 'Street Fighter 6 guides, frame data, mechanics, and learning resources.',
}

const START_HERE = [
  { title: 'Beginners Guide', url: 'https://www.youtube.com/watch?v=seXtzdiKi4Y' },
  { title: 'Starter Guide',   url: 'https://www.youtube.com/watch?v=MK-AJyD1XKk' },
  { title: 'Tips',            url: 'https://www.youtube.com/watch?v=hpsOwdzfWag' },
  { title: 'Choose a Main',   url: 'https://www.youtube.com/watch?v=t7WcJbVt1a4' },
]

const FUNDAMENTALS = [
  { title: 'Neutral Guide', url: 'https://www.youtube.com/watch?v=rUNWK7Aq73c' },
  { title: 'Warmup Drills', url: 'https://www.youtube.com/watch?v=KTIeXU96IeE' },
]

const TECH = [
  { title: 'Drive Rush OS',        url: 'https://www.youtube.com/watch?v=EZ5pL0qopAE' },
  { title: 'Delay Tech on Wakeup', url: 'https://www.youtube.com/watch?v=g8LYoF0S-Lo' },
  { title: 'Concept of Delaying',  url: 'https://www.youtube.com/watch?v=54FCpNJrJ1o' },
]

const RESOURCES = [
  { title: 'Supercombo Wiki',        desc: 'Community wiki with character pages, combos, and matchups.', domain: 'wiki.supercombo.gg',    url: 'https://wiki.supercombo.gg/w/Street_Fighter_6', icon: <BookOpen size={16} />, color: '#60a5fa' },
  { title: 'Ultimate Frame Data',    desc: 'Frame data for every move of every character.',             domain: 'ultimateframedata.com', url: 'https://ultimateframedata.com/sf6',             icon: <Swords size={16} />,   color: '#f97316' },
  { title: 'Fighting Game Glossary', desc: 'Plain-english definitions for FGC terms and mechanics.',    domain: 'glossary.infil.net',    url: 'https://glossary.infil.net/',                   icon: <Info size={16} />,     color: '#a78bfa' },
  { title: "Gief's Gym",             desc: 'Structured training drills to build your fundamentals.',     domain: 'reddit.com',            url: 'https://www.reddit.com/r/StreetFighter/wiki/v/giefsgym/', icon: <Dumbbell size={16} />, color: '#ff4500' },
]

function getVideoId(url: string): string | null {
  const m = url.match(/[?&]v=([^&]+)/)
  return m ? m[1] : null
}

function thumbnailFor(url: string): string | null {
  const id = getVideoId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

function StepHeader({ n, title, hint }: { n: number; title: string; hint: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center justify-center w-9 h-9 -skew-x-12 bg-amber-400 shrink-0">
        <span className="skew-x-12 font-bebas text-2xl text-zinc-950 leading-none">{n}</span>
      </span>
      <div className="min-w-0">
        <h2 className="font-bebas text-2xl tracking-widest text-zinc-100 leading-none">{title}</h2>
        <p className="text-xs text-zinc-400 mt-1 leading-snug">{hint}</p>
      </div>
    </div>
  )
}

function VideoGrid({ videos }: { videos: { title: string; url: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {videos.map((v) => (
        <VideoCard key={v.url} href={v.url} title={v.title} thumbnail={thumbnailFor(v.url)} />
      ))}
    </div>
  )
}

export default async function GuidesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="block w-2 h-10 sm:h-12 -skew-x-12 bg-amber-400 shrink-0" />
        <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Guides</h1>
      </div>

      <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
        New to Street Fighter 6? Follow the path below in order. Learn the basics, pick a
        character, drill the fundamentals, then explore the deeper tech once you are comfortable.
      </p>

      <div className="space-y-10">
        <section className="space-y-4">
          <StepHeader n={1} title="Start Here" hint="Brand new to the game? Watch these first." />
          <VideoGrid videos={START_HERE} />
        </section>

        <section className="space-y-4">
          <StepHeader n={2} title="Choose Your Character" hint="Find a main that clicks with you, then dig into their guides." />
          <Link
            href="/"
            className="group flex items-center gap-4 rounded-none border border-amber-400/40 bg-amber-400/5 px-5 py-4 hover:border-amber-400 hover:bg-amber-400/10 transition-colors"
          >
            <Users size={22} className="shrink-0 text-amber-400" />
            <div className="min-w-0 flex-1">
              <div className="font-bebas text-xl tracking-wide text-zinc-100 leading-none">Browse the roster</div>
              <div className="text-xs text-zinc-300 mt-1.5 leading-snug">
                Open any character for guides, combos, okizeme, matchups and players to watch.
              </div>
            </div>
            <ArrowRight size={18} className="shrink-0 text-amber-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>

        <section className="space-y-4">
          <StepHeader n={3} title="Learn the Fundamentals" hint="The habits that carry every character and every matchup." />
          <VideoGrid videos={FUNDAMENTALS} />
        </section>

        <section className="space-y-4">
          <StepHeader n={4} title="Explore the Tech" hint="Comfortable with the basics? Level up with these concepts." />
          <VideoGrid videos={TECH} />
        </section>

        <section className="space-y-3 pt-2">
          <SectionHeader>Reference &amp; Tools</SectionHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {RESOURCES.map((r) => (
              <LinkCard key={r.url} href={r.url} icon={r.icon} title={r.title} desc={r.desc} domain={r.domain} color={r.color} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
