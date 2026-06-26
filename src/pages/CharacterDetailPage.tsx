import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import StrokeCanvas from '../components/StrokeCanvas'
import ScriptAnalysis from '../components/ScriptAnalysis'
import { playJapanese } from '../utils/audio'

type Tab = 'info' | 'stroke' | 'draw'

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { items, recordReview, rateReview } = useStore()
  const item = id ? items[id] : undefined
  const [tab, setTab] = useState<Tab>('info')
  const [score, setScore] = useState<number | null>(null)
  const [reviewed, setReviewed] = useState(false)

  if (!item) {
    return <div className="flex items-center justify-center h-full text-white/40">Nicht gefunden</div>
  }

  const hasStrokes = item.strokes && item.strokes.length > 0
  const isKanji = item.category === 'kanji'

  const speak = () => playJapanese(item.id, item.character)

  const handleEvaluate = (s: number) => {
    setScore(s)
    if (!reviewed) { recordReview(item.id, s >= 50); setReviewed(true) }
  }

  const scoreColor = score === null ? '' : score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'
  const scoreLabel = score === null ? '' : score >= 70 ? 'Gut!' : score >= 40 ? 'Fast!' : 'Nochmal versuchen'

  const catLabel = { hiragana: 'Hiragana', katakana: 'Katakana', kanji: 'Kanji N5', vocabulary: 'Vokabeln' }[item.category]

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="text-white/40 text-2xl leading-none">‹</button>
        <div className="flex-1">
          <div className="text-white/40 text-xs">{catLabel}</div>
          <div className="text-white font-bold text-sm truncate">{item.meaning}</div>
        </div>
        <button onClick={speak} className="text-2xl active:scale-90 transition-transform">🔊</button>
      </div>

      {/* Character */}
      <div className="text-center py-3">
        <div className="text-7xl leading-none mb-1">{item.character}</div>
        <div className="text-white/50 text-sm">{item.romaji}</div>
        {isKanji && item.onyomi && (
          <div className="text-white/30 text-xs mt-1">
            音: {item.onyomi.join('・')} {item.kunyomi && item.kunyomi.length > 0 ? `｜訓: ${item.kunyomi.join('・')}` : ''}
          </div>
        )}
      </div>

      {/* Tabs – only show relevant ones */}
      <div className="flex border-b border-white/10 mx-4">
        <TabBtn id="info" active={tab} onClick={setTab} label="Info" />
        {hasStrokes && <TabBtn id="stroke" active={tab} onClick={setTab} label="Strichreihenfolge" />}
        {hasStrokes && <TabBtn id="draw" active={tab} onClick={setTab} label="Schreiben" />}
      </div>

      {/* Content */}
      <div className="flex-1 scroll-area px-4 py-4">
        {tab === 'info' && (
          <div className="space-y-3">
            {/* Kanji readings */}
            {isKanji && (
              <div className="rounded-2xl bg-white/5 p-4 grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-white/30 text-xs mb-1">音読み (On)</div><div className="text-white">{item.onyomi?.join('、') || '—'}</div></div>
                <div><div className="text-white/30 text-xs mb-1">訓読み (Kun)</div><div className="text-white">{item.kunyomi?.join('、') || '—'}</div></div>
                {item.strokeCount && <div><div className="text-white/30 text-xs mb-1">Striche</div><div className="text-white">{item.strokeCount}画</div></div>}
              </div>
            )}
            {/* Script analysis */}
            {(item.category === 'vocabulary' || item.category === 'kanji') && item.character.length > 1 && (
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-white/40 text-xs mb-2">Schriftarten</div>
                <ScriptAnalysis text={item.character} showBreakdown />
              </div>
            )}

            {/* Example word */}
            {item.exampleWord && (
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-white/40 text-xs mb-2">Beispielwort</div>
                <button
                  onClick={() => playJapanese(item.id + '-ex', item.exampleWord!)}
                  className="flex items-start gap-3 w-full text-left"
                >
                  <div className="flex-1">
                    <ScriptAnalysis text={item.exampleWord} showBreakdown />
                    <div className="text-white/40 text-xs mt-1">{item.exampleReading}</div>
                    <div className="text-white/60 text-sm">{item.exampleMeaning}</div>
                  </div>
                  <span className="text-xl text-white/30 flex-none mt-1">🔊</span>
                </button>
              </div>
            )}
            {/* SRS card */}
            <SRSCard item={item} onRate={(r) => { rateReview(item.id, r); setReviewed(true) }} done={reviewed} />
          </div>
        )}

        {tab === 'stroke' && hasStrokes && (
          <div className="flex justify-center">
            <StrokeCanvas key={item.id + '-anim'} strokes={item.strokes!} mode="animate" size={260} character={item.character} />
          </div>
        )}

        {tab === 'draw' && hasStrokes && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-white/40 text-sm text-center">
              Zeichne <span className="text-white">{item.character}</span> nach
            </p>
            <StrokeCanvas key={item.id + '-draw'} strokes={item.strokes!} mode="draw" size={260} character={item.character} onEvaluate={handleEvaluate} />
            {score !== null && (
              <div className="text-center">
                <div className={`text-3xl font-bold ${scoreColor}`}>{score}%</div>
                <div className={`text-sm ${scoreColor}`}>{scoreLabel}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function TabBtn({ id, active, onClick, label }: { id: Tab; active: Tab; onClick: (t: Tab) => void; label: string }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${
        active === id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-white/40'
      }`}
    >
      {label}
    </button>
  )
}

import type { SRSRating } from '../types'
const RATINGS: { r: SRSRating; label: string; color: string }[] = [
  { r: 0, label: 'Nochmal', color: 'bg-red-500/20 text-red-300' },
  { r: 1, label: 'Schwer',  color: 'bg-orange-500/20 text-orange-300' },
  { r: 2, label: 'Gut',     color: 'bg-blue-500/20 text-blue-300' },
  { r: 3, label: 'Einfach', color: 'bg-green-500/20 text-green-300' },
]

function SRSCard({ item, onRate, done }: { item: ReturnType<typeof useStore.getState>['items'][string]; onRate: (r: SRSRating) => void; done: boolean }) {
  const STATUS_COLORS = { new: 'text-white/40', learning: 'text-blue-300', uncertain: 'text-yellow-300', mastered: 'text-green-300' }
  const STATUS_LABELS = { new: 'Neu', learning: 'Lernen', uncertain: 'Unsicher', mastered: 'Beherrscht' }
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white/40 text-xs">Lernstatus</span>
        <span className={`text-xs font-medium ${STATUS_COLORS[item.status]}`}>{STATUS_LABELS[item.status]}</span>
      </div>
      {!done ? (
        <>
          <p className="text-white/40 text-xs mb-2">Wie gut kennst du dieses Zeichen?</p>
          <div className="grid grid-cols-4 gap-1.5">
            {RATINGS.map(({ r, label, color }) => (
              <button key={r} onClick={() => onRate(r)}
                className={`py-2 rounded-xl text-xs font-medium active:scale-95 transition-transform ${color}`}>
                {label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-white/40 text-xs text-center">Gespeichert ✓  · nächste Wiederholung in {item.interval} Tag{item.interval !== 1 ? 'en' : ''}</p>
      )}
    </div>
  )
}
