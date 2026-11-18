import { grammarData } from './grammar'
import { stories } from './stories'
import { missions } from './activities'
import type { StudyWord } from './studySentence'
import { toHiragana } from '@/utils/transliteration'

const sentenceWords = new Map<string, StudyWord[]>()
for (const entry of [
  ...grammarData.flatMap((point) => point.examples),
  ...stories.flatMap((story) => story.lines),
  ...missions.flatMap((mission) => mission.questions),
]) {
  if (!entry.jp || !entry.words) continue
  sentenceWords.set(entry.jp, entry.words)
  if (/[。！？]$/.test(entry.jp)) sentenceWords.set(entry.jp.slice(0, -1), entry.words.slice(0, -1))
}

/** Look up authored word boundaries only when both the text and supplied reading match. */
export function knownSentenceWords(text: string, reading?: string): StudyWord[] | undefined {
  const words = sentenceWords.get(text)
  if (words && (!reading || toHiragana(words.map((word) => word.reading).join('')) === toHiragana(reading)))
    return words
}
