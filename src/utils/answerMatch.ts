import type { LearningItem } from '@/types'
import { matchesAlternatives, kanaToRomaji } from './transliteration'
export function matchesJapaneseAnswer(typed: string, item: LearningItem): boolean {
  const readings =
    item.readings?.flatMap((reading) => [reading.kana, reading.romaji]) ??
    [...(item.onyomi ?? []), ...(item.kunyomi ?? [])].flatMap((reading) => [
      reading.replace(/・/g, ''),
      kanaToRomaji(reading),
    ])
  return matchesAlternatives(typed, [item.character, ...item.romaji.split(' / '), ...readings])
}
