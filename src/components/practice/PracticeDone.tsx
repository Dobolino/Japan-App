import { RATING_BUTTONS } from '@/constants/srs'
import type { SRSRating } from '@/types'
import type { PracticeMode } from '@/hooks/usePracticeSession'

interface Props {
  sessionRatings: SRSRating[]
  practiceMode: PracticeMode
  onBack: () => void
  onRestart: () => void
}

export default function PracticeDone({ sessionRatings, practiceMode, onBack, onRestart }: Props) {
  const correct = sessionRatings.filter((r) => r >= 2).length
  const pct = sessionRatings.length > 0 ? Math.round((correct / sessionRatings.length) * 100) : 0
  const counts = { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<SRSRating, number>
  sessionRatings.forEach((r) => counts[r]++)

  return (
    <div className="scroll-area h-full px-6 pt-16 pb-4 flex flex-col items-center gap-5 text-center">
      <div className="text-5xl" aria-hidden="true">{pct >= 70 ? '🌟' : pct >= 40 ? '👍' : '💪'}</div>
      <h1 className="text-2xl font-bold text-white">Sitzung beendet</h1>
      <div className="text-4xl font-bold text-white">{pct}%</div>
      <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
        {RATING_BUTTONS.map(({ rating, label, color }) => (
          <div key={rating} className={`rounded-xl p-2 border ${color}`}>
            <div className="text-xl font-bold">{counts[rating]}</div>
            <div className="text-[10px]">{label}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onBack} className="px-5 py-3 rounded-2xl bg-white/10 text-white text-sm font-medium active:scale-95">
          Zurück
        </button>
        <button type="button" onClick={onRestart} className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-medium active:scale-95">
          Nochmal
        </button>
      </div>
      <p className="text-white/20 text-xs">Modus: {practiceMode === 'srs' ? 'SRS' : 'Karteikarten'}</p>
    </div>
  )
}
