import { collectionStage } from '@/utils/todayPlan'
import type { LearningItem } from '@/types'

export default function CollectionSteps({
  item,
  introducedIds,
}: {
  item: LearningItem
  introducedIds: string[]
}) {
  const stage = collectionStage(item, introducedIds)
  const level = { new: 0, seen: 1, practiced: 2, mastered: 3 }[stage]
  return (
    <section className="collection-steps" aria-label="Fortschritt dieses Zeichens">
      <p>Dein Zeichen wächst mit dir.</p>
      <ol>
        {['Entdecken', 'Richtig abrufen', 'Festigen'].map((label, index) => (
          <li key={label} className={level > index ? 'is-complete' : ''}>
            <span aria-hidden="true">{level > index ? '✓' : index + 1}</span> {label}
            <span className="sr-only">{level > index ? ': erreicht' : ': noch offen'}</span>
          </li>
        ))}
      </ol>
      <small>Grün wird dein Zeichen ab einem Wiederholungsabstand von 7 Tagen.</small>
    </section>
  )
}
