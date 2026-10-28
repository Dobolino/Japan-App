import { Link } from 'react-router-dom'
import { useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { useStore } from '@/store/useStore'
import { lessons } from '@/data/curriculum'
export default function CoursePage() {
  const { completedLessons, learningGoal, setLearningGoal, lessonDrafts } = useStore(),
    [filter, setFilter] = useState('hiragana')
  const categories = [
    ['hiragana', 'Hiragana'],
    ['katakana', 'Katakana'],
    ['kanji', 'Kanji'],
    ['vocabulary', 'Wortschatz'],
    ['grammar', 'Grammatik'],
  ]
  return (
    <div className="scroll-area h-full">
      <div className="page-width">
        <PageHeader
          eyebrow="DEIN KURS"
          title="Ein Ziel. Kleine Schritte."
          description="Jede Einheit führt neue Inhalte ein und prüft Erkennen und aktiven Abruf."
        />
        <div className="card-surface p-5 mb-6">
          <h2 className="font-semibold mb-3">Wofür lernst du Japanisch?</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lernziel">
            {(
              [
                ['foundation', 'Grundlagen'],
                ['travel', 'Japanreise'],
                ['jlpt', 'N5-Grundlagen'],
              ] as const
            ).map(([id, label]) => (
              <button
                type="button"
                key={id}
                className={`chip ${learningGoal === id ? 'chip--active' : ''}`}
                aria-pressed={learningGoal === id}
                onClick={() => setLearningGoal(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="settings-help mt-3 mb-0">
            {learningGoal === 'travel'
              ? 'Verbinde deinen Kurs mit praktischen Alltagsmissionen.'
              : learningGoal === 'jlpt'
                ? 'Erarbeite Kana, Wortschatz und Grammatik schrittweise und prüfe dich mit Kompetenzchecks.'
                : 'Beginne mit den Vokalen und baue Reihe für Reihe darauf auf.'}
          </p>
          <div className="flex gap-4">
            <Link to="/missions" className="text-link">
              Alltagsmissionen →
            </Link>
            <Link to="/training" className="text-link">
              Training →
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Kursbereich">
          {categories.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`chip ${filter === id ? 'chip--active' : ''}`}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {lessons
            .filter((lesson) => lesson.category === filter)
            .map((lesson, index) => {
              const done = completedLessons[lesson.id],
                recommended = !lesson.prerequisite || Boolean(completedLessons[lesson.prerequisite])
              return (
                <Link to={`/lesson/${lesson.id}`} key={lesson.id} className="course-row">
                  <span className="lesson-number">{done ? '✓' : String(index + 1).padStart(2, '0')}</span>
                  <div className="course-copy">
                    <h2 className="font-semibold">{lesson.title}</h2>
                    <p>{lesson.goal}</p>
                    <span className="text-xs text-[var(--blue)]">
                      {lessonDrafts[lesson.id]
                        ? 'Fortsetzen'
                        : done
                          ? `${done.correct}/${done.total} richtig · erneut üben`
                          : recommended
                            ? 'Empfohlener nächster Schritt'
                            : 'Grundlagen zuerst empfohlen'}
                    </span>
                  </div>
                  <span aria-hidden="true">→</span>
                </Link>
              )
            })}
        </div>
        <Link to="/learn" className="text-link mt-5">
          Zur freien Lernbibliothek →
        </Link>
      </div>
    </div>
  )
}
