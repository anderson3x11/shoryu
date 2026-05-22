export interface ProPlayer {
  short_id: string;
  name: string;
  twitch?: string;
  youtube?: string;
  twitter?: string;
}

export const PRO_PLAYERS: ProPlayer[] = [
  // Pro players
  {
    short_id: "3921133935",
    name: "Mister Crimson",
    twitch: "MisterCrimson",
    twitter: "MistahCrimson",
  },
  {
    short_id: "1224217951",
    name: "Punk",
    twitch: "punkdagod",
    twitter: "PunkDaGod",
  },
  {
    short_id: "3097625175",
    name: "NuckleDu",
    twitch: "NuckleDu",
    twitter: "NuckleDuDang",
  },
  {
    short_id: "3826541678",
    name: "Tokido",
    twitch: "tokidoki77",
    twitter: "tokidoki77",
  },
  { short_id: "3505146905", name: "EndingWalker", twitter: "EndingWalker" },

  // Content creators
  {
    short_id: "3478190124",
    name: "Brian_F",
    twitch: "Brian_F",
    twitter: "Bri4nF",
  },
  {
    short_id: "3570388222",
    name: "Broski",
    twitch: "Broski",
    twitter: "broskiFGC",
  },
  {
    short_id: "3349960197",
    name: "Nephew",
    twitch: "nephewdork",
    twitter: "nephewdork",
  },
];

export function getProPlayer(short_id: string | number): ProPlayer | undefined {
  return PRO_PLAYERS.find((p) => p.short_id === String(short_id));
}
