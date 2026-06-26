import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { XP_PER_LEVEL, xpInLevel, xpToLevel } from '@/constants/srs'
import { localDateKey } from '@/utils/date'
import type { ItemCategory } from '@/types'

const CAT_CONFIG: { key: ItemCategory; kana: string; label: string; color: string }[] = [
  { key: 'hiragana', kana: 'あ', label: 'Hiragana', color: 'from-blue-600/30 to-blue-800/10' },
  { key: 'katakana', kana: 'ア', label: 'Katakana', color: 'from-purple-600/30 to-purple-800/10' },
  { key: 'kanji', kana: '漢', label: 'Kanji N5', color: 'from-orange-600/30 to-orange-800/10' },
  { key: 'vocabulary', kana: '語', label: 'Vokabeln', color: 'from-green-600/30 to-green-800/10' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { progress, items, getDueItems, setActiveCategory } = useStore()
  const all = Object.values(items)
  const due = getDueItems(undefined, 999).length

  const catStats = (cat: ItemCategory) => {
    const ci = all.filter((i) => i.category === cat)
    const mastered = ci.filter((i) => i.status === 'mastered').length
    const learning = ci.filter((i) => i.status === 'learning' || i.status === 'uncertain').length
    return { mastered, learning, total: ci.length }
  }

  const goLearn = (cat: ItemCategory) => {
    setActiveCategory(cat)
    navigate('/learn')
  }

  const level = xpToLevel(progress.xp ?? 0)
  const xpNow = xpInLevel(progress.xp ?? 0)
  const xpPct = Math.round((xpNow / XP_PER_LEVEL) * 100)

  const todayCorrect =
    progress.todayDate === localDateKey() ? (progress.todayCorrect ?? 0) : 0
  const dailyGoal = 20
  const dailyDone = Math.min(todayCorrect, dailyGoal)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'おはようございます！' : hour < 18 ? 'こんにちは！' : 'こんばんは！'

  return (
    <div className="scroll-area h-full px-4 pt-3 pb-3 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/40 text-xs jp">{greeting}</p>
          <h1 className="text-xl font-bold text-white leading-tight">Japanisch lernen</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] text-white/30">Level {level}</div>
            <div className="text-xs text-indigo-300 font-medium">{xpNow}/{XP_PER_LEVEL} XP</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">{level}</span>
          </div>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
          style={{ width: `${xpPct}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard icon="🔥" value={String(progress.currentStreak ?? 0)} label="Serie" accent={(progress.currentStreak ?? 0) > 0} />
        <StatCard icon="⚡" value={String(todayCorrect)} label="Heute" />
        <button
          type="button"
          onClick={() => navigate('/practice')}
          aria-label={`${due} fällige Karten üben`}
          className={`rounded-2xl p-2.5 text-center active:scale-95 transition-all ${due > 0 ? 'bg-indigo-600/30 border border-indigo-500/40' : 'bg-white/5'}`}
        >
          <div className="text-lg" aria-hidden="true">📅</div>
          <div className={`text-lg font-bold leading-tight ${due > 0 ? 'text-indigo-300' : 'text-white'}`}>{due}</div>
          <div className="text-[10px] text-white/40">Fällig</div>
        </button>
      </div>

      {due > 0 && (
        <button
          type="button"
          onClick={() => navigate('/practice')}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-sm active:scale-[0.97] transition-transform"
        >
          Wiederholung starten · {due} Karten →
        </button>
      )}

      <div className="rounded-2xl bg-white/5 border border-white/8 px-3 py-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">Tagesziel</span>
          <span className="text-xs text-white/40">{dailyDone}/{dailyGoal}</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${(dailyDone / dailyGoal) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">Kategorien</h2>
        <div className="grid grid-cols-2 gap-2">
          {CAT_CONFIG.map(({ key, kana, label, color }) => {
            const s = catStats(key)
            const pct = s.total > 0 ? (s.mastered / s.total) * 100 : 0
            return (
              <button
                key={key}
                type="button"
                onClick={() => goLearn(key)}
                className={`rounded-2xl p-3 text-left bg-gradient-to-br ${color} border border-white/8 active:scale-[0.97] transition-all`}
              >
                <div className="text-2xl jp font-bold mb-1 text-white">{kana}</div>
                <div className="text-xs font-semibold text-white">{label}</div>
                <div className="text-[10px] text-white/40 mb-1.5">{s.mastered}/{s.total} gelernt</div>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-white/50 transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {(progress.currentStreak ?? 0) >= 3 && (
        <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 px-3 py-2 text-center">
          <span className="text-orange-300 text-xs">🔥 {progress.currentStreak} Tage am Stück!</span>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, value, label, accent, accentColor = 'indigo' }: {
  icon: string; value: string; label: string; accent?: boolean; accentColor?: string
}) {
  const accentClass = accent
    ? accentColor === 'orange'
      ? 'bg-orange-500/15 border border-orange-500/25 text-orange-300'
      : 'bg-indigo-500/15 border border-indigo-500/25 text-indigo-300'
    : 'bg-white/5 border border-white/8 text-white'

  return (
    <div className={`rounded-2xl p-3 text-center ${accentClass}`}>
      <div className="text-lg mb-0.5" aria-hidden="true">{icon}</div>
      <div className={`text-xl font-bold leading-tight ${accent ? '' : 'text-white'}`}>{value}</div>
      <div className="text-[10px] opacity-60 mt-0.5">{label}</div>
    </div>
  )
}
