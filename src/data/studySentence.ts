import { toHiragana } from '@/utils/transliteration'

export interface StudyWord {
  surface: string
  reading: string
  segments: { text: string; reading?: string }[]
}

/** Spaces mark word boundaries; brackets supply the reading of the preceding kanji run. */
export function studySentence(annotated: string) {
  const words: StudyWord[] = annotated
    .trim()
    .split(/\s+/)
    .map((word) => {
      const segments: StudyWord['segments'] = []
      const pattern = /(\p{Script=Han}+)\[([ぁ-ゖー]+)\]|([ぁ-ゖァ-ヺー。、！？]+)/uy
      let consumed = 0
      while (consumed < word.length) {
        const match = pattern.exec(word)
        if (!match) throw new Error(`Ungültige Lesung bei „${word.slice(consumed)}“ im Satz „${annotated}“`)
        segments.push(match[1] ? { text: match[1], reading: match[2] } : { text: match[3] })
        consumed = pattern.lastIndex
      }
      if (!segments.length) throw new Error('Leerer Lerntext')
      return {
        surface: segments.map((part) => part.text).join(''),
        reading: segments.map((part) => part.reading ?? part.text.replace(/[ァ-ヺ]/gu, toHiragana)).join(''),
        segments,
      }
    })
  return {
    words,
    jp: words.map((word) => word.surface).join(''),
    reading: words.map((word) => word.reading).join(''),
  }
}
