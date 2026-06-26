import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { LearningItem, SRSRating, ItemCategory } from '../types'
import { playJapanese } from '../utils/audio'

type Phase = 'idle' | 'question' | 'answer' | 'done'
type Direction = 'jp-de' | 'de-jp'
type PracticeMode = 'srs' | 'flashcard'

const RATING_BUTTONS: { rating: SRSRating; label: string; sub: string; color: string }[] = [
  { rating: 0, label: 'Nochmal',  sub: '<1 min',   color: 'bg-red-500/20 text-red-300 border-red-500/20' },
  { rating: 1, label: 'Schwer',   sub: '<1 Tag',   color: 'bg-orange-500/20 text-orange-300 border-orange-500/20' },
  { rating: 2, label: 'Gut',      sub: '~4 Tage',  color: 'bg-blue-500/20 text-blue-300 border-blue-500/20' },
  { rating: 3, label: 'Einfach',  sub: '>7 Tage',  color: 'bg-green-500/20 text-green-300 border-green-500/20' },
]

const CAT_OPTIONS: { key: ItemCategory | 'all'; label: string }[] = [
  { key: 'all',        label: 'Alle' },
  { key: 'hiragana',   label: 'Hiragana' },
  { key: 'katakana',   label: 'Katakana' },
  { key: 'kanji',      label: 'Kanji' },
  { key: 'vocabulary', label: 'Vokabeln' },
]

