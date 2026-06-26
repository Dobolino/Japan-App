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
      {/* Progress header */}
      <div className="pt-3 pb-2 shrink-0">
        <div className="flex justify-between text-xs text-white/30 mb-1.5">
          <span>{index + 1} / {queueLength}</span>
          <span>{practiceMode === 'srs' ? 'SRS' : 'Karteikarten'} · {direction === 'jp-de' ? 'JP → DE' : 'DE → JP'}</span>
        </div>
        <div
          className="h-1 rounded-full bg-white/10 overflow-hidden"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={queueLength}
        >
          <div className="h-full rounded-full bg-indigo-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Card — grows to fill available height */}
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

      {/* Footer actions — pinned above nav */}
      <div className="shrink-0 space-y-2 pb-1">
        {practiceMode === 'flashcard' && direction === 'de-jp' && phase === 'question' && (
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Japanisch oder Romaji eingeben…"
            aria-label="Antwort eingeben"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base placeholder-white/20 outline-none focus:border-indigo-500"
          />
        )}

        {practiceMode === 'flashcard' && direction === 'de-jp' && phase === 'answer' && typed && (
          <div
            className={`w-full rounded-xl p-3 text-sm text-center ${
              typedCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}
          >
            {typedCorrect
              ? '✓ Richtig!'
              : `Deine Antwort: ${typed} — Richtig: ${current.character} (${current.romaji})`}
          </div>
        )}

        {phase === 'question' ? (
          <button
            type="button"
            onClick={onReveal}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg active:scale-[0.97] shadow-lg shadow-indigo-900/40"
          >
            Aufdecken <span className="text-indigo-200/60 text-sm font-normal">(Leertaste)</span>
          </button>
        ) : practiceMode === 'srs' ? (
          <div className="grid grid-cols-4 gap-2" role="group" aria-label="SRS-Bewertung">
            {RATING_BUTTONS.map(({ rating, label, sub, color }) => (
              <button
                key={rating}
                type="button"
                onClick={() => onAdvance(rating)}
                aria-label={`${label}, Taste ${rating + 1}`}
                className={`py-3 rounded-2xl border font-medium active:scale-95 transition-transform ${color}`}
              >
                <div className="text-sm">{label}</div>
                <div className="text-[10px] opacity-60">{sub}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onAdvance(0)}
              aria-label="Nochmal"
              className="py-3.5 rounded-2xl bg-red-500/20 text-red-300 border border-red-500/20 font-semibold active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <CrossIcon className="w-5 h-5" /> Nochmal
            </button>
            <button
              type="button"
              onClick={() => onAdvance(3)}
              aria-label="Gewusst"
              className="py-3.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 font-semibold active:scale-95 inline-flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-5 h-5" /> Gewusst
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
