'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useT } from '@/lib/i18n/context'
import { fill } from '@/lib/i18n/format'
import {
  STREETDLE_CHARACTERS,
  compareCharacters,
  getDailyCharacter,
  getDailyKey,
  secondsUntilNextPuzzle,
  type StreedleCharacter,
  type GuessResults,
} from '@/lib/data/streetdle-data'

type SavedState = { guessIds: string[]; won: boolean; gaveUp: boolean }
type AttributeKey = 'gender' | 'country' | 'debut' | 'playableDebut' | 'archetype' | 'inputType'

// Column headers come from the dictionary (streetdle.col), keyed by attribute.
const COLUMNS: { key: AttributeKey }[] = [
  { key: 'gender' }, { key: 'country' }, { key: 'debut' }, { key: 'playableDebut' }, { key: 'archetype' }, { key: 'inputType' },
]

function cellClass(status: 'correct' | 'partial' | 'wrong') {
  if (status === 'correct') return 'bg-green-800/60 border border-green-600 text-green-300'
  if (status === 'partial') return 'bg-yellow-800/60 border border-yellow-600 text-yellow-300'
  return 'bg-red-900/40 border border-red-800 text-red-300'
}

function SearchItem({ char, onSelect }: { char: StreedleCharacter; onSelect: () => void }) {
  const [imgErr, setImgErr] = useState(false)
  return (
    <button
      onMouseDown={onSelect}
      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-700 text-left transition-colors"
    >
      <div className="relative w-12 h-12 rounded-none overflow-hidden flex-shrink-0 bg-zinc-700">
        {!imgErr ? (
          <Image src={`/characters/${char.id}.png`} alt={char.name} fill className="object-cover object-top" unoptimized onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center px-0.5">
            <span className="text-[9px] text-zinc-300 text-center leading-tight">{char.name}</span>
          </div>
        )}
      </div>
      <span className="text-lg text-zinc-100">{char.name}</span>
    </button>
  )
}

function CharacterSearch({ guessedIds, onGuess }: {
  guessedIds: string[]
  onGuess: (char: StreedleCharacter) => void
}) {
  const t = useT().streetdle
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = query.length === 0 ? [] : STREETDLE_CHARACTERS.filter(c =>
    !guessedIds.includes(c.id) &&
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  function select(char: StreedleCharacter) {
    onGuess(char)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className="relative max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={t.placeholder}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-none px-5 py-3.5 text-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-none overflow-hidden shadow-xl max-h-80 overflow-y-auto">
          {filtered.map(char => (
            <SearchItem key={char.id} char={char} onSelect={() => select(char)} />
          ))}
        </div>
      )}
    </div>
  )
}

