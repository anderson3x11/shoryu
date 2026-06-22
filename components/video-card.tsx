import Image from 'next/image'
import { Play } from 'lucide-react'

export function VideoCard({ href, title, thumbnail }: { href: string; title: string; thumbnail: string | null }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-none border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-amber-400/70 transition-colors"
    >
      <div className="relative aspect-video bg-zinc-800 overflow-hidden">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        )}

        {/* Centered play affordance — fills amber on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/0">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-black/45 ring-1 ring-white/30 backdrop-blur-sm transition-all duration-200 group-hover:bg-amber-400 group-hover:ring-amber-400 group-hover:scale-110">
            <Play className="w-5 h-5 translate-x-px text-white fill-white transition-colors group-hover:text-zinc-950 group-hover:fill-zinc-950" />
          </span>
        </div>
      </div>

      {/* Title on a solid bar so it stays readable over any thumbnail */}
      <div className="flex items-start gap-2 px-3 py-2.5">
        <span className="mt-0.5 block w-1 h-4 -skew-x-12 bg-amber-400 shrink-0" />
        <span className="font-semibold text-sm leading-tight text-zinc-100 line-clamp-2 group-hover:text-white transition-colors">
          {title}
        </span>
      </div>
    </a>
  )
}
