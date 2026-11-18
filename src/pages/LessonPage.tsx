import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { lessonById } from '@/data/curriculum'
import { grammarData } from '@/data/grammar'
import { lemmaCard, grammarSentenceCard, isKanaLetterCard } from '@/types/review'
import { reviewCardMatchesAnswer } from '@/utils/buildReviewQueue'
import { playJapanese, unlockAudio } from '@/utils/audio'
import PageHeader from '@/components/PageHeader'
import { shuffle } from '@/utils/shuffle'
import SessionSummary from '@/components/SessionSummary'
import { kanjiParts } from '@/data/kanjiParts'
export default function LessonPage() {
  const { lessonId } = useParams()
  return <Lesson key={lessonId} id={lessonId ?? ''} />
}
function Lesson({ id }: { id: string }) {
  const store = useStore(),
    lesson = lessonById[id]
  const [started, setStarted] = useState(Boolean(store.lessonDrafts[id])),
    [feedback, setFeedback] = useState<boolean | null>(store.lessonDrafts[id]?.feedback ?? null),
    [typed, setTyped] = useState(store.lessonDrafts[id]?.typed ?? ''),
    [done, setDone] = useState(false),
    [result, setResult] = useState({ correct: 0, total: 0 })
  const draft = store.lessonDrafts[id] ?? { index: 0, stage: 'intro' as const, correct: 0, attempted: 0 }
  const cards =
    lesson?.category === 'grammar'
      ? grammarData
          .filter((point) => lesson.grammarIds?.includes(point.id))
          .flatMap((point) =>
            point.examples.map((example, index) => grammarSentenceCard(point, index, example))
          )
      : (lesson?.itemIds ?? [])
          .filter((itemId) => store.items[itemId])
          .map((itemId) => lemmaCard(store.items[itemId]))
  const card = cards[draft.index]
  const [choices, setChoices] = useState<string[]>([])
  const [sessionId, setSessionId] = useState(() => store.lessonDrafts[id]?.runId ?? crypto.randomUUID())
  if (!lesson || !cards.length)
    return (
      <div className="page-width">
        <h1>Lektion nicht gefunden</h1>
        <Link to="/course" className="text-link">
          Zum Kurs
        </Link>
      </div>
    )
  const begin = () => {
    const runId = crypto.randomUUID()
    setSessionId(runId)
    store.saveLessonDraft(id, { index: 0, stage: 'intro', correct: 0, attempted: 0, runId })
    setStarted(true)
    setDone(false)
    setFeedback(null)
    setTyped('')
    setChoices([])
  }
  const next = () => {
    const correct = draft.correct + (draft.stage !== 'intro' && feedback ? 1 : 0),
      attempted = draft.attempted + (draft.stage === 'intro' ? 0 : 1)
    if (draft.stage === 'production' && draft.index === cards.length - 1) {
      const outcome = { correct, total: attempted, completedAt: new Date().toISOString() }
      store.completeLesson(id, outcome)
      setResult({ correct, total: attempted })
      setDone(true)
      return
    }
    const index = draft.index + 1 >= cards.length ? 0 : draft.index + 1,
      stage =
        draft.index + 1 >= cards.length
          ? draft.stage === 'intro'
            ? 'recognition'
            : 'production'
          : draft.stage
    store.saveLessonDraft(id, {
      index,
      stage,
      correct,
      attempted,
      feedback: null,
      typed: '',
      runId: sessionId,
    })
    setFeedback(null)
    setTyped('')
    setChoices(shuffle(cards.map((entry) => entry.answerCharacter)))
  }
  const check = (answer: string) => {
    if (feedback !== null) return
    const correct =
      draft.stage === 'recognition' ? answer === card.answerCharacter : reviewCardMatchesAnswer(answer, card)
    setFeedback(correct)
    store.saveLessonDraft(id, { ...draft, feedback: correct, typed: answer, runId: sessionId })
    store.rateReview(
      card.srsId,
      correct ? 2 : 0,
      `lesson:${id}:${draft.stage}:${draft.index}:${store.lessonDrafts[id]?.attempted}:${sessionId}`
    )
  }
  if (done)
    return (
      <SessionSummary
        correct={result.correct}
        total={result.total}
        characters={cards.map((entry) => entry.answerCharacter)}
        onRestart={begin}
      />
    )
  if (!started)
    return (
      <div className="scroll-area h-full">
        <div className="page-width lesson-page">
          <Link to="/explore" className="text-link mb-4">
            ← Entdecken
          </Link>
          <PageHeader
            eyebrow="DEIN LERNZIEL"
            title={lesson.title}
            description={lesson.goal}
            showSettings={false}
          />
          <section className="card-surface p-6">
            <h2 className="font-semibold text-lg">So läuft die Einheit ab</h2>
            <ol className="lesson-steps">
              <li>Entdecke {cards.length} Inhalte mit Bedeutung und Aussprache.</li>
              <li>Erkenne die passende japanische Antwort.</li>
              <li>
                {isKanaLetterCard(cards[0])
                  ? 'Lies jedes Zeichen und tippe seine Lesung in Rōmaji.'
                  : 'Gib die Antwort selbst ein – Japanisch oder Romaji.'}
              </li>
            </ol>
            <button type="button" className="btn-duo" onClick={begin}>
              Lektion beginnen
            </button>
          </section>
          <Link to="/course" className="text-link mt-5">
            ← Zum Kurs
          </Link>
        </div>
      </div>
    )
  const options = choices.length ? choices : cards.map((entry) => entry.answerCharacter)
  const stageName =
    draft.stage === 'intro' ? 'Entdecken' : draft.stage === 'recognition' ? 'Erkennen' : 'Selbst abrufen'
  return (
    <div className="scroll-area h-full">
      <div className="page-width lesson-page">
        <div className="exercise-topbar">
          <Link to="/" className="exercise-pause" aria-label="Lektion pausieren">
            ×
          </Link>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Lektion"
            aria-valuemin={0}
            aria-valuemax={cards.length * 3}
            aria-valuenow={
              ['intro', 'recognition', 'production'].indexOf(draft.stage) * cards.length + draft.index
            }
          >
            <div
              className="progress-fill"
              style={{
                width: `${((['intro', 'recognition', 'production'].indexOf(draft.stage) * cards.length + draft.index) / (cards.length * 3)) * 100}%`,
              }}
            />
          </div>
          <span>
            {draft.index + 1}/{cards.length}
          </span>
        </div>
        <PageHeader
          eyebrow={lesson.title}
          title={
            draft.stage === 'intro'
              ? lesson.category === 'grammar'
                ? 'Ein Satz für deinen Alltag.'
                : lesson.category === 'vocabulary'
                  ? 'Lerne dein Wort kennen.'
                  : 'Lerne dein Zeichen kennen.'
              : draft.stage === 'recognition'
                ? 'Was passt dazu?'
                : 'Jetzt bist du dran.'
          }
          showSettings={false}
        />
        <ol className="lesson-stage-strip" aria-label="Lernschritte">
          {['Entdecken', 'Erkennen', 'Abrufen'].map((label, index) => (
            <li
              key={label}
              aria-current={
                index === ['intro', 'recognition', 'production'].indexOf(draft.stage) ? 'step' : undefined
              }
            >
              {index + 1} {label}
            </li>
          ))}
        </ol>
        <section className="card-surface activity-card">
          {draft.stage === 'production' && isKanaLetterCard(card) ? (
            <>
              <p className="eyebrow mb-3">Wie liest du dieses Zeichen?</p>
              <p lang="ja" className="jp jp-display mb-5">
                {card.answerCharacter}
              </p>
            </>
          ) : (
            <p className="eyebrow mb-5">{draft.stage === 'intro' ? stageName : card.promptMeaning}</p>
          )}
          {draft.stage === 'intro' ? (
            <>
              <p lang="ja" className="jp jp-display">
                {card.answerCharacter}
              </p>
              <p className="text-lg text-[var(--blue)] my-4">{card.answerRomaji}</p>
              <p>{card.promptMeaning}</p>
              <button
                type="button"
                className="text-link my-4"
                onClick={() => {
                  unlockAudio()
                  playJapanese(card.srsId, card.answerCharacter)
                }}
              >
                Aussprache anhören
              </button>
              <button type="button" className="btn-duo" onClick={next}>
                Weiter
              </button>
            </>
          ) : (
            <>
              {draft.stage === 'recognition' ? (
                <div className="choice-list">
                  {options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`choice-button jp ${option.length > 5 ? 'choice-button--sentence' : ''} ${feedback !== null ? (option === card.answerCharacter ? 'is-correct' : option === draft.typed ? 'is-wrong' : '') : ''}`}
                      disabled={feedback !== null}
                      onClick={() => check(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    check(typed)
                  }}
                >
                  <label htmlFor="lesson-answer" className="sr-only">
                    Deine Antwort
                  </label>
                  <input
                    id="lesson-answer"
                    placeholder={isKanaLetterCard(card) ? 'Lesung in Rōmaji' : 'Japanisch oder Rōmaji'}
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={typed}
                    onChange={(event) => {
                      setTyped(event.target.value)
                      store.saveLessonDraft(id, { ...draft, typed: event.target.value, runId: sessionId })
                    }}
                    disabled={feedback !== null}
                    className="search-input mb-4"
                  />
                  {feedback === null && (
                    <button type="submit" disabled={!typed.trim()} className="btn-duo">
                      Antwort prüfen
                    </button>
                  )}
                </form>
              )}
              {feedback !== null && (
                <div role="status" className={`feedback-panel ${feedback ? 'is-correct' : 'is-wrong'}`}>
                  <strong>{feedback ? '✓ Richtig!' : 'Das merken wir uns.'}</strong>
                  <p lang="ja" className="jp text-xl my-2">
                    {card.answerCharacter}
                  </p>
                  <p>{card.answerRomaji}</p>
                  {kanjiParts[card.answerCharacter] ? (
                    <p className="mt-3">Merkhilfe: {kanjiParts[card.answerCharacter].hint}</p>
                  ) : (
                    card.parent.exampleWord && (
                      <p className="mt-3">
                        Im Wort{' '}
                        <span lang="ja" className="jp">
                          {card.parent.exampleWord}
                        </span>{' '}
                        · {card.parent.exampleMeaning}
                      </p>
                    )
                  )}
                  {!feedback && <p className="mt-2">Für die Wiederholung vorgemerkt.</p>}
                  {lesson.category === 'grammar' && (
                    <p className="mt-3 text-sm">
                      {grammarData.find((point) => lesson.grammarIds?.includes(point.id))?.explanation}
                    </p>
                  )}
                  <button type="button" className="btn-duo mt-4" onClick={next}>
                    Weiter
                  </button>
                </div>
              )}
            </>
          )}
        </section>
        <p className="text-xs text-[var(--text-muted)] mt-4">
          Dein Stand wird gespeichert. Du kannst die Lektion später fortsetzen.
        </p>
      </div>
    </div>
  )
}
