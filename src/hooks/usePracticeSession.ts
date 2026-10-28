import { useState, useEffect, useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { buildFlashcardQueue, reviewCardMatchesAnswer } from '@/utils/buildReviewQueue'
import { createStudyPlan } from '@/utils/studyPlan'
import type { SRSRating, ItemCategory } from '@/types'
import type { SessionSnapshot } from '@/store/types'
export type Phase = 'idle' | 'question' | 'answer' | 'done'
export type Direction = 'jp-de' | 'de-jp'
export type PracticeMode = 'srs' | 'flashcard'
export function usePracticeSession() {
  const store = useStore(),
    session = store.activeSession
  const [directionPref, setDirection] = useState<Direction>(session?.direction ?? 'de-jp')
  const [filterCat, setFilterCat] = useState<ItemCategory | 'all'>('all')
  const [showRomajiHint, setShowRomajiHint] = useState(false),
    [autoPlayAudio, setAutoPlayAudio] = useState(false)
  const direction = session?.direction ?? directionPref,
    practiceMode = session?.mode ?? 'srs',
    phase: Phase = session?.phase ?? 'idle'
  const current = session?.queue[session.index],
    productionMode = direction === 'de-jp'
  const allItems = Object.values(store.items).filter(
    (item) => filterCat === 'all' || item.category === filterCat
  )
  const planned = createStudyPlan(store, filterCat)
  const update = useCallback((patch: Partial<SessionSnapshot>) => {
    const active = useStore.getState().activeSession
    if (active) useStore.getState().saveSession({ ...active, ...patch })
  }, [])
  const start = (mode: PracticeMode) => {
    const queue = mode === 'srs' ? planned : buildFlashcardQueue(allItems, 20)
    if (!queue.length) return
    store.startStudySession()
    store.saveSession({
      id: crypto.randomUUID(),
      queue,
      index: 0,
      ratings: [],
      phase: 'question',
      direction: directionPref,
      mode,
      typed: '',
      correct: null,
      startedAt: new Date().toISOString(),
      retries: [],
    })
  }
  const checkAnswer = useCallback(() => {
    const active = useStore.getState().activeSession,
      card = active?.queue[active.index]
    if (active && card && active.phase === 'question')
      update({ phase: 'answer', correct: reviewCardMatchesAnswer(active.typed, card) })
  }, [update])
  const skipQuestion = useCallback(() => update({ phase: 'answer', correct: false }), [update])
  const reveal = useCallback(() => {
    if (productionMode) checkAnswer()
    else update({ phase: 'answer' })
  }, [productionMode, checkAnswer, update])
  const advance = useCallback((rating: SRSRating) => {
    useStore.getState().submitSessionRating(rating)
    setShowRomajiHint(false)
  }, [])
  const confirmWrong = useCallback(
    () => advance(useStore.getState().activeSession?.correct ? 3 : 0),
    [advance]
  )
  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return
    const listener = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLButtonElement
      )
        return
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        if (phase === 'question') reveal()
        else if (productionMode) confirmWrong()
        return
      }
      if (phase === 'answer' && !productionMode) {
        const rating = Number(event.key) - 1
        if (practiceMode === 'srs' && rating >= 0 && rating <= 3) advance(rating as SRSRating)
        else if (practiceMode === 'flashcard') {
          if (/^[1nN]$/.test(event.key)) advance(0)
          if (/^[4yY]$/.test(event.key)) advance(3)
        }
      }
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [phase, productionMode, practiceMode, reveal, advance, confirmWrong])
  return {
    practiceMode,
    phase,
    direction,
    setDirection,
    filterCat,
    setFilterCat,
    queue: session?.queue ?? [],
    index: session?.index ?? 0,
    sessionRatings: session?.ratings ?? [],
    typed: session?.typed ?? '',
    setTyped: (typed: string) => update({ typed }),
    showRomajiHint,
    setShowRomajiHint,
    autoPlayAudio,
    setAutoPlayAudio,
    allItems,
    current,
    productionMode,
    lastCheckedCorrect: session?.correct ?? null,
    canStartSrs: planned.length > 0,
    startSRS: () => start('srs'),
    startFlashcard: () => start('flashcard'),
    checkAnswer,
    skipQuestion,
    reveal,
    advance,
    confirmWrong,
    resetToIdle: () => store.saveSession(null),
    restart: () => {
      store.saveSession(null)
      start(practiceMode)
    },
  }
}
