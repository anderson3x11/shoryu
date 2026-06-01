import type { Metadata } from 'next'
import { StreedleGame } from './game'

export const metadata: Metadata = {
  title: 'Streetdle - Shoryu',
  description: 'Daily Street Fighter character guessing game',
}

export default function StreedlePage() {
  return <StreedleGame />
}
