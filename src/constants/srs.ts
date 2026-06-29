import type { ItemCategory, SRSRating } from '@/types'

export const XP_PER_CORRECT = 10
export const XP_PER_LEVEL = 200

export const RATING_BUTTONS: { rating: SRSRating; label: string; sub: string; color: string }[] = [
  { rating: 0, label: 'Nochmal', sub: '<1 min', color: 'bg-[var(--rating-red-bg)] text-[var(--rating-red-fg)] border-[var(--rating-red-fg)]/30' },
  { rating: 1, label: 'Schwer', sub: '<1 Tag', color: 'bg-[var(--rating-orange-bg)] text-[var(--rating-orange-fg)] border-[var(--rating-orange-fg)]/30' },
  { rating: 2, label: 'Gut', sub: '~4 Tage', color: 'bg-[var(--rating-blue-bg)] text-[var(--rating-blue-fg)] border-[var(--rating-blue-fg)]/30' },
  { rating: 3, label: 'Einfach', sub: '>7 Tage', color: 'bg-[var(--rating-green-bg)] text-[var(--rating-green-fg)] border-[var(--rating-green-fg)]/30' },
]

export const SRS_RATINGS: { r: SRSRating; label: string; color: string }[] = [
  { r: 0, label: 'Nochmal', color: 'bg-[var(--rating-red-bg)] text-[var(--rating-red-fg)]' },
  { r: 1, label: 'Schwer', color: 'bg-[var(--rating-orange-bg)] text-[var(--rating-orange-fg)]' },
  { r: 2, label: 'Gut', color: 'bg-[var(--rating-blue-bg)] text-[var(--rating-blue-fg)]' },
  { r: 3, label: 'Einfach', color: 'bg-[var(--rating-green-bg)] text-[var(--rating-green-fg)]' },
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
