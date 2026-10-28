import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { lessons } from '@/data/curriculum'
import { STATUS_COLORS, STATUS_LABELS_SHORT } from '@/constants/status'
export default function KanaGrid({ category }: { category: 'hiragana' | 'katakana' }) {
  const { items, displayPrefs } = useStore(),
    [filter, setFilter] = useState<'all' | 'new' | 'due'>('all'),
    [historical, setHistorical] = useState(false)
  const now = new Date().toISOString(),
    all = Object.values(items).filter((item) => item.category === category)
  const groups = lessons
    .filter((lesson) => lesson.category === category)
    .map((lesson) => ({ title: lesson.title.split(' · ')[1], ids: lesson.itemIds }))
  if (historical)
    groups.push({
      title: 'Historische Zeichen',
      ids: all.filter((item) => item.historical).map((item) => item.id),
    })
  const visible = groups
    .map((group) => ({
      ...group,
      ids: group.ids.filter((id) =>
        filter === 'new'
          ? items[id].lastReviewDate === null
          : filter === 'due'
            ? items[id].lastReviewDate !== null && items[id].nextReviewDate <= now
            : true
      ),
    }))
    .filter((group) => group.ids.length)
  return (
    <div className="page-screen">
      <div className="flex flex-wrap items-center gap-2 p-4">
        <div role="group" aria-label="Zeichen filtern" className="flex gap-2">
          {(['all', 'new', 'due'] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={`chip ${filter === key ? 'chip--active' : ''}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {key === 'all' ? 'Alle' : key === 'new' ? 'Neu' : 'Fällig'}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-[var(--text-muted)]">
          {all.filter((item) => !item.historical && item.status === 'mastered').length}/
          {all.filter((item) => !item.historical).length} modern
        </span>
      </div>
      <div className="scroll-area flex-1 min-h-0 px-4 pb-4">
        {!visible.length && (
          <p role="status" className="empty-state">
            Keine passenden Zeichen. Für heute ist hier nichts fällig.
          </p>
        )}
        {visible.map((group) => (
          <section key={group.title} className="mb-5">
            <h2 className="eyebrow mb-3">{group.title}</h2>
            <div className="grid grid-cols-5 gap-2">
              {group.ids.map((id) => {
                const item = items[id],
                  reading =
                    displayPrefs.showRomaji &&
                    !(
                      displayPrefs.adaptiveAids &&
                      item.correctCount >= 3 &&
                      item.correctCount > item.errorCount * 3
                    )
                return (
                  <Link key={id} to={`/learn/${id}`} className="kana-cell text-center">
                    <span lang="ja" className="jp text-2xl">
                      {item.character}
                    </span>
                    {reading && <span className="text-xs text-[var(--text-muted)]">{item.romaji}</span>}
                    <span className={`text-[10px] px-1 rounded ${STATUS_COLORS[item.status]}`}>
                      {STATUS_LABELS_SHORT[item.status]}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
        <button
          type="button"
          className="text-link"
          aria-pressed={historical}
          onClick={() => setHistorical(!historical)}
        >
          {historical ? 'Historische Zeichen ausblenden' : 'Historische ゐ・ゑ anzeigen'}
        </button>
      </div>
    </div>
  )
}
