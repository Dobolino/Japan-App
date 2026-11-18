import type { LearningItem } from '@/types'
import { matchesAlternatives, kanaToRomaji } from './transliteration'
export function acceptedReadings(item: LearningItem): string[] {
  return (
    item.readings?.flatMap(({ kana, romaji, writtenForm }) =>
      writtenForm ? [kana, romaji, writtenForm] : [kana, romaji]
    ) ??
    [...(item.onyomi ?? []), ...(item.kunyomi ?? [])].flatMap((reading) => [
      reading.replace(/・/g, ''),
      kanaToRomaji(reading),
    ])
  )
}
export function matchesJapaneseAnswer(typed: string, item: LearningItem): boolean {
  return matchesAlternatives(typed, [item.character, ...item.romaji.split(' / '), ...acceptedReadings(item)])
}
