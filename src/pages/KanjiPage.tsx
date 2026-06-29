import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { playJapanese, unlockAudio } from '@/utils/audio'
import { STATUS_COLORS, STATUS_LABELS } from '@/constants/status'

export default function KanjiPage() {
  const { items } = useStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'new' | 'due'>('all')

  const kanjiItems = Object.values(items)
    .filter((i) => i.category === 'kanji')
    .filter((i) => {
      if (filter === 'new') return i.status === 'new'
      if (filter === 'due') return i.nextReviewDate <= new Date().toISOString()
      return true
    })
    .sort((a, b) => a.id.localeCompare(b.id))

  const mastered = Object.values(items).filter((i) => i.category === 'kanji' && i.status === 'mastered').length
  const total = Object.values(items).filter((i) => i.category === 'kanji').length

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Kanji N5</h1>
          <p className="text-[var(--text-muted)] text-xs font-semibold">
            {mastered}/{total} beherrscht · {total} JLPT N5 Kanji
          </p>
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-3">
        {(['all', 'new', 'due'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`chip ${filter === f ? 'chip--active' : ''}`}
          >
            {f === 'all' ? 'Alle' : f === 'new' ? 'Neu' : 'Fällig'}
          </button>
        ))}
      </div>

      <div className="scroll-area flex-1 px-4 pb-4">
        <div className="grid grid-cols-4 gap-2">
          {kanjiItems.map((item) => (
            <div key={item.id} className="card-surface p-2 flex flex-col items-center gap-1">
              <div className="flex justify-between w-full items-start">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold">{item.strokeCount}画</span>
                <button
                  type="button"
                  onClick={() => {
                    unlockAudio()
                    playJapanese(item.id, item.character)
                  }}
                  className="text-[11px] text-[var(--blue)] active:opacity-70"
                  aria-label={`${item.character} anhören`}
                >
                  🔊
                </button>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/learn/${item.id}`)}
                className="flex flex-col items-center gap-1 w-full active:scale-95 transition-transform"
              >
                <span className="text-3xl jp leading-none text-[var(--text-primary)]">{item.character}</span>
                <span className="text-[10px] text-[var(--text-secondary)] text-center leading-tight font-semibold">
                  {item.meaning}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold ${STATUS_COLORS[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
