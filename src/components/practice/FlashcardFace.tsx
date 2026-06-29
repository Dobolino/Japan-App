import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReadingBreakdown from '@/components/ReadingBreakdown'
import { playJapanese, unlockAudio, isAudioUnlocked } from '@/utils/audio'
import { AudioIcon } from '@/components/icons/UiIcons'
import { CAT_LABELS } from '@/constants/status'
import { CAT_CHIP } from '@/constants/categories'
import { STATUS_LABELS, STATUS_TEXT_COLORS } from '@/constants/status'
import type { ReviewCard } from '@/types/review'
import type { Direction, Phase } from '@/hooks/usePracticeSession'

interface Props {
  card: ReviewCard
  direction: Direction
  phase: Phase
  showRomajiHint: boolean
  onToggleRomajiHint: () => void
}

export default function FlashcardFace({
  card,
  direction,
  phase,
  showRomajiHint,
  onToggleRomajiHint,
}: Props) {
  const { parent: item } = card
  const isJpFront = direction === 'jp-de'
  const flipped = phase === 'answer'
  const multiChar = card.promptCharacter.length > 1

  const audioId = card.kind === 'sentence' ? `${card.srsId}-ex` : card.srsId
  const speak = () => {
    unlockAudio()
    playJapanese(audioId, card.answerCharacter)
  }

  return (
    <div className="flashcard relative flex flex-col flex-1 min-h-0 rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-1 shrink-0 z-10">
        <div className="flex flex-wrap gap-1.5">
          {card.contextLabel && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold bg-[#ddf4ff] border-[#bce8ff] text-[var(--blue)]">
              {card.contextLabel}
            </span>
          )}
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${CAT_CHIP[item.category]}`}>
            {CAT_LABELS[item.category]}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border border-[var(--border)] ${STATUS_TEXT_COLORS[item.status]}`}>
            {STATUS_LABELS[item.status]}
          </span>
        </div>
        <button type="button" onClick={speak} className="audio-fab" aria-label="Anhören">
          <AudioIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flashcard-scene flex-1 min-h-0 px-3 pb-3">
        <div className={`flashcard-flipper ${flipped ? 'flashcard-flipper--flipped' : ''}`}>
          <div className="flashcard-face flashcard-face--front">
            <div className="flex flex-col items-center justify-center h-full px-2 py-2 text-center overflow-y-auto scroll-area">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 font-bold">
                {isJpFront
                  ? card.kind === 'sentence'
                    ? 'Was bedeutet dieser Satz?'
                    : 'Was bedeutet das?'
                  : card.kind === 'sentence'
                    ? 'Bilde den Satz auf Japanisch'
                    : 'Wie heisst das auf Japanisch?'}
              </p>

              {isJpFront ? (
                <>
                  {multiChar ? (
                    <ReadingBreakdown character={card.promptCharacter} romaji={card.promptRomaji} size="lg" />
                  ) : (
                    <div className="jp text-7xl sm:text-8xl leading-none text-[var(--text-primary)]">{card.promptCharacter}</div>
                  )}
                  {(showRomajiHint || !multiChar) && (
                    <p className="text-xl text-[var(--blue)] font-bold mt-3">{card.promptRomaji}</p>
                  )}
                </>
              ) : (
                <>
                  <div className="meaning-hero">{card.promptMeaning}</div>
                  {card.kind === 'sentence' && (
                    <p className="text-xs text-[var(--text-muted)] mt-3 font-semibold">
                      Tipp: Wort „{item.character}“ ({item.meaning})
                    </p>
                  )}
                </>
              )}

              {phase === 'question' && isJpFront && multiChar && (
                <button
                  type="button"
                  onClick={onToggleRomajiHint}
                  className={`action-chip mt-4 ${showRomajiHint ? 'action-chip--active' : ''}`}
                >
                  Romaji {showRomajiHint ? 'aus' : 'ein'}
                </button>
              )}
            </div>
          </div>

          <div className="flashcard-face flashcard-face--back">
            <div className="flex flex-col items-center justify-center h-full px-2 py-2 text-center overflow-y-auto scroll-area">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 font-bold">Antwort</p>

              {isJpFront ? (
                <div className="meaning-hero meaning-hero--answer">{card.promptMeaning}</div>
              ) : (
                <>
                  {multiChar ? (
                    <ReadingBreakdown character={card.answerCharacter} romaji={card.answerRomaji} size="lg" />
                  ) : (
                    <div className="jp text-6xl sm:text-7xl leading-none text-[var(--text-primary)]">{card.answerCharacter}</div>
                  )}
                  <p className="text-xl text-[var(--blue)] font-bold mt-2">{card.answerRomaji}</p>
                </>
              )}

              {!isJpFront && card.kind === 'lemma' && item.exampleWord && (
                <div className="mt-4 pt-3 border-t-2 border-[var(--border)] w-full max-w-xs">
                  <p className="text-[10px] text-[var(--text-muted)] mb-1 font-bold">Kontext</p>
                  <button type="button" onClick={speak} className="active:opacity-70">
                    <span className="jp text-lg text-[var(--text-primary)]">{item.exampleWord}</span>
                    <span className="block text-xs text-[var(--text-muted)]">{item.exampleReading} — {item.exampleMeaning}</span>
                  </button>
                </div>
              )}

              <Link to={`/learn/${item.id}`} className="action-chip mt-4">
                Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function useCardAudio(
  card: ReviewCard | undefined,
  phase: Phase,
  autoPlay: boolean,
  direction: Direction
) {
  useEffect(() => {
    if (!card || !autoPlay || phase !== 'question' || direction !== 'jp-de') return
    if (!isAudioUnlocked()) return
    const audioId = card.kind === 'sentence' ? `${card.srsId}-ex` : card.srsId
    playJapanese(audioId, card.promptCharacter)
  }, [card, phase, autoPlay, direction])
}
