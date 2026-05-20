import Image from 'next/image'
import { getRank, getRankImageUrl, TIER_COLORS } from '@/lib/constants/ranks'

interface RankIconProps {
  rankId: number
  masterRating?: number
  size?: number
  showLabel?: boolean
  showMR?: boolean
}

export function RankIcon({ rankId, masterRating, size = 48, showLabel = false, showMR = true }: RankIconProps) {
  const rank = getRank(rankId)
  const color = TIER_COLORS[rank.tier] ?? TIER_COLORS.unknown
  const isMasterTier = rankId >= 20 || rankId === 40 || rankId === 41 || rankId === 42
  const isLegend = rankId === 37

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <Image
          src={getRankImageUrl(rankId)}
          alt={rank.name}
          width={size}
          height={size}
          className="object-contain drop-shadow-md"
          unoptimized
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold" style={{ color }}>
          {rank.name}
        </span>
      )}
      {showMR && (isMasterTier || isLegend) && masterRating != null && masterRating > 0 && (
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {masterRating.toLocaleString()} MR
        </span>
      )}
    </div>
  )
}
