import { vitalRows, type Vitals } from '@/lib/supercombo'

/** Health, movement and reach numbers straight from the wiki's character data. */
export function CharacterVitals({ vitals }: { vitals: Vitals }) {
  return (
    <div className="divide-y divide-zinc-800">
      <div className="flex items-baseline justify-between gap-3 pb-2.5">
        <span className="text-xs uppercase tracking-wide text-zinc-400">Health</span>
        <span className="text-2xl font-bold tabular-nums leading-none text-zinc-100">
          {vitals.hp.toLocaleString('en-US')}
        </span>
      </div>

      <dl className="py-1">
        {vitalRows(vitals).map((s) => (
          <div key={s.key} className="flex items-baseline justify-between gap-3 py-1" title={s.hint}>
            <dt className="text-xs uppercase tracking-wide text-zinc-400">{s.label}</dt>
            <dd className="text-sm font-semibold tabular-nums text-zinc-100">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex items-baseline justify-between gap-3 pt-2.5">
        <span className="text-xs uppercase tracking-wide text-zinc-400">Jump</span>
        <span className="text-sm font-semibold tabular-nums text-zinc-100">{vitals.jumpSpd} f</span>
      </div>
    </div>
  )
}
