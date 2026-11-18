import { Link } from 'react-router-dom'
import { CheckIcon } from '@/components/icons/UiIcons'
import StreakPill from '@/components/StreakPill'
import { useLocalNow } from '@/hooks/useLocalNow'

interface Props {
  correct: number
  total: number
  characters: string[]
  onFinish?: () => void
  onRestart: () => void
  restartLabel?: string
  note?: string
}
export default function SessionSummary({
  correct,
  total,
  characters,
  onFinish,
  onRestart,
  restartLabel = 'Einheit wiederholen',
  note,
}: Props) {
  const now = useLocalNow()
  const unique = [...new Set(characters)]
  return (
    <div className="scroll-area h-full">
      <div className="page-width session-summary">
        <div className="session-badge">
          <CheckIcon className="w-10 h-10" />
        </div>
        <p lang="ja" className="jp text-[var(--text-muted)] text-lg">
          よくできました
        </p>
        <h1>Ein guter Schritt für heute.</h1>
        <StreakPill now={now} />
        <div className="summary-metrics">
          <div className="card-surface">
            <strong>{total}</strong>
            <span>Antworten</span>
          </div>
          <div className="card-surface">
            <strong>{total ? Math.round((correct / total) * 100) : 0}%</strong>
            <span>richtig</span>
          </div>
          <div className="card-surface">
            <strong>{unique.length}</strong>
            <span>Inhalte geübt</span>
          </div>
        </div>
        {unique.length > 0 && (
          <section className="card-surface summary-collection">
            <p>Das hast du geübt</p>
            <div className="summary-characters">
              {unique.slice(0, 10).map((character) => (
                <span lang="ja" key={character} className="jp">
                  {character}
                </span>
              ))}
            </div>
            {unique.length > 10 && (
              <p className="text-[var(--text-muted)] mt-3">und {unique.length - 10} weitere Inhalte</p>
            )}
          </section>
        )}
        <p className="text-sm text-[var(--text-secondary)] mb-5">
          {note ?? `${correct} von ${total} Antworten richtig. Dein Fortschritt ist gespeichert.`}
        </p>
        <Link to="/" onClick={onFinish} className="btn-duo summary-primary">
          Fertig für heute
        </Link>
        <button type="button" onClick={onRestart} className="text-link mt-3">
          {restartLabel}
        </button>
        <Link to="/me" onClick={onFinish} className="text-link mt-2">
          Meine Sammlung ansehen →
        </Link>
      </div>
    </div>
  )
}
