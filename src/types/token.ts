/** Part-of-speech hint for a segmented token. */
export type TokenPos = 'word' | 'particle' | 'punctuation' | 'other'

/** One word or particle in a Japanese sentence. */
export interface Token {
  surface: string
  reading: string
  pos: TokenPos
  /** Linked SRS item id when known */
  lemmaId?: string
  /** German gloss (from lexicon or particle map) */
  meaning?: string
  /** Romaji for display */
  romaji?: string
}

export interface LexiconEntry {
  id: string
  surface: string
  reading?: string
  romaji: string
  meaning: string
  category: string
}
