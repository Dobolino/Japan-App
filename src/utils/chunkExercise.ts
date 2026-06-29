import { shuffle } from '@/utils/shuffle'
import { tokenizeJapanese } from '@/utils/tokenize'

export interface ChunkExercise {
  id: string
  promptDe: string
  /** Correct surface order (without punctuation) */
  answer: string[]
  /** Shuffled chunks for the user */
  chunks: string[]
}

/** Build SOV chunk-ordering exercise from a Japanese sentence. */
export function buildChunkExercise(id: string, jp: string, reading: string, de: string): ChunkExercise {
  const tokens = tokenizeJapanese(jp, reading).filter((t) => t.pos !== 'punctuation')
  const answer = tokens.map((t) => t.surface)

  return {
    id,
    promptDe: de,
    answer,
    chunks: shuffle([...answer]),
  }
}

export function chunkOrderMatches(selected: string[], answer: string[]): boolean {
  if (selected.length !== answer.length) return false
  return selected.every((c, i) => c === answer[i])
}
