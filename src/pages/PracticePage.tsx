import PracticeIdle from '@/components/practice/PracticeIdle'
import PracticeDone from '@/components/practice/PracticeDone'
import PracticeCard from '@/components/practice/PracticeCard'
import { usePracticeSession } from '@/hooks/usePracticeSession'

export default function PracticePage() {
  const session = usePracticeSession()

  if (session.phase === 'idle') {
    return (
      <PracticeIdle
        practiceMode={session.practiceMode}
        setPracticeMode={session.setPracticeMode}
        direction={session.direction}
        setDirection={session.setDirection}
        filterCat={session.filterCat}
        setFilterCat={session.setFilterCat}
        dueItems={session.dueItems}
        allItems={session.allItems}
        onStartSRS={session.startSRS}
        onStartFlashcard={session.startFlashcard}
        autoPlayAudio={session.autoPlayAudio}
        setAutoPlayAudio={session.setAutoPlayAudio}
      />
    )
  }

  if (session.phase === 'done') {
    return (
      <PracticeDone
        sessionRatings={session.sessionRatings}
        practiceMode={session.practiceMode}
        onBack={session.resetToIdle}
        onRestart={session.restart}
      />
    )
  }

  if (!session.current) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--text-muted)]">
        Keine Karten in der Warteschlange
      </div>
    )
  }

  return (
    <PracticeCard
      current={session.current}
      index={session.index}
      queueLength={session.queue.length}
      phase={session.phase}
      direction={session.direction}
      practiceMode={session.practiceMode}
      productionMode={session.productionMode}
      typed={session.typed}
      setTyped={session.setTyped}
      showRomajiHint={session.showRomajiHint}
      onToggleRomajiHint={() => session.setShowRomajiHint((v) => !v)}
      autoPlayAudio={session.autoPlayAudio}
      lastCheckedCorrect={session.lastCheckedCorrect}
      onCheck={session.checkAnswer}
      onSkip={session.skipQuestion}
      onReveal={session.reveal}
      onAdvance={session.advance}
      onConfirmWrong={session.confirmWrong}
    />
  )
}
