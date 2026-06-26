import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import StrokeCanvas from '@/components/StrokeCanvas'
import ReadingBreakdown from '@/components/ReadingBreakdown'
import { playJapanese } from '@/utils/audio'
import { AudioIcon } from '@/components/icons/UiIcons'
import { SRS_RATINGS } from '@/constants/srs'
import { CAT_LABELS, STATUS_LABELS, STATUS_TEXT_COLORS } from '@/constants/status'
import { CAT_CHIP } from '@/constants/categories'
import { useSquareSize } from '@/hooks/useElementSize'
import type { SRSRating, LearningItem } from '@/types'

type Tab = 'info' | 'stroke' | 'draw'

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { items, recordReview, rateReview } = useStore()
  const item = id ? items[id] : undefined
  const hasStrokes = item?.strokes && item.strokes.length > 0
  const [tab, setTab] = useState<Tab>(hasStrokes ? 'stroke' : 'info')
  const [score, setScore] = useState<number | null>(null)
  const [reviewed, setReviewed] = useState(false)
  const canvasAreaRef = useRef<HTMLDivElement>(null)
  const canvasSize = useSquareSize(canvasAreaRef, 240, 8)

  if (!item) {
    return <div className="flex items-center justify-center h-full text-white/40">Nicht gefunden</div>
  }

  const isKanji = item.category === 'kanji'
  const multiChar = item.character.length > 1
  const speak = () => playJapanese(item.id, item.character)

  const handleEvaluate = (s: number) => {
    setScore(s)
    if (!reviewed) {
      recordReview(item.id, s >= 50)
      setReviewed(true)
    }
  }

  const scoreColor = score === null ? '' : score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'
  const scoreLabel = score === null ? '' : score >= 70 ? 'Gut!' : score >= 40 ? 'Fast!' : 'Nochmal versuchen'

  return (
    <div className="page-screen">
      {/* Kompakter Header — alles auf einen Blick */}
      <div className="shrink-0 px-3 pt-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <button type="button" onClick={() => navigate(-1)} className="text-white/40 text-2xl leading-none w-8" aria-label="Zurück">
            ‹
          </button>
          <div className="flex gap-1.5 flex-1">
            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${CAT_CHIP[item.category]}`}>
              {CAT_LABELS[item.category]}
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full border border-white/10 ${STATUS_TEXT_COLORS[item.status]}`}>
              {STATUS_LABELS[item.status]}
            </span>
          </div>
          <button type="button" onClick={speak} className="audio-fab audio-fab--sm" aria-label="Anhören">
            <AudioIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase tracking-widest text-cyan-400/50 mb-0.5">Bedeutung</p>
            <h1 className="text-2xl font-bold text-cyan-300 leading-tight truncate">{item.meaning}</h1>
          </div>
          <div className="text-center shrink-0">
            {multiChar ? (
              <ReadingBreakdown character={item.character} romaji={item.romaji} size="sm" compact />
            ) : (
              <>
                <div className="jp text-4xl leading-none text-white">{item.character}</div>
                <p className="text-sm text-cyan-300/80 font-medium">{item.romaji}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mx-3 shrink-0">
        <TabBtn id="info" active={tab} onClick={setTab} label="Info" />
        {hasStrokes && <TabBtn id="stroke" active={tab} onClick={setTab} label="Strichfolge" />}
        {hasStrokes && <TabBtn id="draw" active={tab} onClick={setTab} label="Schreiben" />}
      </div>

      {/* Tab-Inhalt füllt restlichen Platz */}
      <div ref={tab === 'stroke' || tab === 'draw' ? canvasAreaRef : undefined} className="flex-1 min-h-0 overflow-hidden">
        {tab === 'info' && (
          <div className="scroll-area h-full px-3 py-3 space-y-2">
            {isKanji && (
              <div className="rounded-xl bg-white/5 p-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-white/30 text-xs mb-0.5">音 (On)</div>
                  <div className="text-white text-sm">{item.onyomi?.join('、') || '—'}</div>
                </div>
                <div>
                  <div className="text-white/30 text-xs mb-0.5">訓 (Kun)</div>
                  <div className="text-white text-sm">{item.kunyomi?.join('、') || '—'}</div>
                </div>
              </div>
            )}
            {multiChar && (
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-white/40 text-xs mb-2">Zeichen &amp; Aussprache</p>
                <ReadingBreakdown character={item.character} romaji={item.romaji} size="md" />
              </div>
            )}
            {item.exampleWord && (
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-white/40 text-xs mb-1">Beispiel</div>
                <button type="button" onClick={() => playJapanese(item.id + '-ex', item.exampleWord!)} className="text-left w-full">
                  <ReadingBreakdown character={item.exampleWord} romaji={item.exampleReading ?? ''} size="sm" compact />
                  <div className="text-white/50 text-xs mt-1">{item.exampleMeaning}</div>
                </button>
              </div>
            )}
            <SRSCard item={item} onRate={(r) => { rateReview(item.id, r); setReviewed(true) }} done={reviewed} />
          </div>
        )}

        {tab === 'stroke' && hasStrokes && (
          <div className="h-full flex flex-col items-center justify-center px-2 py-1">
            <StrokeCanvas
              key={item.id + '-anim'}
              strokes={item.strokes!}
              mode="animate"
              size={canvasSize}
              character={item.character}
            />
          </div>
        )}

        {tab === 'draw' && hasStrokes && (
          <div className="h-full flex flex-col items-center justify-center px-2 py-1 gap-2">
            <StrokeCanvas
              key={item.id + '-draw'}
              strokes={item.strokes!}
              mode="draw"
              size={canvasSize}
              character={item.character}
              onEvaluate={handleEvaluate}
            />
            {score !== null && (
              <div className="text-center shrink-0">
                <div className={`text-xl font-bold ${scoreColor}`}>{score}%</div>
                <div className={`text-xs ${scoreColor}`}>{scoreLabel}</div>
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
      type="button"
      onClick={() => onClick(id)}
      className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${
        active === id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-white/40'
      }`}
    >
      {label}
    </button>
  )
}

function SRSCard({
  item,
  onRate,
  done,
}: {
  item: LearningItem
  onRate: (r: SRSRating) => void
  done: boolean
}) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/40 text-xs">Lernstatus</span>
        <span className={`text-xs font-medium ${STATUS_TEXT_COLORS[item.status]}`}>{STATUS_LABELS[item.status]}</span>
      </div>
      {!done ? (
        <div className="grid grid-cols-4 gap-1" role="group" aria-label="SRS-Bewertung">
          {SRS_RATINGS.map(({ r, label, color }) => (
            <button key={r} type="button" onClick={() => onRate(r)} className={`py-1.5 rounded-lg text-xs font-medium active:scale-95 ${color}`}>
              {label}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-white/40 text-xs text-center">
          Gespeichert ✓ · {item.interval} Tag{item.interval !== 1 ? 'en' : ''}
        </p>
      )}
    </div>
  )
}
