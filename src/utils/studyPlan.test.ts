import { describe, it, expect } from 'vitest'
import { initialState } from '@/store/persistence'
import { applyReview } from '@/store/reviewModel'
import { createStudyPlan } from './studyPlan'
import { lessons } from '@/data/curriculum'
import { strokeCharacters } from '@/data/strokeAssets'
import { kanjiParts } from '@/data/kanjiParts'
import { catalog } from '@/data/catalog'
describe('guided study planning', () => {
  it('does not introduce unvisited content at random', () =>
    expect(createStudyPlan(initialState())).toEqual([]))
  it('offers only the items introduced by a lesson', () => {
    const state = initialState()
    state.introducedIds = lessons[0].itemIds
    expect(
      createStudyPlan(state)
        .map((card) => card.srsId)
        .sort()
    ).toEqual([...lessons[0].itemIds].sort())
  })
  it('always permits a due old review even without a completed lesson', () => {
    const state = initialState(),
      item = Object.values(state.items)[0]
    item.lastReviewDate = '2020-01-01T00:00:00Z'
    item.nextReviewDate = '2020-01-02T00:00:00Z'
    expect(createStudyPlan(state)[0].srsId).toBe(item.id)
  })
  it('keeps a word and its example schedules independent', () => {
    const state = initialState(),
      item = Object.values(state.items).find((entry) => entry.exampleWord)!
    const patch = applyReview(state, `${item.id}:ex`, 2, 'example-1')
    expect(patch.items).toBeUndefined()
    expect(patch.exampleSrs?.[`${item.id}:ex`].correctCount).toBe(1)
    expect(state.items[item.id].correctCount).toBe(0)
  })
  it('counts a retried event only once and preserves recorded daily history', () => {
    const state = initialState(),
      id = Object.keys(state.items)[0]
    const next = { ...state, ...applyReview(state, id, 2, 'same-id') }
    expect(applyReview(next, id, 2, 'same-id')).toEqual({})
    expect(next.progress.xp).toBe(10)
    expect(Object.values(next.dailyHistory)[0].reviewed).toBe(1)
  })
  it('provides valid modern Kana lessons and stroke assets for every Kanji', () => {
    for (const lesson of lessons)
      for (const id of lesson.itemIds) expect(catalog.some((item) => item.id === id)).toBe(true)
    expect(catalog.filter((item) => item.category === 'hiragana' && !item.historical)).toHaveLength(104)
    for (const item of catalog.filter((item) => item.category === 'kanji')) {
      expect(strokeCharacters.has(item.character)).toBe(true)
      expect(kanjiParts[item.character]?.parts.length).toBeGreaterThan(0)
    }
  })
  it('prioritizes an overdue example even when earlier examples are fresh', () => {
    const state = initialState()
    const examples = Object.values(state.items)
      .filter((item) => item.exampleWord && item.exampleReading)
      .slice(0, 8)
    for (const item of examples) item.correctCount = 2
    const overdue = examples[7]
    state.exampleSrs[`${overdue.id}:ex`] = {
      status: 'learning',
      easeFactor: 2.5,
      interval: 1,
      repetitions: 1,
      nextReviewDate: '2020-01-02T00:00:00Z',
      lastReviewDate: '2020-01-01T00:00:00Z',
      correctCount: 1,
      errorCount: 0,
    }
    expect(createStudyPlan(state, 'all', 1)[0].srsId).toBe(`${overdue.id}:ex`)
  })
})
