import type { LearningItem } from '@/types'
import type { GrammarExample, GrammarPoint } from '@/data/grammar'

export type ReviewKind = 'lemma' | 'sentence' | 'grammar-sentence'

/** One review prompt in a practice session (lemma or contextual sentence). */
export interface ReviewCard {
  cardId: string
  srsId: string
  kind: ReviewKind
  answerCharacter: string
  answerRomaji: string
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

  const isKanaExample = /^[\u3040-\u30FF\s]+$/.test(item.exampleWord)
  return {
    cardId: `${item.id}:ex`,
    srsId: item.id,
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

  return {
    cardId: id,
    srsId: id,
    kind: 'grammar-sentence',
    answerCharacter: ex.jp,
    answerRomaji: ex.reading,
    answerReading: ex.reading,
    promptMeaning: ex.de,
    promptCharacter: ex.jp,
    promptRomaji: ex.reading,
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
  if (sentence && Math.random() < sentenceBias) return sentence
  return lemmaCard(item)
}

export function isGrammarSrsId(id: string): boolean {
  return id.startsWith('grammar:')
}
