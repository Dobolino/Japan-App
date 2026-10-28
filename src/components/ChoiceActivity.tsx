import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from './PageHeader'
import { useStore } from '@/store/useStore'
import type { ChoiceQuestion } from '@/data/activities'
import { playJapanese, unlockAudio } from '@/utils/audio'
interface Props {
  id: string
  title: string
  description: string
  questions: ChoiceQuestion[]
  listening?: boolean
  onAnswer?: (question: ChoiceQuestion, correct: boolean, eventId: string) => void
  onComplete?: () => void
  backTo?: string
  resultHref?: string
}
export default function ChoiceActivity({
  id,
  title,
  description,
  questions,
  listening = false,
  onAnswer,
  onComplete,
  backTo = '/training',
  resultHref = '/course',
}: Props) {
  const store = useStore()
  const [chosen] = useState(() => {
    const saved = store.activityDrafts[id]
    return saved?.questions?.length
      ? saved.questions
      : saved
        ? saved.questionIds
            .map((key) => questions.find((question) => question.id === key))
            .filter((q): q is ChoiceQuestion => Boolean(q))
        : questions.slice(0, 10)
  })
  const [runId] = useState(() => store.activityDrafts[id]?.runId ?? crypto.randomUUID())
  const draft = store.activityDrafts[id] ?? {
    runId,
    index: 0,
    answers: [],
    questionIds: chosen.map((question) => question.id),
    questions: chosen,
  }
  const current = chosen[draft.index],
    selected = draft.answers[draft.index],
    answered = selected !== undefined
  const correct = draft.answers.filter((answer, index) => answer === chosen[index]?.answer).length
  const [started, setStarted] = useState(Boolean(store.activityDrafts[id]))
  if (!chosen.length)
    return (
      <div className="page-width">
        <h1>Führe zuerst eine Lektion ein</h1>
        <Link to="/course" className="text-link">
          Zum Kurs →
        </Link>
      </div>
    )
  const begin = () => {
    store.saveActivity(id, {
      runId: crypto.randomUUID(),
      index: 0,
      answers: [],
      questionIds: chosen.map((question) => question.id),
      questions: chosen,
    })
    setStarted(true)
  }
  const answer = (index: number) => {
    if (answered) return
    store.saveActivity(id, { ...draft, answers: [...draft.answers, index] })
    onAnswer?.(current, index === current.answer, `${draft.runId ?? runId}:${draft.index}`)
  }
  const next = () => {
    const index = draft.index + 1
    store.saveActivity(id, { ...draft, index })
    if (index === chosen.length) {
      store.finishTraining(id, { correct, total: chosen.length, completedAt: new Date().toISOString() })
      onComplete?.()
    }
  }
  const speak = () => {
    if (current?.jp) {
      unlockAudio()
      playJapanese(current.id, current.jp)
    }
  }
  return (
    <div className="scroll-area h-full">
      <div className="page-width lesson-page">
        <Link to={backTo} className="text-link mb-4">
          ← Zur Übersicht
        </Link>
        <PageHeader
          eyebrow={listening ? 'HÖRVERSTÄNDNIS' : 'DEIN TRAINING'}
          title={title}
          description={description}
        />
        {!started ? (
          <section className="card-surface p-6">
            <p className="settings-help">
              {chosen.length} Aufgaben mit Rückmeldung und Erklärung. Dein Stand bleibt beim Verlassen
              erhalten.
            </p>
            <button type="button" className="btn-duo" onClick={begin}>
              Training beginnen
            </button>
          </section>
        ) : !current ? (
          <section className="card-surface activity-card">
            <h2 className="text-2xl font-semibold">Training abgeschlossen</h2>
            <p className="my-5">
              {correct} von {chosen.length} Antworten richtig.
            </p>
            <p className="settings-help">
              {correct / chosen.length >= 0.8
                ? 'Das sitzt gut. Du kannst den nächsten Schritt angehen.'
                : 'Wiederhole die schwierigen Inhalte in deiner Tageslektion und probiere diesen Check erneut.'}
            </p>
            <button type="button" className="btn-duo" onClick={begin}>
              Noch einmal üben
            </button>
            <Link to={resultHref} className="text-link mt-5">
              Weiterlernen →
            </Link>
          </section>
        ) : (
          <section className="card-surface activity-card">
            <p className="eyebrow mb-5">
              Aufgabe {draft.index + 1} / {chosen.length}
            </p>
            <h2 className="text-xl font-semibold mb-6">{current.prompt}</h2>
            {listening && (
              <button type="button" className="btn-duo btn-duo--outline mb-5" onClick={speak}>
                Japanisch anhören
              </button>
            )}
            <div className="choice-list">
              {current.choices.map((choice, index) => (
                <button
                  key={`${choice}-${index}`}
                  type="button"
                  className={`choice-button ${answered && index === current.answer ? 'is-correct' : ''} ${answered && index === selected && index !== current.answer ? 'is-wrong' : ''}`}
                  disabled={answered}
                  onClick={() => answer(index)}
                >
                  {choice}
                </button>
              ))}
            </div>
            {answered && (
              <div
                role="status"
                className={`feedback-panel ${selected === current.answer ? 'is-correct' : 'is-wrong'}`}
              >
                <strong>{selected === current.answer ? 'Richtig!' : 'Das schauen wir uns an.'}</strong>
                <p className="my-3">{current.explanation}</p>
                {current.jp && (
                  <>
                    <p lang="ja" className="jp text-xl">
                      {current.jp}
                    </p>
                    <p className="text-sm mt-2">{current.reading}</p>
                    <button type="button" className="text-link" onClick={speak}>
                      Aussprache anhören
                    </button>
                  </>
                )}
                <button type="button" className="btn-duo mt-4" onClick={next}>
                  {draft.index + 1 === chosen.length ? 'Training abschließen' : 'Nächste Aufgabe'}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
