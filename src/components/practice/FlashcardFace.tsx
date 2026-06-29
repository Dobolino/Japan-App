import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReadingBreakdown from '@/components/ReadingBreakdown'
import { playJapanese, unlockAudio, isAudioUnlocked } from '@/utils/audio'
import { AudioIcon, RepeatIcon } from '@/components/icons/UiIcons'
import { CAT_LABELS } from '@/constants/status'
import { CAT_CHIP } from '@/constants/categories'
import { STATUS_LABELS, STATUS_TEXT_COLORS } from '@/constants/status'
import type { LearningItem } from '@/types'
import type { Direction, Phase } from '@/hooks/usePracticeSession'

interface Props {
  item: LearningItem
  direction: Direction
  phase: Phase
  showRomajiHint: boolean
  onToggleRomajiHint: () => void
  autoPlayAudio: boolean
}

export default function FlashcardFace({
  item,
  direction,
  phase,
  showRomajiHint,
  onToggleRomajiHint,
}: Props) {
  const isJpFront = direction === 'jp-de'
  const multiChar = item.character.length > 1
  const flipped = phase === 'answer'

  const speak = () => {
    unlockAudio()
    playJapanese(item.id, item.character)
  }

  return (
    <div className="flashcard relative flex flex-col flex-1 min-h-0 rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-1 shrink-0 z-10">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${CAT_CHIP[item.category]}`}>
            {CAT_LABELS[item.category]}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border border-white/10 ${STATUS_TEXT_COLORS[item.status]}`}>
            {STATUS_LABELS[item.status]}
          </span>
        </div>
        <button
          type="button"
          onClick={speak}
          className="audio-fab"
          aria-label={`${item.character} anhören`}
        >
          <AudioIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flashcard-scene flex-1 min-h-0 px-3 pb-3">
        <div className={`flashcard-flipper ${flipped ? 'flashcard-flipper--flipped' : ''}`}>
          {/* Vorderseite — Frage */}
          <div className="flashcard-face flashcard-face--front">
            <div className="flex flex-col items-center justify-center h-full px-2 py-2 text-center overflow-y-auto scroll-area">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 font-bold">
                {isJpFront ? 'Was bedeutet das?' : 'Wie heisst das auf Japanisch?'}
              </p>

              {isJpFront ? (
                <>
                  {multiChar ? (
                    <ReadingBreakdown character={item.character} romaji={item.romaji} size="lg" />
                  ) : (
                    <div className="jp text-7xl sm:text-8xl leading-none text-[var(--text-primary)]">{item.character}</div>
                  )}
                  {(showRomajiHint || !multiChar) && (
                    <p className="text-xl text-[var(--blue)] font-bold mt-3">{item.romaji}</p>
                  )}
                </>
              ) : (
                <>
                  <div className="meaning-hero">{item.meaning}</div>
                  {item.vocabCategory && (
                    <p className="text-xs text-white/30 mt-2 capitalize">{item.vocabCategory}</p>
                  )}
                </>
              )}

              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                <button type="button" onClick={speak} className="action-chip action-chip--audio">
                  <AudioIcon className="w-4 h-4" />
                  Anhören
                </button>
                <button type="button" onClick={speak} className="action-chip" aria-label="Nochmal anhören">
                  <RepeatIcon className="w-4 h-4" />
                  Wiederholen
                </button>
                {isJpFront && multiChar && (
                  <button
                    type="button"
                    onClick={onToggleRomajiHint}
                    className={`action-chip ${showRomajiHint ? 'action-chip--active' : ''}`}
                  >
                    Romaji {showRomajiHint ? 'aus' : 'ein'}
                  </button>
                )}
                <Link to={`/learn/${item.id}`} className="action-chip">
                  Details →
                </Link>
              </div>
            </div>
          </div>

          {/* Rückseite — Antwort */}
          <div className="flashcard-face flashcard-face--back">
            <div className="flex flex-col items-center justify-center h-full px-2 py-2 text-center overflow-y-auto scroll-area">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 font-bold">Antwort</p>

              {isJpFront ? (
                <>
                  <div className="meaning-hero meaning-hero--answer">{item.meaning}</div>
                  {multiChar && (
                    <div className="mt-3 opacity-80">
                      <ReadingBreakdown character={item.character} romaji={item.romaji} size="sm" compact />
                    </div>
                  )}
                </>
              ) : (
                <>
                  {multiChar ? (
                    <ReadingBreakdown character={item.character} romaji={item.romaji} size="lg" />
                  ) : (
                    <div className="jp text-6xl sm:text-7xl leading-none text-[var(--text-primary)]">{item.character}</div>
                  )}
                  <p className="text-xl text-[var(--blue)] font-bold mt-2">{item.romaji}</p>
                </>
              )}

              {item.exampleWord && (
                <div className="mt-4 pt-3 border-t-2 border-[var(--border)] w-full max-w-xs">
                  <p className="text-[10px] text-[var(--text-muted)] mb-1 font-bold">Beispiel</p>
                  <button type="button" onClick={() => { unlockAudio(); playJapanese(item.id + '-ex', item.exampleWord!) }} className="active:opacity-70">
                    <span className="jp text-lg text-[var(--text-primary)]">{item.exampleWord}</span>
                    <span className="block text-xs text-[var(--text-muted)]">{item.exampleReading} — {item.exampleMeaning}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Auto-play when a new card appears (question phase only). */
export function useCardAudio(item: LearningItem | undefined, phase: Phase, autoPlay: boolean, direction: Direction) {
  useEffect(() => {
    if (!item || !autoPlay || phase !== 'question' || direction !== 'jp-de') return
    if (!isAudioUnlocked()) return
    playJapanese(item.id, item.character)
  }, [item, phase, autoPlay, direction])
}
