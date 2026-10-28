import { tokenizeJapanese } from '@/utils/tokenize'
import { kanaToRomaji } from '@/utils/transliteration'
export { kanaToRomaji } from '@/utils/transliteration'

export function formatRomaji(romaji: string): string {
  if (!romaji) return ''
  return romaji.charAt(0).toUpperCase() + romaji.slice(1)
}

/** Romaji with spaces between words/particles for readability. */
export function romajiFromReading(reading: string, jp?: string): string {
  if (jp) {
    const tokens = tokenizeJapanese(jp, reading)
    const parts = tokens
      .map((t) =>
        t.pos === 'particle'
          ? ({ は: 'wa', へ: 'e', を: 'o' }[t.surface] ?? kanaToRomaji(t.reading))
          : kanaToRomaji(t.reading)
      )
      .filter(Boolean)
    if (parts.length > 0) return formatRomaji(parts.join(' '))
  }
  return formatRomaji(kanaToRomaji(reading))
}
