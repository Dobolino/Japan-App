import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { localDateKey } from '@/utils/date'
import { todayPlan } from '@/utils/todayPlan'
import { useLocalNow } from '@/hooks/useLocalNow'
import { stories } from '@/data/stories'
import StreakPill from '@/components/StreakPill'
import { ArrowIcon, SettingsIcon, CheckIcon } from '@/components/icons/UiIcons'

export default function HomePage() {
  const store = useStore()
  const navigate = useNavigate()
  const now = useLocalNow()
  const plan = todayPlan(store, now.toISOString())
  const today = store.progress.todayDate === localDateKey(now) ? store.progress.todayCorrect : 0
  const goal = store.displayPrefs.dailyGoal
  const reached = today >= goal
  const nextStory = stories.find((story) => !store.storyProgress.completed.includes(story.id)) ?? stories[0]
  const symbol =
    plan.lesson?.itemIds.map((id) => store.items[id]?.character)[0] ?? plan.cards[0]?.answerCharacter ?? '文'
  const details =
    plan.resume && plan.kind === 'lesson'
      ? `Begonnene Lektion · noch ca. ${plan.minutes} Min.`
      : [
          plan.newCount > 0
            ? `${plan.newCount} ${plan.kind === 'lesson' && ['hiragana', 'katakana', 'kanji'].includes(plan.lesson!.category) ? 'neue Zeichen' : 'neue Inhalte'}`
            : '',
          plan.reviewCount > 0
            ? `${plan.reviewCount} ${plan.reviewCount === 1 ? 'Wiederholung' : 'Wiederholungen'}`
            : '',
          `ca. ${plan.minutes} Min.`,
        ]
          .filter(Boolean)
          .join(' · ')

  const start = () => {
    if (plan.kind === 'lesson' && plan.lesson) {
      if (!plan.resume) {
        store.saveLessonDraft(plan.lesson.id, {
          index: 0,
          stage: 'intro',
          correct: 0,
          attempted: 0,
          runId: crypto.randomUUID(),
        })
      }
      navigate(`/lesson/${plan.lesson.id}`)
    } else if (plan.kind === 'practice') {
      if (!plan.resume) {
        store.startStudySession()
        store.saveSession({
          id: crypto.randomUUID(),
          queue: plan.cards,
          index: 0,
          ratings: [],
          phase: 'question',
          direction: 'de-jp',
          mode: 'srs',
          typed: '',
          correct: null,
          startedAt: now.toISOString(),
          retries: [],
        })
      }
      navigate('/practice')
    } else navigate('/explore')
  }

  return (
    <div className="scroll-area h-full">
      <div className="page-width today-page">
        <header className="today-topline">
          <StreakPill now={now} />
          <Link to="/settings" className="icon-button" aria-label="Einstellungen">
            <SettingsIcon />
          </Link>
        </header>
        <div className="today-greeting">
          <p lang="ja" className="jp">
            こんにちは
          </p>
          <h1>
            {reached
              ? 'Dein Tagesziel ist geschafft.'
              : today > 0
                ? `Noch ${goal - today} ${goal - today === 1 ? 'Antwort' : 'Antworten'} bis zum Tagesziel.`
                : 'Ein kleiner Schritt. Jeden Tag.'}
          </h1>
        </div>
        <div
          className={`daily-ring ${reached ? 'daily-ring--complete' : ''}`}
          role="progressbar"
          aria-label="Richtige Antworten heute"
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-valuenow={Math.min(today, goal)}
          aria-valuetext={`${today} von ${goal} richtigen Antworten`}
        >
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <circle className="daily-ring-track" cx="100" cy="100" r="82" />
            <circle
              className="daily-ring-fill"
              cx="100"
              cy="100"
              r="82"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - Math.min(1, today / goal) * 100}
              transform="rotate(-90 100 100)"
              style={{ opacity: today ? 1 : 0 }}
            />
          </svg>
          <div className="daily-ring-copy">
            <strong>{today}</strong>
            <span>von {goal} heute</span>
            {reached && <CheckIcon className="w-5 h-5 mt-1" />}
          </div>
        </div>
        <section className="card-surface today-plan" aria-labelledby="today-plan-title">
          <div className="today-plan-heading">
            <span lang="ja" className="today-plan-symbol jp" aria-hidden="true">
              {[...symbol].slice(0, 2).join('')}
            </span>
            <div>
              <p className="eyebrow">{plan.resume ? 'Hier geht es weiter' : 'Dein Plan für heute'}</p>
              <h2 id="today-plan-title">{plan.title}</h2>
            </div>
          </div>
          <p className="today-plan-meta">
            {plan.kind === 'explore' ? 'Lies eine Geschichte oder entdecke die Lernwerkstatt.' : details}
          </p>
          <button type="button" className="btn-duo today-start" onClick={start}>
            {plan.resume ? 'Weiterlernen' : plan.kind === 'explore' ? 'Entdecken' : 'Los geht’s'}
            <ArrowIcon />
          </button>
        </section>
        <Link to={`/immerse/${nextStory.id}`} className="today-after">
          <span>
            {reached ? 'Zeit für eine Geschichte?' : 'Für danach'}
            <strong>{nextStory.title}</strong>
          </span>
          <ArrowIcon />
        </Link>
      </div>
    </div>
  )
}
