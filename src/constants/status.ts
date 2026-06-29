import type { ItemCategory, SRSStatus } from '@/types'

export const STATUS_COLORS: Record<SRSStatus, string> = {
  new: 'bg-[var(--status-new-bg)] text-[var(--status-new-fg)]',
  learning: 'bg-[var(--status-learn-bg)] text-[var(--status-learn-fg)]',
  uncertain: 'bg-[var(--status-uncertain-bg)] text-[var(--status-uncertain-fg)]',
  mastered: 'bg-[var(--status-mastered-bg)] text-[var(--status-mastered-fg)]',
}

export const STATUS_LABELS: Record<SRSStatus, string> = {
  new: 'Neu',
  learning: 'Lernen',
  uncertain: 'Unsicher',
  mastered: 'Beherrscht',
}

export const STATUS_LABELS_SHORT: Record<SRSStatus, string> = {
  new: 'Neu',
  learning: 'Lerne',
  uncertain: 'Unsicher',
  mastered: 'Gelernt',
}

export const STATUS_TEXT_COLORS: Record<SRSStatus, string> = {
  new: 'text-[var(--status-new-fg)]',
  learning: 'text-[var(--status-learn-fg)]',
  uncertain: 'text-[var(--status-uncertain-fg)]',
  mastered: 'text-[var(--status-mastered-fg)]',
}

export const STATUS_DOT: Record<SRSStatus, string> = {
  new: 'bg-[var(--status-new-fg)]',
  learning: 'bg-[var(--blue)]',
  uncertain: 'bg-[var(--orange)]',
  mastered: 'bg-[var(--green)]',
}

export const CAT_LABELS: Record<ItemCategory, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana',
  kanji: 'Kanji N5',
  vocabulary: 'Vokabeln',
}

export function catFilterLabel(key: ItemCategory | 'all'): string {
  if (key === 'all') return 'Alle Kategorien'
  return CAT_LABELS[key]
}
