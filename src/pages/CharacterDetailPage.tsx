import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import StrokeCanvas from '@/components/StrokeCanvas'
import ReadingBreakdown from '@/components/ReadingBreakdown'
import { playJapanese } from '@/utils/audio'
import { AudioIcon } from '@/components/icons/UiIcons'
import { SRS_RATINGS } from '@/constants/srs'
import { CAT_LABELS, STATUS_LABELS, STATUS_TEXT_COLORS } from '@/constants/status'
import { CAT_CHIP, CAT_GRADIENT } from '@/constants/categories'
import type { SRSRating, LearningItem } from '@/types'

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
      <div className="flex items-center px-4 pt-3 pb-1 shrink-0">
        <button type="button" onClick={() => navigate(-1)} className="text-white/40 text-2xl leading-none w-10" aria-label="Zurück">
          ‹
        </button>
        <span className="text-white/30 text-xs flex-1 text-center">{CAT_LABELS[item.category]}</span>
        <button type="button" onClick={speak} className="audio-fab audio-fab--sm" aria-label="Anhören">
          <AudioIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Hero: Bedeutung gross (cyan) + Zeichen-Aufschlüsselung */}
      <div className={`shrink-0 text-center px-4 py-5 bg-gradient-to-b ${CAT_GRADIENT[item.category]}`}>
        <div className="flex justify-center gap-2 mb-4">
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-medium ${CAT_CHIP[item.category]}`}>
            {CAT_LABELS[item.category]}
          </span>
          <span className={`text-[10px] px-2.5 py-0.5 rounded-full border border-white/10 ${STATUS_TEXT_COLORS[item.status]}`}>
            {STATUS_LABELS[item.status]}
          </span>
        </div>

        <p className="text-[10px] uppercase tracking-widest text-cyan-400/60 mb-2">Bedeutung</p>
        <h1 className="meaning-hero px-2">{item.meaning}</h1>

        <div className="mt-6 pt-5 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">Aussprache &amp; Zeichen</p>
          {multiChar ? (
            <ReadingBreakdown character={item.character} romaji={item.romaji} size="lg" />
          ) : (
            <>
              <div className="jp text-7xl sm:text-8xl leading-none text-white">{item.character}</div>
              <p className="text-2xl text-cyan-300 font-semibold mt-3">{item.romaji}</p>
            </>
          )}
          {isKanji && item.onyomi && (
            <p className="text-xs text-white/30 mt-4">
              音: {item.onyomi.join('・')}
              {item.kunyomi?.length ? ` ｜ 訓: ${item.kunyomi.join('・')}` : ''}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={speak}
          className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-medium active:scale-95"
        >
          <AudioIcon className="w-5 h-5" />
          Aussprache anhören
        </button>
      </div>

      <div className="flex border-b border-white/10 mx-4 shrink-0">
        <TabBtn id="info" active={tab} onClick={setTab} label="Info" />
        {hasStrokes && <TabBtn id="stroke" active={tab} onClick={setTab} label="Strichfolge" />}
        {hasStrokes && <TabBtn id="draw" active={tab} onClick={setTab} label="Schreiben" />}
      </div>

      <div className="flex-1 min-h-0 scroll-area px-4 py-4">
        {tab === 'info' && (
          <div className="space-y-3">
            {isKanji && (
              <div className="rounded-2xl bg-white/5 p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-white/30 text-xs mb-1">音読み (On)</div>
                  <div className="text-white">{item.onyomi?.join('、') || '—'}</div>
                </div>
                <div>
                  <div className="text-white/30 text-xs mb-1">訓読み (Kun)</div>
                  <div className="text-white">{item.kunyomi?.join('、') || '—'}</div>
                </div>
                {item.strokeCount && (
                  <div>
                    <div className="text-white/30 text-xs mb-1">Striche</div>
                    <div className="text-white">{item.strokeCount}画</div>
                  </div>
                )}
              </div>
            )}

            {item.exampleWord && (
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-white/40 text-xs mb-2">Beispielwort</div>
                <button
                  type="button"
                  onClick={() => playJapanese(item.id + '-ex', item.exampleWord!)}
                  className="flex items-start gap-3 w-full text-left"
                >
                  <div className="flex-1">
                    <ReadingBreakdown character={item.exampleWord} romaji={item.exampleReading ?? ''} size="md" compact />
                    <div className="text-white/60 text-sm mt-1">{item.exampleMeaning}</div>
                  </div>
                  <span className="text-cyan-400/50 flex-none mt-1">
                    <AudioIcon className="w-5 h-5" />
                  </span>
                </button>
              </div>
            )}
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
              Zeichne <span className="text-white jp text-xl">{item.character}</span> nach
            </p>
            <StrokeCanvas
              key={item.id + '-draw'}
              strokes={item.strokes!}
              mode="draw"
              size={260}
              character={item.character}
              onEvaluate={handleEvaluate}
            />
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
      type="button"
      onClick={() => onClick(id)}
      className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
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
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white/40 text-xs">Lernstatus</span>
        <span className={`text-xs font-medium ${STATUS_TEXT_COLORS[item.status]}`}>{STATUS_LABELS[item.status]}</span>
      </div>
      {!done ? (
        <>
          <p className="text-white/40 text-xs mb-2">Wie gut kennst du das?</p>
          <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="SRS-Bewertung">
            {SRS_RATINGS.map(({ r, label, color }) => (
              <button
                key={r}
                type="button"
                onClick={() => onRate(r)}
                className={`py-2 rounded-xl text-xs font-medium active:scale-95 transition-transform ${color}`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-white/40 text-xs text-center">
          Gespeichert ✓ · nächste Wiederholung in {item.interval} Tag{item.interval !== 1 ? 'en' : ''}
        </p>
      )}
    </div>
  )
}
