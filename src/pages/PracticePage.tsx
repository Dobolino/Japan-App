import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { LearningItem, SRSRating, ItemCategory } from '../types'

type Phase = 'idle' | 'question' | 'answer' | 'done'
type Mode = 'jp-de' | 'de-jp'

// SM-2 rating button config
const RATING_BUTTONS: { rating: SRSRating; label: string; sub: string; color: string }[] = [
  { rating: 0, label: 'Nochmal',  sub: '<1 min',   color: 'bg-red-500/20 text-red-300 border-red-500/20' },
  { rating: 1, label: 'Schwer',   sub: '<1 Tag',   color: 'bg-orange-500/20 text-orange-300 border-orange-500/20' },
  { rating: 2, label: 'Gut',      sub: '~4 Tage',  color: 'bg-blue-500/20 text-blue-300 border-blue-500/20' },
  { rating: 3, label: 'Einfach',  sub: '>7 Tage',  color: 'bg-green-500/20 text-green-300 border-green-500/20' },
]

const CATEGORY_OPTIONS: { key: ItemCategory | 'all'; label: string }[] = [
  { key: 'all',      label: 'Alle' },
  { key: 'hiragana', label: 'Hiragana' },
  { key: 'katakana', label: 'Katakana' },
]

export default function PracticePage() {
  const navigate = useNavigate()
  const { getDueItems, rateReview, items } = useStore()
  const [phase, setPhase] = useState<Phase>('idle')
  const [mode, setMode] = useState<Mode>('jp-de')
  const [filterCat, setFilterCat] = useState<ItemCategory | 'all'>('all')
  const [queue, setQueue] = useState<LearningItem[]>([])
  const [index, setIndex] = useState(0)
  const [sessionRatings, setSessionRatings] = useState<SRSRating[]>([])

  const dueItems = useMemo(
    () => getDueItems(filterCat === 'all' ? undefined : filterCat, 999),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterCat, items]
  )
  const dueCount = dueItems.length

  const start = () => {
    const due = getDueItems(filterCat === 'all' ? undefined : filterCat, 20)
    if (due.length === 0) return
    setQueue(due)
    setIndex(0)
    setSessionRatings([])
    setPhase('question')
  }

  const current = queue[index]

  const answer = (rating: SRSRating) => {
    rateReview(current.id, rating)
    setSessionRatings((r) => [...r, rating])

    if (index + 1 < queue.length) {
      setIndex((i) => i + 1)
      setPhase('question')
    } else {
      setPhase('done')
    }
  }

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    speechSynthesis.speak(u)
  }

  // ── Idle ────────────────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Wiederholung</h1>
          <p className="text-white/40 text-sm">{dueCount} Karten fällig</p>
        </div>

        {/* Category filter */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 w-full max-w-xs">
          {CATEGORY_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterCat(key)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                filterCat === key ? 'bg-indigo-600 text-white' : 'text-white/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mode selector */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 w-full max-w-xs">
          <button
            onClick={() => setMode('jp-de')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'jp-de' ? 'bg-white/15 text-white' : 'text-white/40'}`}
          >
            JP → DE
          </button>
          <button
            onClick={() => setMode('de-jp')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'de-jp' ? 'bg-white/15 text-white' : 'text-white/40'}`}
          >
            DE → JP
          </button>
        </div>

        {dueCount > 0 ? (
          <button
            onClick={start}
            className="w-full max-w-xs py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg active:scale-[0.97] transition-transform"
          >
            Starten ({Math.min(dueCount, 20)} Karten) →
          </button>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-white/60 text-sm">Alle Karten für heute erledigt!</p>
            <button onClick={() => navigate('/learn')} className="mt-4 text-indigo-400 text-sm underline">
              Neue Zeichen lernen
            </button>
          </div>
        )}

        {/* SM-2 legend */}
        <div className="w-full max-w-xs">
          <p className="text-white/20 text-xs text-center mb-2">Bewertungsskala (SM-2)</p>
          <div className="grid grid-cols-4 gap-1">
            {RATING_BUTTONS.map(({ label, sub, color }) => (
              <div key={label} className={`rounded-lg p-1.5 border text-center ${color}`}>
                <div className="text-xs font-medium">{label}</div>
                <div className="text-[9px] opacity-70">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Done ────────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const correct = sessionRatings.filter((r) => r >= 2).length
    const total = sessionRatings.length
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<SRSRating, number>
    sessionRatings.forEach((r) => counts[r]++)

    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-5 text-center">
        <div className="text-5xl">{pct >= 70 ? '🌟' : pct >= 40 ? '👍' : '💪'}</div>
        <h1 className="text-2xl font-bold text-white">Sitzung beendet</h1>
        <div className="text-4xl font-bold text-white">{pct}%</div>

        {/* Rating breakdown */}
        <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
          {RATING_BUTTONS.map(({ rating, label, color }) => (
            <div key={rating} className={`rounded-xl p-2 border ${color}`}>
              <div className="text-xl font-bold">{counts[rating]}</div>
              <div className="text-[10px]">{label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setPhase('idle')}
            className="px-5 py-3 rounded-2xl bg-white/10 text-white text-sm font-medium active:scale-95"
          >
            Zurück
          </button>
          <button
            onClick={start}
            className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-medium active:scale-95"
          >
            Nochmal
          </button>
        </div>
      </div>
    )
  }

  // ── Question / Answer ────────────────────────────────────────────────────────
  const front = mode === 'jp-de' ? current.character : current.romaji
  const answerText = mode === 'jp-de' ? current.romaji : current.character

  return (
    <div className="flex flex-col h-full px-4">
      {/* Progress bar */}
      <div className="pt-4 pb-2">
        <div className="flex justify-between text-xs text-white/30 mb-1">
          <span>{index + 1} / {queue.length}</span>
          <span className="capitalize">{current.category}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${(index / queue.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <div className="w-full rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col items-center gap-3 min-h-[220px] justify-center">
          {/* SRS status chip */}
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
            current.status === 'new' ? 'text-white/40 border-white/20' :
            current.status === 'learning' ? 'text-blue-300 border-blue-500/30' :
            current.status === 'uncertain' ? 'text-yellow-300 border-yellow-500/30' :
            'text-green-300 border-green-500/30'
          }`}>
            {current.status === 'new' ? 'Neu' : current.status === 'learning' ? 'Lernen' : current.status === 'uncertain' ? 'Unsicher' : 'Beherrscht'}
          </span>

          <div className="text-7xl leading-none">{front}</div>

          {mode === 'jp-de' && (
            <button onClick={() => speak(current.character)} className="text-white/30 text-sm">
              🔊 Anhören
            </button>
          )}

          {phase === 'answer' && (
            <div className="text-center mt-2 border-t border-white/10 pt-4 w-full space-y-1">
              <div className="text-2xl text-white">{answerText}</div>
              {current.exampleWord && (
                <div className="text-sm text-white/50">
                  {current.exampleWord} — {current.exampleMeaning}
                </div>
              )}
              {/* interval preview */}
              <div className="text-xs text-white/25 mt-1">
                Letztes Intervall: {current.interval} Tag{current.interval !== 1 ? 'e' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        {phase === 'question' ? (
          <button
            onClick={() => setPhase('answer')}
            className="w-full py-4 rounded-2xl bg-white/10 text-white font-semibold text-lg active:scale-[0.97]"
          >
            Aufdecken
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-2 w-full">
            {RATING_BUTTONS.map(({ rating, label, sub, color }) => (
              <button
                key={rating}
                onClick={() => answer(rating)}
                className={`py-3 rounded-2xl border font-medium active:scale-95 transition-transform ${color}`}
              >
                <div className="text-sm">{label}</div>
                <div className="text-[10px] opacity-60">{sub}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
