import { codePoints, classifyChar, type ScriptType } from '@/utils/scriptAnalyzer'

export interface ReadingPart {
  char: string
  reading: string
  type: ScriptType
}

/** Basic hiragana → romaji for okurigana suffix matching. */
const HIRA: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'wo', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu',  で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ゃ: 'ya', ゅ: 'yu', ょ: 'yo', っ: '', ー: '',
}

/** Split romaji string into approximate morae. */
export function splitRomajiMorae(romaji: string): string[] {
  const s = romaji.toLowerCase().replace(/[\s\-·]/g, '')
  if (!s) return []

  const morae: string[] = []
  let i = 0
  while (i < s.length) {
    if (s[i] === 'n') {
      if (i === s.length - 1 || !'aiueoy'.includes(s[i + 1])) {
        morae.push('n')
        i++
        continue
      }
    }

    let chunk = ''
    const c = s[i]
    if ('bcdfghjklmnpqrstvwxyz'.includes(c)) {
      chunk += c
      i++
      if (i < s.length && c === s[i - 1] && s[i] === 's' && s[i + 1] === 'h') {
        chunk += 'h'
        i++
      }
      if (i < s.length && 'y'.includes(s[i]) && i + 1 < s.length) {
        chunk += s[i] + s[i + 1]
        i += 2
      } else if (i < s.length && 'aiueo'.includes(s[i])) {
        chunk += s[i]
        i++
      }
    } else if ('aiueo'.includes(c)) {
      chunk = c
      i++
    } else {
      chunk = c
      i++
    }
    if (chunk) morae.push(chunk)
  }
  return morae
}

function kanaReading(ch: string): string {
  return HIRA[ch] ?? ''
}

function trailingKanaStart(chars: string[]): number {
  for (let i = chars.length - 1; i >= 0; i--) {
    const t = classifyChar(chars[i])
    if (t !== 'hiragana' && t !== 'katakana') return i + 1
  }
  return 0
}

function distributeMorae(morae: string[], count: number): string[] {
  if (count <= 0) return []
  if (count === 1) return [morae.join('')]
  if (morae.length === count) return morae

  const result: string[] = []
  const base = Math.floor(morae.length / count)
  let extra = morae.length % count
  let idx = 0
  for (let c = 0; c < count; c++) {
    const take = base + (extra > 0 ? 1 : 0)
    if (extra > 0) extra--
    result.push(morae.slice(idx, idx + take).join(''))
    idx += take
  }
  return result
}

/**
 * Heuristic: map each character to a slice of romaji.
 * Handles okurigana (高い → 高/taka + い/i) and multi-kanji (来年 → 来/rai + 年/nen).
 */
export function breakdownReading(character: string, romaji: string): ReadingPart[] {
  const chars = codePoints(character)
  const r = romaji.toLowerCase().trim().replace(/\s+/g, '')
  if (!chars.length) return []
  if (chars.length === 1) {
    return [{ char: chars[0], reading: r, type: classifyChar(chars[0]) }]
  }

  const trailStart = trailingKanaStart(chars)
  const leading = chars.slice(0, trailStart)
  const trailing = chars.slice(trailStart)

  if (trailing.length > 0 && leading.length > 0) {
    const trailReadings = trailing.map((c) => kanaReading(c))
    const trailRomaji = trailReadings.join('')
    const leadRomaji = r.endsWith(trailRomaji) ? r.slice(0, r.length - trailRomaji.length) : r.slice(0, r.length - trailRomaji.length || r.length)

    const leadMorae = splitRomajiMorae(leadRomaji)
    const leadParts = distributeMorae(leadMorae, leading.length)

    return [
      ...leading.map((c, i) => ({ char: c, reading: leadParts[i] ?? '', type: classifyChar(c) })),
      ...trailing.map((c, i) => ({
        char: c,
        reading: trailReadings[i] || kanaReading(c),
        type: classifyChar(c),
      })),
    ]
  }

  const morae = splitRomajiMorae(r)
  const allKana = chars.every((c) => classifyChar(c) !== 'kanji')

  if (allKana && morae.length >= chars.length) {
    return chars.map((c, i) => ({ char: c, reading: morae[i] ?? '', type: classifyChar(c) }))
  }

  const parts = distributeMorae(morae, chars.length)
  return chars.map((c, i) => ({ char: c, reading: parts[i] ?? '', type: classifyChar(c) }))
}
