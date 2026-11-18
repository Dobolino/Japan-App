import { toHiragana } from '@/utils/transliteration'
import { knownSentenceWords } from '@/data/sentenceIndex'
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
  const known = knownSentenceWords(text, reading)
  if (known) return known.flatMap((word) => word.segments)
  if (!isKanaReading(reading)) {
    return [{ text }]
  }

  // Without authored boundaries only assign ruby when the surrounding kana
  // identify the reading of the kanji run unambiguously.
  const runs = text.match(/[\p{Script=Han}々]+|[^\p{Script=Han}々]+/gu) ?? []
  const phonetic = toHiragana(reading).replace(/\s/g, '')
  if (!runs.some((run) => /[\p{Script=Han}々]/u.test(run)))
    return codePoints(text).map((ch) => ({ text: ch }))
  const segments: RubySegment[] = []
  let offset = 0
  for (const [index, run] of runs.entries()) {
    if (!/[\p{Script=Han}々]/u.test(run)) {
      const anchor = toHiragana(run).replace(/\s/g, '')
      if (!phonetic.startsWith(anchor, offset)) return [{ text }]
      offset += anchor.length
      segments.push(...codePoints(run).map((ch) => ({ text: ch })))
      continue
    }
    const next = runs[index + 1]
    let end = phonetic.length
    if (next) {
      const anchor = toHiragana(next).replace(/\s/g, '')
      if (index + 2 === runs.length) {
        if (!phonetic.endsWith(anchor)) return [{ text }]
        end -= anchor.length
      } else {
        end = phonetic.indexOf(anchor, offset + 1)
        if (phonetic.indexOf(anchor, end + 1) !== -1) return [{ text }]
      }
    }
    if (end <= offset) return [{ text }]
    const ruby = phonetic.slice(offset, end)
    if (!/^[\p{Script=Hiragana}ー]+$/u.test(ruby)) return [{ text }]
    segments.push({ text: run, reading: ruby })
    offset = end
  }
  return offset === phonetic.length ? segments : [{ text }]
}
