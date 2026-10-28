import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import PageHeader from '@/components/PageHeader'
export default function NotebookPage() {
  const store = useStore(),
    [query, setQuery] = useState(''),
    [tag, setTag] = useState('Alle')
  const ids = [...new Set([...store.pinnedReviewIds, ...Object.keys(store.notebook)])].filter(
    (id) => store.items[id]
  )
  const tags = [...new Set(ids.flatMap((id) => store.notebook[id]?.tags ?? []))]
  const matches = ids.filter((id) => {
    const item = store.items[id],
      entry = store.notebook[id]
    return (
      (tag === 'Alle' || entry?.tags.includes(tag)) &&
      [item.character, item.romaji, item.meaning, entry?.note ?? ''].some((value) =>
        value.toLowerCase().includes(query.toLowerCase())
      )
    )
  })
  return (
    <div className="scroll-area h-full">
      <div className="page-width">
        <PageHeader
          eyebrow="DEIN PERSÖNLICHES LERNHEFT"
          title="Wörter mit deiner Geschichte."
          description="Merke Inhalte aus der Bibliothek oder beim Lesen und ergänze eigene Notizen."
        />
        <input
          type="search"
          className="search-input mb-4"
          aria-label="Im Lernheft suchen"
          placeholder="Wort oder Notiz suchen"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex flex-wrap gap-2 mb-5">
          {['Alle', ...tags].map((value) => (
            <button
              key={value}
              type="button"
              className={`chip ${tag === value ? 'chip--active' : ''}`}
              aria-pressed={tag === value}
              onClick={() => setTag(value)}
            >
              {value}
            </button>
          ))}
        </div>
        {!matches.length && (
          <div className="card-surface p-6">
            <p role="status">
              Hier ist noch kein passender Eintrag. Öffne ein Wort und wähle „Im Lernheft merken“.
            </p>
            <Link to="/learn" className="text-link mt-4">
              Wörter entdecken →
            </Link>
          </div>
        )}
        <div className="space-y-5">
          {matches.map((id) => {
            const item = store.items[id],
              entry = store.notebook[id] ?? { note: '', example: '', tags: [] }
            return (
              <section key={id} className="card-surface p-5">
                <div className="section-heading">
                  <div>
                    <Link to={`/learn/${id}`} lang="ja" className="jp text-2xl text-[var(--blue)]">
                      {item.character}
                    </Link>
                    <h2 className="font-semibold mt-2">{item.meaning}</h2>
                  </div>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      if (window.confirm('Diesen Eintrag aus dem Lernheft entfernen?')) {
                        store.unpinForReview(id)
                        const notebook = { ...store.notebook }
                        delete notebook[id]
                        useStore.setState({ notebook })
                      }
                    }}
                  >
                    Entfernen
                  </button>
                </div>
                <label className="form-label">
                  Deine Notiz
                  <textarea
                    maxLength={5000}
                    rows={3}
                    className="search-input"
                    value={entry.note}
                    onChange={(event) => store.updateNotebook(id, { note: event.target.value })}
                  />
                </label>
                <label className="form-label">
                  Dein Beispielsatz
                  <input
                    maxLength={2000}
                    className="search-input"
                    value={entry.example}
                    onChange={(event) => store.updateNotebook(id, { example: event.target.value })}
                  />
                </label>
                <label className="form-label">
                  Sammlungen, durch Komma getrennt
                  <TagInput id={id} tags={entry.tags} />
                </label>
                <p className="text-xs text-[var(--text-muted)] mt-3">
                  Änderungen werden automatisch gespeichert.
                </p>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TagInput({ id, tags }: { id: string; tags: string[] }) {
  const [value, setValue] = useState(tags.join(', '))
  const update = useStore((state) => state.updateNotebook)
  return (
    <input
      maxLength={300}
      className="search-input"
      placeholder="Japanreise, Essen"
      value={value}
      onChange={(event) => {
        setValue(event.target.value)
        update(id, {
          tags: event.target.value
            .split(',')
            .map((tag) => tag.trim().slice(0, 200))
            .filter(Boolean)
            .slice(0, 20),
        })
      }}
    />
  )
}
