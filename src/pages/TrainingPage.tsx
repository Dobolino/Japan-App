import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import ChoiceActivity from '@/components/ChoiceActivity'
import { useStore } from '@/store/useStore'
import { buildTrainingQuestions } from '@/utils/training'
import { playJapaneseSequence, stopAudio } from '@/utils/audio'
import { stories } from '@/data/stories'
const modes = [
  [
    'confusions',
    'Ähnliche Zeichen sicher unterscheiden',
    'Übe シ und ツ oder ぬ und め – mit Hinweisen zu den Unterschieden.',
  ],
  ['listening', 'Hören und verstehen', 'Höre Bekanntes und wähle die passende Bedeutung.'],
  ['checkpoint', 'Dein Kompetenzcheck', 'Prüfe die Inhalte, die du bereits eingeführt hast.'],
  ['shadowing', 'Hören und nachsprechen', 'Kurze Sätze mit regelbarem Tempo und Wiederholungsschleife.'],
]
export default function TrainingPage() {
  const { mode } = useParams()
  return mode === 'shadowing' ? (
    <Shadowing />
  ) : mode ? (
    <Training key={mode} mode={mode} />
  ) : (
    <div className="scroll-area h-full">
      <div className="page-width">
        <PageHeader
          eyebrow="DEINE LERNWERKSTATT"
          title="Übe genau das, was dir hilft."
          description="Kurze Trainings für Zeichen, Hörverständnis und aktiven Abruf."
        />
        <div className="feature-grid">
          {modes.map(([id, title, description]) => (
            <Link key={id} to={`/training/${id}`} className="feature-card card-surface">
              <h2>{title}</h2>
              <p>{description}</p>
              <span className="text-link">Training öffnen →</span>
            </Link>
          ))}
          <Link to="/missions" className="feature-card card-surface">
            <h2>Alltagsmissionen</h2>
            <p>Bestellen, nach dem Weg fragen und dich vorstellen.</p>
            <span className="text-link">Missionen entdecken →</span>
          </Link>
          <Link to="/notebook" className="feature-card card-surface">
            <h2>Dein Lernheft</h2>
            <p>Deine Wörter, Notizen und persönlichen Sammlungen.</p>
            <span className="text-link">Lernheft öffnen →</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
function Training({ mode }: { mode: string }) {
  const state = useStore(),
    [questions] = useState(() => buildTrainingQuestions(mode, state)),
    info = modes.find((entry) => entry[0] === mode)
  if (!info)
    return (
      <div className="page-width">
        <h1>Training nicht gefunden</h1>
        <Link to="/training" className="text-link">
          Zur Lernwerkstatt
        </Link>
      </div>
    )
  return (
    <ChoiceActivity
      id={`training:${mode}`}
      title={info[1]}
      description={info[2]}
      questions={questions}
      listening={mode === 'listening'}
      onAnswer={(question, correct, eventId) => {
        const itemId =
          mode === 'confusions'
            ? Object.values(state.items).find((item) => item.character === question.jp)?.id
            : question.id.slice(mode.length + 1)
        if (itemId) state.rateReview(itemId, correct ? 2 : 0, eventId)
      }}
    />
  )
}
function Shadowing() {
  const [lineIndex, setLineIndex] = useState(0),
    [rate, setRate] = useState(0.8),
    [repetitions, setRepetitions] = useState(3),
    [playing, setPlaying] = useState(false),
    [message, setMessage] = useState('')
  const lines = stories.flatMap((story) =>
      story.lines.map((line, index) => ({ ...line, id: `${story.id}-v2-L${index}` }))
    ),
    line = lines[lineIndex]
  useEffect(() => () => stopAudio(), [])
  const play = async () => {
    setPlaying(true)
    setMessage('')
    const result = await playJapaneseSequence(line.id, line.jp, { rate, repetitions })
    setPlaying(false)
    setMessage(
      result === 'unavailable'
        ? 'Die japanische Sprachausgabe ist auf diesem Gerät nicht verfügbar. Prüfe die installierten Sprachstimmen.'
        : result === 'finished'
          ? 'Jetzt du: Sprich den Satz noch einmal selbst.'
          : 'Wiedergabe gestoppt.'
    )
  }
  return (
    <div className="scroll-area h-full">
      <div className="page-width lesson-page">
        <Link to="/training" className="text-link mb-4">
          ← Zur Lernwerkstatt
        </Link>
        <PageHeader
          eyebrow="NACHSPRECHEN"
          title="Hören. Mitsprechen. Sicherer werden."
          description="Höre den Rhythmus und sprich den Satz in den Pausen nach."
        />
        <section className="card-surface activity-card">
          <p lang="ja" className="jp jp-sentence">
            {line.jp}
          </p>
          <p className="text-[var(--blue)] my-4">{line.reading}</p>
          <p className="text-[var(--text-secondary)] mb-6">{line.de}</p>
          <label className="form-label">
            Tempo: {rate.toFixed(1)}×
            <input
              type="range"
              min="0.6"
              max="1.2"
              step="0.1"
              value={rate}
              disabled={playing}
              onChange={(event) => setRate(Number(event.target.value))}
            />
          </label>
          <label htmlFor="shadowing-repetitions" className="form-label">
            Wiederholungen
          </label>
          <select
            id="shadowing-repetitions"
            value={repetitions}
            disabled={playing}
            onChange={(event) => setRepetitions(Number(event.target.value))}
            className="search-input"
          >
            {[1, 3, 5].map((value) => (
              <option key={value} value={value}>
                {value} Mal
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-duo mt-5"
            onClick={() => (playing ? stopAudio() : void play())}
          >
            {playing ? 'Wiedergabe stoppen' : 'Anhören und nachsprechen'}
          </button>
          {message && (
            <p role="status" className="text-sm mt-4">
              {message}
            </p>
          )}
          <div className="flex justify-between mt-5">
            <button
              type="button"
              className="text-link"
              disabled={playing || lineIndex === 0}
              onClick={() => setLineIndex(lineIndex - 1)}
            >
              ← Voriger Satz
            </button>
            <button
              type="button"
              className="text-link"
              disabled={playing || lineIndex === lines.length - 1}
              onClick={() => setLineIndex(lineIndex + 1)}
            >
              Nächster Satz →
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
