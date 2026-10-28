import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import WeeklyProgress from '@/components/WeeklyProgress'
import { useStore } from '@/store/useStore'
import { STATS_CAT_OPTIONS } from '@/constants/srs'
import { catFilterLabel } from '@/constants/status'
import type { ItemCategory } from '@/types'

type CatFilter = ItemCategory | 'all'

function pct(mastered: number, total: number): number {
  return total > 0 ? Math.round((mastered / total) * 100) : 0
}

export default function StatsPage() {
  const { items, progress, grammarSrs } = useStore()
  const [catFilter, setCatFilter] = useState<CatFilter>('all')

  const all = Object.values(items).filter((i) => catFilter === 'all' || i.category === catFilter)

  const byStatus = {
    new: all.filter((i) => i.status === 'new').length,
    learning: all.filter((i) => i.status === 'learning').length,
    uncertain: all.filter((i) => i.status === 'uncertain').length,
    mastered: all.filter((i) => i.status === 'mastered').length,
  }
  const total = all.length

  const accuracy =
    progress.totalCorrect + progress.totalErrors > 0
      ? Math.round((progress.totalCorrect / (progress.totalCorrect + progress.totalErrors)) * 100)
      : 0

  const weakest = [...all]
    .filter((i) => i.errorCount > 0)
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 8)

  const champions = [...all]
    .filter((i) => i.status === 'mastered')
    .sort((a, b) => b.interval - a.interval)
    .slice(0, 8)

  const allItems = Object.values(items)
  const jlpt = {
    kanji: {
      mastered: allItems.filter((i) => i.category === 'kanji' && i.status === 'mastered').length,
      total: allItems.filter((i) => i.category === 'kanji').length,
    },
    kana: {
      mastered: allItems.filter(
        (i) => (i.category === 'hiragana' || i.category === 'katakana') && i.status === 'mastered'
      ).length,
      total: allItems.filter((i) => i.category === 'hiragana' || i.category === 'katakana').length,
    },
    vocab: {
      mastered: allItems.filter((i) => i.category === 'vocabulary' && i.status === 'mastered').length,
      total: allItems.filter((i) => i.category === 'vocabulary').length,
    },
    grammar: {
      mastered: Object.values(grammarSrs).filter((g) => g.status === 'mastered').length,
      total: Object.values(grammarSrs).length,
    },
  }

  const jlptOverall = pct(
    jlpt.kanji.mastered + jlpt.kana.mastered + jlpt.vocab.mastered + jlpt.grammar.mastered,
    jlpt.kanji.total + jlpt.kana.total + jlpt.vocab.total + jlpt.grammar.total
  )

  return (
    <div className="scroll-area h-full">
      <div className="page-width">
        <PageHeader
          eyebrow="DEIN LERNWEG"
          title="Sieh, was du schon kannst."
          description="Deine geübten Inhalte und persönlichen Fortschritte im Überblick."
        />

        <WeeklyProgress />
        <div className="card-surface p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Beherrschte Lerninhalte
            </h2>
            <span className="text-2xl font-bold text-[var(--green)]">{jlptOverall}%</span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
            Dein Fortschritt in den Lerninhalten dieser App.
          </p>
          <div className="space-y-3">
            <JlptRow label="Kanji" symbol="漢" {...jlpt.kanji} color="progress-fill--orange" />
            <JlptRow label="Kana" symbol="あ" {...jlpt.kana} color="progress-fill--blue" />
            <JlptRow label="Grammatik" symbol="文" {...jlpt.grammar} color="progress-fill--green" />
            <JlptRow label="Vokabeln" symbol="語" {...jlpt.vocab} color="progress-fill--blue" />
          </div>
        </div>

        <h2 className="text-sm font-semibold mb-3">Dein Lernen insgesamt</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          <BigStat
            label="Lernserie"
            value={`${progress.currentStreak} ${progress.currentStreak === 1 ? 'Tag' : 'Tage'}`}
          />
          <BigStat label="Genauigkeit" value={progress.cardsReviewed > 0 ? `${accuracy}%` : '–'} />
          <BigStat label="Gesamt richtig" value={String(progress.totalCorrect)} accent="green" />
          <BigStat label="Gesamt falsch" value={String(progress.totalErrors)} accent="red" />
          <BigStat label="Übungssitzungen" value={String(progress.studySessions ?? 0)} />
          <BigStat label="Karten bewertet" value={String(progress.cardsReviewed ?? 0)} />
        </div>

        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Fortschritt nach Lernbereich">
          {STATS_CAT_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setCatFilter(key)}
              aria-pressed={catFilter === key}
              className={`flex-none px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                catFilter === key ? 'chip chip--active' : 'chip'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="card-surface p-4 mb-4">
          <h2 className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-3">
            {catFilterLabel(catFilter)} — Fortschritt
          </h2>
          <div className="space-y-2.5">
            <StatusRow label="Neu" count={byStatus.new} total={total} color="bg-[var(--border)]" />
            <StatusRow label="Lernen" count={byStatus.learning} total={total} color="bg-[var(--blue)]" />
            <StatusRow label="Unsicher" count={byStatus.uncertain} total={total} color="bg-[var(--orange)]" />
            <StatusRow label="Beherrscht" count={byStatus.mastered} total={total} color="bg-[var(--green)]" />
          </div>
        </div>

        {catFilter !== 'all' && (
          <div className="card-surface p-4 mb-4">
            <h2 className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-3">
              Wiederholungsintervalle
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              {[
                { min: 0, max: 1, label: '10 Min.' },
                { min: 1, max: 4, label: '1–3 Tage' },
                { min: 4, max: 7, label: '4–6 Tage' },
                { min: 7, max: 14, label: '7–13 Tage' },
                { min: 14, max: Infinity, label: '14+ Tage' },
              ].map(({ min, max, label }) => {
                const count = all.filter(
                  (i) => i.lastReviewDate !== null && i.interval >= min && i.interval < max
                ).length
                return (
                  <div
                    key={min}
                    className="rounded-xl bg-[var(--bg-muted)] p-2 border border-[var(--border)]"
                  >
                    <div className="text-base font-bold text-[var(--blue)]">{count}</div>
                    <div className="text-[10px] text-[var(--text-muted)] font-semibold">{label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {weakest.length > 0 && (
          <div className="card-surface p-4 mb-4">
            <h2 className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-3">
              Meine Schwächen
            </h2>
            <div className="flex flex-wrap gap-3">
              {weakest.map((i) => (
                <Link
                  key={i.id}
                  to={`/learn/${i.id}`}
                  className="flex flex-col items-center rounded-lg p-1"
                  aria-label={`${i.character}: ${i.meaning} ansehen`}
                >
                  <span className="jp text-2xl text-[var(--text-primary)]">{i.character}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{i.romaji}</span>
                  <span className="text-xs text-[var(--red)] font-bold">{i.errorCount}✗</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {champions.length > 0 && (
          <div className="card-surface p-4 mb-5">
            <h2 className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-wider mb-3">
              Am besten gelernt
            </h2>
            <div className="flex flex-wrap gap-3">
              {champions.map((i) => (
                <Link
                  key={i.id}
                  to={`/learn/${i.id}`}
                  className="flex flex-col items-center rounded-lg p-1"
                  aria-label={`${i.character}: ${i.meaning} ansehen`}
                >
                  <span className="jp text-2xl text-[var(--text-primary)]">{i.character}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{i.romaji}</span>
                  <span className="text-xs text-[var(--green)] font-bold">{i.interval}T</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link to="/settings" className="text-link">
          Ziele und Einstellungen anpassen →
        </Link>
      </div>
    </div>
  )
}

function JlptRow({
  label,
  symbol,
  mastered,
  total,
  color,
}: {
  label: string
  symbol: string
  mastered: number
  total: number
  color: string
}) {
  const percent = pct(mastered, total)
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="font-bold text-[var(--text-primary)]">
          <span className="jp inline-block w-6 text-[var(--blue)]" lang="ja" aria-hidden="true">
            {symbol}
          </span>{' '}
          {label}
        </span>
        <span className="text-[var(--text-secondary)] font-semibold text-xs">
          {mastered}/{total} · {percent}%
        </span>
      </div>
      <div className="progress-track h-2.5">
        <div className={`progress-fill ${color} h-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function BigStat({ label, value, accent }: { label: string; value: string; accent?: 'green' | 'red' }) {
  const valueColor =
    accent === 'green'
      ? 'text-[var(--green)]'
      : accent === 'red'
        ? 'text-[var(--red)]'
        : 'text-[var(--text-primary)]'

  return (
    <div className="card-surface p-4 text-center">
      <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
      <div className="text-xs text-[var(--text-muted)] mt-0.5 font-semibold">{label}</div>
    </div>
  )
}

function StatusRow({
  label,
  count,
  total,
  color,
}: {
  label: string
  count: number
  total: number
  color: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[var(--text-muted)] text-xs w-20 font-semibold">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-[var(--bg-muted)] overflow-hidden border border-[var(--border)]">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
        />
      </div>
      <span className="text-[var(--text-muted)] text-xs w-6 text-right font-semibold">{count}</span>
    </div>
  )
}
