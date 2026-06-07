export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-14 w-32 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-8 w-16 bg-zinc-800 rounded-md animate-pulse" />
        ))}
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="h-7 w-16 bg-zinc-800 rounded-full animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 rounded-lg border border-zinc-800 h-36 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
