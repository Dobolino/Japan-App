import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import RubyText from '@/components/RubyText'
import { playJapanese, unlockAudio, isAudioUnlocked, stopAudio } from '@/utils/audio'
import { AudioIcon } from '@/components/icons/UiIcons'
import { useReadingAids } from '@/hooks/useReadingAids'
import { CAT_LABELS } from '@/constants/status'
import type { ReviewCard } from '@/types/review'
import type { Direction, Phase } from '@/hooks/usePracticeSession'
interface Props {
  card: ReviewCard
  direction: Direction
  phase: Phase
  showRomajiHint: boolean
  onToggleRomajiHint: () => void
}
export default function FlashcardFace({ card, direction, phase, showRomajiHint, onToggleRomajiHint }: Props) {
  const aids = useReadingAids(card.answerCharacter, showRomajiHint),
    revealed = phase === 'answer',
    japaneseFront = direction === 'jp-de'
  const showJapanese = japaneseFront || revealed
  return (
    <div className="flashcard flex flex-col flex-1 min-h-0 rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-2">
        <p className="eyebrow">
          {card.grammarTitle ?? CAT_LABELS[card.parent.category]}
          {card.contextLabel ? ` · ${card.contextLabel}` : ''}
        </p>
        <button
          type="button"
          className="audio-fab"
          aria-label="Anhören"
          onClick={() => {
            unlockAudio()
            playJapanese(card.srsId, card.answerCharacter)
          }}
        >
          <AudioIcon />
        </button>
      </div>
      <div className="flashcard-body scroll-area">
        <p className="eyebrow mb-5">
          {revealed ? 'Antwort' : japaneseFront ? 'Was bedeutet das?' : 'Wie sagst du das auf Japanisch?'}
        </p>
        {showJapanese ? (
          <>
            <RubyText
              text={card.answerCharacter}
              reading={card.answerReading}
              romaji={card.answerRomaji}
              size={card.answerCharacter.length > 3 ? 'sentence' : 'display'}
              showRomaji={aids.showRomaji}
              showFurigana={aids.showFurigana}
            />
            {!revealed && (
              <button
                type="button"
                className="action-chip mt-5"
                aria-pressed={showRomajiHint}
                onClick={onToggleRomajiHint}
              >
                {showRomajiHint ? 'Lesehilfe ausblenden' : 'Lesehilfe zeigen'}
              </button>
            )}
            {revealed && <p className="meaning-hero meaning-hero--answer mt-6">{card.promptMeaning}</p>}
          </>
        ) : (
          <p className="meaning-hero">{card.promptMeaning}</p>
        )}
        {revealed && card.kind !== 'grammar-sentence' && (
          <Link to={`/learn/${card.parent.id}`} className="text-link mt-5">
            Inhalt genauer ansehen →
          </Link>
        )}
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
    if (card && autoPlay && phase === 'question' && direction === 'jp-de' && isAudioUnlocked()) {
      playJapanese(card.srsId, card.answerCharacter)
      return () => stopAudio()
    }
  }, [card, phase, autoPlay, direction])
}