export default function PracticePage() {
  const navigate = useNavigate()
  const { getDueItems, rateReview, items } = useStore()

  const [practiceMode, setPracticeMode] = useState<PracticeMode>('srs')
  const [phase, setPhase] = useState<Phase>('idle')
  const [direction, setDirection] = useState<Direction>('jp-de')
  const [filterCat, setFilterCat] = useState<ItemCategory | 'all'>('all')
  const [queue, setQueue] = useState<LearningItem[]>([])
  const [index, setIndex] = useState(0)
  const [sessionRatings, setSessionRatings] = useState<SRSRating[]>([])
  const [typed, setTyped] = useState('')

  const dueItems = useMemo(
    () => getDueItems(filterCat === 'all' ? undefined : filterCat, 999),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterCat, items]
  )

  const allItems = useMemo(() => {
    const all = Object.values(items)
    return filterCat === 'all' ? all : all.filter(i => i.category === filterCat)
  }, [filterCat, items])

  const startSRS = () => {
    const due = getDueItems(filterCat === 'all' ? undefined : filterCat, 20)
    if (!due.length) return
    setQueue(due); setIndex(0); setSessionRatings([]); setPhase('question')
  }

  const startFlashcard = () => {
    const shuffled = [...allItems].sort(() => Math.random() - 0.5).slice(0, 20)
    if (!shuffled.length) return
    setQueue(shuffled); setIndex(0); setSessionRatings([]); setTyped(''); setPhase('question')
  }

  const current = queue[index]

  const answerSRS = (rating: SRSRating) => {
    rateReview(current.id, rating)
    setSessionRatings(r => [...r, rating])
    if (index + 1 < queue.length) { setIndex(i => i + 1); setPhase('question') }
    else setPhase('done')
  }

  const nextFlashcard = (rating: SRSRating) => {
    rateReview(current.id, rating)
    setSessionRatings(r => [...r, rating])
    setTyped('')
    if (index + 1 < queue.length) { setIndex(i => i + 1); setPhase('question') }
    else setPhase('done')
  }

  const reveal = () => { setPhase('answer') }

  // ── Idle ────────────────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-4">
        <h1 className="text-2xl font-bold text-white">Üben</h1>

        {/* Mode switcher */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 w-full max-w-xs">
          <button onClick={() => setPracticeMode('srs')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${practiceMode === 'srs' ? 'bg-indigo-600 text-white' : 'text-white/40'}`}>
            🗓 SRS Wiederholung
          </button>
          <button onClick={() => setPracticeMode('flashcard')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${practiceMode === 'flashcard' ? 'bg-indigo-600 text-white' : 'text-white/40'}`}>
            🃏 Karteikarten
          </button>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center w-full max-w-xs">
          {CAT_OPTIONS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilterCat(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCat === key ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/50'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Direction (both modes) */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 w-full max-w-xs">
          <button onClick={() => setDirection('jp-de')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${direction === 'jp-de' ? 'bg-white/15 text-white' : 'text-white/40'}`}>
            🇯🇵 → 🇩🇪
          </button>
          <button onClick={() => setDirection('de-jp')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${direction === 'de-jp' ? 'bg-white/15 text-white' : 'text-white/40'}`}>
            🇩🇪 → 🇯🇵
          </button>
        </div>

        {practiceMode === 'srs' ? (
          <>
            <p className="text-white/40 text-sm">{dueItems.length} Karten fällig</p>
            {dueItems.length > 0 ? (
              <button onClick={startSRS}
                className="w-full max-w-xs py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg active:scale-[0.97] transition-transform">
                Starten ({Math.min(dueItems.length, 20)}) →
              </button>
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-white/60 text-sm">Alle Karten für heute erledigt!</p>
                <button onClick={() => navigate('/learn')} className="mt-3 text-indigo-400 text-sm underline">Neue Zeichen lernen</button>
              </div>
            )}
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
          </>
        ) : (
          <>
            <p className="text-white/40 text-sm">{allItems.length} Karten verfügbar</p>
            <button onClick={startFlashcard}
              className="w-full max-w-xs py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg active:scale-[0.97] transition-transform">
              Starten (20 zufällig) →
            </button>
          </>
        )}
      </div>
    )
  }

  // ── Done ────────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const correct = sessionRatings.filter(r => r >= 2).length
    const pct = sessionRatings.length > 0 ? Math.round((correct / sessionRatings.length) * 100) : 0
    const counts = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<SRSRating, number>
    sessionRatings.forEach(r => counts[r]++)
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-5 text-center">
        <div className="text-5xl">{pct >= 70 ? '🌟' : pct >= 40 ? '👍' : '💪'}</div>
        <h1 className="text-2xl font-bold text-white">Sitzung beendet</h1>
        <div className="text-4xl font-bold text-white">{pct}%</div>
        <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
          {RATING_BUTTONS.map(({ rating, label, color }) => (
            <div key={rating} className={`rounded-xl p-2 border ${color}`}>
              <div className="text-xl font-bold">{counts[rating]}</div>
              <div className="text-[10px]">{label}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPhase('idle')} className="px-5 py-3 rounded-2xl bg-white/10 text-white text-sm font-medium active:scale-95">Zurück</button>
          <button onClick={practiceMode === 'srs' ? startSRS : startFlashcard}
            className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-medium active:scale-95">Nochmal</button>
        </div>
      </div>
    )
  }

  // ── Card ────────────────────────────────────────────────────────────────────
  const front = direction === 'jp-de' ? current.character : current.meaning
  const back  = direction === 'jp-de' ? current.meaning   : current.character
  const backSub = direction === 'jp-de' ? current.romaji : current.romaji

  return (
    <div className="flex flex-col h-full px-4">
      {/* Progress */}
      <div className="pt-4 pb-2">
        <div className="flex justify-between text-xs text-white/30 mb-1">
          <span>{index + 1} / {queue.length}</span>
          <span>{practiceMode === 'srs' ? 'SRS' : '🃏 Karteikarten'} · {direction === 'jp-de' ? 'JP→DE' : 'DE→JP'}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${(index / queue.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {/* Card */}
        <div className="w-full rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col items-center gap-3 min-h-[220px] justify-center">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
            current.status === 'new' ? 'text-white/40 border-white/20' :
            current.status === 'learning' ? 'text-blue-300 border-blue-500/30' :
            current.status === 'uncertain' ? 'text-yellow-300 border-yellow-500/30' :
            'text-green-300 border-green-500/30'
          }`}>
            {current.status === 'new' ? 'Neu' : current.status === 'learning' ? 'Lernen' : current.status === 'uncertain' ? 'Unsicher' : 'Beherrscht'}
          </span>

          <div className={`${direction === 'jp-de' ? 'text-7xl' : 'text-2xl'} leading-none text-center`}>{front}</div>

          {direction === 'jp-de' && (
            <button onClick={() => playJapanese(current.id, current.character)} className="text-white/30 text-sm">
              🔊 Anhören
            </button>
          )}

          {phase === 'answer' && (
            <div className="text-center mt-2 border-t border-white/10 pt-4 w-full space-y-1">
              <div className={`${direction === 'de-jp' ? 'text-5xl' : 'text-2xl'} text-white`}>{back}</div>
              {backSub && direction === 'de-jp' && <div className="text-sm text-white/40">{backSub}</div>}
              {direction === 'jp-de' && current.exampleWord && (
                <div className="text-sm text-white/50">{current.exampleWord} — {current.exampleMeaning}</div>
              )}
              {direction === 'de-jp' && (
                <button onClick={() => playJapanese(current.id, current.character)} className="text-white/30 text-sm">
                  🔊 Anhören
                </button>
              )}
            </div>
          )}
        </div>

        {/* Optional typing input (flashcard mode, DE→JP) */}
        {practiceMode === 'flashcard' && direction === 'de-jp' && phase === 'question' && (
          <div className="w-full flex gap-2">
            <input
              type="text"
              value={typed}
              onChange={e => setTyped(e.target.value)}
              placeholder="Auf Japanisch tippen (optional)..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/20 outline-none focus:border-indigo-500"
            />
          </div>
        )}
        {practiceMode === 'flashcard' && direction === 'de-jp' && phase === 'answer' && typed && (
          <div className={`w-full rounded-xl p-3 text-sm text-center ${
            typed.trim() === current.character ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {typed.trim() === current.character ? '✓ Richtig!' : `Deine Antwort: ${typed} — Richtig: ${current.character}`}
          </div>
        )}

        {/* Buttons */}
        {phase === 'question' ? (
          <button onClick={reveal}
            className="w-full py-4 rounded-2xl bg-white/10 text-white font-semibold text-lg active:scale-[0.97]">
            Aufdecken
          </button>
        ) : practiceMode === 'srs' ? (
          <div className="grid grid-cols-4 gap-2 w-full">
            {RATING_BUTTONS.map(({ rating, label, sub, color }) => (
              <button key={rating} onClick={() => answerSRS(rating)}
                className={`py-3 rounded-2xl border font-medium active:scale-95 transition-transform ${color}`}>
                <div className="text-sm">{label}</div>
                <div className="text-[10px] opacity-60">{sub}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 w-full">
            <button onClick={() => nextFlashcard(0)}
              className="py-3 rounded-2xl bg-red-500/20 text-red-300 border border-red-500/20 font-medium active:scale-95">
              ✗ Nochmal
            </button>
            <button onClick={() => nextFlashcard(3)}
              className="py-3 rounded-2xl bg-green-500/20 text-green-300 border border-green-500/20 font-medium active:scale-95">
              ✓ Gewusst
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
