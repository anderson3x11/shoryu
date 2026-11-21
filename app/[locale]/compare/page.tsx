import Image from 'next/image'
import Link from 'next/link'
import { DEFAULT_LOCALE, isLocale, localeHref } from '@/lib/i18n/locales'
import { getDict } from '@/lib/i18n/dict'
import { isShortId, type BucklerProfilePage } from '@/lib/buckler'
import { getCachedPlayerProfile } from '@/lib/supabase/player-cache'
import { getHeadToHead } from '@/lib/supabase/battles'
import { getCharacterByBucklerId, getCharacterImageUrl } from '@/lib/constants/characters'
import { getEffectiveRankId, getRank, getRankImageUrl, showsMasterRating } from '@/lib/constants/ranks'
import { cn } from '@/lib/utils'
import { CompareForm } from './compare-form'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return { ...getDict(isLocale(locale) ? locale : DEFAULT_LOCALE).meta.compare }
}

// Aggregate pseudo-character Buckler adds to win rate lists ("Any"), and Random.
const AGGREGATE = 253
const RANDOM = 254

type Loaded = { id: string; profile: BucklerProfilePage } | { id: string; error: 'notFound' | 'unavailable' }

async function load(id: string | undefined): Promise<Loaded | null> {
  if (!id) return null
  if (!isShortId(id)) return { id, error: 'notFound' }
  const r = await getCachedPlayerProfile(id)
  if (r.status === 'ok') return { id, profile: r.profile }
  return { id, error: r.status === 'notfound' ? 'notFound' : 'unavailable' }
}

// Everything the table compares, read from the cached profile (current phase, all modes).
function summarize(profile: BucklerProfilePage) {
  const banner = profile.fighter_banner_info
  const play = profile.play
  const li = banner.favorite_character_league_info
  const rankId = getEffectiveRankId(li.league_rank, li.master_league, li.master_rating_ranking, li.master_rating)
  const stats = play?.battle_stats
  const rates = (play?.character_win_rates ?? []).filter((w) => w.character_id !== RANDOM)
  const all = rates.find((w) => w.character_id === AGGREGATE)
  const perChar = rates.filter((w) => w.character_id !== AGGREGATE && w.battle_count > 0)
  const top = [...perChar].sort((a, b) => b.battle_count - a.battle_count)[0]
  const rankedSec = play?.base_info.content_play_time_list.find((p) => p.content_type_name === 'Ranked Matches')?.play_time ?? 0
  return {
    name: banner.personal_info.fighter_id,
    shortId: banner.personal_info.short_id,
    country: banner.home_name,
    favorite: banner.favorite_character_tool_name,
    rankId,
    // Sort key for the rank row: any Master beats any LP rank, then MR decides among Masters (a
    // Master with no MR this phase still outranks Diamond, whatever its huge leftover LP).
    rankScore: showsMasterRating(rankId) ? 1e6 + li.master_rating : li.league_point,
    rankLabel: showsMasterRating(rankId) && li.master_rating > 0 ? `${li.master_rating.toLocaleString('en-US')} MR` : `${Math.max(0, li.league_point).toLocaleString('en-US')} LP`,
    matches: stats
      ? stats.rank_match_play_count + stats.casual_match_play_count + stats.battle_hub_match_play_count + stats.custom_room_match_play_count
      : 0,
    ranked: stats?.rank_match_play_count ?? 0,
    winRate: all && all.battle_count > 0 ? (all.win_count / all.battle_count) * 100 : null,
    winGames: all?.battle_count ?? 0,
    topChar: top ? getCharacterByBucklerId(top.character_id) : undefined,
    topGames: top?.battle_count ?? 0,
    characters: perChar.length,
    rankedHours: Math.round(rankedSec / 3600),
  }
}

type Summary = ReturnType<typeof summarize>

function PlayerCard({ s, href }: { s: Summary; href: string }) {
  const rank = getRank(s.rankId)
  return (
    <Link href={href} prefetch={false} className="flex items-center gap-3 border border-zinc-800 bg-zinc-900 p-3 hover:border-zinc-600 transition-colors">
      <div className="relative w-16 h-16 overflow-hidden bg-zinc-800 shrink-0">
        <Image src={getCharacterImageUrl(s.favorite)} alt="" fill className="object-cover object-top" unoptimized />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-bold text-zinc-100">{s.name}</p>
        <p className="truncate text-xs text-zinc-400">{s.country} · #{s.shortId}</p>
      </div>
      <div className="flex flex-col items-center shrink-0">
        <div className="relative w-20 h-12">
          <Image src={getRankImageUrl(s.rankId)} alt={rank.name} fill className="object-contain" unoptimized />
        </div>
        <span className="text-xs font-bold tabular-nums text-zinc-200">{s.rankLabel}</span>
      </div>
    </Link>
  )
}

