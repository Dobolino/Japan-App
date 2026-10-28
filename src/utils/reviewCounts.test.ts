import { describe, expect, it } from 'vitest'
import { reviewCounts, selectReviewItems } from './reviewCounts'
import { hiraganaData } from '@/data/hiragana'

const now = '2026-10-27T12:00:00.000Z'

describe('reviewCounts', () => {
  it('does not call never-studied content an overdue review', () => {
    expect(reviewCounts([{ lastReviewDate: null, nextReviewDate: '2026-10-01T12:00:00.000Z' }], now)).toEqual(
      { due: 0, fresh: 1 }
    )
  })

  it('counts failed previously reviewed cards as reviews, not fresh content', () => {
    const failed = { repetitions: 0, lastReviewDate: '2026-10-25T12:00:00.000Z', nextReviewDate: now }
    expect(reviewCounts([failed], now)).toEqual({ due: 1, fresh: 0 })
  })

  it('keeps scheduled future reviews out of both counts', () => {
    expect(reviewCounts([{ lastReviewDate: now, nextReviewDate: '2026-10-28T12:00:00.000Z' }], now)).toEqual({
      due: 0,
      fresh: 0,
    })
  })

  it('handles an empty library', () => {
    expect(reviewCounts([], now)).toEqual({ due: 0, fresh: 0 })
  })
})

describe('selectReviewItems', () => {
  it('prioritizes a due failed card and excludes reviewed cards scheduled for tomorrow', () => {
    const failed = {
      ...hiraganaData[0],
      repetitions: 0,
      lastReviewDate: '2026-10-25T12:00:00.000Z',
      nextReviewDate: now,
    }
    const future = {
      ...hiraganaData[1],
      repetitions: 0,
      lastReviewDate: now,
      nextReviewDate: '2026-10-28T12:00:00.000Z',
    }
    const fresh = { ...hiraganaData[2], lastReviewDate: null }
    expect(selectReviewItems([future, fresh, failed], 20, now).map((item) => item.id)).toEqual([
      failed.id,
      fresh.id,
    ])
  })

  it('limits the daily selection of never-studied cards to ten', () => {
    expect(
      selectReviewItems(
        hiraganaData.map((item) => ({ ...item, lastReviewDate: null })),
        20,
        now
      )
    ).toHaveLength(10)
  })

  it('honors a smaller session limit and the order of overdue reviews', () => {
    const due = hiraganaData.slice(0, 3).map((item, index) => ({
      ...item,
      lastReviewDate: '2026-10-01T12:00:00.000Z',
      nextReviewDate: `2026-10-${20 + index}T12:00:00.000Z`,
    }))
    const result = selectReviewItems([due[2], hiraganaData[3], due[0], due[1]], 2, now)
    expect(result.map((item) => item.id)).toEqual([due[0].id, due[1].id])
  })
})
