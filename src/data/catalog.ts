import { hiraganaData } from './hiragana'
import { katakanaData } from './katakana'
import { kanjiN5Data } from './kanji-n5'
import { vocabularyData } from './vocabulary'
import { modernKana } from './modernKana'
import { kanaToRomaji } from '@/utils/transliteration'
import type { LearningItem } from '@/types'
export const catalog: LearningItem[] = [
  ...hiraganaData,
  ...katakanaData,
  ...modernKana,
  ...kanjiN5Data,
  ...vocabularyData,
].map((seed) => {
  const readings = [
    ...(seed.onyomi ?? []).map((value) => ({ value, kind: 'on' as const })),
    ...(seed.kunyomi ?? []).map((value) => ({ value, kind: 'kun' as const })),
  ].map(({ value, kind }) => {
    const [stem, okurigana = ''] = value.split('・')
    const kana = stem + okurigana
    return {
      kana,
      romaji: kanaToRomaji(kana),
      kind,
      ...(okurigana && { writtenForm: seed.character + okurigana }),
    }
  })
  return {
    ...seed,
    historical: /^[ゐゑヰヱ]$/.test(seed.character),
    ...(readings.length ? { readings, romaji: readings.map((r) => r.romaji).join(' / ') } : {}),
  }
})
export const catalogById = Object.fromEntries(catalog.map((item) => [item.id, item]))
