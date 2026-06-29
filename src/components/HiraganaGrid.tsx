import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { STATUS_COLORS, STATUS_LABELS_SHORT } from '@/constants/status'

const ROWS = [
  { label: 'Vokale', ids: ['h-a', 'h-i', 'h-u', 'h-e', 'h-o'] },
  { label: 'K-Reihe', ids: ['h-ka', 'h-ki', 'h-ku', 'h-ke', 'h-ko'] },
  { label: 'S-Reihe', ids: ['h-sa', 'h-si', 'h-su', 'h-se', 'h-so'] },
  { label: 'T-Reihe', ids: ['h-ta', 'h-ti', 'h-tu', 'h-te', 'h-to'] },
  { label: 'N-Reihe', ids: ['h-na', 'h-ni', 'h-nu', 'h-ne', 'h-no'] },
  { label: 'H-Reihe', ids: ['h-ha', 'h-hi', 'h-hu', 'h-he', 'h-ho'] },
  { label: 'M-Reihe', ids: ['h-ma', 'h-mi', 'h-mu', 'h-me', 'h-mo'] },
  { label: 'Y-Reihe', ids: ['h-ya', 'h-yu', 'h-yo'] },
  { label: 'R-Reihe', ids: ['h-ra', 'h-ri', 'h-ru', 'h-re', 'h-ro'] },
  { label: 'W-Reihe', ids: ['h-wa', 'h-wi', 'h-we', 'h-wo'] },
  { label: 'N (nasal)', ids: ['h-nn'] },
]

export default function HiraganaGrid() {
  const { items } = useStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'new' | 'due'>('all')
  const now = new Date().toISOString()

  const mastered = Object.values(items).filter((i) => i.category === 'hiragana' && i.status === 'mastered').length
  const total = Object.values(items).filter((i) => i.category === 'hiragana').length

  const filteredRows = ROWS.map((row) => ({
    ...row,
    ids: row.ids.filter((id) => {
      const item = items[id]
      if (!item) return false
      if (filter === 'new') return item.status === 'new'
      if (filter === 'due') return item.nextReviewDate <= now
      return true
    }),
  })).filter((r) => r.ids.length > 0)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <div className="flex gap-2">
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
        <span className="ml-auto text-xs text-[var(--text-muted)] font-semibold">{mastered}/{total}</span>
      </div>
      <div className="scroll-area flex-1 px-4 pb-4">
        {filteredRows.map((row) => (
          <div key={row.label} className="mb-5">
            <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{row.label}</h2>
            <div className="grid grid-cols-5 gap-2">
              {row.ids.map((id) => {
                const item = items[id]
                if (!item) return null
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => navigate(`/learn/${id}`)}
                    className="kana-cell active:scale-95"
                  >
                    <span className="text-2xl leading-none text-[var(--text-primary)]">{item.character}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">{item.romaji}</span>
                    <span className={`text-[9px] px-1 rounded-sm ${STATUS_COLORS[item.status]}`}>
                      {STATUS_LABELS_SHORT[item.status]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
