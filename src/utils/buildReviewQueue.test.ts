import { describe, it, expect } from 'vitest'
import { lemmaCard, sentenceCard } from '@/types/review'
import { buildReviewQueue, reviewCardMatchesAnswer } from './buildReviewQueue'
import type { LearningItem } from '@/types'

const base: LearningItem = {
  id: 'h-a',
  character: 'あ',
  romaji: 'a',
  meaning: 'a',
  category: 'hiragana',
  status: 'new',
  easeFactor: 2.5,
  interval: 1,
  repetitions: 0,
  nextReviewDate: '',
  lastReviewDate: null,
  errorCount: 0,
  correctCount: 0,
  exampleWord: 'あめ',
  exampleReading: 'ame',
  exampleMeaning: 'Regen',
}

describe('buildReviewQueue', () => {
  it('creates lemma cards', () => {
    const q = buildReviewQueue([base], { sentenceRatio: 0 })
    expect(q).toHaveLength(1)
    expect(q[0].kind).toBe('lemma')
    expect(q[0].answerCharacter).toBe('あ')
  })

  it('sentenceCard uses example fields', () => {
    const s = sentenceCard(base)!
    expect(s.kind).toBe('sentence')
    expect(s.answerCharacter).toBe('あめ')
    expect(s.promptMeaning).toBe('Regen')
  })

  it('reviewCardMatchesAnswer accepts romaji', () => {
    const card = lemmaCard(base)
    expect(reviewCardMatchesAnswer('ame', sentenceCard(base)!)).toBe(true)
    expect(reviewCardMatchesAnswer('a', card)).toBe(true)
  })
})
