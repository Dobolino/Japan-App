import { useStore } from '@/store/useStore'
import { activeStreak } from '@/utils/date'
import { FlameIcon } from '@/components/icons/UiIcons'

export default function StreakPill({ now }: { now: Date }) {
  const progress = useStore((state) => state.progress)
  const streak = activeStreak(progress, now)
  return (
    <span className="streak-pill">
      <FlameIcon />
      {streak > 0 ? `${streak} ${streak === 1 ? 'Tag' : 'Tage'} in Folge` : 'Dein Anfang zählt'}
    </span>
  )
}
