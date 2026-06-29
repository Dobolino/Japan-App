import { shuffle } from '@/utils/shuffle'
import type { LearningItem } from '@/types'
import { cardVariantForItem, lemmaCard, type ReviewCard } from '@/types/review'

interface BuildOptions {
  limit?: number
  /** 0–1: share of items with examples shown as sentence cards */
  sentenceRatio?: number
  /** Flashcard mode: mix random sentence cards from the pool */
  enrichWithSentences?: boolean
}

/**
 * Build a practice queue with contextual sentence variants where available.
 * Due order is preserved; ~35% of eligible items become sentence prompts.
 */
export function buildReviewQueue(items: LearningItem[], options: BuildOptions = {}): ReviewCard[] {
  const { limit = 20, sentenceRatio = 0.35, enrichWithSentences = true } = options

  const cards: ReviewCard[] = items.slice(0, limit).map((item) => cardVariantForItem(item, sentenceRatio))

  if (enrichWithSentences && cards.length < limit) {
    const withExamples = items.filter((i) => i.exampleWord && i.exampleReading)
    const extra = shuffle(withExamples)
      .filter((i) => !cards.some((c) => c.cardId === `${i.id}:ex`))
      .slice(0, Math.min(3, limit - cards.length))
      .map((i) => cardVariantForItem(i, 1))
    cards.push(...extra)
  }

  return cards.slice(0, limit)
}

/** Random lemma + sentence mix for flashcard drills. */
export function buildFlashcardQueue(items: LearningItem[], limit = 20): ReviewCard[] {
  const picked = shuffle(items).slice(0, limit)
  return buildReviewQueue(picked, { limit, sentenceRatio: 0.4, enrichWithSentences: false })
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
      .replace(/[āáàâ]/g, 'a')
      .replace(/[īíìî]/g, 'i')
      .replace(/[ūúùû]/g, 'u')
      .replace(/[ēéèê]/g, 'e')
      .replace(/[ōóòô]/g, 'o')

  return norm(trimmed) === norm(card.answerRomaji)
}

/** Map verified production result to SM-2 rating. */
export function ratingFromProduction(correct: boolean, skipped: boolean): 0 | 2 | 3 {
  if (skipped) return 0
  return correct ? 3 : 0
}

export { lemmaCard }
