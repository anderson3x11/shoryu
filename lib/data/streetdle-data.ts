export type Continent = 'Americas' | 'Europe' | 'Asia' | 'Africa' | 'Unknown'
export type Debut = 'SF1' | 'SF2' | 'Alpha' | 'SF3' | 'SF4' | 'SF5' | 'SF6' | 'KOF'
export type Archetype = 'Rushdown' | 'Zoner' | 'Grappler' | 'Balanced' | 'Mix-Up'
export type InputType = 'Motion' | 'Charge' | 'Hybrid'
export type CompareStatus = 'correct' | 'partial' | 'wrong'

export interface CompareResult {
  status: CompareStatus
  arrow?: 'up' | 'down'
}

export interface StreedleCharacter {
  id: string
  name: string
  gender: 'Male' | 'Female'
  country: string
  continent: Continent
  debut: Debut
  playableDebut: Debut
  style: string
  archetype: Archetype
  inputType: InputType
}

export type GuessResults = {
  [K in 'gender' | 'country' | 'debut' | 'playableDebut' | 'style' | 'archetype' | 'inputType']: CompareResult
}

export const DEBUT_ORDER: Debut[] = ['SF1', 'SF2', 'Alpha', 'SF3', 'SF4', 'SF5', 'SF6', 'KOF']

export const DEBUT_LABELS: Record<Debut, string> = {
  SF1:   'Street Fighter I',
  SF2:   'Street Fighter II',
  Alpha: 'Street Fighter Alpha',
  SF3:   'Street Fighter III',
  SF4:   'Street Fighter IV',
  SF5:   'Street Fighter V',
  SF6:   'Street Fighter 6',
  KOF:   'King of Fighters',
}

