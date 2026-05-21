import { getBattleLog } from '@/lib/buckler'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const mode = searchParams.get('mode') ?? 'all'
  const page = Number(searchParams.get('page') ?? '1')

  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  if (mode === 'all') {
    const [rank, casual, hub, custom] = await Promise.all([
      getBattleLog(id, page, 'rank'),
      getBattleLog(id, page, 'casual'),
      getBattleLog(id, page, 'hub'),
      getBattleLog(id, page, 'custom'),
    ])
    const battles = [
      ...(rank?.replay_list ?? []),
      ...(casual?.replay_list ?? []),
      ...(hub?.replay_list ?? []),
      ...(custom?.replay_list ?? []),
    ].sort((a, b) => b.uploaded_at - a.uploaded_at).slice(0, 10)
    const totalPages = Math.max(
      rank?.total_page ?? 1,
      casual?.total_page ?? 1,
      hub?.total_page ?? 1,
      custom?.total_page ?? 1,
    )
    return Response.json({ battles, totalPages, currentPage: page })
  }

  const data = await getBattleLog(id, page, mode as 'rank' | 'casual' | 'hub' | 'custom' | 'extreme')
  if (!data) return Response.json({ battles: [], totalPages: 1, currentPage: 1 })

  return Response.json({
    battles: data.replay_list,
    totalPages: data.total_page,
    currentPage: data.current_page,
  })
}
