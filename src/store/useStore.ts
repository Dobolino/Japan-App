import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LearningItem, UserProgress, SRSRating, ItemCategory } from '@/types'
import { hiraganaData } from '@/data/hiragana'
import { katakanaData } from '@/data/katakana'
import { vocabularyData } from '@/data/vocabulary'
import { kanjiN5Data } from '@/data/kanji-n5'
import { XP_PER_CORRECT, xpToLevel } from '@/constants/srs'
import { updateStreak } from '@/utils/date'
import { sm2 } from '@/utils/sm2'
import { shuffle } from '@/utils/shuffle'

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
  progress: UserProgress
  activeCategory: ItemCategory

  initItems: () => void
  setActiveCategory: (cat: ItemCategory) => void
  updateItem: (id: string, updates: Partial<LearningItem>) => void
  rateReview: (id: string, rating: SRSRating) => void
  recordReview: (id: string, correct: boolean) => void
  startStudySession: () => void
  resetProgress: () => void
  getDueItems: (category?: string, limit?: number) => LearningItem[]
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

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      items: {},
      progress: defaultProgress,
      activeCategory: 'hiragana',

      initItems: () => {
        const { items } = get()
        const seed: Record<string, LearningItem> = {}
        for (const item of ALL_SEED) {
          const stored = items[item.id]
          seed[item.id] = stored ? mergeStoredItem(item, stored) : item
        }
        set({ items: seed })
      },

      setActiveCategory: (cat) => set({ activeCategory: cat }),

      updateItem: (id, updates) =>
        set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], ...updates } } })),

      startStudySession: () =>
        set((s) => ({
          progress: { ...s.progress, studySessions: s.progress.studySessions + 1 },
        })),

      rateReview: (id, rating) => {
        const { items, progress } = get()
        const item = items[id]
        if (!item) return

        const correct = rating >= 2
        const today = new Date().toLocaleDateString('sv-SE')
        const todayCorrect =
          (progress.todayDate === today ? progress.todayCorrect : 0) + (correct ? 1 : 0)
        const earnedXp = correct ? XP_PER_CORRECT : 0
        const newXp = (progress.xp ?? 0) + earnedXp
        const streakUpdate = updateStreak(progress)

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
          progress: {
            ...s.progress,
            totalCorrect: s.progress.totalCorrect + (correct ? 1 : 0),
            totalErrors: s.progress.totalErrors + (correct ? 0 : 1),
            ...streakUpdate,
            lastStudyDate: new Date().toISOString(),
            cardsReviewed: s.progress.cardsReviewed + 1,
            xp: newXp,
            level: xpToLevel(newXp),
            todayCorrect,
            todayDate: today,
          },
        }))
      },

      recordReview: (id, correct) => get().rateReview(id, correct ? 2 : 0),

      resetProgress: () => {
        const reset: Record<string, LearningItem> = {}
        for (const item of ALL_SEED) reset[item.id] = { ...item }
        set({ items: reset, progress: defaultProgress })
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

      getItemsByCategory: (category) =>
        Object.values(get().items).filter((i) => i.category === category),
    }),
    {
      name: 'japp-store',
      version: 1,
      migrate: (persisted) => {
        const state = persisted as { progress?: Record<string, unknown> }
        const progress = state.progress ?? {}
        if ('totalSessions' in progress && !('cardsReviewed' in progress)) {
          progress.cardsReviewed = progress.totalSessions
          delete progress.totalSessions
        }
        if (!('studySessions' in progress)) {
          progress.studySessions = 0
        }
        return persisted
      },
      partialize: (s) => ({ items: s.items, progress: s.progress }),
    }
  )
)
