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
  result        int,          -- 1 = win, 0 = loss
  mode          text,         -- 'rank'
  lp_after      int,          -- league_point at match time (>= 25000 = master)
  mr_after      int,          -- master_rating at match time (0 if not master)
  played_at     timestamptz
);

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
  profile    jsonb not null,     -- BucklerProfilePage
  fetched_at timestamptz not null default now()
);
