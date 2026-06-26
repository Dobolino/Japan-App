import type { LearningItem } from '@/types'

function normalizeRomaji(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[āáàâ]/g, 'a')
    .replace(/[īíìî]/g, 'i')
    .replace(/[ūúùû]/g, 'u')
    .replace(/[ēéèê]/g, 'e')
    .replace(/[ōóòô]/g, 'o')
}

/** Accept exact Japanese character or romaji (with optional macron normalization). */
export function matchesJapaneseAnswer(typed: string, item: LearningItem): boolean {
  const trimmed = typed.trim()
  if (!trimmed) return false
  if (trimmed === item.character) return true
  return normalizeRomaji(trimmed) === normalizeRomaji(item.romaji)
}
