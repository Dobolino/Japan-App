import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import type { ItemCategory } from '../types'

export default function HomePage() {
  const navigate = useNavigate()
  const { progress, items, getDueItems, setActiveCategory } = useStore()
  const all = Object.values(items)
  const mastered = all.filter(i => i.status === 'mastered').length
  const due = getDueItems(undefined, 999).length
  const total = all.length

  const catStats = (cat: ItemCategory) => {
    const catItems = all.filter(i => i.category === cat)
    return { mastered: catItems.filter(i => i.status === 'mastered').length, total: catItems.length }
  }

  const goLearn = (cat: ItemCategory) => { setActiveCategory(cat); navigate('/learn') }

  return (
    <div className="scroll-area h-full px-4 py-6">
      <div className="mb-6">
        <p className="text-white/40 text-sm">ようこそ！</p>
        <h1 className="text-2xl font-bold text-white">Japanisch lernen</h1>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Serie" value={`${progress.currentStreak}🔥`} />
        <StatCard label="Gelernt" value={`${mastered}/${total}`} />
        <StatCard label="Fällig" value={String(due)} accent={due > 0} />
      </div>

      {due > 0 && (
        <button onClick={() => navigate('/practice')}
          className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-semibold text-lg mb-5 active:scale-[0.97] transition-transform">
          Wiederholung starten ({due} Karten)
        </button>
      )}

      <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Kategorien</h2>
      <div className="grid grid-cols-2 gap-3">
        {([ ['hiragana','あいう','Hiragana'], ['katakana','アイウ','Katakana'], ['kanji','漢字','Kanji N5'], ['vocabulary','言葉','Vokabeln'] ] as [ItemCategory,string,string][]).map(([cat,kana,title]) => {
          const s = catStats(cat)
          return (
            <button key={cat} onClick={() => goLearn(cat)}
              className="rounded-2xl p-4 text-left bg-white/8 border border-white/10 active:scale-[0.97] transition-all hover:border-indigo-500/40">
              <div className="text-2xl font-bold text-indigo-300 mb-1">{kana}</div>
              <div className="text-sm font-semibold text-white">{title}</div>
              <div className="text-xs text-white/40 mb-1.5">{s.mastered}/{s.total} gelernt</div>
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: s.total > 0 ? `${(s.mastered/s.total)*100}%` : '0%' }} />
              </div>
            </button>
          )
        })}
      </div>

      {total > 0 && (
        <div className="mt-5">
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Gesamtfortschritt</span>
            <span>{Math.round((mastered/total)*100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${(mastered/total)*100}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-3 text-center ${accent ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-white/5'}`}>
      <div className={`text-xl font-bold ${accent ? 'text-orange-300' : 'text-white'}`}>{value}</div>
      <div className="text-xs text-white/40">{label}</div>
    </div>
  )
}
