import { useNavigate } from 'react-router-dom'
import { RATING_BUTTONS, PRACTICE_CAT_OPTIONS } from '@/constants/srs'
import type { ItemCategory } from '@/types'
import type { PracticeMode, Direction } from '@/hooks/usePracticeSession'
import type { LearningItem } from '@/types'

interface Props {
  practiceMode: PracticeMode
  setPracticeMode: (mode: PracticeMode) => void
  direction: Direction
  setDirection: (dir: Direction) => void
  filterCat: ItemCategory | 'all'
  setFilterCat: (cat: ItemCategory | 'all') => void
  dueItems: LearningItem[]
  allItems: LearningItem[]
  onStartSRS: () => void
  onStartFlashcard: () => void
  autoPlayAudio: boolean
  setAutoPlayAudio: (v: boolean) => void
}

export default function PracticeIdle({
  practiceMode,
  setPracticeMode,
  direction,
  setDirection,
  filterCat,
  setFilterCat,
  dueItems,
  allItems,
  onStartSRS,
  onStartFlashcard,
  autoPlayAudio,
  setAutoPlayAudio,
}: Props) {
  const navigate = useNavigate()

  return (
    <div className="page-screen">
      <div className="scroll-area flex-1 min-h-0 px-6 pt-4 pb-2">
      <div className="flex flex-col gap-3 items-center max-w-sm mx-auto w-full">
      <h1 className="text-2xl font-bold text-white">Üben</h1>

      <div className="flex rounded-xl overflow-hidden border border-white/10 w-full max-w-xs">
        <button
          type="button"
          onClick={() => setPracticeMode('srs')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${practiceMode === 'srs' ? 'bg-indigo-600 text-white' : 'text-white/40'}`}
        >
          🗓 SRS Wiederholung
        </button>
        <button
          type="button"
          onClick={() => setPracticeMode('flashcard')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${practiceMode === 'flashcard' ? 'bg-indigo-600 text-white' : 'text-white/40'}`}
        >
          🃏 Karteikarten
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center w-full max-w-xs">
        {PRACTICE_CAT_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilterCat(key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterCat === key ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex rounded-xl overflow-hidden border border-white/10 w-full max-w-xs">
        <button
          type="button"
          onClick={() => setDirection('jp-de')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${direction === 'jp-de' ? 'bg-white/15 text-white' : 'text-white/40'}`}
        >
          🇯🇵 → 🇩🇪
        </button>
        <button
          type="button"
          onClick={() => setDirection('de-jp')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${direction === 'de-jp' ? 'bg-white/15 text-white' : 'text-white/40'}`}
        >
          🇩🇪 → 🇯🇵
        </button>
      </div>

      {practiceMode === 'srs' ? (
        <>
          <div className="text-center">
            <p className="text-white/60 text-sm">
              <span className="text-white font-semibold">{dueItems.filter((i) => i.repetitions > 0).length}</span> fällig ·{' '}
              <span className="text-indigo-300 font-semibold">{dueItems.filter((i) => i.repetitions === 0).length}</span> neu
            </p>
          </div>
          {dueItems.length > 0 ? (
            <button
              type="button"
              onClick={onStartSRS}
              className="w-full max-w-xs py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg active:scale-[0.97] transition-transform"
            >
              Starten ({Math.min(dueItems.length, 20)}) →
            </button>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-2" aria-hidden="true">🎉</div>
              <p className="text-white/60 text-sm">Alle Karten für heute erledigt!</p>
              <button type="button" onClick={() => navigate('/learn')} className="mt-3 text-indigo-400 text-sm underline">
                Neue Zeichen lernen
              </button>
            </div>
          )}
          <div className="w-full max-w-xs">
            <p className="text-white/20 text-xs text-center mb-2">Bewertungsskala (SM-2) · Tasten 1–4</p>
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
          <button
            type="button"
            onClick={onStartFlashcard}
            className="w-full max-w-xs py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg active:scale-[0.97] transition-transform"
          >
            Starten (20 zufällig) →
          </button>
        </>
      )}

      {/* Lernoptionen */}
      <div className="w-full max-w-xs mt-2 pt-3 border-t border-white/10">
        <p className="text-white/30 text-xs text-center mb-2">Optionen</p>
        <label className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/5 cursor-pointer">
          <span className="text-sm text-white/70">Auto-Wiedergabe bei neuer Karte</span>
          <input
            type="checkbox"
            checked={autoPlayAudio}
            onChange={(e) => setAutoPlayAudio(e.target.checked)}
            className="accent-indigo-500 w-4 h-4"
          />
        </label>
      </div>
      </div>
      </div>
    </div>
  )
}