export const STREETDLE_CHARACTERS: StreedleCharacter[] = [
  // ── SF1 ──────────────────────────────────────────────────────────────────
  { id: 'ryu',      name: 'Ryu',      gender: 'Male',   country: 'Japan',       continent: 'Asia',     debut: 'SF1',   playableDebut: 'SF1',   style: 'Ansatsuken',          archetype: 'Balanced',  inputType: 'Motion'  },
  { id: 'ken',      name: 'Ken',      gender: 'Male',   country: 'USA',         continent: 'Americas', debut: 'SF1',   playableDebut: 'SF1',   style: 'Ansatsuken',          archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'sagat',    name: 'Sagat',    gender: 'Male',   country: 'Thailand',    continent: 'Asia',     debut: 'SF1',   playableDebut: 'SF2',   style: 'Muay Thai',           archetype: 'Zoner',     inputType: 'Hybrid'  },
  { id: 'gen',      name: 'Gen',      gender: 'Male',   country: 'China',       continent: 'Asia',     debut: 'SF1',   playableDebut: 'Alpha', style: 'Assassin Kung Fu',    archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'adon',     name: 'Adon',     gender: 'Male',   country: 'Thailand',    continent: 'Asia',     debut: 'SF1',   playableDebut: 'Alpha', style: 'Muay Thai',           archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'birdie',   name: 'Birdie',   gender: 'Male',   country: 'UK',          continent: 'Europe',   debut: 'SF1',   playableDebut: 'Alpha', style: 'Street Fighting',     archetype: 'Mix-Up',    inputType: 'Motion'  },
  // ── SF2 ──────────────────────────────────────────────────────────────────
  { id: 'chunli',   name: 'Chun-Li',  gender: 'Female', country: 'China',       continent: 'Asia',     debut: 'SF2',   playableDebut: 'SF2',   style: 'Chinese Martial Arts', archetype: 'Balanced',  inputType: 'Hybrid'  },
  { id: 'zangief',  name: 'Zangief',  gender: 'Male',   country: 'Russia',      continent: 'Europe',   debut: 'SF2',   playableDebut: 'SF2',   style: 'Wrestling',           archetype: 'Grappler',  inputType: 'Motion'  },
  { id: 'dhalsim',  name: 'Dhalsim',  gender: 'Male',   country: 'India',       continent: 'Asia',     debut: 'SF2',   playableDebut: 'SF2',   style: 'Yoga',                archetype: 'Zoner',     inputType: 'Motion'  },
  { id: 'blanka',   name: 'Blanka',   gender: 'Male',   country: 'Brazil',      continent: 'Americas', debut: 'SF2',   playableDebut: 'SF2',   style: 'Electric Fighting',   archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'guile',    name: 'Guile',    gender: 'Male',   country: 'USA',         continent: 'Americas', debut: 'SF2',   playableDebut: 'SF2',   style: 'Military Arts',       archetype: 'Zoner',     inputType: 'Charge'  },
  { id: 'honda',    name: 'E. Honda', gender: 'Male',   country: 'Japan',       continent: 'Asia',     debut: 'SF2',   playableDebut: 'SF2',   style: 'Sumo',                archetype: 'Grappler',  inputType: 'Charge'  },
  { id: 'cammy',    name: 'Cammy',    gender: 'Female', country: 'UK',          continent: 'Europe',   debut: 'SF2',   playableDebut: 'SF2',   style: 'Delta Red',           archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'deejay',   name: 'Dee Jay',  gender: 'Male',   country: 'Jamaica',     continent: 'Americas', debut: 'SF2',   playableDebut: 'SF2',   style: 'Kickboxing',          archetype: 'Balanced',  inputType: 'Charge'  },
  { id: 'gouki',    name: 'Akuma',    gender: 'Male',   country: 'Japan',       continent: 'Asia',     debut: 'SF2',   playableDebut: 'SF2', style: 'Ansatsuken',          archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'vega',     name: 'M. Bison', gender: 'Male',   country: 'Unknown',     continent: 'Unknown',  debut: 'SF2',   playableDebut: 'SF2',   style: 'Psycho Power',        archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'balrog',   name: 'Balrog',   gender: 'Male',   country: 'USA',         continent: 'Americas', debut: 'SF2',   playableDebut: 'SF2',   style: 'Boxing',              archetype: 'Rushdown',  inputType: 'Charge'  },
  { id: 'claw',     name: 'Vega',     gender: 'Male',   country: 'Spain',       continent: 'Europe',   debut: 'SF2',   playableDebut: 'SF2',   style: 'Matador Ninjutsu',    archetype: 'Mix-Up',    inputType: 'Charge'  },
  { id: 'feilong',  name: 'Fei Long', gender: 'Male',   country: 'Hong Kong',   continent: 'Asia',     debut: 'SF2',   playableDebut: 'SF2',   style: 'Kung Fu',             archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'thawk',    name: 'T. Hawk',  gender: 'Male',   country: 'Mexico',      continent: 'Americas', debut: 'SF2',   playableDebut: 'SF2',   style: 'Thunderfoot',         archetype: 'Grappler',  inputType: 'Motion'  },
  // ── Alpha ────────────────────────────────────────────────────────────────
  { id: 'dan',      name: 'Dan',      gender: 'Male',   country: 'Japan',       continent: 'Asia',     debut: 'Alpha', playableDebut: 'Alpha', style: 'Saikyo',              archetype: 'Balanced',  inputType: 'Motion'  },
  { id: 'sakura',   name: 'Sakura',   gender: 'Female', country: 'Japan',       continent: 'Asia',     debut: 'Alpha', playableDebut: 'Alpha', style: 'Ansatsuken',          archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'rose',     name: 'Rose',     gender: 'Female', country: 'Italy',       continent: 'Europe',   debut: 'Alpha', playableDebut: 'Alpha', style: 'Soul Power',          archetype: 'Zoner',     inputType: 'Motion'  },
  { id: 'nash',     name: 'Nash',     gender: 'Male',   country: 'USA',         continent: 'Americas', debut: 'Alpha', playableDebut: 'Alpha', style: 'Military Arts',       archetype: 'Balanced',  inputType: 'Charge'  },
  { id: 'guy',      name: 'Guy',      gender: 'Male',   country: 'Japan',       continent: 'Asia',     debut: 'Alpha', playableDebut: 'Alpha', style: 'Bushinryu',           archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'cody',     name: 'Cody',     gender: 'Male',   country: 'USA',         continent: 'Americas', debut: 'Alpha', playableDebut: 'Alpha', style: 'Street Fighting',     archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'karin',    name: 'Karin',    gender: 'Female', country: 'Japan',       continent: 'Asia',     debut: 'Alpha', playableDebut: 'Alpha', style: 'Kanzuki-ryu',         archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'mika',     name: 'R. Mika',  gender: 'Female', country: 'Japan',       continent: 'Asia',     debut: 'Alpha', playableDebut: 'Alpha', style: 'Wrestling',           archetype: 'Grappler',  inputType: 'Motion'  },
  // ── SF3 ──────────────────────────────────────────────────────────────────
  { id: 'elena',    name: 'Elena',    gender: 'Female', country: 'Kenya',       continent: 'Africa',   debut: 'SF3',   playableDebut: 'SF3',   style: 'Capoeira',            archetype: 'Balanced',  inputType: 'Motion'  },
  { id: 'alex',     name: 'Alex',     gender: 'Male',   country: 'USA',         continent: 'Americas', debut: 'SF3',   playableDebut: 'SF3',   style: 'Power Fighting',      archetype: 'Grappler',  inputType: 'Hybrid'  },
  { id: 'hugo',     name: 'Hugo',     gender: 'Male',   country: 'Germany',     continent: 'Europe',   debut: 'SF3',   playableDebut: 'SF3',   style: 'Wrestling',           archetype: 'Grappler',  inputType: 'Motion'  },
  { id: 'ibuki',    name: 'Ibuki',    gender: 'Female', country: 'Japan',       continent: 'Asia',     debut: 'SF3',   playableDebut: 'SF3',   style: 'Ninjutsu',            archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'makoto',   name: 'Makoto',   gender: 'Female', country: 'Japan',       continent: 'Asia',     debut: 'SF3',   playableDebut: 'SF3',   style: 'Rindo-Kan Karate',    archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'dudley',   name: 'Dudley',   gender: 'Male',   country: 'UK',          continent: 'Europe',   debut: 'SF3',   playableDebut: 'SF3',   style: 'Boxing',              archetype: 'Balanced',  inputType: 'Motion'  },
  { id: 'urien',    name: 'Urien',    gender: 'Male',   country: 'Greece',      continent: 'Europe',   debut: 'SF3',   playableDebut: 'SF3',   style: 'Illuminati Arts',     archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'sean',     name: 'Sean',     gender: 'Male',   country: 'Brazil',      continent: 'Americas', debut: 'SF3',   playableDebut: 'SF3',   style: 'Ansatsuken',          archetype: 'Balanced',  inputType: 'Motion'  },
  { id: 'necro',    name: 'Necro',    gender: 'Male',   country: 'Russia',      continent: 'Europe',   debut: 'SF3',   playableDebut: 'SF3',   style: 'Electric Fighting',   archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'q',        name: 'Q',        gender: 'Male',   country: 'Unknown',     continent: 'Unknown',  debut: 'SF3',   playableDebut: 'SF3',   style: 'Mysterious Power',    archetype: 'Balanced',  inputType: 'Charge'  },
  { id: 'yun',      name: 'Yun',      gender: 'Male',   country: 'China',       continent: 'Asia',     debut: 'SF3',   playableDebut: 'SF3',   style: 'Kung Fu',             archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'yang',     name: 'Yang',     gender: 'Male',   country: 'China',       continent: 'Asia',     debut: 'SF3',   playableDebut: 'SF3',   style: 'Kung Fu',             archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'oro',      name: 'Oro',      gender: 'Male',   country: 'Japan',       continent: 'Asia',     debut: 'SF3',   playableDebut: 'SF3',   style: 'Senjutsu',            archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'gill',     name: 'Gill',     gender: 'Male',   country: 'Greece',      continent: 'Europe',   debut: 'SF3',   playableDebut: 'SF3',   style: 'Illuminati Arts',     archetype: 'Balanced',  inputType: 'Motion'  },
  // ── SF4 ──────────────────────────────────────────────────────────────────
  { id: 'juri',     name: 'Juri',     gender: 'Female', country: 'South Korea', continent: 'Asia',     debut: 'SF4',   playableDebut: 'SF4',   style: 'Taekwondo',           archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'cviper',   name: 'C. Viper', gender: 'Female', country: 'USA',         continent: 'Americas', debut: 'SF4',   playableDebut: 'SF4',   style: 'Technology',          archetype: 'Mix-Up',    inputType: 'Charge'  },
  { id: 'abel',     name: 'Abel',     gender: 'Male',   country: 'France',      continent: 'Europe',   debut: 'SF4',   playableDebut: 'SF4',   style: 'Judo & MMA',          archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'elfuerte', name: 'El Fuerte',gender: 'Male',   country: 'Mexico',      continent: 'Americas', debut: 'SF4',   playableDebut: 'SF4',   style: 'Lucha Libre',         archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'hakan',    name: 'Hakan',    gender: 'Male',   country: 'Turkey',      continent: 'Europe',   debut: 'SF4',   playableDebut: 'SF4',   style: 'Oil Wrestling',       archetype: 'Grappler',  inputType: 'Motion'  },
  { id: 'seth',     name: 'Seth',     gender: 'Male',   country: 'Unknown',     continent: 'Unknown',  debut: 'SF4',   playableDebut: 'SF4',   style: 'Tanden Engine',       archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'gouken',   name: 'Gouken',   gender: 'Male',   country: 'Japan',       continent: 'Asia',     debut: 'SF4',   playableDebut: 'SF4',   style: 'Ansatsuken',          archetype: 'Balanced',  inputType: 'Motion'  },
  { id: 'rufus',    name: 'Rufus',    gender: 'Male',   country: 'USA',         continent: 'Americas', debut: 'SF4',   playableDebut: 'SF4',   style: 'Kung Fu',             archetype: 'Rushdown',  inputType: 'Motion'  },
  // ── SF5 ──────────────────────────────────────────────────────────────────
  { id: 'rashid',   name: 'Rashid',   gender: 'Male',   country: 'UAE',         continent: 'Asia',     debut: 'SF5',   playableDebut: 'SF5',   style: 'Parkour',             archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'ed',       name: 'Ed',       gender: 'Male',   country: 'Germany',     continent: 'Europe',   debut: 'SF5',   playableDebut: 'SF5',   style: 'Psycho Boxing',       archetype: 'Balanced',  inputType: 'Charge'  },
  { id: 'laura',    name: 'Laura',    gender: 'Female', country: 'Brazil',      continent: 'Americas', debut: 'SF5',   playableDebut: 'SF5',   style: 'Matsuda Jiu-Jitsu',   archetype: 'Mix-Up',    inputType: 'Hybrid'  },
  { id: 'fang',     name: 'F.A.N.G.', gender: 'Male',   country: 'China',       continent: 'Asia',     debut: 'SF5',   playableDebut: 'SF5',   style: 'Poison Ninjutsu',     archetype: 'Zoner',     inputType: 'Motion'  },
  { id: 'poison',   name: 'Poison',   gender: 'Female', country: 'USA',         continent: 'Americas', debut: 'SF5',   playableDebut: 'SF5',   style: 'Street Wrestling',    archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'g',        name: 'G',        gender: 'Male',   country: 'USA',         continent: 'Americas', debut: 'SF5',   playableDebut: 'SF5',   style: 'Presidentialisman',   archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'menat',    name: 'Menat',    gender: 'Female', country: 'Egypt',       continent: 'Africa',   debut: 'SF5',   playableDebut: 'SF5',   style: 'Soul Power',          archetype: 'Zoner',     inputType: 'Motion'  },
  { id: 'abigail',  name: 'Abigail',  gender: 'Male',   country: 'Canada',      continent: 'Americas', debut: 'SF5',   playableDebut: 'SF5',   style: 'Brawling',            archetype: 'Grappler',  inputType: 'Motion'  },
  { id: 'kage',     name: 'Kage',     gender: 'Male',   country: 'Japan',       continent: 'Asia',     debut: 'SF5',   playableDebut: 'SF5',   style: 'Ansatsuken',          archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'necalli',  name: 'Necalli',  gender: 'Male',   country: 'Unknown',     continent: 'Unknown',  debut: 'SF5',   playableDebut: 'SF5',   style: 'Ancient Power',       archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'zeku',     name: 'Zeku',     gender: 'Male',   country: 'Japan',       continent: 'Asia',     debut: 'SF5',   playableDebut: 'SF5',   style: 'Bushinryu',           archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'falke',    name: 'Falke',    gender: 'Female', country: 'Germany',     continent: 'Europe',   debut: 'SF5',   playableDebut: 'SF5',   style: 'Psycho Power',        archetype: 'Zoner',     inputType: 'Charge'  },
  // ── SF6 originals + DLC ──────────────────────────────────────────────────
  { id: 'luke',     name: 'Luke',     gender: 'Male',   country: 'USA',         continent: 'Americas', debut: 'SF6',   playableDebut: 'SF6',   style: 'MMA',                 archetype: 'Rushdown',  inputType: 'Hybrid'  },
  { id: 'kimberly', name: 'Kimberly', gender: 'Female', country: 'USA',         continent: 'Americas', debut: 'SF6',   playableDebut: 'SF6',   style: 'Ninjutsu',            archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'manon',    name: 'Manon',    gender: 'Female', country: 'France',      continent: 'Europe',   debut: 'SF6',   playableDebut: 'SF6',   style: 'Judo & Ballet',       archetype: 'Grappler',  inputType: 'Motion'  },
  { id: 'jp',       name: 'JP',       gender: 'Male',   country: 'Russia',      continent: 'Europe',   debut: 'SF6',   playableDebut: 'SF6',   style: 'Psycho Power',        archetype: 'Zoner',     inputType: 'Motion'  },
  { id: 'lily',     name: 'Lily',     gender: 'Female', country: 'USA',         continent: 'Americas', debut: 'SF6',   playableDebut: 'SF6',   style: 'Thunderfoot',         archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'aki',      name: 'A.K.I.',   gender: 'Female', country: 'China',       continent: 'Asia',     debut: 'SF6',   playableDebut: 'SF6',   style: 'Assassination Arts',  archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'marisa',   name: 'Marisa',   gender: 'Female', country: 'Italy',       continent: 'Europe',   debut: 'SF6',   playableDebut: 'SF6',   style: 'Pankration',          archetype: 'Rushdown',  inputType: 'Motion'  },
  { id: 'jamie',    name: 'Jamie',    gender: 'Male',   country: 'China',       continent: 'Asia',     debut: 'SF6',   playableDebut: 'SF6',   style: 'Drunken Fist',        archetype: 'Mix-Up',    inputType: 'Motion'  },
  { id: 'ingrid',   name: 'Ingrid',   gender: 'Female', country: 'Unknown',     continent: 'Unknown',  debut: 'SF6',   playableDebut: 'SF6',   style: 'Sacred Power',        archetype: 'Zoner',     inputType: 'Motion'  },
  // ── KOF guests ───────────────────────────────────────────────────────────
  { id: 'terry',    name: 'Terry',    gender: 'Male',   country: 'USA',         continent: 'Americas', debut: 'KOF',   playableDebut: 'KOF',   style: 'Hakkyokuseiken',      archetype: 'Balanced',  inputType: 'Motion'  },
  { id: 'mai',      name: 'Mai',      gender: 'Female', country: 'Japan',       continent: 'Asia',     debut: 'KOF',   playableDebut: 'KOF',   style: 'Ninjutsu',            archetype: 'Mix-Up',    inputType: 'Motion'  },
]

