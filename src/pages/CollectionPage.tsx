import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { collectionStage, collectionLabels, todayPlan } from '@/utils/todayPlan'
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
  const todayLesson = todayPlan(store, now.toISOString()).lesson
  const collected = items.filter((item) => collectionStage(item, store.introducedIds) !== 'new').length
  const mastered = items.filter((item) => item.status === 'mastered').length
  const today = store.progress.todayDate === localDateKey(now) ? store.progress.todayCorrect : 0
  const groups =
    category === 'kanji'
      ? [{ title: 'Kanji-Grundlagen', entries: items }]
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
          {collected} entdeckt · {mastered} gefestigt · heute {today}/{store.displayPrefs.dailyGoal} richtig
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
            <h2 className="eyebrow">
              {title} · {entries.length}
            </h2>
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
        {category !== 'kanji' && (
          <details className="card-surface p-4 mb-5 text-sm">
            <summary className="cursor-pointer font-semibold">Wie zählt die App die Lernkarten?</summary>
            <p className="mt-3 leading-relaxed">
              Jede Kombination wie <span lang="ja">{category === 'hiragana' ? 'きゃ' : 'キャ'}</span> (kya)
              zählt als eine Karte. Manche Zeichen lernst du direkt im Wort.{' '}
              {category === 'hiragana' ? (
                <>
                  Das kleine <span lang="ja">っ</span> in <span lang="ja">きって</span> (kitte, Briefmarke)
                  steht für einen kurzen Halt vor dem t. Vergleiche <span lang="ja">きて</span> (kite, komm!).
                </>
              ) : (
                <>
                  In <span lang="ja">コーヒー</span> (kōhī, Kaffee) verlängert jeder Strich
                  <span lang="ja"> ー </span>den Vokal davor. Halte das o und das i jeweils zwei Takte.
                </>
              )}
            </p>
            <a
              className="text-link mt-2"
              href={`https://www3.nhk.or.jp/nhkworld/lesson/en/letters/${category}.html`}
            >
              {category === 'hiragana' ? 'Hiragana' : 'Katakana'} bei NHK anhören
            </a>
          </details>
        )}
        <Link to="/" className="btn-duo button-with-icon">
          Zum heutigen Lernplan <ArrowIcon />
        </Link>
      </div>
    </div>
  )
}
