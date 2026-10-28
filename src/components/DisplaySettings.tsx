import { useStore } from '@/store/useStore'
import type { ThemeMode } from '@/types'

const THEME_OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: 'light', label: 'Hell' },
  { key: 'dark', label: 'Dunkel' },
  { key: 'system', label: 'System' },
]
const GOAL_OPTIONS = [10, 20, 30]

export default function DisplaySettings() {
  const { displayPrefs, setDisplayPrefs } = useStore()
  return (
    <div>
      <section className="card-surface settings-section" aria-labelledby="theme-title">
        <h2 id="theme-title" className="settings-legend">
          Dein Erscheinungsbild
        </h2>
        <p className="settings-help">Wähle die Darstellung, die für dich angenehm ist.</p>
        <div className="settings-options" role="group" aria-label="Erscheinungsbild">
          {THEME_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={displayPrefs.theme === key}
              onClick={() => setDisplayPrefs({ theme: key })}
              className={`flex-1 chip ${displayPrefs.theme === key ? 'chip--active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      <section className="card-surface settings-section" aria-labelledby="goal-title">
        <h2 id="goal-title" className="settings-legend">
          Ein Ziel, das zu dir passt
        </h2>
        <p className="settings-help">
          So viele richtige Antworten möchtest du pro Tag schaffen. Du kannst dein Ziel jederzeit ändern.
        </p>
        <div className="settings-options" role="group" aria-label="Tagesziel">
          {GOAL_OPTIONS.map((goal) => (
            <button
              key={goal}
              type="button"
              aria-pressed={displayPrefs.dailyGoal === goal}
              onClick={() => setDisplayPrefs({ dailyGoal: goal })}
              className={`flex-1 chip ${displayPrefs.dailyGoal === goal ? 'chip--active' : ''}`}
            >
              {goal} Antworten
            </button>
          ))}
        </div>
      </section>
      <section className="card-surface settings-section" aria-labelledby="reading-aids-title">
        <h2 id="reading-aids-title" className="settings-legend">
          Deine Lesehilfen
        </h2>
        <p className="settings-help">Unterstützung beim Lesen von japanischen Wörtern und Sätzen.</p>
        <label className="settings-toggle">
          <div>
            <strong>Furigana</strong>
            <span>Kleine Lesezeichen über den Kanji.</span>
          </div>
          <input
            type="checkbox"
            checked={displayPrefs.showFurigana}
            onChange={(e) => setDisplayPrefs({ showFurigana: e.target.checked })}
          />
        </label>
        <label className="settings-toggle">
          <div>
            <strong>Romaji</strong>
            <span>Aussprache in lateinischen Buchstaben.</span>
          </div>
          <input
            type="checkbox"
            checked={displayPrefs.showRomaji}
            onChange={(e) => setDisplayPrefs({ showRomaji: e.target.checked })}
          />
        </label>
        <label className="settings-toggle">
          <div>
            <strong>Lesehilfen schrittweise reduzieren</strong>
            <span>
              Bei sicher erkannten Inhalten werden Hilfen ausgeblendet. Du kannst sie beim Üben jederzeit
              einblenden.
            </span>
          </div>
          <input
            type="checkbox"
            checked={displayPrefs.adaptiveAids ?? true}
            onChange={(event) => setDisplayPrefs({ adaptiveAids: event.target.checked })}
          />
        </label>
      </section>
    </div>
  )
}
