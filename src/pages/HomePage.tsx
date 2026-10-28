import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { XP_PER_LEVEL, xpInLevel, xpToLevel } from '@/constants/srs'
import { localDateKey } from '@/utils/date'
import { reviewCounts } from '@/utils/reviewCounts'
import { stories } from '@/data/stories'
import { lessons } from '@/data/curriculum'
import PageHeader from '@/components/PageHeader'
import { ArrowIcon, ReadingIcon, TargetIcon } from '@/components/icons/UiIcons'

const COURSES = [
  { key: 'hiragana', kana: 'あ', label: 'Hiragana', description: 'Deine ersten japanischen Zeichen' },
  { key: 'katakana', kana: 'ア', label: 'Katakana', description: 'Die Schrift für Wörter aus aller Welt' },
  { key: 'kanji', kana: '漢', label: 'Kanji N5', description: 'Zeichen erkennen und verstehen' },
  { key: 'vocabulary', kana: '語', label: 'Vokabeln', description: 'Wörter für deinen Alltag' },
  { key: 'grammar', kana: '文', label: 'Grammatik', description: 'Aus Wörtern werden Sätze' },
] as const

export default function HomePage() {
  const {
    progress,
    items,
    grammarSrs,
    exampleSrs,
    storyProgress,
    displayPrefs,
    completedLessons,
    activeSession,
  } = useStore()
  const all = Object.values(items)
  const grammar = Object.values(grammarSrs)
  const { due } = reviewCounts([...all, ...grammar, ...Object.values(exampleSrs)])
  const resumable = activeSession && activeSession.phase !== 'done'
  const nextLesson =
    lessons.find(
      (lesson) =>
        !completedLessons[lesson.id] && (!lesson.prerequisite || completedLessons[lesson.prerequisite])
    ) ?? lessons[0]
  const firstVisit = progress.cardsReviewed === 0
  const todayCorrect = progress.todayDate === localDateKey() ? (progress.todayCorrect ?? 0) : 0
  const dailyGoal = displayPrefs.dailyGoal ?? 20
  const goalReached = todayCorrect >= dailyGoal
  const goalPercent = Math.min(100, Math.round((todayCorrect / dailyGoal) * 100))
  const nextStory = stories.find((story) => !storyProgress.completed.includes(story.id)) ?? stories[0]

  return (
    <div className="scroll-area h-full">
      <div className="page-width dashboard">
        <PageHeader
          eyebrow="JAPP · JAPANISCH LERNEN"
          title={firstVisit ? 'Dein Japanisch beginnt hier.' : 'Schön, dass du da bist.'}
          description="Ein kleiner Schritt. Jeden Tag ein Stück weiter."
        />

        <div className="dashboard-top">
          <section className="today-card" aria-labelledby="next-step-title">
            <div className="today-card-copy">
              <p className="eyebrow">Dein nächster Schritt</p>
              <h2 id="next-step-title">
                {firstVisit
                  ? 'Hallo, Hiragana.'
                  : due > 0
                    ? 'Mach dein Wissen sicherer.'
                    : 'Zeit für etwas Neues.'}
              </h2>
              <p>
                {firstVisit
                  ? 'Entdecke die ersten Zeichen, höre ihre Aussprache und probiere die Strichfolge aus.'
                  : due > 0
                    ? `${due} ${due === 1 ? 'Wiederholung wartet' : 'Wiederholungen warten'} auf dich. Festige, was du schon gelernt hast.`
                    : 'Vertiefe deine Zeichen und entdecke neue Wörter – in deinem Tempo.'}
              </p>
              <Link
                to={resumable ? '/practice' : due > 0 ? '/practice' : `/lesson/${nextLesson.id}`}
                className="btn-duo today-cta"
              >
                {resumable
                  ? 'Lektion fortsetzen'
                  : firstVisit
                    ? 'Erste Lektion beginnen'
                    : due > 0
                      ? 'Wiederholen'
                      : 'Nächste Lektion'}{' '}
                <ArrowIcon />
              </Link>
              <span className="today-card-note">
                {firstVisit
                  ? 'Für deinen Einstieg · ohne Vorkenntnisse'
                  : 'Dein Fortschritt bleibt auf diesem Gerät gespeichert'}
              </span>
            </div>
            <div className="today-art" aria-hidden="true">
              <span className="jp">あ</span>
              <span>Ein Zeichen. Ein Anfang.</span>
            </div>
          </section>

          <section className="card-surface daily-card" aria-labelledby="daily-goal-title">
            <div className="section-heading">
              <div className="section-icon">
                <TargetIcon />
              </div>
              <h2 id="daily-goal-title">Dein Tagesziel</h2>
              <Link to="/settings" className="text-link">
                Anpassen
              </Link>
            </div>
            <div className="goal-value">
              {todayCorrect}
              <span> / {dailyGoal}</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              {goalReached ? 'Tagesziel erreicht. Gut gemacht!' : 'richtige Antworten heute'}
            </p>
            <div
              className="progress-track mt-4"
              role="progressbar"
              aria-label="Tagesziel"
              aria-valuenow={Math.min(todayCorrect, dailyGoal)}
              aria-valuemin={0}
              aria-valuemax={dailyGoal}
            >
              <div className="progress-fill" style={{ width: `${goalPercent}%` }} />
            </div>
            <div className="daily-footer">
              <span>Level {xpToLevel(progress.xp ?? 0)}</span>
              <span>
                {xpInLevel(progress.xp ?? 0)} / {XP_PER_LEVEL} XP
              </span>
            </div>
          </section>
        </div>

        <div className="learning-shortcuts mt-5">
          <Link to="/course" className="text-link">
            Dein Kurs →
          </Link>
          <Link to="/missions" className="text-link">
            Alltagsmissionen →
          </Link>
          <Link to="/training" className="text-link">
            Lernwerkstatt →
          </Link>
          <Link to="/notebook" className="text-link">
            Lernheft →
          </Link>
        </div>
        <section className="learning-section" aria-labelledby="learning-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Schritt für Schritt</p>
              <h2 id="learning-title">Deine Lernbereiche</h2>
            </div>
            <Link to="/learn" className="text-link">
              Alle ansehen <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="course-list">
            {COURSES.map(({ key, kana, label, description }, index) => {
              const entries =
                key === 'grammar' ? grammar : all.filter((item) => item.category === key && !item.historical)
              const mastered = entries.filter((item) => item.status === 'mastered').length
              const started = entries.some((item) => item.lastReviewDate !== null)
              const pct = entries.length ? Math.round((mastered / entries.length) * 100) : 0
              return (
                <Link key={key} to={`/learn?category=${key}`} className="course-row">
                  <span className={`course-kana course-kana--${key} jp`} aria-hidden="true">
                    {kana}
                  </span>
                  <div className="course-copy">
                    <span className="course-number">Lernbereich {String(index + 1).padStart(2, '0')}</span>
                    <h3>{label}</h3>
                    <p>{description}</p>
                    <div className="course-progress">
                      <span>
                        {mastered} / {entries.length} beherrscht
                      </span>
                      <span>{started ? `${pct}%` : 'Neu entdecken'}</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <ArrowIcon className="course-arrow w-5 h-5" />
                </Link>
              )
            })}
          </div>
        </section>

        <Link to={`/immerse/${nextStory.id}`} className="reading-feature card-surface">
          <div className="section-icon">
            <ReadingIcon />
          </div>
          <div>
            <p className="eyebrow">Japanisch im Kontext</p>
            <h2>{nextStory.title}</h2>
            <p>
              Eine kurze Geschichte mit Worterklärungen. {storyProgress.completed.length} / {stories.length}{' '}
              gelesen.
            </p>
          </div>
          <ArrowIcon className="w-5 h-5 shrink-0" />
        </Link>
      </div>
    </div>
  )
}
