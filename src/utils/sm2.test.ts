import { describe, it, expect } from 'vitest'
import { sm2 } from './sm2'
import type { LearningItem } from '@/types'

function baseItem(overrides: Partial<LearningItem> = {}): LearningItem {
  return {
    id: 'test',
    character: 'あ',
    romaji: 'a',
    meaning: 'a',
    category: 'hiragana',
    status: 'new',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: null,
    errorCount: 0,
    correctCount: 0,
    ...overrides,
  }
}

describe('sm2', () => {
  it('resets on rating 0 (again)', () => {
    const item = baseItem({ repetitions: 3, interval: 10, easeFactor: 2.5 })
    const result = sm2(item, 0)
    expect(result.repetitions).toBe(0)
    expect(result.interval).toBe(1)
    expect(result.status).toBe('new')
    expect(result.easeFactor).toBeLessThan(2.5)
  })

  it('advances interval on rating 2 (good)', () => {
    const item = baseItem({ repetitions: 2, interval: 4, easeFactor: 2.5 })
    const result = sm2(item, 2)
    expect(result.repetitions).toBe(3)
    expect(result.interval).toBeGreaterThan(1)
  })

  it('marks as mastered when interval >= 7', () => {
    const item = baseItem({ repetitions: 4, interval: 6, easeFactor: 2.5 })
    const result = sm2(item, 3)
    expect(result.status).toBe('mastered')
    expect(result.interval).toBeGreaterThanOrEqual(7)
  })
})