export function StreedleGame() {
  const t = useT().streetdle
  const [target, setTarget]     = useState<StreedleCharacter | null>(null)
  const [guessIds, setGuessIds] = useState<string[]>([])
  const [won, setWon]           = useState(false)
  const [gaveUp, setGaveUp]     = useState(false)

  // Today's answer and saved guesses depend on the browser's clock and localStorage, so they are
  // seeded on mount rather than during render, which would not match the server HTML.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTarget(getDailyCharacter())
    try {
      const saved: SavedState = JSON.parse(localStorage.getItem(getDailyKey()) ?? 'null')
      if (saved) { setGuessIds(saved.guessIds); setWon(saved.won); setGaveUp(saved.gaveUp) }
    } catch {}
  }, [])

  function persist(ids: string[], w: boolean, g: boolean) {
    localStorage.setItem(getDailyKey(), JSON.stringify({ guessIds: ids, won: w, gaveUp: g }))
  }

  function guess(char: StreedleCharacter) {
    if (!target || won || gaveUp) return
    const newIds = [...guessIds, char.id]
    const isWon  = char.id === target.id
    setGuessIds(newIds); setWon(isWon)
    persist(newIds, isWon, false)
  }

  function giveUp() {
    if (!target) return
    setGaveUp(true); persist(guessIds, false, true)
  }

  if (!target) return null

  const guesses  = guessIds.map(id => STREETDLE_CHARACTERS.find(c => c.id === id)).filter(Boolean) as StreedleCharacter[]
  const gameOver = won || gaveUp

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Title */}
      <div className="text-center space-y-2 pt-4">
        <h1 className="font-bebas text-5xl sm:text-8xl tracking-widest text-zinc-100">STREETDLE</h1>
        <p className="text-zinc-300 text-lg">{t.subtitle}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-col items-center gap-3 text-base text-zinc-300">
        <div className="flex flex-wrap justify-center gap-6">
          <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-none bg-green-800 border border-green-600 inline-block" /> {t.correct}</span>
          <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-none bg-yellow-800 border border-yellow-600 inline-block" /> {t.partial}</span>
          <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-none bg-red-900/40 border border-red-800 inline-block" /> {t.wrong}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-zinc-400 text-sm">
          <span>{t.countryHint}</span>
          <span>{t.seriesHint}</span>
        </div>
      </div>

      {/* Win message */}
      {won && (
        <div className="bg-green-900/30 border border-green-700 rounded-none px-5 py-4 text-center">
          <p className="text-green-400 font-semibold text-lg">
            {fill(t.won, { n: guessIds.length, guesses: guessIds.length === 1 ? t.guessOne : t.guessMany })}
          </p>
          <NextPuzzleCountdown />
        </div>
      )}

      {/* Give-up reveal */}
      {gaveUp && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-none px-5 py-4 flex items-center gap-5">
          <div className="relative w-20 h-20 overflow-hidden rounded-none flex-shrink-0">
            <Image src={`/characters/${target.id}.png`} alt={target.name} fill className="object-cover object-top" unoptimized />
          </div>
          <div>
            <p className="text-zinc-300 text-sm">{t.answerWas}</p>
            <p className="text-zinc-100 font-semibold text-2xl">{target.name}</p>
            <NextPuzzleCountdown />
          </div>
        </div>
      )}

      {/* Search input */}
      {!gameOver && <CharacterSearch guessedIds={guessIds} onGuess={guess} />}

      {/* Give up */}
      {!gameOver && guessIds.length >= 3 && (
        <div className="flex justify-end">
          <button onClick={giveUp} className="text-base text-zinc-300 hover:text-zinc-200 transition-colors">
            {t.giveUp}
          </button>
        </div>
      )}

      {/* Guess count */}
      {guessIds.length > 0 && (
        <p className="text-base text-zinc-300 text-center">
          {guessIds.length} {guessIds.length === 1 ? t.guessOne : t.guessMany}
        </p>
      )}

      {/* Guesses table */}
      {guesses.length > 0 && (
        <div className="overflow-x-auto rounded-none border border-zinc-800">
          <table className="w-full text-sm border-collapse" style={{ minWidth: 820 }}>
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="text-left px-3 py-2.5 text-zinc-300 font-medium w-40">{t.character}</th>
                {COLUMNS.map(col => (
                  <th key={col.key} className="text-center px-2 py-2.5 text-zinc-300 font-medium">{t.col[col.key]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guesses.map(g => {
                const results: GuessResults = compareCharacters(g, target)
                return (
                  <tr key={g.id + guessIds.indexOf(g.id)} className="border-b border-zinc-800 last:border-0">
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 overflow-hidden rounded-none flex-shrink-0 bg-zinc-800">
                          <Image src={`/characters/${g.id}.png`} alt={g.name} fill className="object-cover object-top" unoptimized />
                        </div>
                        <span className={`font-medium truncate ${g.id === target.id ? 'text-green-400' : 'text-zinc-200'}`}>
                          {g.name}
                        </span>
                      </div>
                    </td>
                    {COLUMNS.map(col => {
                      const r = results[col.key]
                      const raw = g[col.key]
                      const value = Array.isArray(raw) ? raw.join(' / ') : raw as string
                      return (
                        <td key={col.key} className="px-2 py-2">
                          <div className={`rounded-none px-2 py-1.5 text-center ${cellClass(r.status)}`}>
                            {value}{r.arrow && <span className="ml-1 text-xs opacity-80">{r.arrow === 'up' ? '▲' : '▼'}</span>}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {guesses.length === 0 && !gameOver && (
        <div className="text-center py-16 text-zinc-400 text-lg">{t.noGuesses}</div>
      )}
    </div>
  )
}

// Ticks down to the 00:00 UTC rollover. Client-only (mounted state starts null) so the server
// never renders a time that is already wrong by the time it reaches the browser.
function NextPuzzleCountdown() {
  const t = useT().streetdle
  const [left, setLeft] = useState<number | null>(null)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeft(secondsUntilNextPuzzle())
    const t = setInterval(() => setLeft(secondsUntilNextPuzzle()), 1000)
    return () => clearInterval(t)
  }, [])
  if (left === null) return null
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const sec = left % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <p className="text-zinc-400 text-sm mt-1 tabular-nums">
      {fill(t.nextIn, { time: `${pad(h)}:${pad(m)}:${pad(sec)}` })}
    </p>
  )
}
