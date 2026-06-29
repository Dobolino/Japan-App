import { RATING_BUTTONS } from '@/constants/srs'
import { reviewCardMatchesAnswer } from '@/utils/buildReviewQueue'
import FlashcardFace, { useCardAudio } from '@/components/practice/FlashcardFace'
import { CheckIcon, CrossIcon } from '@/components/icons/UiIcons'
import type { SRSRating } from '@/types'
import type { ReviewCard } from '@/types/review'
import type { Phase, Direction, PracticeMode } from '@/hooks/usePracticeSession'

interface Props {
  current: ReviewCard
  index: number
  queueLength: number
  phase: Phase
  direction: Direction
  practiceMode: PracticeMode
  productionMode: boolean
  typed: string
  setTyped: (value: string) => void
  showRomajiHint: boolean
  onToggleRomajiHint: () => void
  autoPlayAudio: boolean
  lastCheckedCorrect: boolean | null
  onCheck: () => void
  onSkip: () => void
  onReveal: () => void
  onAdvance: (rating: SRSRating) => void
  onConfirmWrong: () => void
}

export default function PracticeCard({
  current,
  index,
  queueLength,
  phase,
  direction,
  practiceMode,
  productionMode,
  typed,
  setTyped,
  showRomajiHint,
  onToggleRomajiHint,
  autoPlayAudio,
  lastCheckedCorrect,
  onCheck,
  onSkip,
  onReveal,
  onAdvance,
  onConfirmWrong,
}: Props) {
  const progressPct = queueLength > 0 ? ((index + 1) / queueLength) * 100 : 0
  const typedCorrect = typed ? reviewCardMatchesAnswer(typed, current) : false
  const kindLabel = current.kind === 'sentence' ? 'Satz' : 'Wort'

  useCardAudio(current, phase, autoPlayAudio, direction)

  return (
    <div className="page-screen px-4">
      <div className="pt-3 pb-2 shrink-0">
        <div className="flex justify-between text-xs text-[var(--text-muted)] font-semibold mb-1.5">
          <span>{index + 1} / {queueLength}</span>
          <span>{practiceMode === 'srs' ? 'SRS' : 'Karten'} · {kindLabel} · {productionMode ? '🇩🇪→🇯🇵' : '🇯🇵→🇩🇪'}</span>
        </div>
        <div className="progress-track h-3" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={queueLength}>
          <div className="progress-fill h-full" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div key={current.cardId} className="flex-1 min-h-0 flex flex-col pb-2 flashcard-enter">
        <FlashcardFace
          card={current}
          direction={direction}
          phase={phase}
          showRomajiHint={showRomajiHint}
          onToggleRomajiHint={onToggleRomajiHint}
        />
      </div>

      <div className="shrink-0 space-y-2 pb-1">
        {productionMode && phase === 'question' && (
          <>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  onCheck()
                }
              }}
              placeholder={current.kind === 'sentence' ? 'Ganzen Satz auf Japanisch…' : 'Japanisch oder Romaji…'}
              aria-label="Antwort eingeben"
              autoFocus
              className="w-full card-surface px-4 py-3 text-[var(--text-primary)] text-base placeholder-[var(--text-muted)] outline-none focus:border-[var(--blue)]"
            />
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={onCheck} className="btn-duo btn-duo--sm">
                Prüfen
              </button>
              <button type="button" onClick={onSkip} className="btn-duo btn-duo--outline btn-duo--sm">
                Nicht gewusst
              </button>
            </div>
          </>
        )}

        {!productionMode && phase === 'question' && (
          <button type="button" onClick={onReveal} className="btn-duo btn-duo--blue">
            Aufdecken
          </button>
        )}

        {productionMode && phase === 'answer' && (
          <>
            {typed && (
              <div className={`w-full card-surface p-3 text-sm text-center font-bold ${typedCorrect || lastCheckedCorrect ? 'border-[var(--green)] text-[var(--green)]' : 'border-[var(--red)] text-[var(--red)]'}`}>
                {typedCorrect || lastCheckedCorrect
                  ? '✓ Richtig!'
                  : `Deine Antwort: ${typed} — Richtig: ${current.answerCharacter} (${current.answerRomaji})`}
              </div>
            )}
            {!typed && (
              <p className="text-center text-sm text-[var(--text-muted)] font-semibold">Antwort angeschaut</p>
            )}
            <button type="button" onClick={onConfirmWrong} className="btn-duo btn-duo--sm">
              Weiter
            </button>
          </>
        )}

        {!productionMode && phase === 'answer' && practiceMode === 'srs' && (
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
        )}

        {!productionMode && phase === 'answer' && practiceMode === 'flashcard' && (
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
