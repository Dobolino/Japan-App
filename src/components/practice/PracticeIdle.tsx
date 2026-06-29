import { useNavigate } from 'react-router-dom'
import { RATING_BUTTONS, PRACTICE_CAT_OPTIONS } from '@/constants/srs'
import { unlockAudio } from '@/utils/audio'
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

  const startSRS = () => {
    unlockAudio()
    onStartSRS()
  }

  const startFlashcard = () => {
    unlockAudio()
    onStartFlashcard()
  }

  return (
    <div className="page-screen">
      <div className="scroll-area flex-1 min-h-0 px-4 pt-4 pb-2">
        <div className="flex flex-col gap-3 items-center max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Üben</h1>

          <div className="card-surface flex w-full max-w-xs overflow-hidden p-1">
            <button
              type="button"
              onClick={() => setPracticeMode('srs')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors ${practiceMode === 'srs' ? 'chip--active bg-[var(--blue)] text-white' : 'text-[var(--text-muted)]'}`}
            >
              SRS
            </button>
            <button
              type="button"
              onClick={() => setPracticeMode('flashcard')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-colors ${practiceMode === 'flashcard' ? 'chip--active bg-[var(--blue)] text-white' : 'text-[var(--text-muted)]'}`}
            >
              Karteikarten
            </button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center w-full max-w-xs">
            {PRACTICE_CAT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilterCat(key)}
                className={`chip ${filterCat === key ? 'chip--active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="card-surface flex w-full max-w-xs overflow-hidden p-1">
            <button
              type="button"
              onClick={() => setDirection('jp-de')}
              className={`flex-1 py-2 text-sm font-bold rounded-xl ${direction === 'jp-de' ? 'bg-[#ddf4ff] text-[var(--blue)]' : 'text-[var(--text-muted)]'}`}
            >
              🇯🇵 → 🇩🇪
            </button>
            <button
              type="button"
              onClick={() => setDirection('de-jp')}
              className={`flex-1 py-2 text-sm font-bold rounded-xl ${direction === 'de-jp' ? 'bg-[#ddf4ff] text-[var(--blue)]' : 'text-[var(--text-muted)]'}`}
            >
              🇩🇪 → 🇯🇵
            </button>
          </div>

          {practiceMode === 'srs' ? (
            <>
              <div className="text-center">
                <p className="text-[var(--text-secondary)] text-sm">
                  <span className="font-bold text-[var(--text-primary)]">{dueItems.filter((i) => i.repetitions > 0).length}</span> fällig ·{' '}
                  <span className="font-bold text-[var(--blue)]">{dueItems.filter((i) => i.repetitions === 0).length}</span> neu
                </p>
              </div>
              {dueItems.length > 0 ? (
                <button type="button" onClick={startSRS} className="btn-duo max-w-xs">
                  Starten · {Math.min(dueItems.length, 20)} Karten
                </button>
              ) : (
                <div className="text-center card-surface p-4 w-full max-w-xs">
                  <div className="text-4xl mb-2" aria-hidden="true">🎉</div>
                  <p className="text-[var(--text-secondary)] text-sm font-semibold">Alles erledigt für heute!</p>
                  <button type="button" onClick={() => navigate('/learn')} className="mt-3 text-[var(--blue)] text-sm font-bold underline">
                    Neues lernen
                  </button>
                </div>
              )}
              <div className="w-full max-w-xs">
                <p className="text-[var(--text-muted)] text-xs text-center mb-2 font-semibold">Bewertung · Tasten 1–4</p>
                <div className="grid grid-cols-4 gap-1">
                  {RATING_BUTTONS.map(({ label, sub, color }) => (
                    <div key={label} className={`rounded-xl p-1.5 border-2 text-center text-xs font-bold ${color}`}>
                      <div>{label}</div>
                      <div className="text-[9px] opacity-70 font-normal">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-[var(--text-secondary)] text-sm font-semibold">{allItems.length} Karten verfügbar</p>
              <button type="button" onClick={startFlashcard} className="btn-duo max-w-xs">
                Starten · 20 Karten
              </button>
            </>
          )}

          <div className="w-full max-w-xs mt-2 pt-3 border-t-2 border-[var(--border)]">
            <label className="flex items-center justify-between py-2 px-3 card-surface cursor-pointer">
              <span className="text-sm font-semibold text-[var(--text-secondary)]">Auto-Aussprache</span>
              <input
                type="checkbox"
                checked={autoPlayAudio}
                onChange={(e) => setAutoPlayAudio(e.target.checked)}
                className="accent-[var(--green)] w-5 h-5"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
