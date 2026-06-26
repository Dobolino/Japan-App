import { useState, useMemo, useCallback, useEffect } from 'react'
import { shuffle } from '@/utils/shuffle'
import { useStore } from '@/store/useStore'
import type { LearningItem, SRSRating, ItemCategory } from '@/types'

export type Phase = 'idle' | 'question' | 'answer' | 'done'
export type Direction = 'jp-de' | 'de-jp'
export type PracticeMode = 'srs' | 'flashcard'

export function usePracticeSession() {
  const items = useStore((s) => s.items)
  const getDueItems = useStore((s) => s.getDueItems)
  const rateReview = useStore((s) => s.rateReview)
  const startStudySession = useStore((s) => s.startStudySession)

  const [practiceMode, setPracticeMode] = useState<PracticeMode>('srs')
  const [phase, setPhase] = useState<Phase>('idle')
  const [direction, setDirection] = useState<Direction>('jp-de')
  const [filterCat, setFilterCat] = useState<ItemCategory | 'all'>('all')
  const [queue, setQueue] = useState<LearningItem[]>([])
  const [index, setIndex] = useState(0)
  const [sessionRatings, setSessionRatings] = useState<SRSRating[]>([])
  const [typed, setTyped] = useState('')
  const [showRomajiHint, setShowRomajiHint] = useState(false)
  const [autoPlayAudio, setAutoPlayAudio] = useState(true)

  const dueItems = getDueItems(filterCat === 'all' ? undefined : filterCat, 999)

  const allItems = useMemo(() => {
    const all = Object.values(items)
    return filterCat === 'all' ? all : all.filter((i) => i.category === filterCat)
  }, [filterCat, items])

  const current = queue[index]

  const startSRS = useCallback(() => {
    const due = getDueItems(filterCat === 'all' ? undefined : filterCat, 20)
    if (!due.length) return
    startStudySession()
    setQueue(due)
    setIndex(0)
    setSessionRatings([])
    setPhase('question')
  }, [filterCat, getDueItems, startStudySession])

  const startFlashcard = useCallback(() => {
    const shuffled = shuffle(allItems).slice(0, 20)
    if (!shuffled.length) return
    startStudySession()
    setQueue(shuffled)
    setIndex(0)
    setSessionRatings([])
    setTyped('')
    setPhase('question')
  }, [allItems, startStudySession])

  const advance = useCallback(
    (rating: SRSRating) => {
      if (!current) return
      rateReview(current.id, rating)
      setSessionRatings((r) => [...r, rating])
      setTyped('')
      if (index + 1 < queue.length) {
        setIndex((i) => i + 1)
        setPhase('question')
      } else {
        setPhase('done')
      }
    },
    [current, index, queue.length, rateReview]
  )

  const reveal = useCallback(() => setPhase('answer'), [])

  const resetToIdle = useCallback(() => setPhase('idle'), [])

  const restart = useCallback(() => {
    if (practiceMode === 'srs') startSRS()
    else startFlashcard()
  }, [practiceMode, startSRS, startFlashcard])

  useEffect(() => {
    if (phase !== 'question' && phase !== 'answer') return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === ' ' || e.key === 'Enter') {
        if (phase === 'question') {
          e.preventDefault()
          reveal()
        }
        return
      }

      if (phase !== 'answer') return

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
  }, [phase, practiceMode, reveal, advance])

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
    startSRS,
    startFlashcard,
    advance,
    reveal,
    resetToIdle,
    restart,
  }
}
