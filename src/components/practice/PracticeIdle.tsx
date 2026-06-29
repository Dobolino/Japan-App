import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
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

const CAT_OPTIONS: { key: ItemCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Alles' },
  { key: 'hiragana', label: 'Hiragana' },
  { key: 'katakana', label: 'Katakana' },
  { key: 'kanji', label: 'Kanji' },
  { key: 'vocabulary', label: 'Vokabeln' },
]

export default function PracticeIdle({
  practiceMode,
  setPracticeMode,
  direction,
  setDirection,
  filterCat,
  setFilterCat,
  dueItems,
  onStartSRS,
  onStartFlashcard,
  autoPlayAudio,
  setAutoPlayAudio,
}: Props) {
  const navigate = useNavigate()
  const getDueGrammarCount = useStore((s) => s.getDueGrammarCount)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const dueGrammar = getDueGrammarCount()
  const dueReview = dueItems.filter((i) => i.repetitions > 0).length
  const dueNew = dueItems.filter((i) => i.repetitions === 0).length
  const totalDue = dueItems.length + dueGrammar

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
        <div className="flex flex-col gap-4 items-center max-w-sm mx-auto w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Wiederholen</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1 font-semibold">
              Tippe die Antwort auf Japanisch — Wort, Satz oder Grammatik
            </p>
          </div>

          <div className="card-surface w-full p-4 text-center">
            <p className="text-[var(--text-secondary)] text-sm">
              <span className="font-bold text-[var(--text-primary)]">{dueReview}</span> fällig ·{' '}
              <span className="font-bold text-[var(--blue)]">{dueNew}</span> neu
              {dueGrammar > 0 && (
                <>
                  {' '}
                  · <span className="font-bold text-[var(--orange)]">{dueGrammar}</span> Grammatik
                </>
              )}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1">Inkl. Beispiel- & Grammatiksätze</p>
          </div>

          {totalDue > 0 ? (
            <button type="button" onClick={startSRS} className="btn-duo">
              Tageslektion · {Math.min(totalDue, 20)} Karten
            </button>
          ) : (
            <div className="card-surface w-full p-4 text-center">
              <div className="text-4xl mb-2" aria-hidden="true">🎉</div>
              <p className="text-[var(--text-secondary)] text-sm font-semibold">Alles erledigt!</p>
              <button type="button" onClick={() => navigate('/learn')} className="mt-3 text-[var(--blue)] text-sm font-bold underline">
                Neues lernen
              </button>
            </div>
          )}

          <button type="button" onClick={startFlashcard} className="btn-duo btn-duo--outline btn-duo--sm">
            Freies Üben · 20 Karten
          </button>

          <button
            type="button"
            onClick={() => setAdvancedOpen((o) => !o)}
            className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider"
          >
            {advancedOpen ? '▲ Weniger Optionen' : '▼ Erweiterte Optionen'}
          </button>

          {advancedOpen && (
            <div className="w-full space-y-3 card-surface p-3">
              <div className="flex flex-wrap gap-2 justify-center">
                {CAT_OPTIONS.map(({ key, label }) => (
                  <button key={key} type="button" onClick={() => setFilterCat(key)} className={`chip ${filterCat === key ? 'chip--active' : ''}`}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('de-jp')}
                  className={`flex-1 chip ${direction === 'de-jp' ? 'chip--green' : ''}`}
                >
                  🇩🇪 → 🇯🇵 Produktion
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('jp-de')}
                  className={`flex-1 chip ${direction === 'jp-de' ? 'chip--active' : ''}`}
                >
                  🇯🇵 → 🇩🇪 Erkennen
                </button>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setPracticeMode('srs')} className={`flex-1 chip ${practiceMode === 'srs' ? 'chip--active' : ''}`}>
                  SRS
                </button>
                <button type="button" onClick={() => setPracticeMode('flashcard')} className={`flex-1 chip ${practiceMode === 'flashcard' ? 'chip--active' : ''}`}>
                  Karteikarten
                </button>
              </div>

              <label className="flex items-center justify-between py-1 cursor-pointer">
                <span className="text-sm font-semibold text-[var(--text-secondary)]">Audio (Erkennen-Modus)</span>
                <input type="checkbox" checked={autoPlayAudio} onChange={(e) => setAutoPlayAudio(e.target.checked)} className="accent-[var(--green)] w-5 h-5" />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
