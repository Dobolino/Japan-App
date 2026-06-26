import { RATING_BUTTONS } from '@/constants/srs'
import { STATUS_LABELS } from '@/constants/status'
import { playJapanese } from '@/utils/audio'
import { matchesJapaneseAnswer } from '@/utils/answerMatch'
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
  onReveal,
  onAdvance,
}: Props) {
  const front = direction === 'jp-de' ? current.character : current.meaning
  const back = direction === 'jp-de' ? current.meaning : current.character
  const backSub = current.romaji
  const progressPct = queueLength > 0 ? ((index + 1) / queueLength) * 100 : 0
  const typedCorrect = typed ? matchesJapaneseAnswer(typed, current) : false

  const statusBorder =
    current.status === 'new'
      ? 'text-white/40 border-white/20'
      : current.status === 'learning'
        ? 'text-blue-300 border-blue-500/30'
        : current.status === 'uncertain'
          ? 'text-yellow-300 border-yellow-500/30'
          : 'text-green-300 border-green-500/30'

  return (
    <div className="flex flex-col h-full px-4">
      <div className="pt-4 pb-2">
        <div className="flex justify-between text-xs text-white/30 mb-1">
          <span>{index + 1} / {queueLength}</span>
          <span>{practiceMode === 'srs' ? 'SRS' : '🃏 Karteikarten'} · {direction === 'jp-de' ? 'JP→DE' : 'DE→JP'}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={queueLength}>
          <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-full rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col items-center gap-3 min-h-[220px] justify-center">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBorder}`}>
            {STATUS_LABELS[current.status]}
          </span>

          <div className={`${direction === 'jp-de' ? 'text-7xl' : 'text-2xl'} leading-none text-center`}>{front}</div>

          {direction === 'jp-de' && (
            <button
              type="button"
              onClick={() => playJapanese(current.id, current.character)}
              className="text-white/30 text-sm"
              aria-label={`${current.character} anhören`}
            >
              🔊 Anhören
            </button>
          )}

          {phase === 'answer' && (
            <div className="text-center mt-2 border-t border-white/10 pt-4 w-full space-y-1">
              <div className={`${direction === 'de-jp' ? 'text-5xl' : 'text-2xl'} text-white`}>{back}</div>
              {backSub && direction === 'de-jp' && <div className="text-sm text-white/40">{backSub}</div>}
              {direction === 'jp-de' && current.exampleWord && (
                <div className="text-sm text-white/50">{current.exampleWord} — {current.exampleMeaning}</div>
              )}
              {direction === 'de-jp' && (
                <button
                  type="button"
                  onClick={() => playJapanese(current.id, current.character)}
                  className="text-white/30 text-sm"
                  aria-label={`${current.character} anhören`}
                >
                  🔊 Anhören
                </button>
              )}
            </div>
          )}
        </div>

        {practiceMode === 'flashcard' && direction === 'de-jp' && phase === 'question' && (
          <div className="w-full flex gap-2">
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Japanisch oder Romaji (optional)…"
              aria-label="Antwort eingeben"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/20 outline-none focus:border-indigo-500"
            />
          </div>
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
            className="w-full py-4 rounded-2xl bg-white/10 text-white font-semibold text-lg active:scale-[0.97]"
          >
            Aufdecken <span className="text-white/30 text-sm font-normal">(Leertaste)</span>
          </button>
        ) : practiceMode === 'srs' ? (
          <div className="grid grid-cols-4 gap-2 w-full" role="group" aria-label="SRS-Bewertung">
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
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={() => onAdvance(0)}
              aria-label="Nochmal, Taste 1"
              className="py-3 rounded-2xl bg-red-500/20 text-red-300 border border-red-500/20 font-medium active:scale-95"
            >
              ✗ Nochmal
            </button>
            <button
              type="button"
              onClick={() => onAdvance(3)}
              aria-label="Gewusst, Taste 4"
              className="py-3 rounded-2xl bg-green-500/20 text-green-300 border border-green-500/20 font-medium active:scale-95"
            >
              ✓ Gewusst
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
