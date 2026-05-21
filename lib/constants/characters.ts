export interface Character {
  id: string
  name: string
  slug: string        // Buckler tool_name used in image URLs and API responses
  bucklerCharId: number // Numeric character_id used in character_league_infos
  color: string       // Signature hex color for UI accents
  comingSoon?: boolean // Not yet released — hide from home grid, no portrait available
}

export const CHARACTERS: Character[] = [
  { id: 'luke',     name: 'Luke',      slug: 'luke',     bucklerCharId: 2,  color: '#f97316' },
  { id: 'jamie',    name: 'Jamie',     slug: 'jamie',    bucklerCharId: 21, color: '#9333ea' },
  { id: 'manon',    name: 'Manon',     slug: 'manon',    bucklerCharId: 5,  color: '#ec4899' },
  { id: 'kimberly', name: 'Kimberly',  slug: 'kimberly', bucklerCharId: 3,  color: '#a855f7' },
  { id: 'marisa',   name: 'Marisa',    slug: 'marisa',   bucklerCharId: 17, color: '#d97706' },
  { id: 'lily',     name: 'Lily',      slug: 'lily',     bucklerCharId: 12, color: '#14b8a6' },
  { id: 'jp',       name: 'JP',        slug: 'jp',       bucklerCharId: 7,  color: '#8b5cf6' },
  { id: 'juri',     name: 'Juri',      slug: 'juri',     bucklerCharId: 16, color: '#d946ef' },
  { id: 'deejay',   name: 'Dee Jay',   slug: 'deejay',   bucklerCharId: 11, color: '#eab308' },
  { id: 'cammy',    name: 'Cammy',     slug: 'cammy',    bucklerCharId: 9,  color: '#22c55e' },
  { id: 'ryu',      name: 'Ryu',       slug: 'ryu',      bucklerCharId: 1,  color: '#3b82f6' },
  { id: 'honda',    name: 'E. Honda',  slug: 'honda',    bucklerCharId: 20, color: '#b91c1c' },
  { id: 'blanka',   name: 'Blanka',    slug: 'blanka',   bucklerCharId: 15, color: '#16a34a' },
  { id: 'guile',    name: 'Guile',     slug: 'guile',    bucklerCharId: 18, color: '#1d4ed8' },
  { id: 'ken',      name: 'Ken',       slug: 'ken',      bucklerCharId: 10, color: '#dc2626' },
  { id: 'chunli',   name: 'Chun-Li',   slug: 'chunli',   bucklerCharId: 4,  color: '#60a5fa' },
  { id: 'zangief',  name: 'Zangief',   slug: 'zangief',  bucklerCharId: 6,  color: '#ef4444' },
  { id: 'dhalsim',  name: 'Dhalsim',   slug: 'dhalsim',  bucklerCharId: 8,  color: '#f59e0b' },
  { id: 'rashid',   name: 'Rashid',    slug: 'rashid',   bucklerCharId: 14, color: '#10b981' },
  { id: 'aki',      name: 'A.K.I.',    slug: 'aki',      bucklerCharId: 13, color: '#06b6d4' },
  { id: 'ed',       name: 'Ed',        slug: 'ed',       bucklerCharId: 19, color: '#c2410c' },
  { id: 'gouki',    name: 'Akuma',     slug: 'gouki',    bucklerCharId: 22, color: '#991b1b' },
  { id: 'vega',     name: 'M. Bison',  slug: 'vega',     bucklerCharId: 26, color: '#7c3aed' },
  { id: 'terry',    name: 'Terry',     slug: 'terry',    bucklerCharId: 27, color: '#e11d48' },
  { id: 'mai',      name: 'Mai',       slug: 'mai',      bucklerCharId: 28, color: '#f43f5e' },
  { id: 'elena',    name: 'Elena',     slug: 'elena',    bucklerCharId: 29, color: '#ca8a04' },
  { id: 'sagat',    name: 'Sagat',     slug: 'sagat',    bucklerCharId: 25, color: '#ea580c' },
  { id: 'cviper',   name: 'C. Viper',  slug: 'cviper',   bucklerCharId: 30, color: '#fb923c' },
  { id: 'alex',     name: 'Alex',      slug: 'alex',     bucklerCharId: 31, color: '#0ea5e9' },
  { id: 'ingrid',   name: 'Ingrid',    slug: 'ingrid',   bucklerCharId: 0,  color: '#d4af37', comingSoon: true },
]

export const CHARACTER_BY_SLUG = new Map<string, Character>(
  CHARACTERS.map((c) => [c.slug, c])
)

export const CHARACTER_BY_BUCKLER_ID = new Map<number, Character>(
  CHARACTERS.map((c) => [c.bucklerCharId, c])
)

export function getCharacterBySlug(slug: string): Character | undefined {
  return CHARACTER_BY_SLUG.get(slug)
}

export function getCharacterByBucklerId(id: number): Character | undefined {
  return CHARACTER_BY_BUCKLER_ID.get(id)
}

export function getCharacterImageUrl(slug: string): string {
  return `/characters/${slug}.png`
}
