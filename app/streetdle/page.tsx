import type { Metadata } from 'next'
import { StreedleGame } from './game'

export const metadata: Metadata = {
  title: 'Streetdle',
  description: 'Daily Street Fighter character guessing game. 72 characters from SF1 to KOF. A new character every day.',
}

export default function StreedlePage() {
  return <StreedleGame />
}
