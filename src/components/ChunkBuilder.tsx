import { useState } from 'react'
import { chunkOrderMatches, type ChunkExercise } from '@/utils/chunkExercise'

interface Props {
  exercise: ChunkExercise
  onComplete?: () => void
}

export default function ChunkBuilder({ exercise, onComplete }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [wrong, setWrong] = useState(false)

  const pick = (chunk: string) => {
    if (done) return
    const next = [...selected, chunk]
    setSelected(next)
    setWrong(false)

    if (next.length === exercise.answer.length) {
      const ok = chunkOrderMatches(next, exercise.answer)
      setDone(ok)
      setWrong(!ok)
      if (ok) onComplete?.()
    }
  }

  const reset = () => {
    setSelected([])
    setDone(false)
    setWrong(false)
  }

  const undo = () => {
    if (done) return
    setSelected((s) => s.slice(0, -1))
    setWrong(false)
  }

  return (
    <div className="chunk-builder card-surface p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
        Satzbau · SOV-Reihenfolge
      </p>
      <p className="text-sm font-semibold text-[var(--text-secondary)] mb-3">{exercise.promptDe}</p>

      <div className="min-h-[52px] rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-muted)] p-2 flex flex-wrap gap-1.5 mb-3">
        {selected.length === 0 && (
          <span className="text-xs text-[var(--text-muted)] font-semibold self-center px-1">
            Tippe die Wörter in der richtigen Reihenfolge…
          </span>
        )}
        {selected.map((c, i) => (
          <span key={`${i}-${c}`} className="chunk-slot jp font-bold text-[var(--text-primary)]">
            {c}
          </span>
        ))}
      </div>

      {done && !wrong && (
        <p className="text-sm font-bold text-[var(--green)] mb-2">✓ Richtige Satzstellung!</p>
      )}
      {wrong && (
        <p className="text-sm font-bold text-[var(--red)] mb-2">Noch nicht — versuch es nochmal.</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {exercise.chunks.map((chunk, i) => {
          const usedCount = selected.filter((s) => s === chunk).length
          const totalCount = exercise.chunks.filter((c) => c === chunk).length
          const disabled = usedCount >= totalCount || done

          return (
            <button
              key={`${i}-${chunk}`}
              type="button"
              disabled={disabled}
              onClick={() => pick(chunk)}
              className={`chunk-pool jp font-bold ${disabled ? 'chunk-pool--used' : ''}`}
            >
              {chunk}
            </button>
          )
        })}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={undo} disabled={selected.length === 0 || done} className="btn-duo btn-duo--outline btn-duo--sm flex-1">
          Zurück
        </button>
        <button type="button" onClick={reset} className="btn-duo btn-duo--outline btn-duo--sm flex-1">
          Neu
        </button>
      </div>
    </div>
  )
}
