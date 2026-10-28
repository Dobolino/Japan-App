import { describe, it, expect } from 'vitest'
import { sm2, reviewIntervalLabel } from './sm2'
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
    expect(result.interval).toBe(0)
    expect(result.status).toBe('learning')
    expect(result.easeFactor).toBeLessThan(2.5)
  })

  it('advances interval on rating 2 (good)', () => {
    const item = baseItem({ repetitions: 2, interval: 4, easeFactor: 2.5 })
    const result = sm2(item, 2)
    expect(result.repetitions).toBe(3)
    expect(result.interval).toBeGreaterThan(1)
  })

  it('schedules a failed answer exactly ten minutes later', () => {
    const now = new Date('2026-10-27T12:00:00.000Z')
    expect(sm2(baseItem(), 0, now).nextReviewDate).toBe('2026-10-27T12:10:00.000Z')
  })

  it('marks as mastered when interval >= 7', () => {
    const item = baseItem({ repetitions: 4, interval: 6, easeFactor: 2.5 })
    const result = sm2(item, 3)
    expect(result.status).toBe('mastered')
    expect(result.interval).toBeGreaterThanOrEqual(7)
  })

  it('shows a ten-minute relearning step and one day for successful first reviews', () => {
    const item = baseItem()
    expect([0, 1, 2, 3].map((rating) => reviewIntervalLabel(item, rating as 0 | 1 | 2 | 3))).toEqual([
      '10 Min.',
      '1 Tag',
      '1 Tag',
      '1 Tag',
    ])
  })

  it('shows the scheduled intervals of an established card', () => {
    const item = baseItem({ repetitions: 2, interval: 4, easeFactor: 2.5 })
    expect([0, 1, 2, 3].map((rating) => reviewIntervalLabel(item, rating as 0 | 1 | 2 | 3))).toEqual([
      '10 Min.',
      '5 Tage',
      '10 Tage',
      '13 Tage',
    ])
  })
})
