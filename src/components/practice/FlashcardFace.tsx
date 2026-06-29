import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReadingBreakdown from '@/components/ReadingBreakdown'
import RubyText from '@/components/RubyText'
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

function isLongJapanese(text: string): boolean {
  return text.length > 2
}

function JapanesePrompt({ card, size = 'display' }: { card: ReviewCard; size?: 'display' | 'sentence' }) {
  const multi = isLongJapanese(card.promptCharacter)

  if (card.kind === 'grammar-sentence' || (card.kind === 'sentence' && card.promptReading)) {
    return (
      <RubyText
        text={card.promptCharacter}
        reading={card.promptReading ?? card.promptRomaji}
        romaji={card.promptRomaji}
        size="sentence"
      />
    )
  }

  if (multi) {
    return <ReadingBreakdown character={card.promptCharacter} romaji={card.promptRomaji} size="lg" />
  }

  return <div className={`jp jp-${size} text-[var(--text-primary)]`}>{card.promptCharacter}</div>
}

function JapaneseAnswer({ card }: { card: ReviewCard }) {
  const multi = isLongJapanese(card.answerCharacter)

  if (card.kind === 'grammar-sentence' || (card.answerReading && multi)) {
    return (
      <RubyText
        text={card.answerCharacter}
        reading={card.answerReading ?? card.answerRomaji}
        romaji={card.answerRomaji}
        size="sentence"
      />
    )
  }

  if (multi) {
    return <ReadingBreakdown character={card.answerCharacter} romaji={card.answerRomaji} size="lg" />
  }

  return <div className="jp jp-display text-[var(--text-primary)]">{card.answerCharacter}</div>
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
  const multiChar = isLongJapanese(card.promptCharacter)
  const isGrammar = card.kind === 'grammar-sentence'

  const audioId =
    card.kind === 'grammar-sentence'
      ? card.srsId
      : card.kind === 'sentence'
        ? `${card.srsId}-ex`
        : card.srsId

  const speak = () => {
    unlockAudio()
    playJapanese(audioId, card.answerCharacter)
  }

  const promptLine = isJpFront
    ? isGrammar
      ? 'Was bedeutet dieser Grammatik-Satz?'
      : card.kind === 'sentence'
        ? 'Was bedeutet dieser Satz?'
        : 'Was bedeutet das?'
    : isGrammar
      ? 'Bilde den Grammatik-Satz'
      : card.kind === 'sentence'
        ? 'Bilde den Satz auf Japanisch'
        : 'Wie heisst das auf Japanisch?'

  return (
    <div className="flashcard relative flex flex-col flex-1 min-h-0 rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-5 pt-4 pb-1 shrink-0 z-10">
        <div className="flex flex-wrap gap-1.5">
          {card.grammarTitle && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold bg-[#fff3e0] border-[#ffcc80] text-[var(--orange)]">
              {card.grammarTitle}
            </span>
          )}
          {card.contextLabel && (
            <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold bg-[#ddf4ff] border-[#bce8ff] text-[var(--blue)]">
              {card.contextLabel}
            </span>
          )}
          {!isGrammar && (
            <>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${CAT_CHIP[item.category]}`}>
                {CAT_LABELS[item.category]}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border border-[var(--border)] ${STATUS_TEXT_COLORS[item.status]}`}>
                {STATUS_LABELS[item.status]}
              </span>
            </>
          )}
        </div>
        <button type="button" onClick={speak} className="audio-fab" aria-label="Anhören">
          <AudioIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flashcard-scene flex-1 min-h-0 px-3 pb-3">
        <div className={`flashcard-flipper ${flipped ? 'flashcard-flipper--flipped' : ''}`}>
          <div className="flashcard-face flashcard-face--front">
            <div className="flex flex-col items-center justify-center h-full px-2 py-2 text-center overflow-y-auto scroll-area">
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-3 font-bold">{promptLine}</p>

              {isJpFront ? (
                <>
                  <JapanesePrompt card={card} size={multiChar ? 'sentence' : 'display'} />
                  {/* Always show reading for sentences/grammar; romaji hint for single chars */}
                  {(isGrammar || card.kind === 'sentence') && card.promptReading && phase === 'answer' && (
                    <p className="jp text-sm text-[var(--blue)] font-semibold mt-2 opacity-80">{card.promptReading}</p>
                  )}
                  {(showRomajiHint || !multiChar) && !card.promptReading && (
                    <p className="text-xl text-[var(--blue)] font-bold mt-3">{card.promptRomaji}</p>
                  )}
                </>
              ) : (
                <>
                  <div className="meaning-hero">{card.promptMeaning}</div>
                  {card.kind === 'sentence' && !isGrammar && (
                    <p className="text-xs text-[var(--text-muted)] mt-3 font-semibold">
                      Tipp: „{item.character}“ ({item.meaning})
                    </p>
                  )}
                </>
              )}

              {phase === 'question' && isJpFront && multiChar && !card.promptReading && (
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
                  <JapaneseAnswer card={card} />
                  {/* Always show reading below Japanese answer */}
                  {(card.answerReading || card.answerRomaji) && (
                    <p className="jp text-sm text-[var(--blue)] font-semibold mt-2 opacity-80">
                      {card.answerReading ?? card.answerRomaji}
                    </p>
                  )}
                </>
              )}

              {!isJpFront && card.kind === 'lemma' && item.exampleWord && (
                <div className="mt-4 pt-3 border-t-2 border-[var(--border)] w-full max-w-xs">
                  <p className="text-[10px] text-[var(--text-muted)] mb-1 font-bold">Kontext</p>
                  <RubyText
                    text={item.exampleWord}
                    reading={item.exampleReading}
                    romaji={item.exampleReading}
                    size="compact"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">{item.exampleMeaning}</p>
                </div>
              )}

              {!isGrammar && (
                <Link to={`/learn/${item.id}`} className="action-chip mt-4">
                  Details →
                </Link>
              )}
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
    const audioId =
      card.kind === 'grammar-sentence'
        ? card.srsId
        : card.kind === 'sentence'
          ? `${card.srsId}-ex`
          : card.srsId
    playJapanese(audioId, card.promptCharacter)
  }, [card, phase, autoPlay, direction])
}
