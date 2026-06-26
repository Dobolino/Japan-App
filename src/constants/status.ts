import type { ItemCategory, SRSStatus } from '@/types'

export const STATUS_COLORS: Record<SRSStatus, string> = {
  new: 'bg-white/10 text-white/50',
  learning: 'bg-blue-500/20 text-blue-300',
  uncertain: 'bg-yellow-500/20 text-yellow-300',
  mastered: 'bg-green-500/20 text-green-300',
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
  new: 'text-white/40',
  learning: 'text-blue-300',
  uncertain: 'text-yellow-300',
  mastered: 'text-green-300',
}

export const STATUS_DOT: Record<SRSStatus, string> = {
  new: 'bg-white/20',
  learning: 'bg-blue-500',
  uncertain: 'bg-yellow-500',
  mastered: 'bg-green-500',
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
