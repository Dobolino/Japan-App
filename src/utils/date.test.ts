import { describe, it, expect } from 'vitest'
import { localDateKey, updateStreak } from './date'
import type { UserProgress } from '@/types'

const baseProgress = (): UserProgress => ({
  studySessions: 0,
  cardsReviewed: 0,
  currentStreak: 5,
  longestStreak: 10,
  lastStudyDate: null,
  totalCorrect: 0,
  totalErrors: 0,
  xp: 0,
  level: 1,
  todayCorrect: 0,
  todayDate: null,
})

describe('localDateKey', () => {
  it('returns YYYY-MM-DD format', () => {
    expect(localDateKey(new Date('2026-06-26T15:00:00'))).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('updateStreak', () => {
  it('continues streak when last study was yesterday', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const progress = baseProgress()
    progress.lastStudyDate = yesterday.toISOString()

    const result = updateStreak(progress)
    expect(result.currentStreak).toBe(6)
    expect(result.longestStreak).toBe(10)
  })

  it('resets streak when gap is longer than one day', () => {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const progress = baseProgress()
    progress.lastStudyDate = threeDaysAgo.toISOString()

    const result = updateStreak(progress)
    expect(result.currentStreak).toBe(1)
  })
})