export function compareCharacters(guess: StreedleCharacter, target: StreedleCharacter): GuessResults {
  const gender: CompareResult = {
    status: guess.gender === target.gender ? 'correct' : 'wrong',
  }

  let country: CompareResult
  if (guess.country === target.country) {
    country = { status: 'correct' }
  } else if (guess.continent === target.continent && guess.continent !== 'Unknown') {
    country = { status: 'partial' }
  } else {
    country = { status: 'wrong' }
  }

  let debut: CompareResult
  const gi = DEBUT_ORDER.indexOf(guess.debut)
  const ti = DEBUT_ORDER.indexOf(target.debut)
  if (guess.debut === target.debut) {
    debut = { status: 'correct' }
  } else {
    const diff = ti - gi
    debut = { status: 'wrong', arrow: diff > 0 ? 'up' : 'down' }
  }

  let playableDebut: CompareResult
  const pgi = DEBUT_ORDER.indexOf(guess.playableDebut)
  const pti = DEBUT_ORDER.indexOf(target.playableDebut)
  if (guess.playableDebut === target.playableDebut) {
    playableDebut = { status: 'correct' }
  } else {
    const diff = pti - pgi
    playableDebut = { status: 'wrong', arrow: diff > 0 ? 'up' : 'down' }
  }

  const style: CompareResult    = { status: guess.style     === target.style     ? 'correct' : 'wrong' }
  const archetype: CompareResult = { status: guess.archetype === target.archetype ? 'correct' : 'wrong' }
  const inputType: CompareResult = { status: guess.inputType === target.inputType ? 'correct' : 'wrong' }

  return { gender, country, debut, playableDebut, style, archetype, inputType }
}

const EPOCH = new Date('2026-01-01T00:00:00Z').getTime()

function getDayIndex(): number {
  return Math.floor((Date.now() - EPOCH) / (1000 * 60 * 60 * 24))
}

export function getDailyCharacter(): StreedleCharacter {
  const idx = getDayIndex()
  return STREETDLE_CHARACTERS[((idx % STREETDLE_CHARACTERS.length) + STREETDLE_CHARACTERS.length) % STREETDLE_CHARACTERS.length]
}

export function getDailyKey(): string {
  return `streetdle-v2-${getDayIndex()}`
}
