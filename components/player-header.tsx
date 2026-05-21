import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { getRankImageUrl, getRank, TIER_COLORS, showsMasterRating, getEffectiveRankId } from '@/lib/constants/ranks'
import { getCharacterImageUrl } from '@/lib/constants/characters'
import type { BucklerFighterBanner } from '@/lib/buckler'

interface PlayerHeaderProps {
  banner: BucklerFighterBanner
}

const PLATFORM_ICONS: Record<string, string> = {
  steam:      'PC',
  ps4:        'PS4',
  ps5:        'PS5',
  xboxone:    'Xbox',
  xboxseries: 'Xbox',
  cross:      'Cross',
}

const FLAG: Record<string, string> = {
  'Japan': '🇯🇵', 'France': '🇫🇷', 'United States': '🇺🇸', 'Germany': '🇩🇪',
  'United Kingdom': '🇬🇧', 'South Korea': '🇰🇷', 'Brazil': '🇧🇷', 'Canada': '🇨🇦',
  'Australia': '🇦🇺', 'Italy': '🇮🇹', 'Spain': '🇪🇸', 'Mexico': '🇲🇽',
  'China': '🇨🇳', 'Taiwan': '🇹🇼', 'Russia': '🇷🇺', 'Netherlands': '🇳🇱',
  'Sweden': '🇸🇪', 'Portugal': '🇵🇹', 'Argentina': '🇦🇷', 'Chile': '🇨🇱',
  'Colombia': '🇨🇴', 'Saudi Arabia': '🇸🇦', 'Thailand': '🇹🇭', 'Philippines': '🇵🇭',
  'Indonesia': '🇮🇩', 'Singapore': '🇸🇬', 'Malaysia': '🇲🇾', 'Vietnam': '🇻🇳',
  'Hong Kong': '🇭🇰', 'New Zealand': '🇳🇿', 'South Africa': '🇿🇦', 'Poland': '🇵🇱',
  'Ukraine': '🇺🇦', 'Belgium': '🇧🇪', 'Switzerland': '🇨🇭', 'Austria': '🇦🇹',
  'Turkey': '🇹🇷', 'India': '🇮🇳', 'Morocco': '🇲🇦', 'Egypt': '🇪🇬',
  'Finland': '🇫🇮', 'Denmark': '🇩🇰', 'Norway': '🇳🇴', 'Czech Republic': '🇨🇿',
  'Romania': '🇷🇴', 'Hungary': '🇭🇺', 'Greece': '🇬🇷', 'Peru': '🇵🇪',
  'Venezuela': '🇻🇪', 'Pakistan': '🇵🇰', 'Algeria': '🇩🇿', 'Tunisia': '🇹🇳',
}

export function PlayerHeader({ banner }: PlayerHeaderProps) {
  const info = banner.personal_info
  const charSlug = banner.favorite_character_tool_name
  const leagueInfo = banner.favorite_character_league_info
  const mr = leagueInfo?.master_rating ?? 0
  const lp = leagueInfo?.league_point ?? 0
  const flag = banner.home_name ? (FLAG[banner.home_name] ?? '') : ''
  const effectiveRankId = getEffectiveRankId(
    leagueInfo?.league_rank ?? 39,
    leagueInfo?.master_league ?? 0,
    leagueInfo?.master_rating_ranking ?? 0,
    mr
  )
  const isLegend = effectiveRankId === 37
  const rank = getRank(effectiveRankId)
  const rankColor = TIER_COLORS[rank.tier] ?? '#ffffff'
  const hasMR = showsMasterRating(leagueInfo?.league_rank ?? 39) && mr > 0

  return (
    <Card className="bg-zinc-900 py-0 gap-0">
      <div className="flex items-center gap-4 px-5 py-4">

        {/* Character art — crops to face, no bg, no border */}
        <div className="relative w-[88px] h-[88px] flex-shrink-0">
          {charSlug && (
            <Image
              src={getCharacterImageUrl(charSlug)}
              alt={banner.favorite_character_name}
              fill
              className="object-cover object-top"
              unoptimized
            />
          )}
        </div>

        {/* Player info */}
        <div className="flex-1 min-w-0 space-y-1">
          <h1 className="text-2xl font-bold text-white leading-none">
            {info.fighter_id}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            {flag && <span className="text-base leading-none">{flag}</span>}
            {banner.home_name && (
              <span className="text-sm text-zinc-400">{banner.home_name}</span>
            )}
            {info.platform_tool_name && (
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                {PLATFORM_ICONS[info.platform_tool_name] ?? info.platform_name}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-600 tabular-nums">#{info.short_id}</p>
          {banner.title_data?.title_data_val && (
            <p className="text-xs text-zinc-500 italic">
              &ldquo;{banner.title_data.title_data_val}&rdquo;
            </p>
          )}
        </div>

        {/* Rank — landscape container kills the transparent bottom padding in the PNG */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1">
          <div className="relative" style={{ width: 160, height: 100 }}>
            <Image
              src={getRankImageUrl(effectiveRankId)}
              alt={rank.name}
              fill
              className="object-contain drop-shadow-md"
              unoptimized
            />
          </div>
          {isLegend && (leagueInfo?.master_rating_ranking ?? 0) > 0 ? (
            <span className="text-base font-bold tabular-nums" style={{ color: rankColor }}>
              #{leagueInfo!.master_rating_ranking}
            </span>
          ) : hasMR ? (
            <span className="text-base font-bold tabular-nums" style={{ color: rankColor }}>
              {mr.toLocaleString()} MR
            </span>
          ) : lp > 0 ? (
            <span className="text-base font-bold tabular-nums text-zinc-200">
              {lp.toLocaleString()} LP
            </span>
          ) : null}
        </div>

      </div>
    </Card>
  )
}
