import { catalog } from '@/data/catalog'
import { grammarData } from '@/data/grammar'
import type { PersistentState, ScheduleState } from './types'
import type { LearningItem, UserProgress, DisplayPrefs, GrammarSrsItem } from '@/types'
export const STORE_VERSION = 4
export const scheduleFields = [
  'status',
  'easeFactor',
  'interval',
  'repetitions',
  'nextReviewDate',
  'lastReviewDate',
  'errorCount',
  'correctCount',
] as const
export function freshSchedule(): ScheduleState {
  return {
    status: 'new',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    lastReviewDate: null,
    errorCount: 0,
    correctCount: 0,
  }
}
export const defaultProgress: UserProgress = {
  studySessions: 0,
  cardsReviewed: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  totalCorrect: 0,
  totalErrors: 0,
  xp: 0,
  level: 1,
  todayCorrect: 0,
  todayDate: null,
}
export const defaultPrefs: DisplayPrefs = {
  showFurigana: true,
  showRomaji: true,
  theme: 'light',
  dailyGoal: 20,
  adaptiveAids: true,
}
export function initialState(): PersistentState {
  const items = Object.fromEntries(catalog.map((item) => [item.id, { ...item, ...freshSchedule() }]))
  const grammarSrs: Record<string, GrammarSrsItem> = {}
  for (const g of grammarData)
    g.examples.forEach((_, index) => {
      const id = `grammar:${g.id}:${index}`
      grammarSrs[id] = { ...freshSchedule(), id, grammarId: g.id, exampleIndex: index, title: g.title }
    })
  return {
    items,
    grammarSrs,
    exampleSrs: {},
    progress: { ...defaultProgress },
    displayPrefs: { ...defaultPrefs },
    activeCategory: 'hiragana',
    storyProgress: { completed: [] },
    pinnedReviewIds: [],
    notebook: {},
    introducedIds: [],
    introducedGrammarIds: [],
    completedLessons: {},
    lessonDrafts: {},
    dailyHistory: {},
    events: [],
    activeSession: null,
    activityDrafts: {},
    learningGoal: 'foundation',
    trainingResults: {},
  }
}
export function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}
/** Add new seed content while preserving the existing learner's SRS and counters. */
export function restoreState(value: unknown): PersistentState {
  const saved = object(value),
    defaults = initialState()
  const items = object(saved.items),
    grammar = object(saved.grammarSrs)
  for (const [id, seed] of Object.entries(defaults.items)) {
    const previous = object(items[id])
    const fields = Object.fromEntries(
      scheduleFields.filter((field) => previous[field] !== undefined).map((field) => [field, previous[field]])
    )
    defaults.items[id] = { ...seed, ...fields } as LearningItem
    if (defaults.items[id].lastReviewDate !== null && defaults.items[id].status === 'new')
      defaults.items[id].status = 'learning'
  }
  for (const id of Object.keys(defaults.grammarSrs)) {
    const previous = object(grammar[id])
    const fields = Object.fromEntries(
      scheduleFields.filter((field) => previous[field] !== undefined).map((field) => [field, previous[field]])
    )
    defaults.grammarSrs[id] = { ...defaults.grammarSrs[id], ...fields } as GrammarSrsItem
  }
  const oldProgress = object(saved.progress)
  if (oldProgress.totalSessions !== undefined && oldProgress.cardsReviewed === undefined)
    oldProgress.cardsReviewed = oldProgress.totalSessions
  const progress = { ...defaultProgress, ...oldProgress } as UserProgress
  const retained = Object.fromEntries(
    Object.keys(defaults)
      .filter((key) => saved[key] !== undefined)
      .map((key) => [key, saved[key]])
  )
  return {
    ...defaults,
    ...retained,
    items: defaults.items,
    grammarSrs: defaults.grammarSrs,
    progress,
    displayPrefs: { ...defaultPrefs, ...object(saved.displayPrefs) },
    introducedIds: Array.isArray(saved.introducedIds)
      ? saved.introducedIds
      : Object.values(defaults.items)
          .filter((item) => item.lastReviewDate !== null)
          .map((item) => item.id),
    introducedGrammarIds: Array.isArray(saved.introducedGrammarIds)
      ? saved.introducedGrammarIds
      : Object.values(defaults.grammarSrs)
          .filter((item) => item.lastReviewDate !== null)
          .map((item) => item.grammarId),
  } as PersistentState
}
export function persistentSnapshot(value: PersistentState): PersistentState {
  const keys = Object.keys(initialState()) as (keyof PersistentState)[]
  return Object.fromEntries(keys.map((key) => [key, value[key]])) as unknown as PersistentState
}
