import { classifyChar, codePoints } from '@/utils/scriptAnalyzer'

export interface RubySegment {
  text: string
  reading?: string
}

function isKana(ch: string): boolean {
  const t = classifyChar(ch)
  return t === 'hiragana' || t === 'katakana'
}

/** True if reading looks like hiragana/katakana (not romaji). */
export function isKanaReading(reading: string): boolean {
  const chars = codePoints(reading.replace(/[\s.、。！？]/g, ''))
  if (!chars.length) return false
  const kanaCount = chars.filter((c) => isKana(c)).length
  return kanaCount / chars.length >= 0.7
}

/**
 * Align Japanese surface text with a hiragana reading string into ruby segments.
 * Works for grammar example sentences (e.g. 私は… + わたしは…).
 */
export function alignFurigana(text: string, reading: string): RubySegment[] {
  if (!isKanaReading(reading)) {
    return [{ text }]
  }

  const chars = codePoints(text)
  const readChars = codePoints(reading.replace(/\s/g, ''))
  const segments: RubySegment[] = []
  let ri = 0
  let i = 0

  while (i < chars.length) {
    const ch = chars[i]
    const type = classifyChar(ch)

    if (type !== 'kanji') {
      if (ri < readChars.length && readChars[ri] === ch) ri++
      segments.push({ text: ch })
      i++
      continue
    }

    let kanjiRun = ''
    while (i < chars.length && classifyChar(chars[i]) === 'kanji') {
      kanjiRun += chars[i]
      i++
    }

    let ruby = ''
    const nextChar = i < chars.length ? chars[i] : null
    while (ri < readChars.length) {
      if (nextChar && readChars[ri] === nextChar) break
      ruby += readChars[ri]
      ri++
    }

    segments.push({ text: kanjiRun, reading: ruby || undefined })
  }

  return segments
}
