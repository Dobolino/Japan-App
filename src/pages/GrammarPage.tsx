import { useState } from 'react'
import { grammarData, GRAMMAR_CATEGORIES } from '../data/grammar'
import type { GrammarPoint } from '../data/grammar'
import { playJapanese } from '../utils/audio'

export default function GrammarPage() {
  const [filter, setFilter] = useState<string>('Alle')
  const [open, setOpen] = useState<string | null>(null)

  const filtered = grammarData.filter(g => filter === 'Alle' || g.category === filter)

  const CATEGORY_COLORS: Record<string, string> = {
    Partikel: 'bg-indigo-500/20 text-indigo-300',
    Verben: 'bg-blue-500/20 text-blue-300',
    Adjektive: 'bg-purple-500/20 text-purple-300',
    Satzstruktur: 'bg-orange-500/20 text-orange-300',
    Ausdrücke: 'bg-green-500/20 text-green-300',
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold text-white">Grammatik N5</h1>
        <p className="text-white/40 text-xs">{grammarData.length} Grammatikpunkte</p>
      </div>

      {/* Category filter */}
      <div className="overflow-x-auto flex gap-2 px-4 pb-3 scrollbar-none">
        {GRAMMAR_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`flex-none px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === cat ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/50'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="scroll-area flex-1 px-4 pb-4 space-y-2">
        {filtered.map(g => (
          <GrammarCard key={g.id} g={g} open={open === g.id}
            onToggle={() => setOpen(open === g.id ? null : g.id)}
            colorClass={CATEGORY_COLORS[g.category] ?? 'bg-white/10 text-white/50'} />
        ))}
      </div>
    </div>
  )
}

function GrammarCard({ g, open, onToggle, colorClass }: {
  g: GrammarPoint; open: boolean; onToggle: () => void; colorClass: string
}) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 flex items-center gap-3 text-left">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-white font-semibold">{g.title}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${colorClass}`}>{g.category}</span>
          </div>
          <div className="text-white/40 text-xs">{g.subtitle}</div>
        </div>
        <span className={`text-white/30 transition-transform ${open ? 'rotate-90' : ''}`}>›</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/8 pt-3">
          {/* Explanation */}
          <p className="text-white/70 text-sm leading-relaxed">{g.explanation}</p>

          {/* Structure */}
          <div className="bg-white/5 rounded-xl px-3 py-2">
            <div className="text-white/30 text-[10px] mb-1 uppercase tracking-wider">Struktur</div>
            <div className="text-indigo-300 text-sm font-mono">{g.structure}</div>
          </div>

          {/* Examples */}
          <div>
            <div className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Beispiele</div>
            <div className="space-y-2">
              {g.examples.map((ex, i) => (
                <div key={i} className="rounded-xl bg-white/5 p-3">
                  <button
                    onClick={() => playJapanese(`${g.id}-ex${i}`, ex.jp)}
                    className="flex items-start gap-2 w-full text-left"
                  >
                    <div className="flex-1">
                      <div className="text-white text-base">{ex.jp}</div>
                      <div className="text-white/40 text-xs">{ex.reading}</div>
                      <div className="text-white/60 text-sm mt-0.5">{ex.de}</div>
                    </div>
                    <span className="text-white/20 text-lg flex-none mt-0.5">🔊</span>
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
