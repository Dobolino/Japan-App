import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LearningItem, UserProgress, SRSRating, ItemCategory, DisplayPrefs, GrammarSrsItem, StoryProgress } from '@/types'
import { hiraganaData } from '@/data/hiragana'
import { katakanaData } from '@/data/katakana'
import { vocabularyData } from '@/data/vocabulary'
import { kanjiN5Data } from '@/data/kanji-n5'
import { grammarData } from '@/data/grammar'
import { XP_PER_CORRECT, xpToLevel } from '@/constants/srs'
import { updateStreak } from '@/utils/date'
import { sm2 } from '@/utils/sm2'
import { shuffle } from '@/utils/shuffle'
import { isGrammarSrsId } from '@/types/review'

const ALL_SEED = [...hiraganaData, ...katakanaData, ...vocabularyData, ...kanjiN5Data]

const SRS_FIELDS = [
  'status',
  'easeFactor',
  'interval',
  'repetitions',
  'nextReviewDate',
  'lastReviewDate',
  'errorCount',
  'correctCount',
] as const satisfies readonly (keyof LearningItem)[]

export { xpToLevel, xpInLevel } from '@/constants/srs'

interface AppState {
  items: Record<string, LearningItem>
  grammarSrs: Record<string, GrammarSrsItem>
  progress: UserProgress
  displayPrefs: DisplayPrefs
  activeCategory: ItemCategory
  storyProgress: StoryProgress

  initItems: () => void
  initGrammarSrs: () => void
  setActiveCategory: (cat: ItemCategory) => void
  setDisplayPrefs: (prefs: Partial<DisplayPrefs>) => void
  markStoryComplete: (storyId: string) => void
  updateItem: (id: string, updates: Partial<LearningItem>) => void
  rateReview: (id: string, rating: SRSRating) => void
  recordReview: (id: string, correct: boolean) => void
  startStudySession: () => void
  resetProgress: () => void
  getDueItems: (category?: string, limit?: number) => LearningItem[]
  getDueGrammarCount: () => number
  getItemsByCategory: (category: string) => LearningItem[]
}

