import { describe, it, expect } from 'vitest'
import { grammarSentenceCard, lemmaCard, sentenceCard } from '@/types/review'
import { buildReviewQueue, reviewCardMatchesAnswer, pickGrammarReviewCards } from './buildReviewQueue'
import { grammarData } from '@/data/grammar'
import type { GrammarSrsItem } from '@/types'
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

  it('grades sentence pronunciation in context while accepting the written kana', () => {
    const point = grammarData.find((g) => g.id === 'g-sov')!
    const card = grammarSentenceCard(point, 0, point.examples[0])
    expect(reviewCardMatchesAnswer('watashi wa ringo o tabemasu', card)).toBe(true)
    expect(reviewCardMatchesAnswer('watashi wa ringo wo tabemasu', card)).toBe(true)
    expect(reviewCardMatchesAnswer('わたしはりんごをたべます', card)).toBe(true)
    expect(reviewCardMatchesAnswer('watashi ha ringo wo tabemasu', card)).toBe(false)
    expect(reviewCardMatchesAnswer('わたしわりんごおたべます', card)).toBe(false)
  })
  it('does not treat a failed grammar card scheduled in the future as fresh content', () => {
    const point = grammarData[0]
    const id = `grammar:${point.id}:0`
    const entry: GrammarSrsItem = {
      ...base,
      id,
      grammarId: point.id,
      exampleIndex: 0,
      title: point.title,
      repetitions: 0,
      lastReviewDate: new Date().toISOString(),
      nextReviewDate: '2099-01-01T00:00:00.000Z',
    }
    expect(pickGrammarReviewCards({ [id]: entry }, grammarData)).toEqual([])
    expect(
      pickGrammarReviewCards({ [id]: { ...entry, nextReviewDate: '2000-01-01T00:00:00.000Z' } }, grammarData)
    ).toHaveLength(1)
  })
})
