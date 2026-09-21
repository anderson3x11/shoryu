<p align="center">
  <img src="public/logo.png" alt="Shoryu" width="120" />
</p>

<h1 align="center">Shoryu</h1>

<p align="center">
  Street Fighter 6 player stats, rankings, matchup charts and character guides.
  <br />
  <a href="https://shoryu.site"><strong>shoryu.site</strong></a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-f59e0b" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6" alt="TypeScript" />
</p>

---

## Features

- **Player profiles**: League Points / Master Rating history, match history, per-character matchup charts, rivals, session summaries and play counts.
- **Master ranking**: the top of the Master league, refreshed on a schedule.
- **Character usage stats**: usage rates across every rank tier.
- **Character pages**: overview, vitals, frame data, combos, matchups and patch notes for every SF6 character.
- **Pro players & creators**: live profiles of well-known players.
- **Tournaments**: Tier 1 results, prize pools and top placements.
- **Streetdle**: a daily "guess the Street Fighter character" game.
- **Guides**: curated learning resources.

Every page is built mobile first and works from 375px wide.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, React Server Components) and TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org) for charts
- [Supabase](https://supabase.com) (Postgres) for caching and historical snapshots

## How it works

Capcom has no public API for Street Fighter 6. Shoryu reads player data from
[Buckler's Boot Camp](https://www.streetfighter.com/6/buckler), Capcom's official SF6 site, by parsing
the `__NEXT_DATA__` JSON embedded in its server-rendered pages. Requests need a logged-in session
cookie and go through a pacing queue (`lib/buckler/client.ts`) so the site never floods Buckler.

To keep Buckler traffic low, most data is cached in Supabase:

| Data | Source | Refreshed by |
| --- | --- | --- |
| Player profiles | Buckler | On visit, at most every 12h (or on manual refresh) |
| Match history | Buckler | On demand, stored incrementally |
| Ranking, pros, usage rates | Buckler | `/api/cron/sync`, every 12h |
| Character reference data | [SuperCombo wiki](https://wiki.supercombo.gg) | `scripts/refresh-supercombo.ts`, by hand after a balance patch |
| Tournaments | [Liquipedia](https://liquipedia.net/fighters) | `scripts/refresh-tournaments.ts`, weekly GitHub Action |

## Getting started

### Prerequisites

- Node.js 20 or newer (CI uses 22)
- A free [Supabase](https://supabase.com) project
- A Capcom ID account that can log into Buckler

### 1. Clone and install

```bash
git clone https://github.com/anderson3x11/shoryu.git
cd shoryu
npm install
```

### 2. Set up the database

Open your Supabase project's SQL editor and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
It creates every table and index the app uses.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `BUCKLER_COOKIE` | Yes | Your Buckler `buckler_id` session cookie (see below). |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key. Server-side only, never expose it to the browser. |
| `CRON_SECRET` | In production | Protects `/api/cron/sync`. When set, the route requires `Authorization: Bearer CRON_SECRET`. |
| `NEXT_PUBLIC_BASE_URL` | No | Public URL of your deployment, used for metadata. Defaults to `https://shoryu.site`. |
| `NEXT_PUBLIC_UMAMI_URL` | No | [Umami](https://umami.is) script URL. Analytics are only loaded when both Umami variables are set. |
| `NEXT_PUBLIC_UMAMI_ID` | No | Umami website ID. |

**Getting the Buckler cookie:** log into [Buckler](https://www.streetfighter.com/6/buckler), open your
browser's DevTools, go to **Application > Cookies > www.streetfighter.com** and copy the value of
`buckler_id`. The cookie expires periodically; when player pages start coming back empty, grab a
fresh one.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Fill the snapshot tables (optional)

The ranking, pros and stats pages read from snapshots written by the sync job. Trigger it once locally:

```bash
curl http://localhost:3000/api/cron/sync
# with CRON_SECRET set:
curl -H "Authorization: Bearer CRON_SECRET" http://localhost:3000/api/cron/sync
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npx tsx scripts/refresh-supercombo.ts [charId ...]` | Regenerate the character reference data in `lib/data/supercombo/`. |
| `npx tsx scripts/refresh-tournaments.ts` | Regenerate `lib/data/tournaments.json` from Liquipedia. |

## Deployment

Shoryu is a standard Next.js app and runs anywhere Next.js does (Node server, Docker, or a platform like
Vercel). Beyond the environment variables above, a production deployment needs:

1. **A scheduler** that calls `/api/cron/sync` every 12 hours with the `CRON_SECRET` bearer token.
   Any cron service or your host's scheduled tasks will do. The job can take a few minutes.
2. **The tournaments workflow** (`.github/workflows/refresh-tournaments.yml`), which runs weekly on
   GitHub Actions and commits the new snapshot when it changes. Enable Actions on your fork to use it.

## Project structure

```
app/            Routes (pages and API handlers)
components/     React components (shadcn/ui primitives in components/ui)
lib/buckler/    Buckler session, client and response types
lib/supabase/   Database access and caching
lib/constants/  Characters, ranks, flags
lib/data/       Static snapshots (SuperCombo, tournaments, changelog)
scripts/        Data refresh scripts
supabase/       Database schema
public/         Images, fonts and icons
```

## Contributing

Contributions are welcome. Bug reports, fixes, new stats and design improvements are all fair game.

1. Fork the repo and create a branch from `main`.
2. Make your change. Keep it focused, and check that it holds up on a 375px wide screen.
3. Run `npm run lint` and `npm run build`.
4. Open a pull request describing what changed and why. Screenshots help for UI changes.

For bigger changes, open an issue first so we can agree on the approach.

A few conventions to follow:

- Buckler data comes from `__NEXT_DATA__` only. Don't guess at undocumented endpoints.
- Every Buckler request must go through the pacing queue in `lib/buckler/client.ts`.
- Use `getEffectiveRankId()` for rank sub-tiers instead of reimplementing the logic.
- Master rank starts at `league_point >= 25000`. Show MR above it and LP below.
- Amber is the only accent color, corners stay square (`rounded-none`), and text never gets a glow.

## Acknowledgements

- Character reference data comes from the [SuperCombo wiki](https://wiki.supercombo.gg), and tournament
  data from [Liquipedia](https://liquipedia.net/fighters). Both are licensed under
  [CC BY-SA](https://creativecommons.org/licenses/by-sa/3.0/). Thanks to their editors.
- Player data comes from Capcom's [Buckler's Boot Camp](https://www.streetfighter.com/6/buckler).

## License

The source code is released under the [MIT License](LICENSE).

The MIT License covers only this project's code. Wiki-derived data keeps its CC BY-SA license.
Street Fighter, character names, artwork and rank icons are trademarks and property of Capcom.
Bundled fonts are covered by their own licenses. Shoryu is a fan project, not affiliated with or
endorsed by Capcom.
