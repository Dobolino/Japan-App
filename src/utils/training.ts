import type { PersistentState } from '@/store/types'
import type { ChoiceQuestion } from '@/data/activities'
import { confusionPairs } from '@/data/activities'
import { kanaToRomaji } from './transliteration'
export function buildTrainingQuestions(kind: string, state: PersistentState): ChoiceQuestion[] {
  if (kind === 'confusions')
    return confusionPairs
      .flatMap((pair, index) =>
        pair.chars.map((character, side) => ({
          id: `confusion:${index}:${side}`,
          prompt: `Welches Zeichen liest du „${kanaToRomaji(character)}“?`,
          choices: pair.chars,
          answer: side,
          explanation: pair.hint,
          jp: character,
          reading: kanaToRomaji(character),
        }))
      )
      .sort((a, b) => {
        const errors = (question: ChoiceQuestion) =>
          Object.values(state.items).find((item) => item.character === question.jp)?.errorCount ?? 0
        return errors(b) - errors(a) || a.id.localeCompare(b.id)
      })
  const items = Object.values(state.items).filter(
    (item) => !item.historical && (state.introducedIds.includes(item.id) || item.lastReviewDate !== null)
  )
  return items
    .sort((a, b) => b.errorCount - a.errorCount || a.id.localeCompare(b.id))
    .map((item, index) => {
      const others = items
        .filter(
          (other) =>
            other.id !== item.id &&
            other.category === item.category &&
            other.meaning !== item.meaning &&
            other.romaji !== item.romaji
        )
        .slice(0, 3)
      const answers =
        kind === 'listening'
          ? [item.meaning, ...others.map((other) => other.meaning)]
          : [item.character, ...others.map((other) => other.character)]
      const choices = [...new Set(answers)]
      const offset = index % choices.length
      const rotated = [...choices.slice(offset), ...choices.slice(0, offset)]
      return {
        id: `${kind}:${item.id}`,
        prompt:
          kind === 'listening'
            ? 'Welche Bedeutung oder Lesung hörst du?'
            : `${item.category === 'hiragana' ? 'Hiragana' : item.category === 'katakana' ? 'Katakana' : 'Japanisch'}: ${item.meaning}`,
        choices: rotated,
        answer: rotated.indexOf(answers[0]),
        explanation: `${item.character} liest du ${item.romaji}. Bedeutung: ${item.meaning}.`,
        jp: item.character,
        reading: item.romaji,
      }
    })
    .filter((question) => question.choices.length >= 2)
}
