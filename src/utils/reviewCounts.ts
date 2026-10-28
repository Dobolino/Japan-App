import type { LearningItem } from '@/types'
import { shuffle } from '@/utils/shuffle'

type ReviewState = Pick<LearningItem, 'lastReviewDate' | 'nextReviewDate'>

/** A failed, previously reviewed card is not a never-studied new card. */
export function reviewCounts(items: ReviewState[], now = new Date().toISOString()) {
  return items.reduce(
    (counts, item) => {
      if (!item.lastReviewDate) counts.fresh += 1
      else if (item.nextReviewDate <= now) counts.due += 1
      return counts
    },
    { due: 0, fresh: 0 }
  )
}

/** Prefer due reviews, then at most ten never-studied cards. */
export function selectReviewItems(
  items: LearningItem[],
  limit = 20,
  now = new Date().toISOString()
): LearningItem[] {
  const due = items
    .filter((item) => item.lastReviewDate !== null && item.nextReviewDate <= now)
    .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))
  const fresh = shuffle(items.filter((item) => item.lastReviewDate === null)).slice(
    0,
    Math.max(0, 10 - due.length)
  )
  return [...due, ...fresh].slice(0, limit)
}
