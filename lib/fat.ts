// Read side of the FAT snapshot in lib/data/fat/ (frame data fields SuperCombo doesn't have).
// Regenerate it with `npx tsx scripts/refresh-fat.ts`. Data from FAT, GPL-3.0:
// https://github.com/D4RKONION/FAT
export const FAT_URL = 'https://github.com/D4RKONION/FAT'

export interface FatExtra {
  hitstun?: string
  blockstun?: string
  hitstop?: string
  range?: string
  hitConfirm?: string
  scaling?: string
  juggle?: string          // start / increase / limit
  afterDriveRush?: string  // on hit / on block
  perfectParry?: string
  superGain?: string       // on hit / on block
}

/** FAT extras for one character, keyed by SuperCombo move id ({} when there is no snapshot). */
export async function getFatExtras(id: string): Promise<Record<string, FatExtra>> {
  try {
    const mod = await import(`@/lib/data/fat/${id}.json`)
    return (mod.default ?? mod) as Record<string, FatExtra>
  } catch {
    return {}
  }
}
