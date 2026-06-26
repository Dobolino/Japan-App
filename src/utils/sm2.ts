import type { LearningItem, SRSRating, SRSStatus } from '@/types'

/**
 * Simplified SM-2 variant tuned for this app (not identical to Anki).
 *
 * Ratings: 0=Again, 1=Hard, 2=Good, 3=Easy
 * - Again resets repetitions and shortens the interval.
 * - Hard keeps learning but grows interval slowly.
 * - Good / Easy follow spaced intervals with ease-factor adjustments.
 */
export function sm2(item: LearningItem, rating: SRSRating) {
  let { easeFactor, interval, repetitions } = item

  if (rating === 0) {
    repetitions = 0
    interval = 1
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  } else if (rating === 1) {
    easeFactor = Math.max(1.3, easeFactor - 0.15)
    interval = Math.max(1, Math.round(interval * 1.2))
    repetitions += 1
  } else if (rating === 2) {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 4
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 4
    else interval = Math.round(interval * easeFactor * 1.3)
    easeFactor = Math.min(3.0, easeFactor + 0.15)
    repetitions += 1
  }

  let status: SRSStatus
  if (repetitions === 0) status = 'new'
  else if (interval <= 1) status = 'learning'
  else if (interval < 7) status = 'uncertain'
  else status = 'mastered'

  const next = new Date()
  next.setDate(next.getDate() + interval)

  return {
    easeFactor,
    interval,
    repetitions,
    status,
    nextReviewDate: next.toISOString(),
  }
}
