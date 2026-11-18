import { describe, it, expect } from 'vitest'
import { initialState } from '@/store/persistence'
import { lessons } from '@/data/curriculum'
import { lemmaCard } from '@/types/review'
import { todayPlan, collectionStage } from './todayPlan'
import { activeStreak } from './date'

const now = '2026-11-18T12:00:00.000Z'
describe('one daily learning action', () => {
  it('starts beginners with the first complete Kana unit without random new content', () => {
    const state = initialState()
    const plan = todayPlan(state, now)
    expect(plan.kind).toBe('lesson')
    expect(plan.lesson?.id).toBe('hiragana-0')
    expect(plan.newCount).toBe(5)
    expect(plan.reviewCount).toBe(0)
    expect(state.introducedIds).toEqual([])
  })
  it('resumes a saved lesson before starting a different activity', () => {
    const state = initialState()
    state.lessonDrafts['hiragana-0'] = {
      index: 3,
      stage: 'production',
      attempted: 8,
      correct: 6,
      typed: 'e',
      feedback: false,
      runId: 'saved',
    }
    state.introducedIds = lessons[0].itemIds
    const before = JSON.stringify(state)
    const plan = todayPlan(state, now)
    expect(plan.resume).toBe(true)
    expect(plan.lesson?.id).toBe('hiragana-0')
    expect(plan.newCount).toBe(0)
    expect(plan.minutes).toBe(1)
    expect(JSON.stringify(state)).toBe(before)
  })
  it('uses exactly the remaining saved queue without overwriting feedback or typed input', () => {
    const state = initialState()
    const queue = lessons[0].itemIds.map((id) => lemmaCard(state.items[id]))
    state.activeSession = {
      id: 'saved',
      queue,
      index: 3,
      ratings: [2, 0, 3],
      phase: 'answer',
      direction: 'de-jp',
      mode: 'srs',
      typed: 'my answer',
      correct: false,
      startedAt: now,
      retries: [],
    }
    const before = JSON.stringify(state.activeSession)
    const plan = todayPlan(state, now)
    expect(plan.kind).toBe('practice')
    expect(plan.resume).toBe(true)
    expect(plan.cards.map((card) => card.srsId)).toEqual(queue.slice(3).map((card) => card.srsId))
    expect(JSON.stringify(state.activeSession)).toBe(before)
  })
  it('counts scheduled reviews and fresh introduced cards, excluding future reviews', () => {
    const state = initialState()
    const [due, fresh, future] = Object.values(state.items)
    due.lastReviewDate = future.lastReviewDate = '2026-11-17T12:00:00.000Z'
    due.nextReviewDate = '2026-11-18T11:00:00.000Z'
    future.nextReviewDate = '2026-11-19T12:00:00.000Z'
    state.introducedIds = [fresh.id]
    const plan = todayPlan(state, now)
    expect(plan.kind).toBe('practice')
    expect(plan.reviewCount).toBe(1)
    expect(plan.newCount).toBe(1)
    expect(plan.cards.some((card) => card.srsId === future.id)).toBe(false)
  })
  it('moves to the next eligible lesson and does not reset a completed course', () => {
    const state = initialState()
    state.completedLessons[lessons[0].id] = { correct: 10, total: 10, completedAt: now }
    expect(todayPlan(state, now).lesson?.id).toBe('hiragana-1')
    for (const lesson of lessons)
      state.completedLessons[lesson.id] = { correct: 10, total: 10, completedAt: now }
    expect(todayPlan(state, now).kind).toBe('explore')
  })
})
describe('honest collection and streak states', () => {
  it('does not award mastery for seeing a character or answering once', () => {
    const item = Object.values(initialState().items)[0]
    expect(collectionStage(item, [])).toBe('new')
    expect(collectionStage(item, [item.id])).toBe('seen')
    expect(collectionStage({ ...item, correctCount: 1, status: 'learning' }, [])).toBe('practiced')
    expect(collectionStage({ ...item, correctCount: 4, status: 'mastered', interval: 10 }, [])).toBe(
      'mastered'
    )
  })
  it('shows an expired streak as zero while preserving its stored history', () => {
    const progress = {
      ...initialState().progress,
      currentStreak: 7,
      lastStudyDate: new Date(2026, 10, 16, 12).toISOString(),
    }
    expect(activeStreak(progress, new Date(2026, 10, 18, 12))).toBe(0)
    expect(activeStreak(progress, new Date(2026, 10, 17, 12))).toBe(7)
    expect(progress.currentStreak).toBe(7)
  })
})
