import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { playJapanese } from '../utils/audio'

const STATUS_COLORS = {
  new: 'bg-white/10 text-white/50',
  learning: 'bg-blue-500/20 text-blue-300',
  uncertain: 'bg-yellow-500/20 text-yellow-300',
  mastered: 'bg-green-500/20 text-green-300',
}

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
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Kanji N5</h1>
          <p className="text-white/40 text-xs">{mastered}/{total} beherrscht · {total} JLPT N5 Kanji</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 px-4 pb-3">
        {(['all', 'new', 'due'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === f ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/50'
            }`}
          >
            {f === 'all' ? 'Alle' : f === 'new' ? 'Neu' : 'Fällig'}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="scroll-area flex-1 px-4 pb-4">
        <div className="grid grid-cols-4 gap-2">
          {kanjiItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/learn/${item.id}`)}
              className="rounded-2xl bg-white/5 border border-white/8 p-2 flex flex-col items-center gap-1 active:scale-95 transition-transform"
            >
              <div className="flex justify-between w-full items-start">
                <span className="text-[10px] text-white/30">{item.strokeCount}画</span>
                <button
                  onClick={(e) => { e.stopPropagation(); playJapanese(item.id, item.character) }}
                  className="text-[11px] text-white/20 active:text-indigo-400"
                >🔊</button>
              </div>
              <span className="text-3xl leading-none">{item.character}</span>
              <span className="text-[10px] text-white/40 text-center leading-tight">{item.meaning}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${STATUS_COLORS[item.status]}`}>
                {item.status === 'new' ? 'Neu' : item.status === 'learning' ? 'Lernen' : item.status === 'uncertain' ? 'Unsicher' : 'Beherrscht'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
