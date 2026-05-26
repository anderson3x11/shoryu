export interface ProPlayer {
  short_id: string;
  name: string;
  category: "pro" | "creator";
  twitch?: string;
  youtube?: string;
  twitter?: string;
}

export const PRO_PLAYERS: ProPlayer[] = [
  // Pro players
  {
    short_id: "3921133935",
    name: "Mister Crimson",
    category: "pro",
    twitch: "MistahCrimson",
    twitter: "MistahCrimson",
  },
  {
    short_id: "1224217951",
    name: "Punk",
    category: "pro",
    twitch: "punkdagod",
    twitter: "PunkDaGod",
  },
  {
    short_id: "3097625175",
    name: "NuckleDu",
    category: "pro",
    twitch: "NuckleDu",
    twitter: "NuckleDuDang",
  },
  {
    short_id: "3826541678",
    name: "Tokido",
    category: "pro",
    twitch: "tokidoki77",
    twitter: "tokidoki77",
  },
  {
    short_id: "3505146905",
    name: "EndingWalker",
    category: "pro",
    twitter: "EndingWalker",
  },
  {
    short_id: "3349960197",
    name: "Nephew",
    category: "pro",
    twitch: "nephewdork",
    twitter: "nephewdork",
  },
  {
    short_id: "3381453962",
    name: "Blaz",
    category: "pro",
    twitter: "DerekBlaz11",
  },
  {
    short_id: "3833467565",
    name: "YHC-Mochi",
    category: "pro",
    twitter: "yhcmochi82",
  },
  {
    short_id: "3139764784",
    name: "Takepi",
    category: "pro",
    twitter: "piano_taketake",
  },
  {
    short_id: "1396895782",
    name: "Torimeshi",
    category: "pro",
    twitch: "cg_torimeshi",
    twitter: "torimesi911",
  },
  {
    short_id: "3304337807",
    name: "Haitani",
    category: "pro",
    twitch: "haitani0904",
    twitter: "hai090",
  },
  {
    short_id: "2626960876",
    name: "Kazunoko",
    category: "pro",
    twitter: "kazunoko0215",
  },
  {
    short_id: "1304761987",
    name: "Leshar",
    category: "pro",
    twitter: "leshar15",
  },
  {
    short_id: "3108342606",
    name: "Hibiki",
    category: "pro",
    twitch: "hibikithebeast",
    twitter: "HibikiTheBeast",
  },
  {
    short_id: "4248707238",
    name: "NoahTheProdigy",
    category: "pro",
    twitter: "NoahtheProdigy",
  },
  {
    short_id: "1051410689",
    name: "Sahara",
    category: "pro",
    twitter: "sahara7h",
  },
  {
    short_id: "3466035121",
    name: "Daigo Umehara",
    category: "pro",
    twitch: "daigothebeastv",
    twitter: "daigothebeast",
  },
  {
    short_id: "2898412129",
    name: "HotDog29",
    category: "pro",
    twitter: "HotDog29gg",
  },

  // Content creators
  {
    short_id: "3478190124",
    name: "Brian_F",
    category: "creator",
    twitch: "Brian_F",
    twitter: "Bri4nF",
  },
  {
    short_id: "3570388222",
    name: "Broski",
    category: "creator",
    twitch: "Broskifgc",
    twitter: "broskiFGC",
  },
  {
    short_id: "1674774367",
    name: "Maximilian Dood",
    category: "creator",
    twitch: "maximilian_dood",
    twitter: "maximilian_",
  },
];

export function getProPlayer(short_id: string | number): ProPlayer | undefined {
  return PRO_PLAYERS.find((p) => p.short_id === String(short_id));
}
