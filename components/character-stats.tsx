import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RankIcon } from '@/components/rank-icon'
import { getCharacterByBucklerId, getCharacterImageUrl } from '@/lib/constants/characters'
import type { BucklerPlayData } from '@/lib/buckler'

interface CharacterStatsProps {
  playData: BucklerPlayData
}

export function CharacterStats({ playData }: CharacterStatsProps) {
  const chars = playData.character_league_infos ?? []

  // Sort by master_rating desc, then league_point desc
  const top5 = [...chars]
    .filter((c) => c.is_played)
    .sort((a, b) => {
      const aMR = a.league_info.master_rating
      const bMR = b.league_info.master_rating
      if (bMR !== aMR) return bMR - aMR
      return b.league_info.league_point - a.league_info.league_point
    })
    .slice(0, 5)

  if (top5.length === 0) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader><CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Characters</CardTitle></CardHeader>
        <CardContent><p className="text-zinc-500 text-sm">No character data</p></CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-zinc-400 uppercase tracking-wider">Characters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {top5.map((c, i) => {
          const char = getCharacterByBucklerId(c.character_id)
          const li = c.league_info

          return (
            <div key={c.character_id} className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 w-4 tabular-nums">{i + 1}</span>

              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                {char && (
                  <Image
                    src={getCharacterImageUrl(char.slug)}
                    alt={char.name}
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-200 truncate">
                  {char?.name ?? `Character ${c.character_id}`}
                </p>
                <p className="text-xs text-zinc-500">
                  {li.league_point?.toLocaleString()} LP
                  {li.master_rating > 0 && ` · ${li.master_rating} MR`}
                </p>
              </div>

              <RankIcon
                rankId={li.league_rank}
                masterRating={li.master_rating}
                size={44}
                showMR={false}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
