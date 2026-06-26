import { Link } from 'react-router-dom'
import ScriptAnalysis from '@/components/ScriptAnalysis'
import { playJapanese } from '@/utils/audio'
import { CAT_LABELS } from '@/constants/status'
import { CAT_CHIP, CAT_GRADIENT } from '@/constants/categories'
import { STATUS_LABELS, STATUS_TEXT_COLORS } from '@/constants/status'
import type { LearningItem } from '@/types'
import type { Direction, Phase } from '@/hooks/usePracticeSession'

interface Props {
  item: LearningItem
  direction: Direction
  phase: Phase
  showRomajiHint: boolean
  onToggleRomajiHint: () => void
}

export default function FlashcardFace({
  item,
  direction,
  phase,
  showRomajiHint,
  onToggleRomajiHint,
}: Props) {
  const isJpFront = direction === 'jp-de'
  const showScript = item.character.length > 1 && (item.category === 'vocabulary' || item.category === 'kanji')

  return (
    <div
      className={`flashcard relative flex flex-col flex-1 min-h-0 rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-b ${CAT_GRADIENT[item.category]}`}
    >
      {/* Header chips */}
      <div className="flex items-center justify-between gap-2 px-5 pt-5 pb-2">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${CAT_CHIP[item.category]}`}>
            {CAT_LABELS[item.category]}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border border-white/10 ${STATUS_TEXT_COLORS[item.status]}`}>
            {STATUS_LABELS[item.status]}
          </span>
        </div>
      </div>

      {/* Question area — takes most space */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 text-center min-h-0">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
          {isJpFront ? 'Was bedeutet das?' : 'Wie heisst das auf Japanisch?'}
        </p>

        {isJpFront ? (
          <>
            {showScript ? (
              <ScriptAnalysis text={item.character} showBreakdown={false} size="xl" />
            ) : (
              <div className="jp text-7xl sm:text-8xl leading-none mb-2">{item.character}</div>
            )}
            {showRomajiHint && (
              <p className="text-lg text-indigo-300/80 font-medium">{item.romaji}</p>
            )}
          </>
        ) : (
          <>
            <div className="text-3xl sm:text-4xl font-bold text-white leading-snug max-w-[280px]">
              {item.meaning}
            </div>
            {item.vocabCategory && (
              <p className="text-xs text-white/30 mt-2 capitalize">{item.vocabCategory}</p>
            )}
          </>
        )}

        {/* Quick actions */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => playJapanese(item.id, item.character)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 text-white/70 text-sm font-medium active:scale-95 transition-transform"
            aria-label="Anhören"
          >
            <span aria-hidden="true">🔊</span> Anhören
          </button>
          {isJpFront && (
            <button
              type="button"
              onClick={onToggleRomajiHint}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium active:scale-95 transition-transform ${
                showRomajiHint ? 'bg-indigo-600/40 text-indigo-200' : 'bg-white/10 text-white/70'
              }`}
            >
              <span aria-hidden="true">💡</span> Romaji
            </button>
          )}
          <Link
            to={`/learn/${item.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 text-white/70 text-sm font-medium active:scale-95 transition-transform"
          >
            <span aria-hidden="true">📖</span> Details
          </Link>
        </div>
      </div>

      {/* Answer area — slides in */}
      {phase === 'answer' && (
        <div className="flashcard-answer border-t border-white/10 bg-black/20 px-6 py-5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Antwort</p>

          {isJpFront ? (
            <>
              <div className="text-2xl sm:text-3xl font-bold text-white leading-snug">{item.meaning}</div>
              <p className="text-sm text-white/40 mt-1">{item.romaji}</p>
            </>
          ) : (
            <>
              {showScript ? (
                <div className="mb-2">
                  <ScriptAnalysis text={item.character} size="xl" />
                </div>
              ) : (
                <div className="jp text-6xl sm:text-7xl leading-none text-white mb-2">{item.character}</div>
              )}
              <p className="text-lg text-white/50">{item.romaji}</p>
            </>
          )}

          {item.exampleWord && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[10px] text-white/30 mb-1">Beispiel</p>
              <button
                type="button"
                onClick={() => playJapanese(item.id + '-ex', item.exampleWord!)}
                className="inline-flex flex-col items-center gap-0.5 active:opacity-70"
              >
                <span className="jp text-xl text-white/80">{item.exampleWord}</span>
                <span className="text-xs text-white/40">{item.exampleReading} — {item.exampleMeaning}</span>
              </button>
            </div>
          )}

          {isKanjiItem(item) && item.onyomi && (
            <div className="mt-3 text-xs text-white/40">
              音 {item.onyomi.join(' · ')}
              {item.kunyomi?.length ? ` ｜ 訓 ${item.kunyomi.join(' · ')}` : ''}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function isKanjiItem(item: LearningItem) {
  return item.category === 'kanji'
}
