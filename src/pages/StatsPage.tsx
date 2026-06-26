import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { ItemCategory } from '../types'

type CatFilter = ItemCategory | 'all'

const CAT_TABS: { key: CatFilter; label: string }[] = [
  { key: 'all',        label: 'Gesamt' },
  { key: 'hiragana',   label: 'Hiragana' },
  { key: 'katakana',   label: 'Katakana' },
  { key: 'kanji',      label: 'Kanji' },
  { key: 'vocabulary', label: 'Vokabeln' },
]

export default function StatsPage() {
  const { items, progress, resetProgress } = useStore()
  const [catFilter, setCatFilter] = useState<CatFilter>('all')

  const all = Object.values(items).filter(
    (i) => catFilter === 'all' || i.category === catFilter
  )

  const byStatus = {
    new:       all.filter((i) => i.status === 'new').length,
    learning:  all.filter((i) => i.status === 'learning').length,
    uncertain: all.filter((i) => i.status === 'uncertain').length,
    mastered:  all.filter((i) => i.status === 'mastered').length,
  }
  const total = all.length

  const accuracy =
    progress.totalCorrect + progress.totalErrors > 0
      ? Math.round((progress.totalCorrect / (progress.totalCorrect + progress.totalErrors)) * 100)
      : 0

  // Weakest: most errors (only items that have been reviewed)
  const weakest = [...all]
    .filter((i) => i.errorCount > 0)
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 8)

  // Longest intervals (mastered items)
  const champions = [...all]
    .filter((i) => i.status === 'mastered')
    .sort((a, b) => b.interval - a.interval)
    .slice(0, 8)

  return (
    <div className="scroll-area h-full px-4 py-5">
      <h1 className="text-xl font-bold text-white mb-4">Statistik</h1>

      {/* Category tabs — horizontal scroll */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-none">
        {CAT_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCatFilter(key)}
            className={`flex-none px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              catFilter === key ? 'bg-indigo-600 text-white' : 'bg-white/8 text-white/40'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <BigStat label="Lernserie" value={`${progress.currentStreak} 🔥`} />
        <BigStat label="Genauigkeit" value={`${accuracy}%`} />
        <BigStat label="Gesamt richtig" value={String(progress.totalCorrect)} color="text-green-400" />
        <BigStat label="Gesamt falsch"  value={String(progress.totalErrors)}  color="text-red-400" />
      </div>

      {/* Status breakdown */}
      <div className="rounded-2xl bg-white/5 p-4 mb-4">
        <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">
          {catFilter === 'all' ? 'Alle Kategorien' : catFilter === 'hiragana' ? 'Hiragana' : 'Katakana'} — Fortschritt
        </h2>
        <div className="space-y-2.5">
          <StatusRow label="Neu"       count={byStatus.new}       total={total} color="bg-white/30" />
          <StatusRow label="Lernen"    count={byStatus.learning}  total={total} color="bg-blue-500" />
          <StatusRow label="Unsicher"  count={byStatus.uncertain} total={total} color="bg-yellow-500" />
          <StatusRow label="Beherrscht"count={byStatus.mastered}  total={total} color="bg-green-500" />
        </div>
      </div>

      {/* SM-2 interval overview */}
      {catFilter !== 'all' && (
        <div className="rounded-2xl bg-white/5 p-4 mb-4">
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Wiederholungsintervalle</h2>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[1, 4, 7, 14].map((days) => {
              const count = all.filter((i) => i.interval >= days && i.interval < (days === 14 ? Infinity : days * 2)).length
              return (
                <div key={days} className="rounded-xl bg-white/5 p-2">
                  <div className="text-base font-bold text-indigo-300">{count}</div>
                  <div className="text-[10px] text-white/30">{days === 14 ? '14+ T' : `~${days}T`}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Weakest */}
      {weakest.length > 0 && (
        <div className="rounded-2xl bg-white/5 p-4 mb-4">
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Meine Schwächen</h2>
          <div className="flex flex-wrap gap-3">
            {weakest.map((i) => (
              <div key={i.id} className="flex flex-col items-center">
                <span className="text-2xl">{i.character}</span>
                <span className="text-[10px] text-white/30">{i.romaji}</span>
                <span className="text-xs text-red-300">{i.errorCount}✗</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Champions */}
      {champions.length > 0 && (
        <div className="rounded-2xl bg-white/5 p-4 mb-5">
          <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Am besten gelernt</h2>
          <div className="flex flex-wrap gap-3">
            {champions.map((i) => (
              <div key={i.id} className="flex flex-col items-center">
                <span className="text-2xl">{i.character}</span>
                <span className="text-[10px] text-white/30">{i.romaji}</span>
                <span className="text-xs text-green-300">{i.interval}T</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={() => {
          if (window.confirm('Wirklich den gesamten Fortschritt zurücksetzen?')) {
            resetProgress()
          }
        }}
        className="w-full py-3 rounded-2xl border border-red-500/30 text-red-400 text-sm font-medium active:scale-[0.97] mb-2"
      >
        Fortschritt zurücksetzen
      </button>
    </div>
  )
}

function BigStat({ label, value, color = 'text-white' }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-white/40 mt-0.5">{label}</div>
    </div>
  )
}

function StatusRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/40 text-xs w-20">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
        />
      </div>
      <span className="text-white/40 text-xs w-6 text-right">{count}</span>
    </div>
  )
}
