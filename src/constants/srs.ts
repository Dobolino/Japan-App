import type { ItemCategory, SRSRating } from '@/types'

export const XP_PER_CORRECT = 10
export const XP_PER_LEVEL = 200

export const RATING_BUTTONS: { rating: SRSRating; label: string; sub: string; color: string }[] = [
  { rating: 0, label: 'Nochmal', sub: '<1 min', color: 'bg-red-500/20 text-red-300 border-red-500/20' },
  { rating: 1, label: 'Schwer', sub: '<1 Tag', color: 'bg-orange-500/20 text-orange-300 border-orange-500/20' },
  { rating: 2, label: 'Gut', sub: '~4 Tage', color: 'bg-blue-500/20 text-blue-300 border-blue-500/20' },
  { rating: 3, label: 'Einfach', sub: '>7 Tage', color: 'bg-green-500/20 text-green-300 border-green-500/20' },
]

export const SRS_RATINGS: { r: SRSRating; label: string; color: string }[] = [
  { r: 0, label: 'Nochmal', color: 'bg-red-500/20 text-red-300' },
  { r: 1, label: 'Schwer', color: 'bg-orange-500/20 text-orange-300' },
  { r: 2, label: 'Gut', color: 'bg-blue-500/20 text-blue-300' },
  { r: 3, label: 'Einfach', color: 'bg-green-500/20 text-green-300' },
]

export const PRACTICE_CAT_OPTIONS: { key: ItemCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'hiragana', label: 'Hiragana' },
  { key: 'katakana', label: 'Katakana' },
  { key: 'kanji', label: 'Kanji' },
  { key: 'vocabulary', label: 'Vokabeln' },
]

export const STATS_CAT_OPTIONS: { key: ItemCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Gesamt' },
  { key: 'hiragana', label: 'Hiragana' },
  { key: 'katakana', label: 'Katakana' },
  { key: 'kanji', label: 'Kanji' },
  { key: 'vocabulary', label: 'Vokabeln' },
]

export function xpToLevel(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function xpInLevel(xp: number) {
  return xp % XP_PER_LEVEL
}
