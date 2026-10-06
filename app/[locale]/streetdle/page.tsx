import type { Metadata } from 'next'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/locales'
import { getDict } from '@/lib/i18n/dict'
import { StreedleGame } from './game'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return { ...getDict(isLocale(locale) ? locale : DEFAULT_LOCALE).meta.streetdle }
}

export default function StreedlePage() {
  return <StreedleGame />
}
