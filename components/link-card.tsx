import { ExternalLink } from 'lucide-react'

export interface LinkCardProps {
  href: string
  icon: React.ReactNode
  title: string
  domain: string
  desc?: string
  color?: string
}

export function LinkCard({ href, icon, title, domain, desc, color }: LinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-none border border-zinc-800 bg-zinc-900 px-4 py-3 hover:border-zinc-600 hover:bg-zinc-800/60 transition-colors"
    >
      <span className="shrink-0" style={color ? { color } : undefined}>{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-zinc-100 leading-tight">{title}</div>
        {desc && <div className="text-xs text-zinc-200 leading-snug mt-0.5">{desc}</div>}
        <div className="text-xs text-zinc-400 truncate mt-0.5">{domain}</div>
      </div>
      <ExternalLink size={14} className="shrink-0 text-zinc-300 group-hover:text-zinc-200 transition-colors" />
    </a>
  )
}