export default async function ComparePage({ params, searchParams }: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ a?: string; b?: string }>
}) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE
  const t = getDict(locale).compare
  const { a, b } = await searchParams

  const [pa, pb] = await Promise.all([load(a), load(b)])
  const ok = (p: Loaded | null): p is { id: string; profile: BucklerProfilePage } => !!p && 'profile' in p
  const sa = ok(pa) ? summarize(pa.profile) : null
  const sb = ok(pb) ? summarize(pb.profile) : null
  const h2h = sa && sb ? await getHeadToHead(sa.shortId, sb.shortId) : null

  // Label, the two values, and which side is ahead (null when it doesn't apply or it's a tie).
  const rows: { label: string; a: string; b: string; better: 'a' | 'b' | null }[] = []
  if (sa && sb) {
    const cmp = (x: number | null, y: number | null) => (x === null || y === null || x === y ? null : x > y ? 'a' : 'b')
    const n = (v: number) => v.toLocaleString('en-US')
    rows.push(
      { label: t.rank, a: `${getRank(sa.rankId).name} · ${sa.rankLabel}`, b: `${getRank(sb.rankId).name} · ${sb.rankLabel}`, better: cmp(sa.rankScore, sb.rankScore) },
      { label: t.matches, a: n(sa.matches), b: n(sb.matches), better: cmp(sa.matches, sb.matches) },
      { label: t.ranked, a: n(sa.ranked), b: n(sb.ranked), better: cmp(sa.ranked, sb.ranked) },
      {
        label: t.winRate,
        a: sa.winRate === null ? '-' : `${sa.winRate.toFixed(1)}% (${n(sa.winGames)})`,
        b: sb.winRate === null ? '-' : `${sb.winRate.toFixed(1)}% (${n(sb.winGames)})`,
        better: cmp(sa.winRate, sb.winRate),
      },
      { label: t.mostPlayed, a: sa.topChar ? `${sa.topChar.name} (${n(sa.topGames)})` : '-', b: sb.topChar ? `${sb.topChar.name} (${n(sb.topGames)})` : '-', better: null },
      { label: t.characters, a: n(sa.characters), b: n(sb.characters), better: null },
      { label: t.rankedTime, a: `${n(sa.rankedHours)}h`, b: `${n(sb.rankedHours)}h`, better: cmp(sa.rankedHours, sb.rankedHours) },
    )
  }
  const errorText = (p: Loaded | null) => (p && 'error' in p ? (p.error === 'notFound' ? t.notFound : t.unavailable) : null)

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="block w-2 h-10 sm:h-12 -skew-x-12 bg-amber-400 shrink-0" />
          <h1 className="font-bebas text-4xl sm:text-6xl tracking-widest text-zinc-100">{t.title}</h1>
        </div>
        <p className="text-sm text-zinc-300">{t.intro}</p>
      </div>

      <CompareForm
        players={{ a: sa?.name ?? null, b: sb?.name ?? null }}
        labels={{ pickA: t.pickA, pickB: t.pickB, change: t.change }}
      />
      {[errorText(pa), errorText(pb)].filter(Boolean).map((e, i) => (
        <p key={i} className="text-sm text-red-400">{e}</p>
      ))}

      {sa && sb && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PlayerCard s={sa} href={localeHref(locale, `/player/${sa.shortId}`)} />
            <PlayerCard s={sb} href={localeHref(locale, `/player/${sb.shortId}`)} />
          </div>

          <div className="border border-zinc-800 bg-zinc-900">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 border-b border-zinc-800 last:border-b-0 px-3 sm:px-4 py-2.5">
                <span className={cn('text-sm tabular-nums text-right', r.better === 'a' ? 'font-bold text-amber-400' : 'text-zinc-200')}>{r.a}</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-zinc-500 text-center max-w-28 sm:max-w-none">{r.label}</span>
                <span className={cn('text-sm tabular-nums', r.better === 'b' ? 'font-bold text-amber-400' : 'text-zinc-200')}>{r.b}</span>
              </div>
            ))}
          </div>

          <div className="border border-zinc-800 bg-zinc-900 px-4 py-4 text-center space-y-1">
            <p className="text-xs uppercase tracking-wider text-zinc-500">{t.h2h}</p>
            {h2h && h2h.wins + h2h.losses + h2h.draws > 0 ? (
              <p className="font-bebas text-4xl tracking-widest text-zinc-100 tabular-nums">
                <span className={cn(h2h.wins > h2h.losses && 'text-amber-400')}>{h2h.wins}</span>
                <span className="text-zinc-600"> - </span>
                <span className={cn(h2h.losses > h2h.wins && 'text-amber-400')}>{h2h.losses}</span>
              </p>
            ) : (
              <p className="text-sm text-zinc-300">{t.h2hNone}</p>
            )}
            <p className="text-[11px] text-zinc-500">{t.h2hNote}</p>
          </div>
        </>
      )}
    </div>
  )
}
