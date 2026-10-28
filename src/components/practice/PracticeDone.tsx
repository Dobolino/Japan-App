import { RATING_BUTTONS, XP_PER_CORRECT } from '@/constants/srs'
import { CheckIcon } from '@/components/icons/UiIcons'
import type { SRSRating } from '@/types'
import type { Direction } from '@/hooks/usePracticeSession'

interface Props {
  sessionRatings: SRSRating[]
  direction: Direction
  onBack: () => void
  onRestart: () => void
}

export default function PracticeDone({ sessionRatings, direction, onBack, onRestart }: Props) {
  const correct = sessionRatings.filter((rating) => rating >= 1).length
  const pct = sessionRatings.length > 0 ? Math.round((correct / sessionRatings.length) * 100) : 0
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<SRSRating, number>
  sessionRatings.forEach((rating) => counts[rating]++)
  return (
    <div className="scroll-area h-full">
      <div className="page-width session-summary">
        <div className="session-badge">
          <CheckIcon className="w-8 h-8" />
        </div>
        <p className="eyebrow mb-3">Lektion abgeschlossen</p>
        <h1>Ein guter Schritt für heute.</h1>
        <p>
          {correct} von {sessionRatings.length} Antworten richtig. Dein Fortschritt ist gespeichert.
        </p>
        <div className="session-metrics">
          <div className="card-surface p-5">
            <strong>{pct}%</strong>
            <span>richtig beantwortet</span>
          </div>
          <div className="card-surface p-5">
            <strong>+{correct * XP_PER_CORRECT}</strong>
            <span>XP gesammelt</span>
          </div>
        </div>
        <p className="mb-5">
          {direction === 'de-jp'
            ? 'Deine Antworten wurden per Eingabe geprüft.'
            : 'Du hast deine Antworten selbst eingeschätzt.'}
        </p>
        <div className="grid grid-cols-4 gap-2 mb-8">
          {RATING_BUTTONS.map(({ rating, label, color }) => (
            <div key={rating} className={`rounded-xl p-3 border ${color}`}>
              <div className="text-xl font-semibold">{counts[rating]}</div>
              <div className="text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onBack} className="btn-duo btn-duo--outline flex-1">
            Zur Übersicht
          </button>
          <button type="button" onClick={onRestart} className="btn-duo flex-1">
            Weiter üben
          </button>
        </div>
      </div>
    </div>
  )
}
