import type {
  LearningItem,
  GrammarSrsItem,
  UserProgress,
  DisplayPrefs,
  ItemCategory,
  SRSRating,
} from '@/types'
import type { ReviewCard } from '@/types/review'
import type { ChoiceQuestion } from '@/data/activities'
export type ScheduleState = Pick<
  LearningItem,
  | 'status'
  | 'easeFactor'
  | 'interval'
  | 'repetitions'
  | 'nextReviewDate'
  | 'lastReviewDate'
  | 'errorCount'
  | 'correctCount'
>
export interface NotebookEntry {
  note: string
  example: string
  tags: string[]
  updatedAt: string
}
export interface DailyActivity {
  reviewed: number
  correct: number
  xp: number
}
export interface StudyEvent {
  id: string
  at: string
  srsId: string
  rating: SRSRating
  category: string
}
export interface SessionSnapshot {
  id: string
  queue: ReviewCard[]
  index: number
  ratings: SRSRating[]
  phase: 'question' | 'answer' | 'done'
  direction: 'de-jp' | 'jp-de'
  mode: 'srs' | 'flashcard'
  typed: string
  correct: boolean | null
  startedAt: string
  retries: string[]
}
export interface LessonResult {
  correct: number
  total: number
  completedAt: string
}
export interface LessonDraft {
  index: number
  stage: 'intro' | 'recognition' | 'production'
  correct: number
  attempted: number
  feedback?: boolean | null
  typed?: string
  runId?: string
}
export interface ActivityDraft {
  questions?: ChoiceQuestion[]
  runId?: string
  index: number
  answers: number[]
  questionIds: string[]
}
export interface PersistentState {
  items: Record<string, LearningItem>
  grammarSrs: Record<string, GrammarSrsItem>
  exampleSrs: Record<string, ScheduleState>
  progress: UserProgress
  displayPrefs: DisplayPrefs
  activeCategory: ItemCategory
  storyProgress: { completed: string[] }
  pinnedReviewIds: string[]
  notebook: Record<string, NotebookEntry>
  introducedIds: string[]
  introducedGrammarIds: string[]
  completedLessons: Record<string, LessonResult>
  lessonDrafts: Record<string, LessonDraft>
  dailyHistory: Record<string, DailyActivity>
  events: StudyEvent[]
  activeSession: SessionSnapshot | null
  activityDrafts: Record<string, ActivityDraft>
  learningGoal: 'foundation' | 'travel' | 'jlpt'
  trainingResults: Record<string, LessonResult>
}
