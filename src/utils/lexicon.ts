import { hiraganaData } from '@/data/hiragana'
import { katakanaData } from '@/data/katakana'
import { vocabularyData } from '@/data/vocabulary'
import { kanjiN5Data } from '@/data/kanji-n5'
import type { LexiconEntry } from '@/types/token'

const ALL_ITEMS = [...hiraganaData, ...katakanaData, ...vocabularyData, ...kanjiN5Data]

/** N5 particle glosses (German). */
export const PARTICLE_MEANINGS: Record<string, string> = {
  は: 'Thema-Partikel (wa)',
  が: 'Subjekt-Partikel',
  を: 'Objekt-Partikel (wo)',
  に: 'Richtung / Ort / Zeit',
  で: 'Ort der Handlung / Mittel',
  と: 'und / zusammen mit',
  も: 'auch',
  か: 'Fragepartikel',
  ね: 'Bestätigung (ne)',
  よ: 'Betonung (yo)',
  の: 'Besitz / Nomen-Zusatz',
  へ: 'Richtung (he)',
  や: 'und (unvollständige Liste)',
  から: 'von / ab',
  まで: 'bis',
  より: 'als / von (Vergleich)',
}

function normalizeKey(s: string): string {
  return s.replace(/[\s.、。！？]/g, '').toLowerCase()
}

function buildLexicon(): Map<string, LexiconEntry[]> {
  const map = new Map<string, LexiconEntry[]>()

  const add = (key: string, entry: LexiconEntry) => {
    const k = normalizeKey(key)
    if (!k) return
    const list = map.get(k) ?? []
    if (!list.some((e) => e.id === entry.id)) list.push(entry)
    map.set(k, list)
  }

  for (const item of ALL_ITEMS) {
    const entry: LexiconEntry = {
      id: item.id,
      surface: item.character,
      reading: item.exampleReading ?? undefined,
      romaji: item.romaji,
      meaning: item.meaning,
      category: item.category,
    }
    add(item.character, entry)
    add(item.romaji, entry)
    if (item.exampleWord) add(item.exampleWord, entry)
    if (item.exampleReading) add(item.exampleReading, entry)
  }

  return map
}

const LEXICON = buildLexicon()

export function lookupSurface(surface: string): LexiconEntry | undefined {
  const entries = LEXICON.get(normalizeKey(surface))
  return entries?.[0]
}

export function lookupReading(reading: string): LexiconEntry | undefined {
  const entries = LEXICON.get(normalizeKey(reading))
  return entries?.[0]
}

export function lookupToken(surface: string, reading: string): LexiconEntry | undefined {
  return lookupSurface(surface) ?? lookupReading(reading)
}

export function isKnownParticle(surface: string): boolean {
  return surface in PARTICLE_MEANINGS
}

export function particleMeaning(surface: string): string | undefined {
  return PARTICLE_MEANINGS[surface]
}
