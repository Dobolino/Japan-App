import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { stories, getStory } from '@/data/stories'
import TappableSentence from '@/components/TappableSentence'
import ChunkBuilder from '@/components/ChunkBuilder'
import { buildChunkExercise } from '@/utils/chunkExercise'
import { useStore } from '@/store/useStore'

export default function ImmersePage() {
  const { storyId } = useParams<{ storyId?: string }>()

  if (storyId) {
    const story = getStory(storyId)
    if (!story) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
          <p className="text-[var(--text-muted)]">Geschichte nicht gefunden</p>
          <Link to="/immerse" className="text-[var(--blue)] font-bold text-sm">
            ← Zurück
          </Link>
        </div>
      )
    }
    return <StoryReader story={story} />
  }

  return <StoryList />
}

function StoryList() {
  const completed = useStore((s) => s.storyProgress.completed)

  return (
    <div className="scroll-area h-full px-4 py-4">
      <h1 className="text-xl font-bold text-[var(--text-primary)] mb-1">Lesen</h1>
      <p className="text-xs text-[var(--text-muted)] font-semibold mb-4">
        Tippe auf Wörter für Bedeutung · {stories.length} Mini-Geschichten N5
      </p>

      <div className="space-y-3">
        {stories.map((story) => {
          const done = completed.includes(story.id)
          return (
            <Link
              key={story.id}
              to={`/immerse/${story.id}`}
              className="card-surface block p-4 active:translate-y-0.5 transition-transform"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-bold text-[var(--text-primary)]">{story.title}</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 font-semibold">{story.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {story.grammarTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--bg-muted)] text-[var(--text-secondary)] font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {done ? (
                  <span className="text-[var(--green)] text-lg shrink-0" aria-label="Abgeschlossen">
                    ✓
                  </span>
                ) : (
                  <span className="text-[var(--text-muted)] text-sm shrink-0">{story.lines.length} Zeilen</span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function StoryReader({ story }: { story: (typeof stories)[0] }) {
  const navigate = useNavigate()
  const markStoryComplete = useStore((s) => s.markStoryComplete)
  const [lineIndex, setLineIndex] = useState(0)
  const [showChunk, setShowChunk] = useState(false)
  const [chunkDone, setChunkDone] = useState(false)

  const line = story.lines[lineIndex]
  const isLast = lineIndex >= story.lines.length - 1
  const chunkExercise = buildChunkExercise(
    `${story.id}-${lineIndex}`,
    line.jp.replace(/[。、！？]/g, ''),
    line.reading.replace(/[。、！？]/g, ''),
    line.de
  )

  const next = () => {
    if (isLast) {
      markStoryComplete(story.id)
      navigate('/immerse')
      return
    }
    setLineIndex((i) => i + 1)
    setShowChunk(false)
    setChunkDone(false)
  }

  return (
    <div className="page-screen">
      <div className="shrink-0 px-4 pt-3 pb-2 border-b-2 border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-2 mb-2">
          <button type="button" onClick={() => navigate('/immerse')} className="text-[var(--text-muted)] text-2xl leading-none w-8" aria-label="Zurück">
            ‹
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[var(--text-primary)] truncate">{story.title}</h1>
            <p className="text-[10px] text-[var(--text-muted)] font-semibold">
              Zeile {lineIndex + 1} / {story.lines.length}
            </p>
          </div>
        </div>
        <div className="progress-track h-2">
          <div
            className="progress-fill progress-fill--blue h-full"
            style={{ width: `${((lineIndex + 1) / story.lines.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="scroll-area flex-1 px-4 py-5">
        <div className="max-w-md mx-auto space-y-5">
          {line.speaker && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-muted)]">
              {line.speaker}
            </span>
          )}

          <div className="card-surface p-4 text-center">
            <TappableSentence
              text={line.jp}
              reading={line.reading}
              audioId={`${story.id}-L${lineIndex}`}
              size="sentence"
            />
            <p className="text-sm text-[var(--text-secondary)] font-semibold mt-4 border-t-2 border-[var(--border)] pt-3">
              {line.de}
            </p>
          </div>

          <p className="text-[10px] text-center text-[var(--text-muted)] font-semibold">
            Tippe ein Wort oder Partikel für die Bedeutung
          </p>

          {!showChunk ? (
            <button type="button" onClick={() => setShowChunk(true)} className="btn-duo btn-duo--outline w-full">
              Satzbau üben (SOV)
            </button>
          ) : (
            <ChunkBuilder
              exercise={chunkExercise}
              onComplete={() => setChunkDone(true)}
            />
          )}

          <button
            type="button"
            onClick={next}
            className="btn-duo w-full"
            disabled={showChunk && !chunkDone}
          >
            {isLast ? 'Geschichte abschließen' : 'Nächste Zeile →'}
          </button>

          {showChunk && !chunkDone && (
            <button type="button" onClick={next} className="text-xs text-[var(--text-muted)] font-bold w-full text-center underline">
              Übung überspringen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
