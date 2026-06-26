import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LearningItem, UserProgress, SRSRating, ItemCategory } from '../types'
import { hiraganaData } from '../data/hiragana'
import { katakanaData } from '../data/katakana'
import { vocabularyData } from '../data/vocabulary'
import { kanjiN5Data } from '../data/kanji-n5'

const ALL_SEED = [...hiraganaData, ...katakanaData, ...vocabularyData, ...kanjiN5Data]

const XP_PER_CORRECT = 10
const XP_PER_LEVEL = 200

export function xpToLevel(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}
export function xpInLevel(xp: number) {
  return xp % XP_PER_LEVEL
}

interface AppState {
  items: Record<string, LearningItem>
  progress: UserProgress
  activeCategory: ItemCategory

  initItems: () => void
  setActiveCategory: (cat: ItemCategory) => void
  updateItem: (id: string, updates: Partial<LearningItem>) => void
  rateReview: (id: string, rating: SRSRating) => void
  recordReview: (id: string, correct: boolean) => void
  resetProgress: () => void
  getDueItems: (category?: string, limit?: number) => LearningItem[]
  getItemsByCategory: (category: string) => LearningItem[]
}

const defaultProgress: UserProgress = {
  totalSessions: 0,
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

function sm2(item: LearningItem, rating: SRSRating) {
  let { easeFactor, interval, repetitions } = item
  if (rating === 0) {
    repetitions = 0; interval = 1; easeFactor = Math.max(1.3, easeFactor - 0.2)
  } else if (rating === 1) {
    easeFactor = Math.max(1.3, easeFactor - 0.15)
    interval = Math.max(1, Math.round(interval * 1.2)); repetitions += 1
  } else if (rating === 2) {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 4
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 4
    else interval = Math.round(interval * easeFactor * 1.3)
    easeFactor = Math.min(3.0, easeFactor + 0.15); repetitions += 1
  }
  let status: LearningItem['status']
  if (repetitions === 0) status = 'new'
  else if (interval <= 1) status = 'learning'
  else if (interval < 7) status = 'uncertain'
  else status = 'mastered'
  const next = new Date(); next.setDate(next.getDate() + interval)
  return { easeFactor, interval, repetitions, status, nextReviewDate: next.toISOString() }
}

function updateStreak(progress: UserProgress): { currentStreak: number; longestStreak: number } {
  const today = new Date().toDateString()
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
  const last = progress.lastStudyDate ? new Date(progress.lastStudyDate).toDateString() : null
  let streak = progress.currentStreak
  if (last === yesterday.toDateString()) streak = progress.currentStreak + 1
  else if (last === today) streak = progress.currentStreak
  else streak = 1
  return { currentStreak: streak, longestStreak: Math.max(streak, progress.longestStreak ?? 0) }
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
          seed[item.id] = stored
            ? { ...item, ...stored, easeFactor: stored.easeFactor ?? 2.5, interval: stored.interval ?? 1, repetitions: stored.repetitions ?? 0 }
            : item
        }
        set({ items: seed })
      },

      setActiveCategory: (cat) => set({ activeCategory: cat }),
      updateItem: (id, updates) =>
        set((s) => ({ items: { ...s.items, [id]: { ...s.items[id], ...updates } } })),

      rateReview: (id, rating) => {
        const { items, progress } = get()
        const item = items[id]; if (!item) return
        const correct = rating >= 2
        const today = new Date().toDateString()
        const todayCorrect = (progress.todayDate === today ? progress.todayCorrect : 0) + (correct ? 1 : 0)
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
            totalSessions: s.progress.totalSessions + 1,
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
        return Object.values(get().items)
          .filter((i) => (!category || i.category === category) && i.nextReviewDate <= now)
          .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate))
          .slice(0, limit)
      },

      getItemsByCategory: (category) =>
        Object.values(get().items).filter((i) => i.category === category),
    }),
    { name: 'japp-store', partialize: (s) => ({ items: s.items, progress: s.progress }) }
  )
)
