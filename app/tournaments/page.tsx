import { ExternalLink } from 'lucide-react'
import { getTournaments } from '@/lib/liquipedia'
import type { Player, Tournament, TournamentYear } from '@/lib/liquipedia'

export const metadata = { title: 'Tournaments - Shoryu' }

function proxy(url: string) {
  return `/api/lp-icon?url=${encodeURIComponent(url)}`
}

function PlayerCell({ player, className }: { player: Player; className?: string }) {
  return (
    <a
      href={player.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 hover:text-white transition-colors ${className ?? ''}`}
    >
      {player.flagUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={proxy(player.flagUrl)} alt={player.flagAlt ?? ''} className="h-3 w-auto object-contain shrink-0" />
      )}
      {player.charUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={proxy(player.charUrl)} alt={player.charAlt ?? ''} className="h-5 w-5 object-contain rounded-sm shrink-0" />
      )}
      {player.name}
    </a>
  )
}

function TournamentRow({ t }: { t: Tournament }) {
  return (
    <tr className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
      <td className="py-2.5 pl-4 pr-4">
        <a
          href={t.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium text-zinc-100 hover:text-white transition-colors group"
        >
          <span className="inline-flex items-center justify-center w-8 h-5 shrink-0">
            {t.iconUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={proxy(t.iconUrl)} alt="" className="max-w-full max-h-full object-contain" />
            )}
          </span>
          {t.name}
          <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0" />
        </a>
      </td>
      <td className="py-2.5 pr-4 text-zinc-400 whitespace-nowrap text-sm">{t.date}</td>
      <td className="py-2.5 pr-4 text-zinc-300 whitespace-nowrap text-sm">
        {t.prizePool ?? <span className="text-zinc-600">N/A</span>}
      </td>
      <td className="py-2.5 pr-4 text-zinc-400 whitespace-nowrap text-sm">
        {t.location ?? <span className="text-zinc-600">N/A</span>}
      </td>
      <td className="py-2.5 pr-4 whitespace-nowrap text-sm">
        {t.winner && <PlayerCell player={t.winner} className="text-amber-400" />}
      </td>
      <td className="py-2.5 pr-4 whitespace-nowrap text-sm">
        {t.runnerUp && <PlayerCell player={t.runnerUp} className="text-zinc-300" />}
      </td>
    </tr>
  )
}

function YearSection({ year, tournaments }: TournamentYear) {
  return (
    <section className="space-y-2">
      <h2 className="font-bebas text-4xl tracking-widest text-zinc-100">{year}</h2>
      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="pl-4 pr-4 py-2.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tournament</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Date</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Prize</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Location</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Winner</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Runner-up</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-900/50">
            {tournaments.map(t => (
              <TournamentRow key={t.url} t={t} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default async function TournamentsPage() {
  const data = await getTournaments()

  return (
    <div className="space-y-8">
      <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Tournaments</h1>

      {data.length === 0 && (
        <p className="text-zinc-400">Tournament data temporarily unavailable.</p>
      )}

      {data.map(section => (
        <YearSection key={section.year} {...section} />
      ))}
    </div>
  )
}
