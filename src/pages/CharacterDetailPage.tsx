import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import StrokeCanvas from '@/components/StrokeCanvas'
import RubyText from '@/components/RubyText'
import { playJapanese, unlockAudio } from '@/utils/audio'
import { SRS_RATINGS } from '@/constants/srs'
import { CAT_LABELS, STATUS_LABELS } from '@/constants/status'
import { strokeCharacters } from '@/data/strokeAssets'
import { kanjiParts } from '@/data/kanjiParts'
import { reviewIntervalLabel } from '@/utils/sm2'
export default function CharacterDetailPage() {
  const { id } = useParams()
  return <Detail key={id} id={id ?? ''} />
}
function Detail({ id }: { id: string }) {
  const store = useStore(),
    item = store.items[id],
    hasStrokes = Boolean(item && strokeCharacters.has(item.character))
  const [tab, setTab] = useState('info'),
    [score, setScore] = useState<number | null>(null),
    [saved, setSaved] = useState(false),
    [forceAids, setForceAids] = useState(false)
  if (!item)
    return (
      <div className="page-width">
        <h1>Inhalt nicht gefunden</h1>
        <Link to="/learn" className="text-link">
          Zur Bibliothek →
        </Link>
      </div>
    )
  const part = kanjiParts[item.character],
    pinned = store.pinnedReviewIds.includes(id)
  return (
    <div className="page-screen">
      <header className="detail-heading">
        <Link to="/learn" className="icon-button" aria-label="Zur Lernbibliothek">
          ‹
        </Link>
        <div className="flex-1 min-w-0">
          <p className="eyebrow">
            {CAT_LABELS[item.category]} · {STATUS_LABELS[item.status]}
          </p>
          <h1 className="text-xl font-semibold mt-1">{item.meaning}</h1>
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Anhören"
          onClick={() => {
            unlockAudio()
            playJapanese(id, item.character)
          }}
        >
          ♪
        </button>
      </header>
      <nav className="detail-tabs" aria-label="Inhalt ansehen">
        {[
          ['info', 'Verstehen'],
          ...(hasStrokes
            ? [
                ['stroke', 'Strichfolge'],
                ['draw', 'Schreiben'],
              ]
            : []),
        ].map(([key, label]) => (
          <button
            type="button"
            key={key}
            className={`chip ${tab === key ? 'chip--active' : ''}`}
            aria-pressed={tab === key}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="scroll-area flex-1 min-h-0">
        <div className="page-width detail-content">
          {tab === 'info' ? (
            <>
              <div className="card-surface activity-card mb-5">
                <div className="character-prompt">
                  <RubyText
                    text={item.character}
                    romaji={item.romaji}
                    size="display"
                    showRomaji={forceAids ? true : undefined}
                  />
                  <button
                    type="button"
                    className="text-link"
                    aria-pressed={forceAids}
                    onClick={() => setForceAids(!forceAids)}
                  >
                    {forceAids ? 'Lesehilfe ausblenden' : 'Aussprache zeigen'}
                  </button>
                </div>
                {item.readings && (
                  <dl className="mt-5 text-left text-sm">
                    <dt className="eyebrow mb-2">Mögliche Lesungen</dt>
                    {item.readings.map((reading, index) => (
                      <dd key={`${reading.kana}-${index}`} className="py-2 border-b border-[var(--border)]">
                        <span className="text-[var(--text-muted)] mr-2">
                          {reading.kind === 'on' ? 'On' : reading.kind === 'kun' ? 'Kun' : ''}
                        </span>
                        <span lang="ja" className="jp">
                          {reading.kana}
                        </span>{' '}
                        · {reading.romaji}
                      </dd>
                    ))}
                  </dl>
                )}
              </div>
              {part && (
                <section className="card-surface p-5 mb-5">
                  <h2 className="font-semibold mb-3">Bausteine erkennen</h2>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {part.parts.map((piece, index) => (
                      <span lang="ja" key={`${piece}-${index}`} className="kanji-part jp">
                        {piece}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{part.hint}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">Eine Merkhilfe für die Form.</p>
                </section>
              )}
              {item.exampleWord && (
                <section className="card-surface p-5 mb-5">
                  <h2 className="font-semibold mb-4">Im Zusammenhang</h2>
                  <RubyText text={item.exampleWord} romaji={item.exampleReading} size="sentence" />
                  <p className="text-sm mt-3">{item.exampleMeaning}</p>
                  <button
                    type="button"
                    className="text-link mt-3"
                    onClick={() => playJapanese(`${id}-ex`, item.exampleWord!)}
                  >
                    Beispiel anhören
                  </button>
                </section>
              )}
              <section className="card-surface p-5 mb-5">
                <h2 className="font-semibold mb-3">Lernstand einschätzen</h2>
                {saved ? (
                  <p role="status">Bewertung gespeichert.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2" role="group" aria-label="SRS-Bewertung">
                    {SRS_RATINGS.map(({ r, label, color }) => (
                      <button
                        type="button"
                        key={r}
                        className={`rounded-xl border p-3 ${color}`}
                        onClick={() => {
                          store.rateReview(id, r)
                          setSaved(true)
                        }}
                      >
                        <strong>{label}</strong>
                        <span className="block text-xs mt-1">{reviewIntervalLabel(item, r)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
              <button
                type="button"
                className="btn-duo btn-duo--outline"
                aria-pressed={pinned}
                onClick={() => (pinned ? store.unpinForReview(id) : store.pinForReview(id))}
              >
                {pinned ? 'Im Lernheft gemerkt ✓' : 'Im Lernheft merken'}
              </button>
              <Link to="/notebook" className="text-link mt-3">
                Notiz oder Sammlung ergänzen →
              </Link>
            </>
          ) : (
            <>
              <StrokeCanvas
                mode={tab === 'stroke' ? 'animate' : 'draw'}
                key={`${id}-${tab}`}
                character={item.character}
                onEvaluate={setScore}
                onReset={() => setScore(null)}
              />
              {tab === 'draw' && score !== null && (
                <button
                  type="button"
                  disabled={saved}
                  className="btn-duo mt-5"
                  onClick={() => {
                    store.rateReview(id, score >= 70 ? 2 : 0)
                    setSaved(true)
                  }}
                >
                  {saved ? 'Bewertung gespeichert' : 'Diese Übung als Bewertung speichern'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
