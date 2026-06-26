import { describe, it, expect } from 'vitest'
import { matchesJapaneseAnswer } from './answerMatch'
import type { LearningItem } from '@/types'

const item: LearningItem = {
  id: 'v-test',
  character: '水',
  romaji: 'mizu',
  meaning: 'Wasser',
  category: 'vocabulary',
  status: 'new',
  easeFactor: 2.5,
  interval: 1,
  repetitions: 0,
  nextReviewDate: new Date().toISOString(),
  lastReviewDate: null,
  errorCount: 0,
  correctCount: 0,
}

describe('matchesJapaneseAnswer', () => {
  it('accepts exact character', () => {
    expect(matchesJapaneseAnswer('水', item)).toBe(true)
  })

  it('accepts romaji', () => {
    expect(matchesJapaneseAnswer('mizu', item)).toBe(true)
    expect(matchesJapaneseAnswer('MIZU', item)).toBe(true)
  })

  it('rejects wrong answers', () => {
    expect(matchesJapaneseAnswer('fire', item)).toBe(false)
    expect(matchesJapaneseAnswer('', item)).toBe(false)
  })
})
