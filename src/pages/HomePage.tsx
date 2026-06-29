import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { XP_PER_LEVEL, xpInLevel, xpToLevel } from '@/constants/srs'
import { localDateKey } from '@/utils/date'
import DisplaySettings from '@/components/DisplaySettings'
import { stories } from '@/data/stories'
import type { ItemCategory } from '@/types'

const CAT_CONFIG: { key: ItemCategory; kana: string; label: string; emoji: string }[] = [
  { key: 'hiragana', kana: 'あ', label: 'Hiragana', emoji: '🔤' },
  { key: 'katakana', kana: 'ア', label: 'Katakana', emoji: '🔡' },
  { key: 'kanji', kana: '漢', label: 'Kanji N5', emoji: '🈶' },
  { key: 'vocabulary', kana: '語', label: 'Vokabeln', emoji: '💬' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { progress, items, getDueItems, getDueGrammarCount, setActiveCategory, storyProgress, displayPrefs, setDisplayPrefs } = useStore()
  const all = Object.values(items)
  const due = getDueItems(undefined, 999).length + getDueGrammarCount()

  const catStats = (cat: ItemCategory) => {
    const ci = all.filter((i) => i.category === cat)
    const mastered = ci.filter((i) => i.status === 'mastered').length
    return { mastered, total: ci.length }
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
  const dailyGoal = displayPrefs.dailyGoal ?? 20
  const dailyDone = Math.min(todayCorrect, dailyGoal)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Guten Morgen!' : hour < 18 ? 'Hallo!' : 'Guten Abend!'

  return (
    <div className="page-screen">
      {/* Duolingo-style header banner */}
      <div className="header-banner shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[var(--header-text-muted)] text-sm">{greeting}</p>
            <h1 className="text-xl font-bold text-[var(--header-text)]">Japanisch lernen</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDisplayPrefs({ theme: displayPrefs.theme === 'dark' ? 'light' : 'dark' })}
              className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg active:scale-90 transition-transform"
              aria-label="Hell/Dunkel"
            >
              {displayPrefs.theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <div className="text-right">
              <div className="text-[10px] text-[var(--header-text-muted)] uppercase tracking-wide">Level</div>
              <div className="text-sm text-[var(--header-text)] font-bold">{xpNow}/{XP_PER_LEVEL} XP</div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#ff9600] border-2 border-[#e68600] flex items-center justify-center shadow-[0_3px_0_#e68600]">
              <span className="text-[var(--header-text)] font-bold text-lg">{level}</span>
            </div>
          </div>
        </div>
        <div className="progress-track">
          <div className="progress-fill progress-fill--orange h-full" style={{ width: `${xpPct}%` }} />
        </div>
      </div>

      <div className="scroll-area flex-1 min-h-0 px-4 pt-4 pb-2 flex flex-col gap-3">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 shrink-0">
          <StatCard icon="🔥" value={String(progress.currentStreak ?? 0)} label="Serie" accent />
          <StatCard icon="⚡" value={String(todayCorrect)} label="Heute" />
          <StatCard icon="📅" value={String(due)} label="Fällig" accent={due > 0} />
        </div>

        {/* Main CTA — like Duolingo "Continue" */}
        {due > 0 ? (
          <button type="button" onClick={() => navigate('/practice')} className="btn-duo shrink-0">
            Lektion fortsetzen · {due} Karten
          </button>
        ) : (
          <button type="button" onClick={() => navigate('/learn')} className="btn-duo btn-duo--blue shrink-0">
            Neues lernen
          </button>
        )}

        {/* Daily goal */}
        <div className="card-surface px-4 py-3 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Tagesziel</span>
            <span className="text-xs font-bold text-[var(--green)]">{dailyDone}/{dailyGoal}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill h-full" style={{ width: `${(dailyDone / dailyGoal) * 100}%` }} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/immerse')}
          className="card-surface w-full p-3 text-left shrink-0 active:translate-y-0.5 transition-transform border-[var(--blue)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">📖 Geschichten lesen</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-semibold">
                Tap-to-Lookup · {storyProgress.completed.length}/{stories.length} abgeschlossen
              </p>
            </div>
            <span className="jp text-2xl text-[var(--blue)]">読</span>
          </div>
        </button>

        {/* Next learning step */}
        {(() => {
          const next = CAT_CONFIG.map(({ key, label, emoji }) => {
            const s = catStats(key)
            const pct = s.total > 0 ? s.mastered / s.total : 0
            return { key, label, emoji, pct, s }
          }).sort((a, b) => a.pct - b.pct)[0]
          if (!next || next.pct >= 1) return null
          return (
            <div className="card-surface px-3 py-2 shrink-0 border-[var(--green)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Nächster Schritt</p>
              <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                {next.emoji} {next.label} · {Math.round(next.pct * 100)}% gemeistert
              </p>
            </div>
          )
        })()}

        <DisplaySettings />

        {/* Lesson path — category cards */}
        <div className="flex-1 min-h-[120px]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Lernpfad</h2>
          <div className="grid grid-cols-2 gap-2">
            {CAT_CONFIG.map(({ key, kana, label, emoji }) => {
              const s = catStats(key)
              const pct = s.total > 0 ? (s.mastered / s.total) * 100 : 0
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => goLearn(key)}
                  className="card-surface p-3 text-left active:translate-y-0.5 transition-transform min-h-[100px] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl jp font-bold text-[var(--text-primary)]">{kana}</span>
                    <span className="text-lg" aria-hidden="true">{emoji}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">{label}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{s.mastered}/{s.total} gemeistert</div>
                    <div className="progress-track mt-1.5 h-2">
                      <div className="progress-fill progress-fill--blue h-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {(progress.currentStreak ?? 0) >= 3 && (
          <div className="card-surface px-3 py-2 text-center shrink-0 border-[#ff9600]">
            <span className="text-[var(--orange)] text-sm font-bold">🔥 {progress.currentStreak} Tage Serie!</span>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, value, label, accent }: {
  icon: string; value: string; label: string; accent?: boolean
}) {
  return (
    <div className={`card-surface p-2.5 text-center ${accent ? 'border-[var(--orange)]' : ''}`}>
      <div className="text-lg mb-0.5" aria-hidden="true">{icon}</div>
      <div className={`text-xl font-bold leading-tight ${accent ? 'text-[var(--orange)]' : 'text-[var(--text-primary)]'}`}>{value}</div>
      <div className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">{label}</div>
    </div>
  )
}
