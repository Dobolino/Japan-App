import type { ItemCategory } from '@/types'

export const CAT_CHIP: Record<ItemCategory, string> = {
  hiragana: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  katakana: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  kanji: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  vocabulary: 'bg-green-500/20 text-green-300 border-green-500/30',
}

export const CAT_GRADIENT: Record<ItemCategory, string> = {
  hiragana: 'from-blue-600/20 via-indigo-900/10 to-transparent',
  katakana: 'from-purple-600/20 via-indigo-900/10 to-transparent',
  kanji: 'from-orange-600/20 via-indigo-900/10 to-transparent',
  vocabulary: 'from-green-600/20 via-indigo-900/10 to-transparent',
}
