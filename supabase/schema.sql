-- Shoryu — Supabase schema reference.
-- Run manually in the Supabase SQL editor (dashboard project: REDACTED).
-- This file documents the DB; it is not applied automatically by the app.

-- ---------------------------------------------------------------------------
-- Battle history (existing) — populated on demand by syncAndGetRankedBattles.
-- ---------------------------------------------------------------------------

create table if not exists players (
  player_id      bigint primary key,
  fighter_id     text,
  last_synced_at timestamptz
);

create table if not exists battles (
  replay_id     text primary key,
  player_id     bigint not null,
  char_id       int,
  opp_player_id bigint,
  opp_char_id   int,
  opp_name      text,         -- opponent CFN name at match time; null on rows synced before Rivals
  result        int,          -- 1 = win, 0 = loss, 2 = draw (equal rounds)
  mode          text,         -- 'rank'
  lp_after      int,          -- league_point at match time (>= 25000 = master)
  mr_after      int,          -- master_rating at match time (0 if not master)
  played_at     timestamptz
);

-- Added for the Rivals tab (2026-07). Existing rows stay null; names fill in as new battles sync.
alter table battles add column if not exists opp_name text;

create index if not exists battles_player_mode_played_idx
  on battles (player_id, mode, played_at desc);

-- ---------------------------------------------------------------------------
-- Legend snapshot (existing) — character distribution of the top ranked pages,
-- written by the periodic sync cron.
-- ---------------------------------------------------------------------------

create table if not exists legend_snapshot (
  id           bigint generated always as identity primary key,
  snapped_at   timestamptz not null default now(),
  player_count int,
  data         jsonb        -- [{ character_id, count, percentage }]
);

-- ---------------------------------------------------------------------------
-- Periodic snapshots (new) — filled by /api/cron/sync every 12h so the pages
-- read from the DB instead of hitting Buckler on every render. One fresh row
-- per run; pages read the latest by snapped_at.
-- ---------------------------------------------------------------------------

-- Pro/creator banners for the /pros page.
create table if not exists pro_snapshot (
  id         bigint generated always as identity primary key,
  snapped_at timestamptz not null default now(),
  data       jsonb        -- [{ short_id, banner }]  (banner = BucklerFighterBanner | null)
);

-- Master ranking list for the /ranking page (up to ~25 pages of entries).
create table if not exists ranking_snapshot (
  id         bigint generated always as identity primary key,
  snapped_at timestamptz not null default now(),
  data       jsonb        -- BucklerRankingEntry[]
);

-- Character usage rate for the /stats page.
create table if not exists usage_snapshot (
  id         bigint generated always as identity primary key,
  snapped_at timestamptz not null default now(),
  month      text,        -- YYYYMM the usage data is for
  data       jsonb        -- BucklerUsageRateData
);

-- ---------------------------------------------------------------------------
-- Player profile cache (new) — the raw Buckler profile per player, refreshed
-- at most once per TTL (12h) or on an explicit refresh. Serves /player/[id]
-- without a Buckler fetch on every visit.
-- ---------------------------------------------------------------------------

create table if not exists player_profiles (
  player_id  bigint primary key,
  profile    jsonb not null,     -- BucklerProfilePage (includes the current-phase matchup matrix)
  fetched_at timestamptz not null default now()
);

-- NOTE: the matchup chart reads the current-phase matrix straight out of the cached profile above
-- (12h TTL), so there is no separate matchup table. Cross-phase history was dropped (Buckler only
-- exposes the current phase).

-- ---------------------------------------------------------------------------
-- Cleanup (2026-07-06). Dropped the two orphan tables left over from the
-- abandoned cross-phase attempt (they were unused):
-- ---------------------------------------------------------------------------
drop table if exists player_phase_stats;
drop table if exists player_peak;

-- Snapshot retention: the *_snapshot tables gain one row per 12h cron run but the pages read only
-- the newest, so /api/cron/sync now calls pruneSnapshots() to keep just the latest 3 rows each
-- (see lib/supabase/snapshots.ts). One-time backfill of the historical bloat was done via the API.
