import type { PersistentState } from '@/store/types'
import type { ItemCategory } from '@/types'
import { lemmaCard, sentenceCard, grammarSentenceCard, type ReviewCard } from '@/types/review'
import { grammarData } from '@/data/grammar'
import { selectReviewItems } from './reviewCounts'
export function createStudyPlan(
  state: PersistentState,
  category: ItemCategory | 'all' = 'all',
  limit = 20,
  now = new Date().toISOString()
): ReviewCard[] {
  const items = Object.values(state.items).filter((item) => category === 'all' || item.category === category)
  const eligible = items.filter(
    (item) => item.lastReviewDate !== null || state.introducedIds.includes(item.id)
  )
  const picked = selectReviewItems(eligible, limit, now).map(lemmaCard)
  const examples = items
    .filter(
      (item) =>
        item.exampleWord &&
        item.exampleReading &&
        ((state.exampleSrs[`${item.id}:ex`]?.lastReviewDate &&
          state.exampleSrs[`${item.id}:ex`].nextReviewDate <= now) ||
          (!state.exampleSrs[`${item.id}:ex`]?.lastReviewDate && item.correctCount >= 2))
    )
    .map(sentenceCard)
    .filter((card): card is ReviewCard => Boolean(card))
  const grammar =
    category === 'all'
      ? Object.values(state.grammarSrs)
          .filter((entry) =>
            entry.lastReviewDate
              ? entry.nextReviewDate <= now
              : state.introducedGrammarIds.includes(entry.grammarId)
          )
          .sort(
            (a, b) =>
              Number(Boolean(b.lastReviewDate)) - Number(Boolean(a.lastReviewDate)) ||
              a.nextReviewDate.localeCompare(b.nextReviewDate)
          )
          .flatMap((entry) => {
            const point = grammarData.find((g) => g.id === entry.grammarId)
            return point
              ? [grammarSentenceCard(point, entry.exampleIndex, point.examples[entry.exampleIndex])]
              : []
          })
      : []
  const pins = state.pinnedReviewIds
    .map((id) => state.items[id])
    .filter((item) => item && (category === 'all' || item.category === category))
    .slice(0, 4)
    .map(lemmaCard)
  const cards = [...picked, ...examples, ...grammar, ...pins]
  const unique = cards.filter(
    (card, index) => cards.findIndex((other) => other.srsId === card.srsId) === index
  )
  const schedule = (card: ReviewCard) =>
    state.grammarSrs[card.srsId] ?? state.exampleSrs[card.srsId] ?? state.items[card.srsId]
  return unique
    .sort((a, b) => {
      const sa = schedule(a),
        sb = schedule(b)
      return (
        Number(Boolean(sb?.lastReviewDate)) - Number(Boolean(sa?.lastReviewDate)) ||
        (sa?.nextReviewDate ?? now).localeCompare(sb?.nextReviewDate ?? now)
      )
    })
    .slice(0, limit)
}
