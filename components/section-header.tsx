export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="block w-1.5 h-6 -skew-x-12 shrink-0" style={{ background: 'var(--accent, #fbbf24)' }} />
      <h2 className="font-bebas text-2xl tracking-widest text-zinc-100 leading-none">{children}</h2>
    </div>
  )
}
