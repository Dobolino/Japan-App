import { shuffle } from '@/utils/shuffle'
import type { LearningItem } from '@/types'
import {
  cardVariantForItem,
  grammarSentenceCard,
  isGrammarSrsId,
  lemmaCard,
  type ReviewCard,
} from '@/types/review'
import type { GrammarSrsItem } from '@/types'
import type { GrammarPoint } from '@/data/grammar'

interface BuildOptions {
  limit?: number
  sentenceRatio?: number
  grammarCards?: ReviewCard[]
}

/**
 * Build a practice queue: mostly sentence variants + grammar example sentences.
 */
export function buildReviewQueue(items: LearningItem[], options: BuildOptions = {}): ReviewCard[] {
  const { limit = 20, sentenceRatio = 0.7, grammarCards = [] } = options

  const itemSlots = Math.max(0, limit - grammarCards.length)
  const cards: ReviewCard[] = items.slice(0, itemSlots).map((item) => cardVariantForItem(item, sentenceRatio))

  const merged = [...cards, ...grammarCards.slice(0, limit - cards.length)]
  return merged.slice(0, limit)
}

export function buildFlashcardQueue(items: LearningItem[], limit = 20): ReviewCard[] {
  const picked = shuffle(items).slice(0, limit)
  return buildReviewQueue(picked, { limit, sentenceRatio: 0.65, grammarCards: [] })
}

/** Pick due grammar example cards for the session. */
export function pickGrammarReviewCards(grammarSrs: Record<string, GrammarSrsItem>, grammarData: GrammarPoint[], limit = 4): ReviewCard[] {
  const now = new Date().toISOString()
  const entries = Object.values(grammarSrs)

  const due = entries
    .filter((g) => g.repetitions > 0 && g.nextReviewDate <= now)
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))

  const fresh = shuffle(entries.filter((g) => g.repetitions === 0)).slice(0, Math.max(0, limit - due.length))

  const picked = [...due, ...fresh].slice(0, limit)
  const cards: ReviewCard[] = []

  for (const entry of picked) {
    const point = grammarData.find((g) => g.id === entry.grammarId)
    const ex = point?.examples[entry.exampleIndex]
    if (point && ex) cards.push(grammarSentenceCard(point, entry.exampleIndex, ex))
  }

  return cards
}

/** Match typed answer against a review card (lemma or full sentence). */
export function reviewCardMatchesAnswer(typed: string, card: ReviewCard): boolean {
  const trimmed = typed.trim()
  if (!trimmed) return false
  if (trimmed === card.answerCharacter) return true

  const norm = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[。、！？]/g, '')
      .replace(/[āáàâ]/g, 'a')
      .replace(/[īíìî]/g, 'i')
      .replace(/[ūúùû]/g, 'u')
      .replace(/[ēéèê]/g, 'e')
      .replace(/[ōóòô]/g, 'o')

  const targets = [card.answerRomaji]
  if (card.answerReading) targets.push(card.answerReading)

  return targets.some((t) => norm(trimmed) === norm(t))
}

export function ratingFromProduction(correct: boolean, skipped: boolean): 0 | 2 | 3 {
  if (skipped) return 0
  return correct ? 3 : 0
}

export { lemmaCard, isGrammarSrsId }