const defaultProgress: UserProgress = {
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

const defaultStoryProgress: StoryProgress = { completed: [] }

const defaultDisplayPrefs: DisplayPrefs = {
  showFurigana: true,
  showRomaji: false,
  theme: 'light',
}

function mergeStoredItem(seed: LearningItem, stored: LearningItem): LearningItem {
  const srs = Object.fromEntries(
    SRS_FIELDS.map((key) => [key, stored[key] ?? seed[key]])
  ) as Pick<LearningItem, (typeof SRS_FIELDS)[number]>

  return {
    ...seed,
    ...srs,
    easeFactor: stored.easeFactor ?? 2.5,
    interval: stored.interval ?? 1,
    repetitions: stored.repetitions ?? 0,
  }
}

function seedGrammarSrs(): Record<string, GrammarSrsItem> {
  const today = new Date().toISOString()
  const out: Record<string, GrammarSrsItem> = {}
  for (const g of grammarData) {
    g.examples.forEach((_, exIndex) => {
      const id = `grammar:${g.id}:${exIndex}`
      out[id] = {
        id,
        grammarId: g.id,
        exampleIndex: exIndex,
        title: g.title,
        status: 'new',
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReviewDate: today,
        lastReviewDate: null,
        errorCount: 0,
        correctCount: 0,
      }
    })
  }
  return out
}

function applyProgressPatch(progress: UserProgress, correct: boolean) {
  const today = new Date().toLocaleDateString('sv-SE')
  const todayCorrect =
    (progress.todayDate === today ? progress.todayCorrect : 0) + (correct ? 1 : 0)
  const earnedXp = correct ? XP_PER_CORRECT : 0
  const newXp = (progress.xp ?? 0) + earnedXp
  const streakUpdate = updateStreak(progress)

  return {
    ...progress,
    totalCorrect: progress.totalCorrect + (correct ? 1 : 0),
    totalErrors: progress.totalErrors + (correct ? 0 : 1),
    ...streakUpdate,
    lastStudyDate: new Date().toISOString(),
    cardsReviewed: progress.cardsReviewed + 1,
    xp: newXp,
    level: xpToLevel(newXp),
    todayCorrect,
    todayDate: today,
  }
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: {},
      grammarSrs: {},
      progress: defaultProgress,
      displayPrefs: defaultDisplayPrefs,
      activeCategory: 'hiragana',
      storyProgress: defaultStoryProgress,

      initItems: () => {
        const { items } = get()
        const seed: Record<string, LearningItem> = {}
        for (const item of ALL_SEED) {
          const stored = items[item.id]
          seed[item.id] = stored ? mergeStoredItem(item, stored) : item
        }
        set({ items: seed })
      },

      initGrammarSrs: () => {
        const seeded = seedGrammarSrs()
        const { grammarSrs } = get()
        const merged: Record<string, GrammarSrsItem> = { ...seeded }
        for (const id of Object.keys(grammarSrs)) {
          if (merged[id]) merged[id] = { ...merged[id], ...grammarSrs[id] }
        }
        set({ grammarSrs: merged })
      },

      setActiveCategory: (cat) => set({ activeCategory: cat }),

      setDisplayPrefs: (prefs) =>
        set((s) => ({ displayPrefs: { ...s.displayPrefs, ...prefs } })),

      markStoryComplete: (storyId) =>
        set((s) => {
          if (s.storyProgress.completed.includes(storyId)) return s
          return {
            storyProgress: {
              completed: [...s.storyProgress.completed, storyId],
            },
          }
        }),

      updateItem: (id, updates) =>
        set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], ...updates } } })),

      startStudySession: () =>
        set((s) => ({
          progress: { ...s.progress, studySessions: s.progress.studySessions + 1 },
        })),

      rateReview: (id, rating) => {
        const correct = rating >= 1

        if (isGrammarSrsId(id)) {
          const { grammarSrs } = get()
          const entry = grammarSrs[id]
          if (!entry) return

          set((s) => ({
            grammarSrs: {
              ...s.grammarSrs,
              [id]: {
                ...entry,
                ...sm2(entry as unknown as LearningItem, rating),
                lastReviewDate: new Date().toISOString(),
                errorCount: entry.errorCount + (correct ? 0 : 1),
                correctCount: entry.correctCount + (correct ? 1 : 0),
              },
            },
            progress: applyProgressPatch(s.progress, correct),
          }))
          return
        }

        const { items } = get()
        const item = items[id]
        if (!item) return

        set((s) => ({
          items: {
            ...s.items,
            [id]: {
              ...item,
              ...sm2(item, rating),
              lastReviewDate: new Date().toISOString(),
              errorCount: item.errorCount + (correct ? 0 : 1),
              correctCount: item.correctCount + (correct ? 1 : 0),
            },
          },
          progress: applyProgressPatch(s.progress, correct),
        }))
      },

      recordReview: (id, correct) => get().rateReview(id, correct ? 2 : 0),

      resetProgress: () => {
        const reset: Record<string, LearningItem> = {}
        for (const item of ALL_SEED) reset[item.id] = { ...item }
        set({ items: reset, grammarSrs: seedGrammarSrs(), progress: defaultProgress, storyProgress: defaultStoryProgress })
      },

      getDueItems: (category, limit = 20) => {
        const now = new Date().toISOString()
        const allItems = Object.values(get().items).filter(
          (i) => !category || i.category === category
        )

        const reviews = allItems
          .filter((i) => i.repetitions > 0 && i.nextReviewDate <= now)
          .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))

        const newCards = shuffle(allItems.filter((i) => i.repetitions === 0)).slice(
          0,
          Math.max(0, 10 - reviews.length)
        )

        return [...reviews, ...newCards].slice(0, limit)
      },

      getDueGrammarCount: () => {
        const now = new Date().toISOString()
        return Object.values(get().grammarSrs).filter(
          (g) => g.repetitions === 0 || g.nextReviewDate <= now
        ).length
      },

      getItemsByCategory: (category) =>
        Object.values(get().items).filter((i) => i.category === category),
    }),
    {
      name: 'japp-store',
      version: 3,
      migrate: (persisted) => {
        const state = persisted as {
          progress?: Record<string, unknown>
          displayPrefs?: DisplayPrefs
          grammarSrs?: Record<string, GrammarSrsItem>
          storyProgress?: StoryProgress
        }
        const progress = state.progress ?? {}
        if ('totalSessions' in progress && !('cardsReviewed' in progress)) {
          progress.cardsReviewed = progress.totalSessions
          delete progress.totalSessions
        }
        if (!('studySessions' in progress)) {
          progress.studySessions = 0
        }
        if (!state.displayPrefs) {
          state.displayPrefs = defaultDisplayPrefs
        } else if (!('theme' in state.displayPrefs)) {
          state.displayPrefs = {
            ...defaultDisplayPrefs,
            ...(state.displayPrefs as DisplayPrefs),
            theme: 'light',
          }
        }
        if (!state.grammarSrs || !Object.keys(state.grammarSrs).length) {
          state.grammarSrs = seedGrammarSrs()
        }
        if (!state.storyProgress) {
          state.storyProgress = defaultStoryProgress
        }
        return persisted
      },
      partialize: (s) => ({
        items: s.items,
        grammarSrs: s.grammarSrs,
        progress: s.progress,
        displayPrefs: s.displayPrefs,
        storyProgress: s.storyProgress,
      }),
    }
  )
)
