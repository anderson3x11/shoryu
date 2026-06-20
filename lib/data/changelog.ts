export interface ChangelogEntry {
  date: string   // "YYYY-MM-DD"
  items: string[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-06-20",
    items: [
      "Fresh new look across the whole site: a sharper fighting-game style with a bold new accent color",
      "New tournament banner: a heads up at the top of the site when a big tournament is happening that week",
      "Revamped the matchups section with clearer, easier-to-read win rates per character",
      "Redesigned the profile header, and fixed missing country flags (Monaco and more)",
    ],
  },
  {
    date: "2026-06-16",
    items: [
      "Battle history now stored in a database, matchup chart and LP/MR history get faster on every visit",
      "LP/MR chart now zooms in on your actual range instead of a fixed scale",
      "Follow updates on X: @shoryuapp",
    ],
  },
  {
    date: "2026-06-13",
    items: [
      "Shoryu has a new home: shoryu.site",
    ],
  },
  {
    date: "2026-06-08",
    items: [
      "New Stats page: character usage rates by league and control type",
      "Player profiles now show win/loss record and win rate per character",
      "Streetdle: archetypes reworked (shoto, rushdown, zoner, grappler, footsies), some characters have dual archetypes",
    ],
  },
  {
    date: "2026-06-05",
    items: [
      "Started adding Ingrid stuff on her page",
      "Fixed some issues with Streetdle data",
    ],
  },
  {
    date: "2026-06-03",
    items: [
      "Added this Changelog page so you always know what's new",
      "Added an About page",
    ],
  },
  {
    date: "2026-06-02",
    items: [
      "Match history now shows how much LP or MR you gained/lost after each ranked game",
      "You can now properly filter match history by character",
      "Replay IDs are now clickable, click to copy instantly",
      "New: Session view, groups your most recent ranked session in one place",
    ],
  },
  {
    date: "2026-06-01",
    items: [
      "New mini game: Streetdle ! Guess the daily SF character, 72 characters from across the series",
      "Ingrid added across the whole site",
    ],
  },
  {
    date: "2026-05-26",
    items: [
      "Player search now has a full results page with pagination",
      "Pros page is live ! Browse pro players and content creators",
      "Various visual fixes on player profiles",
    ],
  },
  {
    date: "2026-05-25",
    items: [
      "Recently searched players now appear on the home page for quick access",
      "Character pages now include tech videos organized by category",
    ],
  },
  {
    date: "2026-05-22",
    items: [
      "Shoryu is live!",
      "Master Rating leaderboard",
      "Tournament page with Tier 1 results, prize pools, and player info",
      "Pro players and content creators page",
    ],
  },
  {
    date: "2026-05-21",
    items: [
      "Matchup chart: see your win rate for every character combination",
      "LP/MR history chart: track your progression over time per character",
    ],
  },
  {
    date: "2026-05-20",
    items: [
      "Player profiles are up : rank, region, platform, character stats, and match history",
    ],
  },
]
