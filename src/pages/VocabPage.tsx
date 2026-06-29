import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { VOCAB_CATEGORIES } from '@/data/vocabulary'
import { playJapanese, unlockAudio } from '@/utils/audio'
import { STATUS_DOT } from '@/constants/status'
import ReadingBreakdown from '@/components/ReadingBreakdown'
import { AudioIcon } from '@/components/icons/UiIcons'

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
    <div className="page-screen">
      <div className="px-4 pt-3 pb-2 shrink-0">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Vokabeln</h1>
        <p className="text-[var(--text-muted)] text-xs font-semibold">{mastered}/{total} beherrscht</p>
      </div>

      <div className="overflow-x-auto flex gap-2 px-4 pb-2 shrink-0 scrollbar-none">
        {VOCAB_CATEGORIES.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveCat(key)}
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
          <p className="text-center text-[var(--text-muted)] text-sm mt-12 font-semibold">Keine Vokabeln gefunden</p>
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
                {item.character.length > 1 ? (
                  <ReadingBreakdown character={item.character} romaji={item.romaji} size="sm" compact />
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl jp font-bold text-[var(--text-primary)]">{item.character}</span>
                    <span className="text-xs text-[var(--blue)] font-semibold">{item.romaji}</span>
                  </div>
                )}
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
