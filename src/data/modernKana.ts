import type { LearningItem } from '@/types'
import { kanaToRomaji } from '@/utils/transliteration'
const voiced = 'がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ'
const combinations = ['き', 'ぎ', 'し', 'じ', 'ち', 'に', 'ひ', 'び', 'ぴ', 'み', 'り'].flatMap((base) =>
  ['ゃ', 'ゅ', 'ょ'].map((small) => base + small)
)
const signs = [...voiced, ...combinations]
export const modernKana: LearningItem[] = (['hiragana', 'katakana'] as const).flatMap((category) =>
  signs.map((hira) => {
    const character =
      category === 'hiragana'
        ? hira
        : [...hira].map((ch) => String.fromCodePoint(ch.codePointAt(0)! + 0x60)).join('')
    const romaji = kanaToRomaji(character)
    return {
      id: `${category === 'hiragana' ? 'h' : 'k'}-ext-${[...character].map((ch) => ch.codePointAt(0)!.toString(16)).join('-')}`,
      character,
      romaji,
      meaning: romaji,
      category,
      status: 'new',
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReviewDate: new Date().toISOString(),
      lastReviewDate: null,
      errorCount: 0,
      correctCount: 0,
    }
  })
)
