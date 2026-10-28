import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { localDateKey } from '@/utils/date'
export default function WeeklyProgress() {
  const history = useStore((state) => state.dailyHistory),
    [selected, setSelected] = useState(localDateKey())
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - 6 + index)
    return { key: localDateKey(date), label: date.toLocaleDateString('de-CH', { weekday: 'short' }), date }
  })
  const maximum = Math.max(1, ...days.map((day) => history[day.key]?.reviewed ?? 0)),
    entry = history[selected],
    sum = days.reduce((acc, day) => acc + (history[day.key]?.reviewed ?? 0), 0)
  return (
    <section className="card-surface p-5 mb-6" aria-labelledby="week-title">
      <div className="section-heading">
        <h2 id="week-title">Deine letzten sieben Tage</h2>
        <span className="text-sm text-[var(--text-secondary)]">{sum} Antworten</span>
      </div>
      <div className="week-chart">
        {days.map((day) => (
          <button
            key={day.key}
            type="button"
            className="week-day"
            aria-pressed={selected === day.key}
            aria-label={`${day.date.toLocaleDateString('de-CH')}: ${history[day.key]?.reviewed ?? 0} Antworten`}
            onClick={() => setSelected(day.key)}
          >
            <span className="week-track">
              <span
                className="week-fill"
                style={{ height: `${((history[day.key]?.reviewed ?? 0) / maximum) * 100}%` }}
              />
            </span>
            <span>{day.label}</span>
          </button>
        ))}
      </div>
      <p role="status" className="text-sm text-[var(--text-secondary)] mt-4">
        {selected}:{' '}
        {entry
          ? `${entry.reviewed} Antworten · ${entry.correct} richtig · ${entry.xp} XP`
          : 'Noch keine aufgezeichnete Lernaktivität.'}
      </p>
      <p className="text-xs text-[var(--text-muted)] mt-3">
        Gezählt werden bewertete Lernkarten, auch aus Lektionen und Trainings. Der Verlauf beginnt mit dieser
        Funktion; frühere Tageswerte werden nicht geschätzt.
      </p>
    </section>
  )
}
