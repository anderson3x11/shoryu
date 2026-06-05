export type Continent = "Americas" | "Europe" | "Asia" | "Africa" | "Unknown";
export type Debut =
  | "SF1"
  | "SF2"
  | "Alpha"
  | "SF3"
  | "SF4"
  | "SF5"
  | "SF6"
  | "KOF";
export type Archetype =
  | "Shoto"
  | "Rushdown"
  | "Zoner"
  | "Grappler"
  | "Footsies";
export type InputType = "Motion" | "Charge" | "Hybrid";
export type CompareStatus = "correct" | "partial" | "wrong";

export interface CompareResult {
  status: CompareStatus;
  arrow?: "up" | "down";
}

export interface StreedleCharacter {
  id: string;
  name: string;
  gender: "Male" | "Female";
  country: string;
  continent: Continent;
  debut: Debut;
  playableDebut: Debut;
  archetype: Archetype[];
  inputType: InputType;
}

export type GuessResults = {
  [K in
    | "gender"
    | "country"
    | "debut"
    | "playableDebut"
    | "archetype"
    | "inputType"]: CompareResult;
};

export const DEBUT_ORDER: Debut[] = [
  "SF1",
  "SF2",
  "Alpha",
  "SF3",
  "SF4",
  "SF5",
  "SF6",
  "KOF",
];

export const DEBUT_LABELS: Record<Debut, string> = {
  SF1: "Street Fighter I",
  SF2: "Street Fighter II",
  Alpha: "Street Fighter Alpha",
  SF3: "Street Fighter III",
  SF4: "Street Fighter IV",
  SF5: "Street Fighter V",
  SF6: "Street Fighter 6",
  KOF: "King of Fighters",
};

