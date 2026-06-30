export interface Character {
  id: string
  name: string
  slug: string        // Buckler tool_name used in image URLs and API responses
  bucklerCharId: number // Numeric character_id used in character_league_infos
  color: string       // Primary signature color: banner bar, mainpage grid hover
  colorSecondary?: string // Secondary color: accents the character page (ticks, active chips) instead of amber
  comingSoon?: boolean // Not yet released — hide from home grid, no portrait available
  hidden?: boolean    // Not a real playable character — exclude from grid and static pages
}

export const CHARACTERS: Character[] = [
  { id: 'luke',     name: 'Luke',      slug: 'luke',     bucklerCharId: 2,  color: '#2f7be6', colorSecondary: '#f0c020' },
  { id: 'jamie',    name: 'Jamie',     slug: 'jamie',    bucklerCharId: 21, color: '#e6c423', colorSecondary: '#b23a2e' },
  { id: 'manon',    name: 'Manon',     slug: 'manon',    bucklerCharId: 5,  color: '#e890b4', colorSecondary: '#a8d4f0' },
  { id: 'kimberly', name: 'Kimberly',  slug: 'kimberly', bucklerCharId: 3,  color: '#ec4a72', colorSecondary: '#2bc5d8' },
  { id: 'marisa',   name: 'Marisa',    slug: 'marisa',   bucklerCharId: 17, color: '#c0392b', colorSecondary: '#d4a738' },
  { id: 'lily',     name: 'Lily',      slug: 'lily',     bucklerCharId: 12, color: '#7ec99a', colorSecondary: '#7fc0ec' },
  { id: 'jp',       name: 'JP',        slug: 'jp',       bucklerCharId: 7,  color: '#9aa1ac', colorSecondary: '#d23a3a' },
  { id: 'juri',     name: 'Juri',      slug: 'juri',     bucklerCharId: 16, color: '#9b3fd4', colorSecondary: '#6b6770' },
  { id: 'deejay',   name: 'Dee Jay',   slug: 'deejay',   bucklerCharId: 11, color: '#f0992a', colorSecondary: '#4cae5a' },
  { id: 'cammy',    name: 'Cammy',     slug: 'cammy',    bucklerCharId: 9,  color: '#4f86d8', colorSecondary: '#d83a3a' },
  { id: 'ryu',      name: 'Ryu',       slug: 'ryu',      bucklerCharId: 1,  color: '#9b2335', colorSecondary: '#9aa1ac' },
  { id: 'honda',    name: 'E. Honda',  slug: 'honda',    bucklerCharId: 20, color: '#5fb0e8', colorSecondary: '#e6ebf0' },
  { id: 'blanka',   name: 'Blanka',    slug: 'blanka',   bucklerCharId: 15, color: '#2bb24f', colorSecondary: '#3f8fe0' },
  { id: 'guile',    name: 'Guile',     slug: 'guile',    bucklerCharId: 18, color: '#6a9a4e', colorSecondary: '#3f7be0' },
  { id: 'ken',      name: 'Ken',       slug: 'ken',      bucklerCharId: 10, color: '#df7a2c', colorSecondary: '#d83a2a' },
  { id: 'chunli',   name: 'Chun-Li',   slug: 'chunli',   bucklerCharId: 4,  color: '#34a9e6', colorSecondary: '#f2c52a' },
  { id: 'zangief',  name: 'Zangief',   slug: 'zangief',  bucklerCharId: 6,  color: '#a8a0a0', colorSecondary: '#d23a3a' },
  { id: 'dhalsim',  name: 'Dhalsim',   slug: 'dhalsim',  bucklerCharId: 8,  color: '#cf8a3c', colorSecondary: '#d0432a' },
  { id: 'rashid',   name: 'Rashid',    slug: 'rashid',   bucklerCharId: 14, color: '#e6bb67', colorSecondary: '#b8823f' },
  { id: 'aki',      name: 'A.K.I.',    slug: 'aki',      bucklerCharId: 13, color: '#9d4edd', colorSecondary: '#9aa1ac' },
  { id: 'ed',       name: 'Ed',        slug: 'ed',       bucklerCharId: 19, color: '#b9c6d4', colorSecondary: '#8fa6bd' },
  { id: 'gouki',    name: 'Akuma',     slug: 'gouki',    bucklerCharId: 22, color: '#9a9298', colorSecondary: '#a02a24' },
  { id: 'vega',     name: 'M. Bison',  slug: 'vega',     bucklerCharId: 26, color: '#7c3aed', colorSecondary: '#5f5b66' },
  { id: 'terry',    name: 'Terry',     slug: 'terry',    bucklerCharId: 27, color: '#d83a3a', colorSecondary: '#5fa8e8' },
  { id: 'mai',      name: 'Mai',       slug: 'mai',      bucklerCharId: 28, color: '#f0805f', colorSecondary: '#e8442a' },
  { id: 'elena',    name: 'Elena',     slug: 'elena',    bucklerCharId: 29, color: '#f2c52a', colorSecondary: '#2fb0a0' },
  { id: 'sagat',    name: 'Sagat',     slug: 'sagat',    bucklerCharId: 25, color: '#a07a4a', colorSecondary: '#c8b89a' },
  { id: 'cviper',   name: 'C. Viper',  slug: 'cviper',   bucklerCharId: 30, color: '#b03038', colorSecondary: '#e6ebf0' },
  { id: 'alex',     name: 'Alex',      slug: 'alex',     bucklerCharId: 31, color: '#3f8050', colorSecondary: '#b05048' },
  { id: 'ingrid', name: 'Ingrid', slug: 'ingrid', bucklerCharId: 32, color: '#b9a0e8', colorSecondary: '#d4a738' },
  // { id: 'yasmine',   name: 'Yasmine',    slug: 'yasmine',   bucklerCharId: 33, color: '#b9a0e8', colorSecondary: '#d4a738' },
  // { id: 'arjun',   name: 'Arjun',    slug: 'arjun',   bucklerCharId: 34, color: '#b9a0e8', colorSecondary: '#d4a738' },
  // { id: 'tifa',   name: 'Tifa',    slug: 'tifa',   bucklerCharId: 35, color: '#b9a0e8', colorSecondary: '#d4a738' },
  // { id: 'bosch',   name: 'Bosch',    slug: 'bosh',   bucklerCharId: 36, color: '#b9a0e8', colorSecondary: '#d4a738' },
  { id: 'random',   name: 'Random',    slug: 'random',   bucklerCharId: 254, color: '#71717a', hidden: true },
]

