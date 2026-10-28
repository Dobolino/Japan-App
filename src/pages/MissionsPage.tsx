import { Link, useParams } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import ChoiceActivity from '@/components/ChoiceActivity'
import { missions } from '@/data/activities'
import { useStore } from '@/store/useStore'
export default function MissionsPage() {
  const { missionId } = useParams(),
    store = useStore(),
    mission = missions.find((entry) => entry.id === missionId)
  if (mission)
    return (
      <ChoiceActivity
        key={mission.id}
        id={`mission:${mission.id}`}
        title={mission.title}
        description={mission.goal}
        questions={mission.questions}
        onComplete={() => store.introduceItems([], mission.grammar)}
      />
    )
  return (
    <div className="scroll-area h-full">
      <div className="page-width">
        <PageHeader
          eyebrow="ALLTAGSMISSIONEN"
          title="Japanisch, das du benutzen kannst."
          description="Wähle eine Situation und übe, was du wirklich sagen möchtest."
        />
        <div className="feature-grid">
          {missions.map((entry) => (
            <Link key={entry.id} to={`/missions/${entry.id}`} className="card-surface feature-card">
              <span className="eyebrow">
                {store.trainingResults[`mission:${entry.id}`] ? 'Bereits geübt' : 'Kurzer Dialog'}
              </span>
              <h2>{entry.title}</h2>
              <p>{entry.goal}</p>
              <span className="text-link">Mission öffnen →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
