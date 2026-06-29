import type { ItemCategory } from '@/types'

export const CAT_CHIP: Record<ItemCategory, string> = {
  hiragana: 'bg-[var(--cat-hira-bg)] text-[var(--cat-hira-fg)] border-[var(--cat-hira-border)]',
  katakana: 'bg-[var(--cat-kata-bg)] text-[var(--cat-kata-fg)] border-[var(--cat-kata-border)]',
  kanji: 'bg-[var(--cat-kanji-bg)] text-[var(--cat-kanji-fg)] border-[var(--cat-kanji-border)]',
  vocabulary: 'bg-[var(--cat-vocab-bg)] text-[var(--cat-vocab-fg)] border-[var(--cat-vocab-border)]',
}

export const CAT_GRADIENT: Record<ItemCategory, string> = {
  hiragana: 'from-blue-600/20 via-indigo-900/10 to-transparent',
  katakana: 'from-purple-600/20 via-indigo-900/10 to-transparent',
  kanji: 'from-orange-600/20 via-indigo-900/10 to-transparent',
  vocabulary: 'from-green-600/20 via-indigo-900/10 to-transparent',
}
