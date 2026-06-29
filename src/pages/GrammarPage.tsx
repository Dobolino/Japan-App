import { useState } from 'react'
import { grammarData, GRAMMAR_CATEGORIES } from '@/data/grammar'
import type { GrammarPoint } from '@/data/grammar'
import RubyText from '@/components/RubyText'
import { playJapanese, unlockAudio } from '@/utils/audio'
import { AudioIcon } from '@/components/icons/UiIcons'

const CATEGORY_COLORS: Record<string, string> = {
  Partikel: 'bg-[#eef2ff] text-[var(--blue)] border-[#bce8ff]',
  Verben: 'bg-[#e8f4fd] text-[var(--blue)] border-[#bce8ff]',
  Adjektive: 'bg-[#f3e8ff] text-purple-700 border-purple-200',
  Satzstruktur: 'bg-[#fff3e0] text-[var(--orange)] border-[#ffcc80]',
  Ausdrücke: 'bg-[#e5f9e5] text-[var(--green)] border-[#b7e4b7]',
}

export default function GrammarPage() {
  const [filter, setFilter] = useState<string>('Alle')
  const [open, setOpen] = useState<string | null>(null)

  const filtered = grammarData.filter((g) => filter === 'Alle' || g.category === filter)

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Grammatik N5</h1>
        <p className="text-[var(--text-muted)] text-xs font-semibold">{grammarData.length} Grammatikpunkte</p>
      </div>

      <div className="overflow-x-auto flex gap-2 px-4 pb-3 scrollbar-none">
        {GRAMMAR_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`flex-none px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              filter === cat ? 'chip chip--active' : 'chip'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="scroll-area flex-1 px-4 pb-4 space-y-2">
        {filtered.map((g) => (
          <GrammarCard
            key={g.id}
            g={g}
            open={open === g.id}
            onToggle={() => setOpen(open === g.id ? null : g.id)}
            colorClass={CATEGORY_COLORS[g.category] ?? 'chip'}
          />
        ))}
      </div>
    </div>
  )
}

function GrammarCard({
  g,
  open,
  onToggle,
  colorClass,
}: {
  g: GrammarPoint
  open: boolean
  onToggle: () => void
  colorClass: string
}) {
  return (
    <div className="card-surface overflow-hidden">
      <button type="button" onClick={onToggle} className="w-full p-4 flex items-center gap-3 text-left">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[var(--text-primary)] font-bold">{g.title}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-bold ${colorClass}`}>{g.category}</span>
          </div>
          <div className="text-[var(--text-muted)] text-xs font-semibold">{g.subtitle}</div>
        </div>
        <span className={`text-[var(--text-muted)] transition-transform font-bold ${open ? 'rotate-90' : ''}`}>›</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t-2 border-[var(--border)] pt-3">
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{g.explanation}</p>

          <div className="bg-[var(--bg-muted)] rounded-xl px-3 py-2 border border-[var(--border)]">
            <div className="text-[var(--text-muted)] text-[10px] mb-1 uppercase tracking-wider font-bold">Struktur</div>
            <div className="text-[var(--blue)] text-sm font-mono font-semibold">{g.structure}</div>
          </div>

          <div>
            <div className="text-[var(--text-muted)] text-[10px] uppercase tracking-wider mb-2 font-bold">Beispiele</div>
            <div className="space-y-2">
              {g.examples.map((ex, i) => (
                <div key={i} className="rounded-xl bg-[var(--bg-muted)] p-3 border border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => {
                      unlockAudio()
                      playJapanese(`${g.id}-ex${i}`, ex.jp)
                    }}
                    className="flex items-start gap-2 w-full text-left active:opacity-70"
                  >
                    <div className="flex-1">
                      <RubyText text={ex.jp} reading={ex.reading} size="compact" />
                      <div className="text-[var(--text-muted)] text-xs mt-0.5 jp">{ex.reading}</div>
                      <div className="text-[var(--text-secondary)] text-sm mt-1 font-semibold">{ex.de}</div>
                    </div>
                    <span className="text-[var(--blue)] flex-none mt-0.5">
                      <AudioIcon className="w-5 h-5" />
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
