import SessionSummary from '@/components/SessionSummary'
import { useStore } from '@/store/useStore'
import type { SRSRating } from '@/types'
import type { Direction } from '@/hooks/usePracticeSession'
interface Props {
  sessionRatings: SRSRating[]
  direction: Direction
  onBack: () => void
  onRestart: () => void
}
export default function PracticeDone({ sessionRatings, direction, onBack, onRestart }: Props) {
  const session = useStore((state) => state.activeSession)
  const correct = sessionRatings.filter((rating) => rating >= 1).length
  return (
    <SessionSummary
      correct={correct}
      total={sessionRatings.length}
      characters={session?.queue.slice(0, session.index).map((card) => card.answerCharacter) ?? []}
      onFinish={onBack}
      onRestart={onRestart}
      restartLabel="Weitere Übungen"
      note={
        direction === 'de-jp'
          ? 'Deine Antworten wurden geprüft. Dein Fortschritt ist gespeichert.'
          : 'Du hast deine Antworten selbst eingeschätzt. Dein Fortschritt ist gespeichert.'
      }
    />
  )
}
