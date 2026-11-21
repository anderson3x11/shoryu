export interface ChangelogEntry {
  version: string  // "1.2": minor for a big release, patch ("1.2.1") for the ones after it
  title: string    // release name shown next to the version
  date: string     // "YYYY-MM-DD"
  items: string[]
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.2.1",
    title: "Fresh Rivals",
    date: "2026-11-21",
    items: [
      "Rivals now look at your ranked games from the last 90 days, so they show who you face now and no more \"Unknown\" opponents",
    ],
  },
  {
    version: "1.2",
    title: "Head to Head",
    date: "2026-11-21",
    items: [
      "Frame meter on every move: startup, active and recovery frames at a glance, like the in-game meter",
      "More frame data on each move: hitstun, blockstun, hit confirm window, juggle values, drive rush and perfect parry advantage, thanks to FAT",
      "Moves are now in a proper order: each special with all its versions together, normals from light to heavy",
      "Hitbox buttons now say what they show (full hitbox, hit 1, hit 2...), and \"Move\" became \"Hide hitbox\"",
      "The \"Updated\" time next to Refresh now shows when the profile was really last updated",
      "Fixed the top menu overflowing on tablets and small laptops",
      "A broken or mistyped link now lands on a proper page with a player search",
      "Phase picker on player profiles: look back at any past phase, with its win rates, matchups, final ranks and peak MR",
      "New Compare page: two players side by side, with their ranked head-to-head record",
      "Master ranking filters: by character and by country",
      "Frame data: quick filters (plus on block, safe, invincible, armor), sorting, and search in move notes",
      "Arjun's frame data now has hitbox images",
      "The current version is now shown in the footer",
      "Japanese and Portuguese now cover the whole site: profiles, character pages, frame data, stats, tournaments, guides and Streetdle",
      "New character, country, phase and sort pickers in the site's style, with character portraits",
      "The ranking now says it's a snapshot refreshed every 12 hours, and how old it is",
      "The LP/MR chart only offers the characters played in ranked this phase, and says so when a past phase has no history to show",
      "Fixed large ranking positions overlapping the character portraits",
    ],
  },
  {
    version: "1.1.15",
    title: "Hitbox Reveal",
    date: "2026-10-19",
    items: [
      "Frame data redesigned as cards, with the hitbox image of every move",
      "New tech videos and timestamped chapters on character pages",
      "The Refresh button now really pulls the latest data, and match history updates along with the rest of the profile",
    ],
  },
  {
    version: "1.1.14",
    title: "Here Comes Arjun",
    date: "2026-10-14",
    items: [
      "Arjun is in: he shows up on the character grid, in stats and matchups, and has his own page",
      "Arjun added to Streetdle's roster",
    ],
  },
  {
    version: "1.1.13",
    title: "Here Comes Yasmine",
    date: "2026-08-05",
    items: [
      "Yasmine is in: she shows up on the character grid, in stats and matchups, and has her own page",
      "Yasmine added to Streetdle's roster",
    ],
  },
  {
    version: "1.1.12",
    title: "Rivals",
    date: "2026-07-06",
    items: [
      "New Rivals tab on player profiles: see the opponents you face the most, the ones you beat the most, and the ones who give you the most trouble",
      "Player data now loads lighter and a little faster behind the scenes",
    ],
  },
  {
    version: "1.1.11",
    title: "Fresh Costume",
    date: "2026-06-20",
    items: [
      "Fresh new look across the whole site: a sharper fighting-game style with a bold new accent color",
      "New tournament banner: a heads up at the top of the site when a big tournament is happening that week",
      "Revamped the matchups section with clearer, easier-to-read win rates per character",
      "Redesigned the profile header, and fixed missing country flags (Monaco and more)",
    ],
  },
  {
    version: "1.1.10",
    title: "Memory Card",
    date: "2026-06-16",
    items: [
      "Battle history now stored in a database, matchup chart and LP/MR history get faster on every visit",
      "LP/MR chart now zooms in on your actual range instead of a fixed scale",
      "Follow updates on X: @shoryuapp",
    ],
  },
  {
    version: "1.1.9",
    title: "New Stage",
    date: "2026-06-13",
    items: [
      "Shoryu has a new home: shoryu.site",
    ],
  },
  {
    version: "1.1.8",
    title: "Tier List",
    date: "2026-06-08",
    items: [
      "New Stats page: character usage rates by league and control type",
      "Player profiles now show win/loss record and win rate per character",
      "Streetdle: archetypes reworked (shoto, rushdown, zoner, grappler, footsies), some characters have dual archetypes",
    ],
  },
  {
    version: "1.1.7",
    title: "Hotfix",
    date: "2026-06-05",
    items: [
      "Started adding Ingrid stuff on her page",
      "Fixed some issues with Streetdle data",
    ],
  },
  {
    version: "1.1.6",
    title: "Patch Notes",
    date: "2026-06-03",
    items: [
      "Added this Changelog page so you always know what's new",
      "Added an About page",
    ],
  },
  {
    version: "1.1.5",
    title: "Session Mode",
    date: "2026-06-02",
    items: [
      "Match history now shows how much LP or MR you gained/lost after each ranked game",
      "You can now properly filter match history by character",
      "Replay IDs are now clickable, click to copy instantly",
      "New: Session view, groups your most recent ranked session in one place",
    ],
  },
  {
    version: "1.1.4",
    title: "Streetdle",
    date: "2026-06-01",
    items: [
      "New mini game: Streetdle ! Guess the daily SF character, 72 characters from across the series",
      "Ingrid added across the whole site",
    ],
  },
  {
    version: "1.1.3",
    title: "Scouting Report",
    date: "2026-05-26",
    items: [
      "Player search now has a full results page with pagination",
      "Pros page is live ! Browse pro players and content creators",
      "Various visual fixes on player profiles",
    ],
  },
  {
    version: "1.1.2",
    title: "Quick Rise",
    date: "2026-05-25",
    items: [
      "Recently searched players now appear on the home page for quick access",
      "Character pages now include tech videos organized by category",
    ],
  },
  {
    version: "1.1.1",
    title: "Fight!",
    date: "2026-05-22",
    items: [
      "Shoryu is live!",
      "Master Rating leaderboard",
      "Tournament page with Tier 1 results, prize pools, and player info",
      "Pro players and content creators page",
    ],
  },
  {
    version: "1.1.0",
    title: "Matchup Mind",
    date: "2026-05-21",
    items: [
      "Matchup chart: see your win rate for every character combination",
      "LP/MR history chart: track your progression over time per character",
    ],
  },
  {
    version: "1.0",
    title: "Round One",
    date: "2026-05-20",
    items: [
      "Player profiles are up : rank, region, platform, character stats, and match history",
    ],
  },
]

/** The version the site is on: the newest changelog entry. */
export const CURRENT_VERSION = CHANGELOG[0].version
