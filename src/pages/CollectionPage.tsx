import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { collectionStage, collectionLabels, nextLesson } from '@/utils/todayPlan'
import { localDateKey } from '@/utils/date'
import { useLocalNow } from '@/hooks/useLocalNow'
import StreakPill from '@/components/StreakPill'
import { SettingsIcon, ArrowIcon } from '@/components/icons/UiIcons'

const categories = [
  ['hiragana', 'Hiragana'],
  ['katakana', 'Katakana'],
  ['kanji', 'Kanji'],
] as const
export default function CollectionPage() {
  const store = useStore()
  const now = useLocalNow()
  const [params, setParams] = useSearchParams()
  const category = categories.find(([key]) => key === params.get('category'))?.[0] ?? 'hiragana'
  const items = Object.values(store.items).filter((item) => item.category === category && !item.historical)
  const todayLesson = nextLesson(store)
  const collected = items.filter((item) => collectionStage(item, store.introducedIds) !== 'new').length
  const mastered = items.filter((item) => item.status === 'mastered').length
  const today = store.progress.todayDate === localDateKey(now) ? store.progress.todayCorrect : 0
  const groups =
    category === 'kanji'
      ? [{ title: 'Kanji N5', entries: items }]
      : [
          {
            title: 'Grundzeichen',
            entries: items.filter(
              (item) => item.character.length === 1 && item.character.normalize('NFD').length === 1
            ),
          },
          {
            title: 'Mit Lautzeichen',
            entries: items.filter(
              (item) => item.character.length === 1 && item.character.normalize('NFD').length > 1
            ),
          },
          { title: 'Kombinationen', entries: items.filter((item) => item.character.length > 1) },
        ]
  return (
    <div className="scroll-area h-full">
      <div className="page-width collection-page">
        <header className="today-topline">
          <StreakPill now={now} />
          <Link to="/settings" className="icon-button" aria-label="Einstellungen">
            <SettingsIcon />
          </Link>
        </header>
        <nav className="personal-tabs" aria-label="Dein Bereich">
          <Link to="/me" aria-current="page">
            Sammlung
          </Link>
          <Link to="/stats">Fortschritt</Link>
        </nav>
        <div className="collection-title">
          <h1>Deine Sammlung</h1>
          <span>
            {collected}
            <small>/{items.length}</small>
          </span>
        </div>
        <p className="collection-caption">
          {mastered} gefestigt · heute {today}/{store.displayPrefs.dailyGoal} richtig
        </p>
        <div className="collection-picker" role="group" aria-label="Schrift auswählen">
          {categories.map(([key, label]) => (
            <button
              type="button"
              key={key}
              aria-pressed={category === key}
              onClick={() => setParams({ category: key }, { replace: true })}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="collection-legend" aria-label="Farblegende">
          <span>
            <i className="legend-new" />
            Neu
          </span>
          <span>
            <i className="legend-seen" />
            Entdeckt
          </span>
          <span>
            <i className="legend-practiced" />
            Geübt
          </span>
          <span>
            <i className="legend-mastered" />
            Gefestigt
          </span>
        </div>
        {groups.map(({ title, entries }) => (
          <section className="collection-section" key={title}>
            <h2 className="eyebrow">{title}</h2>
            <div className="collection-grid">
              {entries.map((item) => {
                const stage = collectionStage(item, store.introducedIds)
                const due = Boolean(item.lastReviewDate && item.nextReviewDate <= now.toISOString())
                const forToday = due || (stage === 'new' && todayLesson?.itemIds.includes(item.id))
                const label = due ? 'Fällig' : forToday ? 'Heute' : collectionLabels[stage]
                return (
                  <Link
                    key={item.id}
                    to={`/learn/${item.id}?from=collection`}
                    className={`collection-cell collection-cell--${stage} ${item.character.length > 1 ? 'collection-cell--compound' : ''} ${forToday ? 'collection-cell--today' : ''}`}
                    aria-label={`${item.character} · ${item.romaji} · ${collectionLabels[stage]}${forToday ? ` · ${label}` : ''}`}
                  >
                    <span lang="ja" className="jp">
                      {item.character}
                    </span>
                    <small>
                      {forToday
                        ? label
                        : stage === 'mastered'
                          ? '✓'
                          : stage === 'new' && category !== 'kanji' && store.displayPrefs.showRomaji
                            ? item.romaji
                            : collectionLabels[stage]}
                    </small>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
        <p className="collection-footnote">
          Mit jeder Wiederholung wird deine Sammlung sicherer. Gefestigte Zeichen haben einen
          Wiederholungsabstand von mindestens 7 Tagen. Orange markiert, was als Nächstes ansteht.
        </p>
        <Link to="/" className="btn-duo button-with-icon">
          Zum heutigen Lernplan <ArrowIcon />
        </Link>
      </div>
    </div>
  )
}
