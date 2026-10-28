import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { unlockAudio } from '@/utils/audio'
import { reviewCounts } from '@/utils/reviewCounts'
import PageHeader from '@/components/PageHeader'
import { ArrowIcon } from '@/components/icons/UiIcons'
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

const CAT_OPTIONS: { key: ItemCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Alles' },
  { key: 'hiragana', label: 'Hiragana' },
  { key: 'katakana', label: 'Katakana' },
  { key: 'kanji', label: 'Kanji' },
  { key: 'vocabulary', label: 'Vokabeln' },
]

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
  const { grammarSrs, exampleSrs, introducedIds, introducedGrammarIds, items } = useStore()
  const pinnedIds = useStore((s) => s.pinnedReviewIds)
  const pinnedCount = allItems.filter((item) => pinnedIds.includes(item.id)).length
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const grammar = filterCat === 'all' ? Object.values(grammarSrs) : []
  const eligible = allItems.filter((item) => item.lastReviewDate || introducedIds.includes(item.id))
  const eligibleGrammar = grammar.filter(
    (item) => item.lastReviewDate || introducedGrammarIds.includes(item.grammarId)
  )
  const examples = Object.entries(exampleSrs)
    .filter(([id]) => filterCat === 'all' || items[id.slice(0, -3)]?.category === filterCat)
    .map(([, schedule]) => schedule)
  const { due, fresh } = reviewCounts([...eligible, ...eligibleGrammar, ...examples])

  return (
    <div className="scroll-area h-full">
      <div className="page-width practice-setup">
        <PageHeader
          eyebrow="ÜBUNG MACHT VERTRAUT"
          title="Festige, was du lernst."
          description="Wiederhole Bekanntes und lerne Neues in kleinen Portionen."
        />
        <section className="card-surface practice-overview" aria-labelledby="practice-title">
          <h2 id="practice-title">Deine Tageslektion</h2>
          <p>
            Eine Mischung aus neuen Inhalten und Wiederholungen. Bereits geübte Karten bleiben gespeichert.
          </p>
          <div className="practice-counts">
            <div>
              <strong>{due}</strong>
              <span>Wiederholungen fällig</span>
            </div>
            <div>
              <strong>{fresh}</strong>
              <span>neu eingeführte Inhalte</span>
            </div>
          </div>
          <p className="eyebrow">Wie möchtest du üben?</p>
          <div className="mode-picker" role="group" aria-label="Übungsrichtung">
            <button
              type="button"
              className="mode-choice"
              aria-pressed={direction === 'de-jp'}
              onClick={() => setDirection('de-jp')}
            >
              <strong>Antwort eingeben</strong>
              <span>
                Deutsch → Japanisch
                <br />
                Japanisch oder Romaji tippen
              </span>
            </button>
            <button
              type="button"
              className="mode-choice"
              aria-pressed={direction === 'jp-de'}
              onClick={() => setDirection('jp-de')}
            >
              <strong>Karte aufdecken</strong>
              <span>
                Japanisch → Deutsch
                <br />
                Erkennen und selbst bewerten
              </span>
            </button>
          </div>
          {canStartSrs ? (
            <button
              type="button"
              disabled={!canStartSrs}
              onClick={() => {
                unlockAudio()
                onStartSRS()
              }}
              className="btn-duo button-with-icon"
            >
              Tageslektion starten <ArrowIcon />
            </button>
          ) : (
            <Link to="/course" className="btn-duo button-with-icon">
              Neue Lektion auswählen <ArrowIcon />
            </Link>
          )}
          <p className="text-xs text-[var(--text-muted)] text-center mt-3">
            Bis zu 20 Karten · in deinem Tempo
          </p>
          {!canStartSrs && (
            <p role="status" className="text-sm text-[var(--text-secondary)] mt-4 leading-relaxed">
              Für heute ist alles wiederholt oder noch keine neue Lektion eingeführt.
              <Link to="/course" className="text-link">
                Neue Lektion auswählen →
              </Link>
            </p>
          )}
          <div className="practice-options">
            <button
              type="button"
              className="text-link"
              aria-expanded={advancedOpen}
              aria-controls="practice-options"
              onClick={() => setAdvancedOpen((open) => !open)}
            >
              Lektion anpassen <span aria-hidden="true">{advancedOpen ? '−' : '+'}</span>
            </button>
            {advancedOpen && (
              <div id="practice-options" className="practice-options-panel">
                <p className="eyebrow mb-3">Lernbereich</p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Lernbereich für die Übung">
                  {CAT_OPTIONS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
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
                {pinnedCount > 0 && (
                  <p className="text-xs text-[var(--text-secondary)] mt-3">
                    {pinnedCount} gemerkte Inhalte können in deine Lektion einfließen.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
        <section className="card-surface practice-overview practice-extra">
          <h2>Lieber frei üben?</h2>
          <p>
            Eine zufällige Auswahl aus deinem Lernbereich. Deine Bewertungen zählen auch hier für den
            Lernfortschritt.
          </p>
          <button
            type="button"
            disabled={allItems.length === 0}
            onClick={() => {
              unlockAudio()
              onStartFlashcard()
            }}
            className="btn-duo btn-duo--outline"
          >
            Freies Üben starten
          </button>
        </section>
      </div>
    </div>
  )
}
