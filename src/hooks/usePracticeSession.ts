import { useState, useMemo, useCallback, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { buildReviewQueue, buildFlashcardQueue, ratingFromProduction, reviewCardMatchesAnswer, pickGrammarReviewCards } from '@/utils/buildReviewQueue'
import { grammarData } from '@/data/grammar'
import type { ReviewCard } from '@/types/review'
import type { SRSRating, ItemCategory } from '@/types'

export type Phase = 'idle' | 'question' | 'answer' | 'done'
export type Direction = 'jp-de' | 'de-jp'
export type PracticeMode = 'srs' | 'flashcard'

export function usePracticeSession() {
  const items = useStore((s) => s.items)
  const getDueItems = useStore((s) => s.getDueItems)
  const grammarSrs = useStore((s) => s.grammarSrs)
  const rateReview = useStore((s) => s.rateReview)
  const startStudySession = useStore((s) => s.startStudySession)

  const [practiceMode, setPracticeMode] = useState<PracticeMode>('srs')
  const [phase, setPhase] = useState<Phase>('idle')
  const [direction, setDirection] = useState<Direction>('de-jp')
  const [filterCat, setFilterCat] = useState<ItemCategory | 'all'>('all')
  const [queue, setQueue] = useState<ReviewCard[]>([])
  const [index, setIndex] = useState(0)
  const [sessionRatings, setSessionRatings] = useState<SRSRating[]>([])
  const [typed, setTyped] = useState('')
  const [showRomajiHint, setShowRomajiHint] = useState(false)
  const [autoPlayAudio, setAutoPlayAudio] = useState(false)
  const [lastCheckedCorrect, setLastCheckedCorrect] = useState<boolean | null>(null)

  const productionMode = direction === 'de-jp'

  const dueItems = getDueItems(filterCat === 'all' ? undefined : filterCat, 999)

  const allItems = useMemo(() => {
    const all = Object.values(items)
    return filterCat === 'all' ? all : all.filter((i) => i.category === filterCat)
  }, [filterCat, items])

  const current = queue[index]

  const goNext = useCallback(
    (rating: SRSRating) => {
      if (!current) return
      rateReview(current.srsId, rating)
      setSessionRatings((r) => [...r, rating])
      setTyped('')
      setLastCheckedCorrect(null)
      if (index + 1 < queue.length) {
        setIndex((i) => i + 1)
        setPhase('question')
      } else {
        setPhase('done')
      }
    },
    [current, index, queue.length, rateReview]
  )

  const startSRS = useCallback(() => {
    const due = getDueItems(filterCat === 'all' ? undefined : filterCat, 16)
    const grammarCards = pickGrammarReviewCards(grammarSrs, grammarData, 4)
    const built = buildReviewQueue(due, { limit: 20, grammarCards })
    if (!built.length) return
    startStudySession()
    setQueue(built)
    setIndex(0)
    setSessionRatings([])
    setTyped('')
    setLastCheckedCorrect(null)
    setPhase('question')
  }, [filterCat, getDueItems, grammarSrs, startStudySession])

  const startFlashcard = useCallback(() => {
    const built = buildFlashcardQueue(allItems, 20)
    if (!built.length) return
    startStudySession()
    setQueue(built)
    setIndex(0)
    setSessionRatings([])
    setTyped('')
    setLastCheckedCorrect(null)
    setPhase('question')
  }, [allItems, startStudySession])

  const checkAnswer = useCallback(() => {
    if (!current) return
    const correct = reviewCardMatchesAnswer(typed, current)
    setLastCheckedCorrect(correct)

    if (productionMode) {
      if (correct) {
        goNext(ratingFromProduction(true, false))
        return
      }
      setPhase('answer')
      return
    }

    setPhase('answer')
  }, [current, typed, productionMode, goNext])

  const skipQuestion = useCallback(() => {
    setLastCheckedCorrect(false)
    setPhase('answer')
  }, [])

  const reveal = useCallback(() => {
    if (productionMode && !typed.trim()) {
      skipQuestion()
      return
    }
    if (productionMode && typed.trim()) {
      checkAnswer()
      return
    }
    setPhase('answer')
  }, [productionMode, typed, skipQuestion, checkAnswer])

  const advance = useCallback(
    (rating: SRSRating) => {
      goNext(rating)
    },
    [goNext]
  )

  const confirmWrong = useCallback(() => {
    goNext(ratingFromProduction(false, !typed.trim()))
  }, [goNext, typed])

  const resetToIdle = useCallback(() => setPhase('idle'), [])

  const restart = useCallback(() => {
    if (practiceMode === 'srs') startSRS()
    else startFlashcard()
  }, [practiceMode, startSRS, startFlashcard])

  useEffect(() => {
    if (phase !== 'question' && phase !== 'answer') return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (productionMode && phase === 'question') {
        if (e.key === 'Enter') {
          e.preventDefault()
          reveal()
        }
        return
      }

      if (e.key === ' ' || e.key === 'Enter') {
        if (phase === 'question') {
          e.preventDefault()
          reveal()
        }
        return
      }

      if (phase !== 'answer' || productionMode) return

      if (practiceMode === 'srs') {
        const rating = Number(e.key) - 1
        if (rating >= 0 && rating <= 3) advance(rating as SRSRating)
      } else {
        if (e.key === '1' || e.key === 'n' || e.key === 'N') advance(0)
        if (e.key === '4' || e.key === 'y' || e.key === 'Y') advance(3)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [phase, practiceMode, productionMode, reveal, advance])

  return {
    practiceMode,
    setPracticeMode,
    phase,
    direction,
    setDirection,
    filterCat,
    setFilterCat,
    queue,
    index,
    sessionRatings,
    typed,
    setTyped,
    showRomajiHint,
    setShowRomajiHint,
    autoPlayAudio,
    setAutoPlayAudio,
    dueItems,
    allItems,
    current,
    productionMode,
    lastCheckedCorrect,
    startSRS,
    startFlashcard,
    checkAnswer,
    skipQuestion,
    advance,
    confirmWrong,
    reveal,
    resetToIdle,
    restart,
  }
}
