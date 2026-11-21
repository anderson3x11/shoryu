import { vitalRows, type Vitals } from '@/lib/supercombo'
import type { Dict } from '@/lib/i18n/dict'

/** Health, movement and reach numbers straight from the wiki's character data. */
export function CharacterVitals({ vitals, t }: { vitals: Vitals; t: Dict['character'] }) {
  return (
    <div className="divide-y divide-zinc-800">
      <div className="flex items-baseline justify-between gap-3 pb-2.5">
        <span className="text-xs uppercase tracking-wide text-zinc-400">{t.health}</span>
        <span className="text-2xl font-bold tabular-nums leading-none text-zinc-100">
          {vitals.hp.toLocaleString('en-US')}
        </span>
      </div>

      <dl className="py-1">
        {vitalRows(vitals).map((s) => (
          <div key={s.key} className="flex items-baseline justify-between gap-3 py-1" title={t.vitalHint[s.key]}>
            <dt className="text-xs uppercase tracking-wide text-zinc-400">{t.vital[s.key]}</dt>
            <dd className="text-sm font-semibold tabular-nums text-zinc-100">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex items-baseline justify-between gap-3 pt-2.5">
        <span className="text-xs uppercase tracking-wide text-zinc-400">{t.jump}</span>
        <span className="text-sm font-semibold tabular-nums text-zinc-100">{vitals.jumpSpd} f</span>
      </div>
    </div>
  )
}
