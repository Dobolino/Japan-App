import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { VOCAB_CATEGORIES } from '@/data/vocabulary'
import { playJapanese, unlockAudio } from '@/utils/audio'
import { STATUS_DOT } from '@/constants/status'
import RubyText from '@/components/RubyText'
import { AudioIcon } from '@/components/icons/UiIcons'

export default function VocabPage() {
  const { items } = useStore()
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState('all')
  const [query, setQuery] = useState('')
  const search = query.trim().normalize('NFKC').toLocaleLowerCase('de')

  const vocabItems = Object.values(items)
    .filter((i) => i.category === 'vocabulary')
    .filter((i) => activeCat === 'all' || i.vocabCategory === activeCat)
    .filter((i) =>
      [i.character, i.romaji, i.meaning].some((value) =>
        value.normalize('NFKC').toLocaleLowerCase('de').includes(search)
      )
    )
    .sort((a, b) => a.id.localeCompare(b.id))

  const mastered = Object.values(items).filter(
    (i) => i.category === 'vocabulary' && i.status === 'mastered'
  ).length
  const total = Object.values(items).filter((i) => i.category === 'vocabulary').length

  return (
    <div className="page-screen">
      <div className="px-4 pt-3 pb-2 shrink-0">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Vokabeln</h2>
        <p className="text-[var(--text-muted)] text-xs font-semibold">
          {mastered}/{total} beherrscht
        </p>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Vokabeln suchen"
          placeholder="Japanisch, Romaji oder Deutsch suchen"
          className="search-input mt-3"
        />
      </div>

      <div
        className="overflow-x-auto flex gap-2 px-4 pb-2 shrink-0 scrollbar-none"
        role="group"
        aria-label="Vokabelthema"
      >
        {VOCAB_CATEGORIES.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveCat(key)}
            aria-pressed={activeCat === key}
            className={`flex-none flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeCat === key ? 'chip chip--active' : 'chip'
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="scroll-area flex-1 min-h-0 px-4 pb-2 space-y-2">
        {vocabItems.length === 0 && (
          <p role="status" className="text-center text-[var(--text-muted)] text-sm mt-12 font-semibold">
            Keine Vokabeln gefunden. Versuche einen anderen Suchbegriff oder Lernbereich.
          </p>
        )}
        {vocabItems.map((item) => (
          <div key={item.id} className="card-surface p-3 flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => navigate(`/learn/${item.id}`)}
              className="flex flex-1 flex-col gap-1.5 active:scale-[0.99] transition-transform text-left min-w-0"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-none ${STATUS_DOT[item.status]}`} />
                <RubyText text={item.character} romaji={item.romaji} size="compact" />
              </div>
              <div className="text-base font-bold text-[var(--text-secondary)] pl-4">{item.meaning}</div>
            </button>
            <button
              type="button"
              onClick={() => {
                unlockAudio()
                playJapanese(item.id, item.character)
              }}
              className="audio-fab audio-fab--sm self-center"
              aria-label={`${item.character} anhören`}
            >
              <AudioIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
