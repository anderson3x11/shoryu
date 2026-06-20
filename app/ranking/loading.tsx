export default function RankingLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-3">
          <span className="block w-2 h-10 sm:h-12 -skew-x-12 bg-amber-400 shrink-0" />
          <h1 className="font-bebas text-6xl tracking-widest text-zinc-100">Master Ranking</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-none border border-zinc-800 bg-zinc-900 px-4 py-3 animate-pulse"
          >
            <div className="w-8 flex-shrink-0" />
            <div className="w-12 h-12 rounded-none bg-zinc-800 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-zinc-800 rounded-none w-3/4" />
              <div className="h-3 bg-zinc-800 rounded-none w-1/4" />
            </div>
            <div className="w-20 h-[50px] bg-zinc-800 rounded-none flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
