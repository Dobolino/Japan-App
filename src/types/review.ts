import type { LearningItem } from '@/types'
import { romajiFromReading } from '@/utils/kanaRomaji'
import { acceptedReadings } from '@/utils/answerMatch'
import type { GrammarExample, GrammarPoint } from '@/data/grammar'

export type ReviewKind = 'lemma' | 'sentence' | 'grammar-sentence'

/** One review prompt in a practice session (lemma or contextual sentence). */
export interface ReviewCard {
  cardId: string
  srsId: string
  kind: ReviewKind
  answerCharacter: string
  answerRomaji: string
  acceptedAnswers?: string[]
  /** Hiragana reading for furigana (grammar / full sentences) */
  answerReading?: string
  promptMeaning: string
  promptCharacter: string
  promptRomaji: string
  promptReading?: string
  parent: LearningItem
  contextLabel?: string
  grammarTitle?: string
}

export function isKanaLetterCard(card: ReviewCard): boolean {
  return card.kind === 'lemma' && (card.parent.category === 'hiragana' || card.parent.category === 'katakana')
}

export function lemmaCard(item: LearningItem): ReviewCard {
  return {
    cardId: item.id,
    srsId: item.id,
    kind: 'lemma',
    answerCharacter: item.character,
    answerRomaji: item.romaji,
    acceptedAnswers: acceptedReadings(item),
    promptMeaning: item.meaning,
    promptCharacter: item.character,
    promptRomaji: item.romaji,
    parent: item,
  }
}

export function sentenceCard(item: LearningItem): ReviewCard | null {
  if (!item.exampleWord || !item.exampleReading) return null

  const isKanaExample = /^[\u3040-\u30FF\s]+$/.test(item.exampleWord)
  return {
    cardId: `${item.id}:ex`,
    srsId: `${item.id}:ex`,
    kind: 'sentence',
    answerCharacter: item.exampleWord,
    answerRomaji: item.exampleReading,
    answerReading: isKanaExample ? item.exampleReading : undefined,
    promptMeaning: item.exampleMeaning ?? item.meaning,
    promptCharacter: item.exampleWord,
    promptRomaji: item.exampleReading,
    parent: item,
    contextLabel: 'Beispielsatz',
  }
}

export function grammarSentenceCard(g: GrammarPoint, exIndex: number, ex: GrammarExample): ReviewCard {
  const id = `grammar:${g.id}:${exIndex}`
  const placeholder = placeholderParent(g.id)
  const spoken = romajiFromReading(ex.reading, ex.jp)
  const acceptedAnswers = [ex.reading]
  // Both o and wo conventionally romanize the object particle を. Keep the
  // pronunciation of は (wa) and へ (e) from the contextual reading in both.
  if (ex.jp.includes('を')) acceptedAnswers.push(spoken.replace(/\bo\b/gi, 'wo'))

  return {
    cardId: id,
    srsId: id,
    kind: 'grammar-sentence',
    answerCharacter: ex.jp,
    answerRomaji: spoken,
    acceptedAnswers,
    answerReading: ex.reading,
    promptMeaning: ex.de,
    promptCharacter: ex.jp,
    promptRomaji: spoken,
    promptReading: ex.reading,
    parent: placeholder,
    contextLabel: g.category,
    grammarTitle: g.title,
  }
}

function placeholderParent(grammarId: string): LearningItem {
  const today = new Date().toISOString()
  return {
    id: grammarId,
    character: '文',
    romaji: 'bun',
    meaning: 'Grammatik',
    category: 'vocabulary',
    status: 'new',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: today,
    lastReviewDate: null,
    errorCount: 0,
    correctCount: 0,
  }
}

/** Prefer sentence when example exists (~70% default). */
export function cardVariantForItem(item: LearningItem, sentenceBias = 0.7): ReviewCard {
  const sentence = sentenceCard(item)
  if (sentence && item.correctCount >= 2 && Math.random() < sentenceBias) return sentence
  return lemmaCard(item)
}

export function isGrammarSrsId(id: string): boolean {
  return id.startsWith('grammar:')
}
