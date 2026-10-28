import type { LearningItem, SRSRating, SRSStatus } from '@/types'
type SchedulingState = Pick<LearningItem, 'easeFactor' | 'interval' | 'repetitions'>
export function sm2(item: SchedulingState, rating: SRSRating, now = new Date()) {
  let { easeFactor, interval, repetitions } = item
  if (rating === 0) {
    repetitions = 0
    interval = 0
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  } else if (rating === 1) {
    easeFactor = Math.max(1.3, easeFactor - 0.15)
    interval = Math.max(1, Math.round(interval * 1.2))
    repetitions++
  } else {
    interval =
      repetitions === 0
        ? 1
        : repetitions === 1
          ? 4
          : Math.max(1, Math.round(interval * easeFactor * (rating === 3 ? 1.3 : 1)))
    repetitions++
    if (rating === 3) easeFactor = Math.min(3, easeFactor + 0.15)
  }
  const status: SRSStatus = interval <= 1 ? 'learning' : interval < 7 ? 'uncertain' : 'mastered'
  const next = new Date(now)
  if (rating === 0) next.setMinutes(next.getMinutes() + 10)
  else next.setDate(next.getDate() + interval)
  return { easeFactor, interval, repetitions, status, nextReviewDate: next.toISOString() }
}
export function reviewIntervalLabel(item: SchedulingState, rating: SRSRating): string {
  if (rating === 0) return '10 Min.'
  const { interval } = sm2(item, rating)
  return `${interval} ${interval === 1 ? 'Tag' : 'Tage'}`
}
