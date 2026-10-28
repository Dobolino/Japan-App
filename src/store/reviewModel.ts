import type { PersistentState, StudyEvent } from './types'
import type { SRSRating } from '@/types'
import { sm2 } from '@/utils/sm2'
import { localDateKey, updateStreak } from '@/utils/date'
import { XP_PER_CORRECT, xpToLevel } from '@/constants/srs'
import { freshSchedule } from './persistence'
export function applyReview(
  state: PersistentState,
  id: string,
  rating: SRSRating,
  eventId: string = crypto.randomUUID(),
  now = new Date()
): Partial<PersistentState> {
  if (state.events.some((event) => event.id === eventId)) return {}
  const example = id.endsWith(':ex'),
    parentId = example ? id.slice(0, -3) : id
  const entry = id.startsWith('grammar:')
    ? state.grammarSrs[id]
    : example
      ? (state.exampleSrs[id] ?? (state.items[parentId] ? freshSchedule() : undefined))
      : state.items[id]
  if (!entry) return {}
  const correct = rating >= 1,
    at = now.toISOString(),
    day = localDateKey(now),
    xp = correct ? XP_PER_CORRECT : 0
  const updated = {
    ...entry,
    ...sm2(entry, rating, now),
    lastReviewDate: at,
    errorCount: entry.errorCount + (correct ? 0 : 1),
    correctCount: entry.correctCount + (correct ? 1 : 0),
  }
  const scheduled = id.startsWith('grammar:')
    ? { grammarSrs: { ...state.grammarSrs, [id]: updated } }
    : example
      ? { exampleSrs: { ...state.exampleSrs, [id]: updated } }
      : { items: { ...state.items, [id]: updated } }
  const progress = {
    ...state.progress,
    ...updateStreak(state.progress, now),
    lastStudyDate: at,
    cardsReviewed: state.progress.cardsReviewed + 1,
    totalCorrect: state.progress.totalCorrect + (correct ? 1 : 0),
    totalErrors: state.progress.totalErrors + (correct ? 0 : 1),
    xp: state.progress.xp + xp,
    level: xpToLevel(state.progress.xp + xp),
    todayDate: day,
    todayCorrect: (state.progress.todayDate === day ? state.progress.todayCorrect : 0) + (correct ? 1 : 0),
  }
  const previous = state.dailyHistory[day] ?? { reviewed: 0, correct: 0, xp: 0 }
  const event: StudyEvent = {
    id: eventId,
    at,
    srsId: id,
    rating,
    category: id.startsWith('grammar:') ? 'grammar' : (state.items[parentId]?.category ?? 'vocabulary'),
  }
  return {
    ...scheduled,
    progress,
    dailyHistory: {
      ...state.dailyHistory,
      [day]: {
        reviewed: previous.reviewed + 1,
        correct: previous.correct + (correct ? 1 : 0),
        xp: previous.xp + xp,
      },
    },
    events: [...state.events, event].slice(-5000),
  } as Partial<PersistentState>
}
