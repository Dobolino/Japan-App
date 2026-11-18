import { catalog } from '@/data/catalog'
import { readingGlosses } from '@/data/readingGlosses'
import { studySentence } from '@/data/studySentence'
import { kanaToRomaji, toHiragana } from './transliteration'
import type { LexiconEntry } from '@/types/token'

export const PARTICLE_MEANINGS: Record<string, string> = {
  は: 'Thema-Partikel (wa)',
  が: 'Subjekt-Partikel',
  を: 'Markiert ein Objekt, einen zurückgelegten Weg oder den Ort, den man verlässt (o)',
  に: 'Markiert unter anderem Ziel, Zeitpunkt oder die Person, der man begegnet',
  で: 'Markiert unter anderem Ort, Mittel oder Umstände einer Handlung',
  と: 'und / zusammen mit',
  も: 'auch',
  か: 'Fragepartikel',
  ね: 'Bestätigung (ne)',
  よ: 'Betonung (yo)',
  の: 'Besitz / Nomen-Zusatz',
  へ: 'Richtung (e)',
  や: 'und (unvollständige Liste)',
  から: 'von / ab',
  まで: 'bis',
  より: 'als / von (Vergleich)',
}

const dictionary = new Map<string, LexiconEntry[]>()
const pronunciations = new Map<string, LexiconEntry[]>()

function add(map: Map<string, LexiconEntry[]>, key: string, entry: LexiconEntry) {
  const entries = map.get(key) ?? []
  entries.push(entry)
  map.set(key, entries)
}

// A word card has priority over the same spelling used as a kanji or as an example.
for (const category of ['vocabulary', 'kanji']) {
  for (const item of catalog.filter((item) => item.category === category)) {
    const entry = {
      id: item.id,
      surface: item.character,
      romaji: item.romaji,
      meaning: item.meaning,
      category,
    }
    add(dictionary, item.character, entry)
    if (category === 'vocabulary') {
      for (const romaji of item.romaji.split(' / ')) add(pronunciations, romaji.replace(/\s/g, ''), entry)
    }
  }
}
for (const item of catalog) {
  if (item.exampleWord && item.exampleReading && item.exampleMeaning) {
    add(dictionary, item.exampleWord, {
      surface: item.exampleWord,
      romaji: item.exampleReading,
      meaning: item.exampleMeaning,
      category: 'example',
    })
  }
}

for (const [annotated, meaning, headword] of readingGlosses) {
  const { jp: surface, reading } = studySentence(annotated)
  const entry = {
    id: headword ? dictionary.get(headword)?.find((word) => word.id)?.id : undefined,
    surface,
    romaji: kanaToRomaji(reading),
    meaning,
    category: 'gloss',
  }
  dictionary.set(surface, [entry, ...(dictionary.get(surface) ?? [])])
}

export function lookupToken(surface: string, reading: string): LexiconEntry | undefined {
  const pronunciation = kanaToRomaji(reading)
  const entries = dictionary.get(surface) ?? []
  const match = entries.find((entry) =>
    entry.romaji.split(' / ').some((romaji) => romaji.replace(/\s/g, '') === pronunciation)
  )
  // A kana-only example can share its spelling with other catalogued words (はな).
  if (
    match?.category === 'example' &&
    /^[ぁ-ゖー]+$/.test(surface) &&
    (pronunciations.get(pronunciation)?.length ?? 0) > 1
  )
    return undefined
  if (match) return match
  if (entries.length && !pronunciation) return entries[0]
  if (toHiragana(surface) !== toHiragana(reading) || !pronunciation) return undefined
  // A kana-only spelling has no kanji to disambiguate homophones such as はな (花 / 鼻).
  const candidates = pronunciations.get(pronunciation)
  return candidates?.length === 1 ? candidates[0] : undefined
}

export function isKnownParticle(surface: string): boolean {
  return Object.prototype.hasOwnProperty.call(PARTICLE_MEANINGS, surface)
}

export function particleMeaning(surface: string): string | undefined {
  return PARTICLE_MEANINGS[surface]
}