export const STREETDLE_CHARACTERS: StreedleCharacter[] = [
  // ── SF1 ──────────────────────────────────────────────────────────────────
  {
    id: "ryu",
    name: "Ryu",
    gender: "Male",
    country: "Japan",
    continent: "Asia",
    debut: "SF1",
    playableDebut: "SF1",
    archetype: ["Shoto"],
    inputType: "Motion",
  },
  {
    id: "ken",
    name: "Ken",
    gender: "Male",
    country: "USA",
    continent: "Americas",
    debut: "SF1",
    playableDebut: "SF1",
    archetype: ["Shoto", "Rushdown"],
    inputType: "Motion",
  },
  {
    id: "sagat",
    name: "Sagat",
    gender: "Male",
    country: "Thailand",
    continent: "Asia",
    debut: "SF1",
    playableDebut: "SF2",
    archetype: ["Shoto", "Zoner"],
    inputType: "Motion",
  },
  {
    id: "gen",
    name: "Gen",
    gender: "Male",
    country: "China",
    continent: "Asia",
    debut: "SF1",
    playableDebut: "Alpha",
    archetype: ["Rushdown"],
    inputType: "Charge",
  },
  {
    id: "adon",
    name: "Adon",
    gender: "Male",
    country: "Thailand",
    continent: "Asia",
    debut: "SF1",
    playableDebut: "Alpha",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "birdie",
    name: "Birdie",
    gender: "Male",
    country: "UK",
    continent: "Europe",
    debut: "SF1",
    playableDebut: "Alpha",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  // ── SF2 ──────────────────────────────────────────────────────────────────
  {
    id: "chunli",
    name: "Chun-Li",
    gender: "Female",
    country: "China",
    continent: "Asia",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Footsies", "Rushdown"],
    inputType: "Hybrid",
  },
  {
    id: "zangief",
    name: "Zangief",
    gender: "Male",
    country: "Russia",
    continent: "Europe",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Grappler"],
    inputType: "Motion",
  },
  {
    id: "dhalsim",
    name: "Dhalsim",
    gender: "Male",
    country: "India",
    continent: "Asia",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Zoner"],
    inputType: "Motion",
  },
  {
    id: "blanka",
    name: "Blanka",
    gender: "Male",
    country: "Brazil",
    continent: "Americas",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Rushdown"],
    inputType: "Charge",
  },
  {
    id: "guile",
    name: "Guile",
    gender: "Male",
    country: "USA",
    continent: "Americas",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Zoner"],
    inputType: "Charge",
  },
  {
    id: "honda",
    name: "E. Honda",
    gender: "Male",
    country: "Japan",
    continent: "Asia",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Rushdown"],
    inputType: "Charge",
  },
  {
    id: "cammy",
    name: "Cammy",
    gender: "Female",
    country: "UK",
    continent: "Europe",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "deejay",
    name: "Dee Jay",
    gender: "Male",
    country: "Jamaica",
    continent: "Americas",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Footsies", "Zoner"],
    inputType: "Hybrid",
  },
  {
    id: "gouki",
    name: "Akuma",
    gender: "Male",
    country: "Japan",
    continent: "Asia",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Shoto", "Rushdown"],
    inputType: "Motion",
  },
  {
    id: "vega",
    name: "M. Bison",
    gender: "Male",
    country: "Unknown",
    continent: "Unknown",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Rushdown"],
    inputType: "Hybrid",
  },
  {
    id: "balrog",
    name: "Balrog",
    gender: "Male",
    country: "USA",
    continent: "Americas",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Rushdown"],
    inputType: "Charge",
  },
  {
    id: "claw",
    name: "Vega",
    gender: "Male",
    country: "Spain",
    continent: "Europe",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Rushdown"],
    inputType: "Charge",
  },
  {
    id: "feilong",
    name: "Fei Long",
    gender: "Male",
    country: "Hong Kong",
    continent: "Asia",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "thawk",
    name: "T. Hawk",
    gender: "Male",
    country: "Mexico",
    continent: "Americas",
    debut: "SF2",
    playableDebut: "SF2",
    archetype: ["Grappler"],
    inputType: "Motion",
  },
  // ── Alpha ────────────────────────────────────────────────────────────────
  {
    id: "dan",
    name: "Dan",
    gender: "Male",
    country: "Japan",
    continent: "Asia",
    debut: "Alpha",
    playableDebut: "Alpha",
    archetype: ["Shoto"],
    inputType: "Motion",
  },
  {
    id: "sakura",
    name: "Sakura",
    gender: "Female",
    country: "Japan",
    continent: "Asia",
    debut: "Alpha",
    playableDebut: "Alpha",
    archetype: ["Shoto", "Rushdown"],
    inputType: "Motion",
  },
  {
    id: "rose",
    name: "Rose",
    gender: "Female",
    country: "Italy",
    continent: "Europe",
    debut: "Alpha",
    playableDebut: "Alpha",
    archetype: ["Zoner", "Footsies"],
    inputType: "Motion",
  },
  {
    id: "nash",
    name: "Nash",
    gender: "Male",
    country: "USA",
    continent: "Americas",
    debut: "Alpha",
    playableDebut: "Alpha",
    archetype: ["Footsies", "Zoner"],
    inputType: "Charge",
  },
  {
    id: "guy",
    name: "Guy",
    gender: "Male",
    country: "Japan",
    continent: "Asia",
    debut: "Alpha",
    playableDebut: "Alpha",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "cody",
    name: "Cody",
    gender: "Male",
    country: "USA",
    continent: "Americas",
    debut: "Alpha",
    playableDebut: "Alpha",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "karin",
    name: "Karin",
    gender: "Female",
    country: "Japan",
    continent: "Asia",
    debut: "Alpha",
    playableDebut: "Alpha",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "mika",
    name: "R. Mika",
    gender: "Female",
    country: "Japan",
    continent: "Asia",
    debut: "Alpha",
    playableDebut: "Alpha",
    archetype: ["Grappler"],
    inputType: "Motion",
  },
  // ── SF3 ──────────────────────────────────────────────────────────────────
  {
    id: "elena",
    name: "Elena",
    gender: "Female",
    country: "Kenya",
    continent: "Africa",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Footsies"],
    inputType: "Motion",
  },
  {
    id: "alex",
    name: "Alex",
    gender: "Male",
    country: "USA",
    continent: "Americas",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Grappler", "Rushdown"],
    inputType: "Motion",
  },
  {
    id: "hugo",
    name: "Hugo",
    gender: "Male",
    country: "Germany",
    continent: "Europe",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Grappler"],
    inputType: "Motion",
  },
  {
    id: "ibuki",
    name: "Ibuki",
    gender: "Female",
    country: "Japan",
    continent: "Asia",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "makoto",
    name: "Makoto",
    gender: "Female",
    country: "Japan",
    continent: "Asia",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "dudley",
    name: "Dudley",
    gender: "Male",
    country: "UK",
    continent: "Europe",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Footsies"],
    inputType: "Motion",
  },
  {
    id: "urien",
    name: "Urien",
    gender: "Male",
    country: "Unknown",
    continent: "Europe",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Rushdown"],
    inputType: "Charge",
  },
  {
    id: "sean",
    name: "Sean",
    gender: "Male",
    country: "Brazil",
    continent: "Americas",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Shoto"],
    inputType: "Motion",
  },
  {
    id: "necro",
    name: "Necro",
    gender: "Male",
    country: "Russia",
    continent: "Europe",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Zoner"],
    inputType: "Motion",
  },
  {
    id: "q",
    name: "Q",
    gender: "Male",
    country: "Unknown",
    continent: "Unknown",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Footsies"],
    inputType: "Charge",
  },
  {
    id: "yun",
    name: "Yun",
    gender: "Male",
    country: "China",
    continent: "Asia",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "yang",
    name: "Yang",
    gender: "Male",
    country: "China",
    continent: "Asia",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "oro",
    name: "Oro",
    gender: "Male",
    country: "Japan",
    continent: "Asia",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Zoner"],
    inputType: "Motion",
  },
  {
    id: "gill",
    name: "Gill",
    gender: "Male",
    country: "Unknown",
    continent: "Europe",
    debut: "SF3",
    playableDebut: "SF3",
    archetype: ["Footsies"],
    inputType: "Motion",
  },
  // ── SF4 ──────────────────────────────────────────────────────────────────
  {
    id: "juri",
    name: "Juri",
    gender: "Female",
    country: "South Korea",
    continent: "Asia",
    debut: "SF4",
    playableDebut: "SF4",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "cviper",
    name: "C. Viper",
    gender: "Female",
    country: "USA",
    continent: "Americas",
    debut: "SF4",
    playableDebut: "SF4",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "abel",
    name: "Abel",
    gender: "Male",
    country: "France",
    continent: "Europe",
    debut: "SF4",
    playableDebut: "SF4",
    archetype: ["Grappler", "Rushdown"],
    inputType: "Motion",
  },
  {
    id: "elfuerte",
    name: "El Fuerte",
    gender: "Male",
    country: "Mexico",
    continent: "Americas",
    debut: "SF4",
    playableDebut: "SF4",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "hakan",
    name: "Hakan",
    gender: "Male",
    country: "Turkey",
    continent: "Europe",
    debut: "SF4",
    playableDebut: "SF4",
    archetype: ["Grappler"],
    inputType: "Motion",
  },
  {
    id: "seth",
    name: "Seth",
    gender: "Male",
    country: "Unknown",
    continent: "Unknown",
    debut: "SF4",
    playableDebut: "SF4",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "gouken",
    name: "Gouken",
    gender: "Male",
    country: "Japan",
    continent: "Asia",
    debut: "SF4",
    playableDebut: "SF4",
    archetype: ["Shoto"],
    inputType: "Motion",
  },
  {
    id: "rufus",
    name: "Rufus",
    gender: "Male",
    country: "USA",
    continent: "Americas",
    debut: "SF4",
    playableDebut: "SF4",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  // ── SF5 ──────────────────────────────────────────────────────────────────
  {
    id: "rashid",
    name: "Rashid",
    gender: "Male",
    country: "UAE",
    continent: "Asia",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "ed",
    name: "Ed",
    gender: "Male",
    country: "Germany",
    continent: "Europe",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Footsies"],
    inputType: "Motion",
  },
  {
    id: "laura",
    name: "Laura",
    gender: "Female",
    country: "Brazil",
    continent: "Americas",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Rushdown", "Grappler"],
    inputType: "Motion",
  },
  {
    id: "fang",
    name: "F.A.N.G.",
    gender: "Male",
    country: "China",
    continent: "Asia",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Zoner"],
    inputType: "Charge",
  },
  {
    id: "poison",
    name: "Poison",
    gender: "Female",
    country: "USA",
    continent: "Americas",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Zoner"],
    inputType: "Motion",
  },
  {
    id: "g",
    name: "G",
    gender: "Male",
    country: "USA",
    continent: "Americas",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Footsies"],
    inputType: "Motion",
  },
  {
    id: "menat",
    name: "Menat",
    gender: "Female",
    country: "Egypt",
    continent: "Africa",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Zoner"],
    inputType: "Motion",
  },
  {
    id: "abigail",
    name: "Abigail",
    gender: "Male",
    country: "Canada",
    continent: "Americas",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Grappler"],
    inputType: "Motion",
  },
  {
    id: "kage",
    name: "Kage",
    gender: "Male",
    country: "Japan",
    continent: "Asia",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Shoto", "Rushdown"],
    inputType: "Motion",
  },
  {
    id: "necalli",
    name: "Necalli",
    gender: "Male",
    country: "Unknown",
    continent: "Unknown",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "zeku",
    name: "Zeku",
    gender: "Male",
    country: "Japan",
    continent: "Asia",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "falke",
    name: "Falke",
    gender: "Female",
    country: "Germany",
    continent: "Europe",
    debut: "SF5",
    playableDebut: "SF5",
    archetype: ["Zoner"],
    inputType: "Charge",
  },
  // ── SF6 originals + DLC ──────────────────────────────────────────────────
  {
    id: "luke",
    name: "Luke",
    gender: "Male",
    country: "USA",
    continent: "Americas",
    debut: "SF6",
    playableDebut: "SF6",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "kimberly",
    name: "Kimberly",
    gender: "Female",
    country: "USA",
    continent: "Americas",
    debut: "SF6",
    playableDebut: "SF6",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "manon",
    name: "Manon",
    gender: "Female",
    country: "France",
    continent: "Europe",
    debut: "SF6",
    playableDebut: "SF6",
    archetype: ["Grappler"],
    inputType: "Motion",
  },
  {
    id: "jp",
    name: "JP",
    gender: "Male",
    country: "Russia",
    continent: "Europe",
    debut: "SF6",
    playableDebut: "SF6",
    archetype: ["Zoner"],
    inputType: "Motion",
  },
  {
    id: "lily",
    name: "Lily",
    gender: "Female",
    country: "USA",
    continent: "Americas",
    debut: "SF6",
    playableDebut: "SF6",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "aki",
    name: "A.K.I.",
    gender: "Female",
    country: "China",
    continent: "Asia",
    debut: "SF6",
    playableDebut: "SF6",
    archetype: ["Zoner"],
    inputType: "Motion",
  },
  {
    id: "marisa",
    name: "Marisa",
    gender: "Female",
    country: "Italy",
    continent: "Europe",
    debut: "SF6",
    playableDebut: "SF6",
    archetype: ["Grappler", "Rushdown"],
    inputType: "Motion",
  },
  {
    id: "jamie",
    name: "Jamie",
    gender: "Male",
    country: "China",
    continent: "Asia",
    debut: "SF6",
    playableDebut: "SF6",
    archetype: ["Rushdown"],
    inputType: "Motion",
  },
  {
    id: "ingrid",
    name: "Ingrid",
    gender: "Female",
    country: "Unknown",
    continent: "Unknown",
    debut: "SF6",
    playableDebut: "SF6",
    archetype: ["Zoner"],
    inputType: "Motion",
  },
  // ── KOF guests ───────────────────────────────────────────────────────────
  {
    id: "terry",
    name: "Terry",
    gender: "Male",
    country: "USA",
    continent: "Americas",
    debut: "KOF",
    playableDebut: "KOF",
    archetype: ["Rushdown", "Footsies"],
    inputType: "Motion",
  },
  {
    id: "mai",
    name: "Mai",
    gender: "Female",
    country: "Japan",
    continent: "Asia",
    debut: "KOF",
    playableDebut: "KOF",
    archetype: ["Zoner"],
    inputType: "Motion",
  },
];

export function compareCharacters(
  guess: StreedleCharacter,
  target: StreedleCharacter,
): GuessResults {
  const gender: CompareResult = {
    status: guess.gender === target.gender ? "correct" : "wrong",
  };

  let country: CompareResult;
  if (guess.country === target.country) {
    country = { status: "correct" };
  } else if (
    guess.continent === target.continent &&
    guess.continent !== "Unknown"
  ) {
    country = { status: "partial" };
  } else {
    country = { status: "wrong" };
  }

  let debut: CompareResult;
  const gi = DEBUT_ORDER.indexOf(guess.debut);
  const ti = DEBUT_ORDER.indexOf(target.debut);
  if (guess.debut === target.debut) {
    debut = { status: "correct" };
  } else {
    debut = { status: "wrong", arrow: ti > gi ? "up" : "down" };
  }

  let playableDebut: CompareResult;
  const pgi = DEBUT_ORDER.indexOf(guess.playableDebut);
  const pti = DEBUT_ORDER.indexOf(target.playableDebut);
  if (guess.playableDebut === target.playableDebut) {
    playableDebut = { status: "correct" };
  } else {
    playableDebut = { status: "wrong", arrow: pti > pgi ? "up" : "down" };
  }

  const sameSet =
    guess.archetype.length === target.archetype.length &&
    guess.archetype.every((a) => target.archetype.includes(a));
  const hasOverlap = guess.archetype.some((a) => target.archetype.includes(a));
  const archetype: CompareResult = {
    status: sameSet ? "correct" : hasOverlap ? "partial" : "wrong",
  };

  const inputType: CompareResult = {
    status: guess.inputType === target.inputType ? "correct" : "wrong",
  };

  return { gender, country, debut, playableDebut, archetype, inputType };
}

const EPOCH = new Date("2026-01-01T00:00:00Z").getTime();

function getDayIndex(): number {
  return Math.floor((Date.now() - EPOCH) / (1000 * 60 * 60 * 24));
}

export function getDailyCharacter(): StreedleCharacter {
  const idx = getDayIndex();
  return STREETDLE_CHARACTERS[
    ((idx % STREETDLE_CHARACTERS.length) + STREETDLE_CHARACTERS.length) %
      STREETDLE_CHARACTERS.length
  ];
}

export function getDailyKey(): string {
  return `streetdle-v2-${getDayIndex()}`;
}