export const CHARACTER_BY_BUCKLER_ID = new Map<number, Character>(
  CHARACTERS.map((c) => [c.bucklerCharId, c])
)

export function getCharacterByBucklerId(id: number): Character | undefined {
  return CHARACTER_BY_BUCKLER_ID.get(id)
}

export function getCharacterImageUrl(slug: string): string {
  return `/characters/${slug}.png`
}

// Full-body splash art used only for the character page header banner.
export function getCharacterFullImageUrl(slug: string): string {
  return `/characters/full/${slug}.png`
}

// Vertical background-position (%) for the character page header banner.
// Full-body splash arts are shown with background-size cover; this picks the
// vertical band so the crop lands on each character's head/torso. Default 14.
const CHARACTER_HEADER_Y: Record<string, number> = {
  luke: 14, jamie: 16, manon: 22, kimberly: 52, marisa: 35, lily: 38,
  jp: 6, juri: 54, deejay: 16, cammy: 5, ryu: 12, honda: 42, blanka: 33,
  guile: 1, ken: 22, chunli: 23, zangief: 20, dhalsim: 18, rashid: 35,
  aki: 35, ed: 18, gouki: 25, vega: 15, terry: 20, mai: 39, elena: 72,
  sagat: 15, cviper: 10, alex: 31, ingrid: 47,
}

export function getCharacterHeaderY(id: string): number {
  return CHARACTER_HEADER_Y[id] ?? 14
}
