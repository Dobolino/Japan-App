/** Pure kana transliteration: shared by content, matching and reading helpers. */
const kana =
  'あ:a い:i う:u え:e お:o か:ka き:ki く:ku け:ke こ:ko さ:sa し:shi す:su せ:se そ:so た:ta ち:chi つ:tsu て:te と:to な:na に:ni ぬ:nu ね:ne の:no は:ha ひ:hi ふ:fu へ:he ほ:ho ま:ma み:mi む:mu め:me も:mo や:ya ゆ:yu よ:yo ら:ra り:ri る:ru れ:re ろ:ro わ:wa ゐ:wi ゑ:we を:wo ん:n が:ga ぎ:gi ぐ:gu げ:ge ご:go ざ:za じ:ji ず:zu ぜ:ze ぞ:zo だ:da ぢ:ji づ:zu で:de ど:do ば:ba び:bi ぶ:bu べ:be ぼ:bo ぱ:pa ぴ:pi ぷ:pu ぺ:pe ぽ:po ぁ:a ぃ:i ぅ:u ぇ:e ぉ:o ゃ:ya ゅ:yu ょ:yo ゔ:vu'
const syllables = Object.fromEntries(kana.split(' ').map((entry) => entry.split(':')))
const combinations: Record<string, string> = { し: 'sh', ち: 'ch', じ: 'j', ぢ: 'j' }
export function toHiragana(text: string): string {
  return [...text.normalize('NFKC')]
    .map((ch) => {
      const cp = ch.codePointAt(0)!
      return cp >= 0x30a1 && cp <= 0x30f6 ? String.fromCodePoint(cp - 0x60) : ch
    })
    .join('')
}
export function kanaToRomaji(text: string): string {
  const chars = [...toHiragana(text.replace(/[。、！？・\s]/g, ''))]
  let out = ''
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    if (ch === 'っ') {
      const next = syllables[chars[i + 1]]
      if (next) out += next.startsWith('ch') ? 't' : next[0]
      continue
    }
    if (ch === 'ー') {
      out += out.match(/[aeiou](?!.*[aeiou])/)?.[0] ?? ''
      continue
    }
    const syllable = syllables[ch]
    const small = { ゃ: 'a', ゅ: 'u', ょ: 'o' }[chars[i + 1] as 'ゃ']
    if (small && syllable?.endsWith('i')) {
      out += (combinations[ch] ?? syllable.slice(0, -1) + 'y') + small
      i++
      continue
    }
    out += syllable ?? (/^[a-z0-9]$/i.test(ch) ? ch.toLowerCase() : '')
  }
  return out
}
/** Preserve vowel length: おばさん and おばあさん must remain different answers. */
export function normalizeAnswer(text: string): string {
  return toHiragana(text)
    .toLowerCase()
    .trim()
    .replace(/[。、「」！？!?.,\s・'’]/g, '')
    .replace(/ā/g, 'aa')
    .replace(/ī/g, 'ii')
    .replace(/ū/g, 'uu')
    .replace(/ē/g, 'ee')
    .replace(/ō/g, 'ou')
    .replace(/si/g, 'shi')
    .replace(/ti/g, 'chi')
    .replace(/tu/g, 'tsu')
    .replace(/hu/g, 'fu')
    .replace(/zi/g, 'ji')
    .replace(/di/g, 'ji')
    .replace(/du/g, 'zu')
    .replace(/oo|ou/g, 'ō')
}
export function matchesAlternatives(typed: string, targets: string[]): boolean {
  if (!typed.trim()) return false
  const answer = normalizeAnswer(typed)
  const kanaOnly = /^[\u3040-\u30ffー\s。、！？]+$/.test(typed.trim())
  return targets.some(
    (target) =>
      normalizeAnswer(target) === answer ||
      (kanaOnly && /[a-z]/i.test(target) && normalizeAnswer(kanaToRomaji(typed)) === normalizeAnswer(target))
  )
}
