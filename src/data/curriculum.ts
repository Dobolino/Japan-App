import { catalog } from './catalog'
import { grammarData } from './grammar'
import type { ItemCategory } from '@/types'
export interface Lesson {
  id: string
  title: string
  goal: string
  category: ItemCategory | 'grammar'
  itemIds: string[]
  grammarIds?: string[]
  prerequisite?: string
}
const rows = [
  'あいうえお',
  'かきくけこ',
  'さしすせそ',
  'たちつてと',
  'なにぬねの',
  'はひふへほ',
  'まみむめも',
  'やゆよ',
  'らりるれろ',
  'わをん',
  'がぎぐげご',
  'ざじずぜぞ',
  'だぢづでど',
  'ばびぶべぼ',
  'ぱぴぷぺぽ',
]
const names = [
  'Vokale',
  'K-Reihe',
  'S-Reihe',
  'T-Reihe',
  'N-Reihe',
  'H-Reihe',
  'M-Reihe',
  'Y-Reihe',
  'R-Reihe',
  'W und N',
  'G-Reihe',
  'Z-Reihe',
  'D-Reihe',
  'B-Reihe',
  'P-Reihe',
]
export const lessons: Lesson[] = (['hiragana', 'katakana'] as const).flatMap((category) => {
  const groups = [
    ...rows.map((row) => [...row]),
    ...['き', 'ぎ', 'し', 'じ', 'ち', 'に', 'ひ', 'び', 'ぴ', 'み', 'り'].map((base) =>
      ['ゃ', 'ゅ', 'ょ'].map((small) => base + small)
    ),
  ]
  return groups.map((group, index) => {
    const chars = group.map((hira) =>
      category === 'hiragana'
        ? hira
        : [...hira].map((ch) => String.fromCodePoint(ch.codePointAt(0)! + 0x60)).join('')
    )
    return {
      id: `${category}-${index}`,
      title: `${category === 'hiragana' ? 'Hiragana' : 'Katakana'} · ${names[index] ?? chars.join('・')}`,
      goal: `Du erkennst ${chars.join('・')} und kannst die Lesung selbst eingeben.`,
      category,
      itemIds: chars.map(
        (ch) => catalog.find((item) => item.category === category && item.character === ch)!.id
      ),
      prerequisite: index > 0 ? `${category}-${index - 1}` : undefined,
    }
  })
})
for (const category of ['kanji', 'vocabulary'] as const) {
  const items = catalog.filter((item) => item.category === category)
  for (let i = 0; i < items.length; i += 5)
    lessons.push({
      id: `${category}-${i / 5}`,
      title: `${category === 'kanji' ? 'Kanji' : 'Wortschatz'} · ${items
        .slice(i, i + 5)
        .map((item) => item.meaning.split(' / ')[0])
        .join(', ')}`,
      goal: 'Du verstehst diese fünf Inhalte und kannst sie aktiv abrufen.',
      category,
      itemIds: items.slice(i, i + 5).map((item) => item.id),
      prerequisite: i > 0 ? `${category}-${i / 5 - 1}` : 'hiragana-0',
    })
}
for (const point of grammarData)
  lessons.push({
    id: `lesson-${point.id}`,
    title: point.title,
    goal: point.subtitle,
    category: 'grammar',
    itemIds: [],
    grammarIds: [point.id],
    prerequisite: 'hiragana-0',
  })
export const lessonById = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]))
