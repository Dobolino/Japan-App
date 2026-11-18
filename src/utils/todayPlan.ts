import type { PersistentState } from '@/store/types'
import type { LearningItem } from '@/types'
import type { ReviewCard } from '@/types/review'
import { lessons, lessonById, type Lesson } from '@/data/curriculum'
import { grammarData } from '@/data/grammar'
import { createStudyPlan } from './studyPlan'

export interface TodayPlan {
  kind: 'lesson' | 'practice' | 'explore'
  title: string
  resume: boolean
  lesson?: Lesson
  cards: ReviewCard[]
  newCount: number
  reviewCount: number
  minutes: number
}

export function nextLesson(state: PersistentState): Lesson | undefined {
  return lessons.find(
    (lesson) =>
      !state.completedLessons[lesson.id] &&
      (!lesson.prerequisite || state.completedLessons[lesson.prerequisite])
  )
}

/** Describe the same activity that the home button starts, including saved work. */
export function todayPlan(state: PersistentState, now = new Date().toISOString()): TodayPlan {
  const session = state.activeSession
  const resume = Boolean(session && session.phase !== 'done')
  const cards = resume ? session!.queue.slice(session!.index) : createStudyPlan(state, 'all', 20, now)
  const draftId = Object.keys(state.lessonDrafts)
    .reverse()
    .find((id) => lessonById[id])
  if (resume || (!draftId && cards.length)) {
    const reviewCount = cards.filter((card) =>
      Boolean(
        (state.grammarSrs[card.srsId] ?? state.exampleSrs[card.srsId] ?? state.items[card.srsId])
          ?.lastReviewDate
      )
    ).length
    return {
      kind: 'practice',
      title: resume ? 'Deine Übung wartet auf dich.' : 'Mach dein Wissen sicherer.',
      resume,
      cards,
      newCount: cards.length - reviewCount,
      reviewCount,
      minutes: Math.max(1, Math.ceil((cards.length * 20) / 60)),
    }
  }
  const lesson = draftId ? lessonById[draftId] : nextLesson(state)
  if (lesson) {
    const count =
      lesson.category === 'grammar'
        ? grammarData
            .filter((point) => lesson.grammarIds?.includes(point.id))
            .reduce((n, point) => n + point.examples.length, 0)
        : lesson.itemIds.length
    const draft = state.lessonDrafts[lesson.id]
    const remaining = draft
      ? count * (3 - ['intro', 'recognition', 'production'].indexOf(draft.stage)) - draft.index
      : count * 3
    const newCount = draft
      ? 0
      : lesson.category === 'grammar'
        ? Object.values(state.grammarSrs).filter(
            (entry) => lesson.grammarIds?.includes(entry.grammarId) && !entry.lastReviewDate
          ).length
        : lesson.itemIds.filter((id) => !state.items[id]?.lastReviewDate).length
    return {
      kind: 'lesson',
      title: lesson.title,
      resume: Boolean(draft),
      lesson,
      cards: [],
      newCount,
      reviewCount: draft ? 0 : count - newCount,
      minutes: Math.max(1, Math.ceil((remaining * 15) / 60)),
    }
  }
  return {
    kind: 'explore',
    title: 'Alle Kurseinheiten geschafft.',
    resume: false,
    cards: [],
    newCount: 0,
    reviewCount: 0,
    minutes: 0,
  }
}

export type CollectionStage = 'new' | 'seen' | 'practiced' | 'mastered'
export const collectionLabels: Record<CollectionStage, string> = {
  new: 'Neu',
  seen: 'Entdeckt',
  practiced: 'Geübt',
  mastered: 'Gefestigt',
}
export function collectionStage(item: LearningItem, introducedIds: string[]): CollectionStage {
  if (item.status === 'mastered') return 'mastered'
  if (item.correctCount > 0) return 'practiced'
  if (item.lastReviewDate || introducedIds.includes(item.id)) return 'seen'
  return 'new'
}
