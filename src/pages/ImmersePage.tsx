import { useState } from 'react'
import ChoiceActivity from '@/components/ChoiceActivity'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { stories, getStory } from '@/data/stories'
import TappableSentence from '@/components/TappableSentence'
import ChunkBuilder from '@/components/ChunkBuilder'
import { buildChunkExercise } from '@/utils/chunkExercise'
import { useStore } from '@/store/useStore'
import PageHeader from '@/components/PageHeader'
import { ArrowIcon, ReadingIcon, CheckIcon } from '@/components/icons/UiIcons'

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
    return <StoryReader key={story.id} story={story} />
  }

  return <StoryList />
}

function StoryList() {
  const completed = useStore((s) => s.storyProgress.completed)

  return (
    <div className="scroll-area h-full">
      <div className="page-width">
        <PageHeader
          eyebrow="JAPANISCH IM KONTEXT"
          title="Kleine Geschichten. Neues verstehen."
          description={`Lies mit Worterklärungen und übe den Satzbau. ${completed.length} von ${stories.length} Geschichten abgeschlossen.`}
        />
        <div className="story-list">
          {stories.map((story) => {
            const done = completed.includes(story.id)
            return (
              <Link
                key={story.id}
                to={`/immerse/${story.id}`}
                className="card-surface story-card"
                onClick={() => {
                  if (done) {
                    useStore.getState().saveActivity(`reader:${story.id}`, null)
                    useStore.getState().saveActivity(`story:${story.id}`, null)
                  }
                }}
              >
                <div className="section-icon">{done ? <CheckIcon /> : <ReadingIcon />}</div>
                <div className="flex-1 min-w-0">
                  <span className="eyebrow">
                    {story.level} · {story.lines.length} Zeilen{done ? ' · Erneut lesen' : ''}
                  </span>
                  <h2>{story.title}</h2>
                  <p>{story.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {story.grammarTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-md bg-[var(--bg-muted)] text-[var(--text-secondary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowIcon className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-1" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StoryReader({ story }: { story: (typeof stories)[0] }) {
  const navigate = useNavigate()
  const markStoryComplete = useStore((s) => s.markStoryComplete)
  const store = useStore()
  const readerId = `reader:${story.id}`
  const lineIndex = Math.min(store.activityDrafts[readerId]?.index ?? 0, story.lines.length)
  const [translationFor, setTranslationFor] = useState<number | null>(null)
  const [showChunk, setShowChunk] = useState(false)
  const [chunkDone, setChunkDone] = useState(false)

  const line = story.lines[Math.min(lineIndex, story.lines.length - 1)]
  const isLast = lineIndex >= story.lines.length - 1
  const chunkExercise = buildChunkExercise(
    `${story.id}-${lineIndex}`,
    line.jp.replace(/[。、！？]/g, ''),
    line.reading.replace(/[。、！？]/g, ''),
    line.de
  )

  const next = () => {
    if (isLast) {
      store.saveActivity(readerId, { index: story.lines.length, answers: [], questionIds: [] })
      return
    }
    store.saveActivity(readerId, { index: lineIndex + 1, answers: [], questionIds: [] })
    setShowChunk(false)
    setChunkDone(false)
  }

  if (lineIndex >= story.lines.length)
    return (
      <ChoiceActivity
        id={`story:${story.id}`}
        title="Was hast du verstanden?"
        description={story.title}
        questions={story.questions}
        onComplete={() => markStoryComplete(story.id)}
        backTo="/immerse"
        resultHref="/immerse"
      />
    )
  return (
    <div className="page-screen">
      <div className="shrink-0 px-4 pt-3 pb-2 border-b-2 border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => navigate('/immerse')}
            className="icon-button text-2xl shrink-0"
            aria-label="Zurück"
          >
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
              audioId={`${story.id}-v2-L${lineIndex}`}
              size="sentence"
            />
            <button
              type="button"
              className="text-link mt-4"
              aria-expanded={translationFor === lineIndex}
              onClick={() => setTranslationFor(translationFor === lineIndex ? null : lineIndex)}
            >
              Übersetzung {translationFor === lineIndex ? 'ausblenden' : 'zeigen'}
            </button>
            {translationFor === lineIndex && (
              <p className="text-sm text-[var(--text-secondary)] mt-3">{line.de}</p>
            )}
          </div>

          <p className="text-[10px] text-center text-[var(--text-muted)] font-semibold">
            Tippe ein Wort oder Partikel für die Bedeutung
          </p>

          {!showChunk ? (
            <button
              type="button"
              onClick={() => setShowChunk(true)}
              className="btn-duo btn-duo--outline w-full"
            >
              Satzbau üben (SOV)
            </button>
          ) : (
            <ChunkBuilder exercise={chunkExercise} onComplete={() => setChunkDone(true)} />
          )}

          <button type="button" onClick={next} className="btn-duo w-full" disabled={showChunk && !chunkDone}>
            {isLast ? 'Verständnis prüfen' : 'Nächste Zeile →'}
          </button>

          {showChunk && !chunkDone && (
            <button
              type="button"
              onClick={next}
              className="text-xs text-[var(--text-muted)] font-bold w-full text-center underline"
            >
              Übung überspringen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
