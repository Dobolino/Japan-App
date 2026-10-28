import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { LearningItem, SRSRating, ItemCategory, DisplayPrefs } from '@/types'
import type {
  PersistentState,
  NotebookEntry,
  LessonResult,
  LessonDraft,
  SessionSnapshot,
  ActivityDraft,
} from './types'
import { initialState, persistentSnapshot, restoreState, STORE_VERSION } from './persistence'
import { applyReview } from './reviewModel'
import { selectReviewItems } from '@/utils/reviewCounts'
import { createBackup } from '@/utils/backup'
export { xpToLevel, xpInLevel } from '@/constants/srs'
export interface AppState extends PersistentState {
  setActiveCategory: (category: ItemCategory) => void
  setDisplayPrefs: (prefs: Partial<DisplayPrefs>) => void
  markStoryComplete: (id: string) => void
  updateItem: (id: string, updates: Partial<LearningItem>) => void
  rateReview: (id: string, rating: SRSRating, eventId?: string) => void
  recordReview: (id: string, correct: boolean) => void
  startStudySession: () => void
  resetProgress: () => void
  getDueItems: (category?: string, limit?: number) => LearningItem[]
  getDueGrammarCount: () => number
  getItemsByCategory: (category: string) => LearningItem[]
  pinForReview: (id: string) => void
  unpinForReview: (id: string) => void
  getPinnedItems: () => LearningItem[]
  introduceItems: (ids: string[], grammarIds?: string[]) => void
  completeLesson: (id: string, result: LessonResult) => void
  saveLessonDraft: (id: string, draft: LessonDraft | null) => void
  updateNotebook: (id: string, entry: Partial<NotebookEntry>) => void
  setLearningGoal: (goal: PersistentState['learningGoal']) => void
  saveSession: (session: SessionSnapshot | null) => void
  submitSessionRating: (rating: SRSRating) => void
  finishTraining: (id: string, result: LessonResult) => void
  saveActivity: (id: string, draft: ActivityDraft | null) => void
  replaceState: (state: PersistentState) => void
}
export const storageState = { failed: false, damagedRaw: null as string | null }
const storage = createJSONStorage<PersistentState>(() => ({
  getItem: (key: string) => {
    if (typeof localStorage === 'undefined') return null
    let raw: string | null
    try {
      raw = localStorage.getItem(key)
    } catch {
      storageState.failed = true
      return null
    }
    if (key === 'japp-store' && raw) {
      let parsed
      try {
        parsed = JSON.parse(raw)
        if (!parsed || typeof parsed !== 'object') throw new Error('Ungültiger Lernstand')
      } catch {
        storageState.failed = true
        storageState.damagedRaw = raw
        try {
          localStorage.setItem('japp-unreadable', raw)
        } catch {
          /* Original remains available for download in memory. */
        }
        return null
      }
      try {
        if (
          typeof parsed.version === 'number' &&
          parsed.version < STORE_VERSION &&
          !localStorage.getItem('japp-recovery')
        )
          localStorage.setItem('japp-recovery', createBackup(restoreState(parsed.state)))
      } catch {
        storageState.failed = true
      }
    }
    // A failed recovery copy must not discard the readable original learner state.
    return raw
  },
  setItem: (key: string, value: string) => {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value)
    } catch {
      storageState.failed = true
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('japp-storage-error'))
    }
  },
  removeItem: (key: string) => {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key)
  },
}))
export const useStore = create<AppState>()(
  persist<AppState, [], [], PersistentState>(
    (set, get) => ({
      ...initialState(),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      setDisplayPrefs: (prefs) => set((state) => ({ displayPrefs: { ...state.displayPrefs, ...prefs } })),
      markStoryComplete: (id) =>
        set((state) => ({
          storyProgress: { completed: [...new Set([...state.storyProgress.completed, id])] },
        })),
      updateItem: (id, updates) =>
        set((state) =>
          state.items[id] ? { items: { ...state.items, [id]: { ...state.items[id], ...updates } } } : {}
        ),
      rateReview: (id, rating, eventId) => set((state) => applyReview(state, id, rating, eventId)),
      recordReview: (id, correct) => get().rateReview(id, correct ? 2 : 0),
      startStudySession: () =>
        set((state) => ({
          progress: { ...state.progress, studySessions: state.progress.studySessions + 1 },
        })),
      resetProgress: () =>
        set((state) => ({
          ...initialState(),
          displayPrefs: state.displayPrefs,
          learningGoal: state.learningGoal,
        })),
      getDueItems: (category, limit = 20) => {
        const state = get()
        return selectReviewItems(
          Object.values(state.items).filter(
            (item) =>
              (!category || item.category === category) &&
              (item.lastReviewDate !== null || state.introducedIds.includes(item.id))
          ),
          limit
        )
      },
      getDueGrammarCount: () =>
        Object.values(get().grammarSrs).filter(
          (item) => item.lastReviewDate !== null && item.nextReviewDate <= new Date().toISOString()
        ).length,
      getItemsByCategory: (category) =>
        Object.values(get().items).filter((item) => item.category === category),
      pinForReview: (id) =>
        set((state) =>
          state.items[id] ? { pinnedReviewIds: [...new Set([...state.pinnedReviewIds, id])] } : {}
        ),
      unpinForReview: (id) =>
        set((state) => ({ pinnedReviewIds: state.pinnedReviewIds.filter((value) => value !== id) })),
      getPinnedItems: () =>
        get()
          .pinnedReviewIds.map((id) => get().items[id])
          .filter(Boolean),
      introduceItems: (ids, grammar = []) =>
        set((state) => ({
          introducedIds: [
            ...new Set([...state.introducedIds, ...ids.filter((id) => Boolean(state.items[id]))]),
          ],
          introducedGrammarIds: [...new Set([...state.introducedGrammarIds, ...grammar])],
        })),
      completeLesson: (id, result) =>
        set((state) => ({
          completedLessons: { ...state.completedLessons, [id]: result },
          lessonDrafts: Object.fromEntries(Object.entries(state.lessonDrafts).filter(([key]) => key !== id)),
        })),
      saveLessonDraft: (id, draft) =>
        set((state) => ({
          lessonDrafts: draft
            ? { ...state.lessonDrafts, [id]: draft }
            : Object.fromEntries(Object.entries(state.lessonDrafts).filter(([key]) => key !== id)),
        })),
      updateNotebook: (id, entry) =>
        set((state) =>
          state.items[id]
            ? {
                notebook: {
                  ...state.notebook,
                  [id]: {
                    ...(state.notebook[id] ?? { note: '', example: '', tags: [] }),
                    ...entry,
                    updatedAt: new Date().toISOString(),
                  },
                },
              }
            : {}
        ),
      setLearningGoal: (learningGoal) => set({ learningGoal }),
      saveSession: (activeSession) => set({ activeSession }),
      submitSessionRating: (rating) =>
        set((state) => {
          const session = state.activeSession,
            card = session?.queue[session.index]
          if (!session || !card || session.phase !== 'answer') return {}
          const queue = [...session.queue],
            retries = [...session.retries]
          if (rating === 0 && !retries.includes(card.srsId)) {
            retries.push(card.srsId)
            queue.splice(Math.min(session.index + 4, queue.length), 0, {
              ...card,
              cardId: `${card.cardId}:retry`,
            })
          }
          const index = session.index + 1
          return {
            ...applyReview(state, card.srsId, rating, `${session.id}:${session.index}`),
            activeSession: {
              ...session,
              queue,
              retries,
              index,
              ratings: [...session.ratings, rating],
              typed: '',
              correct: null,
              phase: index >= queue.length ? 'done' : 'question',
            },
          }
        }),
      saveActivity: (id, draft) =>
        set((state) => ({
          activityDrafts: draft
            ? { ...state.activityDrafts, [id]: draft }
            : Object.fromEntries(Object.entries(state.activityDrafts).filter(([key]) => key !== id)),
        })),
      finishTraining: (id, result) =>
        set((state) => ({ trainingResults: { ...state.trainingResults, [id]: result } })),
      replaceState: (state) => set(restoreState(state)),
    }),
    {
      name: 'japp-store',
      version: STORE_VERSION,
      storage,
      partialize: persistentSnapshot,
      migrate: restoreState,
      merge: (saved, current) => ({ ...current, ...restoreState(saved) }),
    }
  )
)
