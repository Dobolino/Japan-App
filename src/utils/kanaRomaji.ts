import { codePoints, classifyChar } from '@/utils/scriptAnalyzer'
import { tokenizeJapanese } from '@/utils/tokenize'

/** Hiragana → romaji (N5 coverage). */
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
  わ: 'wa', ゐ: 'wi', ゑ: 'we', を: 'wo', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ゃ: 'ya', ゅ: 'yu', ょ: 'yo', っ: '', ー: '',
}

function toHiragana(ch: string): string {
  const cp = ch.codePointAt(0) ?? 0
  if (cp >= 0x30a1 && cp <= 0x30f6) {
    return String.fromCodePoint(cp - 0x60)
  }
  if (cp >= 0xff66 && cp <= 0xff9f) {
    const half = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ'
    const full = 'ヲァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン゛゜'
    const idx = half.indexOf(ch)
    if (idx >= 0) return toHiragana(full[idx])
  }
  return ch
}

/** Convert hiragana/katakana reading to romaji for learners. */
export function kanaToRomaji(text: string): string {
  const chars = codePoints(text.replace(/[。、！？・\s]/g, ''))
  let out = ''
  let i = 0

  while (i < chars.length) {
    const ch = toHiragana(chars[i])

    if (ch === 'っ') {
      const next = toHiragana(chars[i + 1] ?? '')
      const nextRomaji = HIRA[next]
      if (nextRomaji) out += nextRomaji[0] ?? ''
      i++
      continue
    }

    if (ch === 'ー') {
      i++
      continue
    }

    const romaji = HIRA[ch]
    if (romaji !== undefined) {
      out += romaji
      i++
      continue
    }

    if (classifyChar(ch) === 'other' && /[a-zA-Z0-9]/.test(ch)) {
      out += ch.toLowerCase()
      i++
      continue
    }

    i++
  }

  return out.replace(/\s+/g, ' ').trim()
}

export function formatRomaji(romaji: string): string {
  if (!romaji) return ''
  return romaji.charAt(0).toUpperCase() + romaji.slice(1)
}

/** Romaji with spaces between words/particles for readability. */
export function romajiFromReading(reading: string, jp?: string): string {
  if (jp) {
    const tokens = tokenizeJapanese(jp, reading)
    const parts = tokens.map((t) => kanaToRomaji(t.reading)).filter(Boolean)
    if (parts.length > 0) return formatRomaji(parts.join(' '))
  }
  return formatRomaji(kanaToRomaji(reading))
}
