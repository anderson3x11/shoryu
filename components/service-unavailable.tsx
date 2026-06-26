// Shown when Buckler (Capcom's servers / our scraping session) is unreachable, so visitors
// get a clear "temporary" message instead of a 404 that reads like the page doesn't exist.
export function ServiceUnavailable({
  title = 'Data Unavailable',
  message = "We can't reach Capcom's Buckler servers right now. This is usually temporary, so please try again in a little while.",
}: {
  title?: string
  message?: string
}) {
  return (
    <div className="max-w-xl mx-auto py-20 sm:py-28 text-center space-y-5">
      <div className="flex items-center justify-center gap-2.5">
        <span className="block w-1.5 h-8 -skew-x-12 bg-amber-400 shrink-0" />
        <h1 className="font-bebas text-5xl sm:text-6xl tracking-widest text-zinc-100 leading-none">{title}</h1>
      </div>
      <p className="text-zinc-400 leading-relaxed px-4">{message}</p>
    </div>
  )
}
