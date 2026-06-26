import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { VOCAB_CATEGORIES } from '@/data/vocabulary'
import { playJapanese } from '@/utils/audio'
import { STATUS_DOT } from '@/constants/status'

export default function VocabPage() {
  const { items } = useStore()
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState('all')

  const vocabItems = Object.values(items)
    .filter((i) => i.category === 'vocabulary')
    .filter((i) => activeCat === 'all' || i.vocabCategory === activeCat)
    .sort((a, b) => a.id.localeCompare(b.id))

  const mastered = Object.values(items).filter((i) => i.category === 'vocabulary' && i.status === 'mastered').length
  const total = Object.values(items).filter((i) => i.category === 'vocabulary').length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Vokabeln</h1>
          <p className="text-white/40 text-xs">{mastered}/{total} beherrscht</p>
        </div>
      </div>

      {/* Category filter – horizontal scroll */}
      <div className="overflow-x-auto flex gap-2 px-4 pb-3 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
        {VOCAB_CATEGORIES.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveCat(key)}
            className={`flex-none flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCat === key ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/50'
            }`}
          >
            <span>{icon}</span>{label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="scroll-area flex-1 px-4 pb-4 space-y-2">
        {vocabItems.length === 0 && (
          <p className="text-center text-white/30 text-sm mt-12">Keine Vokabeln gefunden</p>
        )}
        {vocabItems.map((item) => (
          <div
            key={item.id}
            className="w-full rounded-2xl bg-white/5 border border-white/8 p-3.5 flex items-center gap-3"
          >
            <button
              type="button"
              onClick={() => navigate(`/learn/${item.id}`)}
              className="flex flex-1 items-center gap-3 active:scale-[0.98] transition-transform text-left min-w-0"
            >
              <div className={`w-2 h-2 rounded-full flex-none ${STATUS_DOT[item.status]}`} />
              <div className="flex-1 min-w-0">
                <div className="text-lg font-medium text-white leading-tight">{item.character}</div>
                <div className="text-xs text-white/40">{item.romaji}</div>
              </div>
              <div className="text-sm text-white/60 text-right max-w-[120px] truncate">{item.meaning}</div>
            </button>
            <button
              type="button"
              onClick={() => playJapanese(item.id, item.character)}
              className="text-lg flex-none text-white/30 active:text-indigo-400 transition-colors"
              aria-label={`${item.character} anhören`}
            >
              🔊
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
