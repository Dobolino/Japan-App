import type { LearningItem } from '@/types'

export type ReviewKind = 'lemma' | 'sentence'

/** One review prompt in a practice session (lemma or contextual sentence). */
export interface ReviewCard {
  /** Unique key within the session queue */
  cardId: string
  /** LearningItem id passed to rateReview / SM-2 */
  srsId: string
  kind: ReviewKind
  /** Expected Japanese answer */
  answerCharacter: string
  answerRomaji: string
  /** German prompt (de → jp) or meaning (jp → de back) */
  promptMeaning: string
  /** Japanese prompt for recognition mode (jp → de) */
  promptCharacter: string
  promptRomaji: string
  /** Source item for badges, audio, links */
  parent: LearningItem
  contextLabel?: string
}

export function lemmaCard(item: LearningItem): ReviewCard {
  return {
    cardId: item.id,
    srsId: item.id,
    kind: 'lemma',
    answerCharacter: item.character,
    answerRomaji: item.romaji,
    promptMeaning: item.meaning,
    promptCharacter: item.character,
    promptRomaji: item.romaji,
    parent: item,
  }
}

export function sentenceCard(item: LearningItem): ReviewCard | null {
  if (!item.exampleWord || !item.exampleReading) return null
  return {
    cardId: `${item.id}:ex`,
    srsId: item.id,
    kind: 'sentence',
    answerCharacter: item.exampleWord,
    answerRomaji: item.exampleReading,
    promptMeaning: item.exampleMeaning ?? item.meaning,
    promptCharacter: item.exampleWord,
    promptRomaji: item.exampleReading,
    parent: item,
    contextLabel: 'Beispielsatz',
  }
}

/** Pick lemma or sentence variant for one due item (~35% sentence when available). */
export function cardVariantForItem(item: LearningItem, sentenceBias = 0.35): ReviewCard {
  const sentence = sentenceCard(item)
  if (sentence && Math.random() < sentenceBias) return sentence
  return lemmaCard(item)
}
