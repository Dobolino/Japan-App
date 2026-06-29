import { RATING_BUTTONS } from '@/constants/srs'
import { matchesJapaneseAnswer } from '@/utils/answerMatch'
import FlashcardFace, { useCardAudio } from '@/components/practice/FlashcardFace'
import { CheckIcon, CrossIcon } from '@/components/icons/UiIcons'
import type { LearningItem, SRSRating } from '@/types'
import type { Phase, Direction, PracticeMode } from '@/hooks/usePracticeSession'

interface Props {
  current: LearningItem
  index: number
  queueLength: number
  phase: Phase
  direction: Direction
  practiceMode: PracticeMode
  typed: string
  setTyped: (value: string) => void
  showRomajiHint: boolean
  onToggleRomajiHint: () => void
  autoPlayAudio: boolean
  onReveal: () => void
  onAdvance: (rating: SRSRating) => void
}

export default function PracticeCard({
  current,
  index,
  queueLength,
  phase,
  direction,
  practiceMode,
  typed,
  setTyped,
  showRomajiHint,
  onToggleRomajiHint,
  autoPlayAudio,
  onReveal,
  onAdvance,
}: Props) {
  const progressPct = queueLength > 0 ? ((index + 1) / queueLength) * 100 : 0
  const typedCorrect = typed ? matchesJapaneseAnswer(typed, current) : false

  useCardAudio(current, phase, autoPlayAudio, direction)

  return (
    <div className="page-screen px-4">
      <div className="pt-3 pb-2 shrink-0">
        <div className="flex justify-between text-xs text-[var(--text-muted)] font-semibold mb-1.5">
          <span>{index + 1} / {queueLength}</span>
          <span>{practiceMode === 'srs' ? 'SRS' : 'Karteikarten'}</span>
        </div>
        <div className="progress-track h-3" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={queueLength}>
          <div className="progress-fill h-full" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div key={current.id} className="flex-1 min-h-0 flex flex-col pb-2 flashcard-enter">
        <FlashcardFace
          item={current}
          direction={direction}
          phase={phase}
          showRomajiHint={showRomajiHint}
          onToggleRomajiHint={onToggleRomajiHint}
          autoPlayAudio={autoPlayAudio}
        />
      </div>

      <div className="shrink-0 space-y-2 pb-1">
        {practiceMode === 'flashcard' && direction === 'de-jp' && phase === 'question' && (
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Japanisch oder Romaji eingeben…"
            aria-label="Antwort eingeben"
            className="w-full card-surface px-4 py-3 text-[var(--text-primary)] text-base placeholder-[var(--text-muted)] outline-none focus:border-[var(--blue)]"
          />
        )}

        {practiceMode === 'flashcard' && direction === 'de-jp' && phase === 'answer' && typed && (
          <div className={`w-full card-surface p-3 text-sm text-center font-bold ${typedCorrect ? 'border-[var(--green)] text-[var(--green)]' : 'border-[var(--red)] text-[var(--red)]'}`}>
            {typedCorrect ? '✓ Richtig!' : `Deine Antwort: ${typed} — Richtig: ${current.character} (${current.romaji})`}
          </div>
        )}

        {phase === 'question' ? (
          <button type="button" onClick={onReveal} className="btn-duo btn-duo--blue">
            Aufdecken
          </button>
        ) : practiceMode === 'srs' ? (
          <div className="grid grid-cols-4 gap-2" role="group" aria-label="SRS-Bewertung">
            {RATING_BUTTONS.map(({ rating, label, sub, color }) => (
              <button
                key={rating}
                type="button"
                onClick={() => onAdvance(rating)}
                aria-label={`${label}, Taste ${rating + 1}`}
                className={`py-3 rounded-2xl border-2 font-bold active:scale-95 transition-transform text-xs ${color}`}
              >
                <div>{label}</div>
                <div className="text-[9px] opacity-70 font-normal">{sub}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => onAdvance(0)} aria-label="Nochmal" className="btn-duo btn-duo--wrong btn-duo--sm inline-flex items-center justify-center gap-2">
              <CrossIcon className="w-5 h-5" /> Nochmal
            </button>
            <button type="button" onClick={() => onAdvance(3)} aria-label="Gewusst" className="btn-duo btn-duo--sm inline-flex items-center justify-center gap-2">
              <CheckIcon className="w-5 h-5" /> Gewusst
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
