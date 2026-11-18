import { grammarData } from '@/data/grammar'
import { grammarSentenceCard, lemmaCard, sentenceCard, type ReviewCard } from '@/types/review'
import type { PersistentState } from './types'

/** Rehydrate content by its schedule ID, retaining the unique ID of each occurrence (including retries). */
export function rebuildSessionCard(
  state: Pick<PersistentState, 'items' | 'grammarSrs'>,
  srsId: string,
  cardId: string
): ReviewCard | null {
  let card: ReviewCard | null = null
  if (srsId.startsWith('grammar:')) {
    const entry = state.grammarSrs[srsId]
    const point = grammarData.find((grammar) => grammar.id === entry?.grammarId)
    if (point && entry && point.examples[entry.exampleIndex]) {
      card = grammarSentenceCard(point, entry.exampleIndex, point.examples[entry.exampleIndex])
    }
  } else {
    const example = srsId.endsWith(':ex')
    const itemId = example ? srsId.slice(0, -3) : srsId
    if (Object.prototype.hasOwnProperty.call(state.items, itemId)) {
      const item = state.items[itemId]
      card = example ? sentenceCard(item) : lemmaCard(item)
    }
  }
  return card ? { ...card, cardId } : null
}
