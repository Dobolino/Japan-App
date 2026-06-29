import { alignFurigana, isKanaReading } from '@/utils/furigana'
import { classifyChar, codePoints } from '@/utils/scriptAnalyzer'
import { isKnownParticle, lookupToken, particleMeaning } from '@/utils/lexicon'
import type { Token, TokenPos } from '@/types/token'

const MULTI_PARTICLES = ['から', 'まで', 'より']

function enrichToken(surface: string, reading: string, pos: TokenPos): Token {
  if (pos === 'particle') {
    return {
      surface,
      reading,
      pos,
      meaning: particleMeaning(surface),
    }
  }

  const hit = lookupToken(surface, reading)
  return {
    surface,
    reading,
    pos,
    lemmaId: hit?.id,
    meaning: hit?.meaning,
    romaji: hit?.romaji,
  }
}

/** Group ruby segments into word/particle tokens. */
function segmentsToTokens(text: string, reading: string): Token[] {
  const segments = isKanaReading(reading) ? alignFurigana(text, reading) : [{ text }]
  const tokens: Token[] = []
  let buf = { surface: '', reading: '' }

  const flush = () => {
    if (!buf.surface) return
    const pos: TokenPos = buf.surface.length === 1 && isKnownParticle(buf.surface) ? 'particle' : 'word'
    tokens.push(enrichToken(buf.surface, buf.reading || buf.surface, pos))
    buf = { surface: '', reading: '' }
  }

  for (const seg of segments) {
    const surf = seg.text
    const read = seg.reading ?? seg.text

    if (surf.length === 1 && isKnownParticle(surf)) {
      flush()
      tokens.push(enrichToken(surf, read, 'particle'))
      continue
    }

    if (classifyChar(surf[0]) === 'katakana' && !seg.reading) {
      flush()
      tokens.push(enrichToken(surf, surf, 'word'))
      continue
    }

    buf.surface += surf
    buf.reading += read
  }

  flush()

  if (tokens.length === 0 && text.trim()) {
    return [enrichToken(text, reading || text, 'word')]
  }

  return tokens
}

/** Split a kana-only string on particle boundaries. */
function splitKanaOnParticles(kana: string): string[] {
  const parts: string[] = []
  let i = 0
  const chars = codePoints(kana)

  while (i < chars.length) {
    let matched = false
    for (const mp of MULTI_PARTICLES) {
      const slice = chars.slice(i, i + mp.length).join('')
      if (slice === mp) {
        parts.push(slice)
        i += mp.length
        matched = true
        break
      }
    }
    if (matched) continue

    if (isKnownParticle(chars[i])) {
      parts.push(chars[i])
      i++
      continue
    }

    let chunk = chars[i]
    i++
    while (i < chars.length) {
      let isPart = isKnownParticle(chars[i])
      for (const mp of MULTI_PARTICLES) {
        if (chars.slice(i, i + mp.length).join('') === mp) isPart = true
      }
      if (isPart) break
      chunk += chars[i]
      i++
    }
    parts.push(chunk)
  }

  return parts.filter(Boolean)
}

/**
 * Tokenize Japanese text using an optional hiragana reading.
 * Falls back to particle splitting on kana-only input.
 */
export function tokenizeJapanese(text: string, reading?: string): Token[] {
  const stripped = text.replace(/[。、！？]/g, '').trim()
  if (!stripped) return []

  if (reading && isKanaReading(reading)) {
    return segmentsToTokens(stripped, reading.replace(/[。、！？]/g, ''))
  }

  if (/^[\u3040-\u30FF\uFF65-\uFF9F]+$/.test(stripped)) {
    return splitKanaOnParticles(stripped).map((part) =>
      enrichToken(
        part,
        part,
        isKnownParticle(part) ? 'particle' : 'word'
      )
    )
  }

  return [enrichToken(stripped, reading ?? stripped, 'word')]
}
