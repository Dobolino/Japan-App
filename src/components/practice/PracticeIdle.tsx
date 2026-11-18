import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import { ArrowIcon } from '@/components/icons/UiIcons'
import { unlockAudio } from '@/utils/audio'
import type { ItemCategory, LearningItem } from '@/types'
import type { Direction } from '@/hooks/usePracticeSession'
interface Props {
  canStartSrs: boolean
  direction: Direction
  setDirection: (dir: Direction) => void
  filterCat: ItemCategory | 'all'
  setFilterCat: (cat: ItemCategory | 'all') => void
  allItems: LearningItem[]
  onStartSRS: () => void
  onStartFlashcard: () => void
  autoPlayAudio: boolean
  setAutoPlayAudio: (v: boolean) => void
}
const categories = [
  ['all', 'Alles'],
  ['hiragana', 'Hiragana'],
  ['katakana', 'Katakana'],
  ['kanji', 'Kanji'],
  ['vocabulary', 'Vokabeln'],
] as const
export default function PracticeIdle({
  canStartSrs,
  direction,
  setDirection,
  filterCat,
  setFilterCat,
  allItems,
  onStartSRS,
  onStartFlashcard,
  autoPlayAudio,
  setAutoPlayAudio,
}: Props) {
  const [advanced, setAdvanced] = useState(false)
  return (
    <div className="scroll-area h-full">
      <div className="page-width practice-setup">
        <Link to="/explore" className="text-link mb-3">
          ← Entdecken
        </Link>
        <PageHeader eyebrow="MIT WIEDERHOLUNG WIRD ES VERTRAUT" title="Dein Wissen bleibt." />
        <section className="card-surface practice-overview">
          <h2>{canStartSrs ? 'Bereit für eine kleine Runde?' : 'Alles auf dem aktuellen Stand.'}</h2>
          <p>
            {canStartSrs
              ? 'Bis zu 20 eingeführte Inhalte. Schwierige Karten kommen noch einmal.'
              : 'Entdecke neue Inhalte im Kurs oder übe frei.'}
          </p>
          {canStartSrs ? (
            <button
              type="button"
              className="btn-duo button-with-icon"
              onClick={() => {
                unlockAudio()
                onStartSRS()
              }}
            >
              Wiederholung starten <ArrowIcon />
            </button>
          ) : (
            <Link to="/course" className="btn-duo button-with-icon">
              Nächste Lektion finden <ArrowIcon />
            </Link>
          )}
          <div className="practice-options">
            <button
              type="button"
              className="text-link"
              aria-expanded={advanced}
              aria-controls="practice-options"
              onClick={() => setAdvanced(!advanced)}
            >
              Übung anpassen {advanced ? '−' : '+'}
            </button>
            {advanced && (
              <div id="practice-options" className="practice-options-panel">
                <div className="mode-picker" role="group" aria-label="Übungsrichtung">
                  <button
                    type="button"
                    className="mode-choice"
                    aria-pressed={direction === 'de-jp'}
                    onClick={() => setDirection('de-jp')}
                  >
                    <strong>Antwort eingeben</strong>
                    <span>Deutsch → Japanisch oder Romaji</span>
                  </button>
                  <button
                    type="button"
                    className="mode-choice"
                    aria-pressed={direction === 'jp-de'}
                    onClick={() => setDirection('jp-de')}
                  >
                    <strong>Karte aufdecken</strong>
                    <span>Japanisch → Deutsch</span>
                  </button>
                </div>
                <p className="eyebrow mb-3">Lernbereich</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Lernbereich für die Übung">
                  {categories.map(([key, label]) => (
                    <button
                      type="button"
                      key={key}
                      aria-pressed={filterCat === key}
                      onClick={() => setFilterCat(key)}
                      className={`chip ${filterCat === key ? 'chip--active' : ''}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <label className="settings-toggle mt-3">
                  <div>
                    <strong>Automatisch vorlesen</strong>
                    <span>Im Modus „Karte aufdecken“.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoPlayAudio}
                    onChange={(event) => setAutoPlayAudio(event.target.checked)}
                  />
                </label>
              </div>
            )}
          </div>
        </section>
        <details className="card-surface practice-overview practice-extra">
          <summary className="font-bold cursor-pointer">Lieber frei üben?</summary>
          <p>Eine zufällige Auswahl. Deine Bewertungen zählen zum Lernfortschritt.</p>
          <button
            type="button"
            disabled={!allItems.length}
            className="btn-duo btn-duo--outline"
            onClick={() => {
              unlockAudio()
              onStartFlashcard()
            }}
          >
            Freies Üben starten
          </button>
        </details>
      </div>
    </div>
  )
}
