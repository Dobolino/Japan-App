export type ItemCategory = 'hiragana' | 'katakana' | 'kanji' | 'vocabulary'
export type SRSStatus = 'new' | 'learning' | 'uncertain' | 'mastered'
export type SRSRating = 0 | 1 | 2 | 3   // 0=Nochmal 1=Schwer 2=Gut 3=Einfach

export type VocabCategory =
  | 'zahlen' | 'zeit' | 'familie' | 'koerper'
  | 'essen' | 'orte' | 'verkehr' | 'natur'
  | 'farben' | 'verben' | 'adjektive' | 'grüße'

export interface StrokeSegment {
  points: [number, number][]
}

export interface LearningItem {
  id: string
  character: string        // the Japanese word / character
  romaji: string           // reading in romaji
  meaning: string          // German meaning
  category: ItemCategory
  strokes?: StrokeSegment[]            // hiragana/katakana/kanji only
  exampleWord?: string
  exampleReading?: string
  exampleMeaning?: string
  // Vocabulary-specific
  vocabCategory?: VocabCategory
  // Kanji-specific
  onyomi?: string[]
  kunyomi?: string[]
  strokeCount?: number
  // SM-2 SRS fields
  status: SRSStatus
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  lastReviewDate: string | null
  errorCount: number
  correctCount: number
}

export interface UserProgress {
  studySessions: number
  cardsReviewed: number
  currentStreak: number
  longestStreak: number
  lastStudyDate: string | null
  totalCorrect: number
  totalErrors: number
  xp: number
  level: number
  todayCorrect: number
  todayDate: string | null
}

export type ThemeMode = 'light' | 'dark' | 'system'

export interface DisplayPrefs {
  showFurigana: boolean
  showRomaji: boolean
  theme: ThemeMode
}

export interface StoryProgress {
  completed: string[]
}

/** SRS state for grammar example sentences (id: grammar:{pointId}:{exampleIndex}) */
export interface GrammarSrsItem {
  id: string
  grammarId: string
  exampleIndex: number
  title: string
  status: SRSStatus
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: string
  lastReviewDate: string | null
  errorCount: number
  correctCount: number
}

export interface DrawingStroke {
  points: { x: number; y: number }[]
}
