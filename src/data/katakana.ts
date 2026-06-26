import type { LearningItem, StrokeSegment } from '../types'

function s(...pts: [number, number][]): StrokeSegment {
  return { points: pts }
}

const today = new Date().toISOString()

function base(overrides: Partial<LearningItem>): LearningItem {
  return {
    id: '',
    character: '',
    romaji: '',
    meaning: '',
    category: 'katakana',
    strokes: [],
    status: 'new',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: today,
    lastReviewDate: null,
    errorCount: 0,
    correctCount: 0,
    ...overrides,
  }
}

// All 46 basic Katakana with simplified stroke guides.
// Stroke order follows traditional Japanese calligraphy conventions.
export const katakanaData: LearningItem[] = [
  // ── Vowels ──────────────────────────────────────────────────────────────────
  base({
    id: 'k-a', character: 'ア', romaji: 'a', meaning: 'a',
    exampleWord: 'アイス', exampleReading: 'aisu', exampleMeaning: 'Eis',
    strokes: [
      s([0.2,0.28],[0.8,0.28]),                           // 1: top horizontal
      s([0.5,0.12],[0.5,0.52],[0.35,0.72],[0.22,0.85]),  // 2: vertical + left drop
    ],
  }),
  base({
    id: 'k-i', character: 'イ', romaji: 'i', meaning: 'i',
    exampleWord: 'イヌ', exampleReading: 'inu', exampleMeaning: 'Hund',
    strokes: [
      s([0.32,0.18],[0.55,0.52],[0.45,0.75],[0.32,0.88]), // 1: left diagonal drop
      s([0.62,0.18],[0.62,0.88]),                          // 2: right vertical
    ],
  }),
  base({
    id: 'k-u', character: 'ウ', romaji: 'u', meaning: 'u',
    exampleWord: 'ウミ', exampleReading: 'umi', exampleMeaning: 'Meer',
    strokes: [
      s([0.38,0.15],[0.62,0.15]),                          // 1: top tick
      s([0.25,0.35],[0.75,0.35]),                          // 2: middle horizontal
      s([0.5,0.35],[0.5,0.88]),                            // 3: vertical
    ],
  }),
  base({
    id: 'k-e', character: 'エ', romaji: 'e', meaning: 'e',
    exampleWord: 'エキ', exampleReading: 'eki', exampleMeaning: 'Bahnhof',
    strokes: [
      s([0.2,0.28],[0.8,0.28]),                            // 1: top horizontal
      s([0.5,0.28],[0.5,0.72]),                            // 2: vertical
      s([0.2,0.72],[0.8,0.72]),                            // 3: bottom horizontal
    ],
  }),
  base({
    id: 'k-o', character: 'オ', romaji: 'o', meaning: 'o',
    exampleWord: 'オカネ', exampleReading: 'okane', exampleMeaning: 'Geld',
    strokes: [
      s([0.2,0.28],[0.8,0.28]),                            // 1: top horizontal
      s([0.5,0.12],[0.5,0.88]),                            // 2: vertical
      s([0.28,0.55],[0.72,0.68]),                          // 3: right diagonal
    ],
  }),

  // ── K-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'k-ka', character: 'カ', romaji: 'ka', meaning: 'ka',
    exampleWord: 'カワ', exampleReading: 'kawa', exampleMeaning: 'Fluss',
    strokes: [
      s([0.25,0.32],[0.75,0.32]),                          // 1: horizontal
      s([0.48,0.15],[0.48,0.88]),                          // 2: left-center vertical
      s([0.5,0.5],[0.78,0.62],[0.82,0.78]),               // 3: right arm
    ],
  }),
  base({
    id: 'k-ki', character: 'キ', romaji: 'ki', meaning: 'ki',
    exampleWord: 'キカイ', exampleReading: 'kikai', exampleMeaning: 'Maschine',
    strokes: [
      s([0.22,0.28],[0.78,0.28]),                          // 1: top horizontal
      s([0.22,0.52],[0.78,0.52]),                          // 2: middle horizontal
      s([0.5,0.12],[0.5,0.88]),                            // 3: vertical
      s([0.35,0.65],[0.5,0.88],[0.65,0.65]),              // 4: bottom V
    ],
  }),
  base({
    id: 'k-ku', character: 'ク', romaji: 'ku', meaning: 'ku',
    exampleWord: 'クモ', exampleReading: 'kumo', exampleMeaning: 'Wolke',
    strokes: [
      s([0.55,0.18],[0.78,0.32]),                          // 1: top right diagonal
      s([0.55,0.18],[0.28,0.5],[0.35,0.72],[0.6,0.82],[0.78,0.72]), // 2: left arc
    ],
  }),
  base({
    id: 'k-ke', character: 'ケ', romaji: 'ke', meaning: 'ke',
    exampleWord: 'ケーキ', exampleReading: 'keeki', exampleMeaning: 'Kuchen',
    strokes: [
      s([0.32,0.18],[0.32,0.88]),                          // 1: left vertical
      s([0.28,0.38],[0.78,0.38]),                          // 2: horizontal
      s([0.75,0.38],[0.78,0.62],[0.65,0.78],[0.45,0.85]), // 3: right curve
    ],
  }),
  base({
    id: 'k-ko', character: 'コ', romaji: 'ko', meaning: 'ko',
    exampleWord: 'コト', exampleReading: 'koto', exampleMeaning: 'Ding / Sache',
    strokes: [
      s([0.25,0.25],[0.75,0.25]),                          // 1: top horizontal
      s([0.72,0.25],[0.72,0.75]),                          // 2: right vertical
      s([0.25,0.75],[0.75,0.75]),                          // 3: bottom horizontal
    ],
  }),

  // ── S-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'k-sa', character: 'サ', romaji: 'sa', meaning: 'sa',
    exampleWord: 'サクラ', exampleReading: 'sakura', exampleMeaning: 'Kirschblüte',
    strokes: [
      s([0.22,0.32],[0.78,0.32]),                          // 1: top horizontal
      s([0.38,0.15],[0.38,0.55],[0.28,0.75],[0.2,0.88]),  // 2: left vertical drop
      s([0.62,0.15],[0.62,0.55],[0.75,0.75],[0.8,0.88]),  // 3: right vertical drop
    ],
  }),
  base({
    id: 'k-si', character: 'シ', romaji: 'shi', meaning: 'shi',
    exampleWord: 'シロ', exampleReading: 'shiro', exampleMeaning: 'weiß',
    strokes: [
      s([0.22,0.35],[0.38,0.28]),                          // 1: top-left dot
      s([0.28,0.52],[0.42,0.45]),                          // 2: middle dot
      s([0.45,0.25],[0.72,0.38],[0.78,0.55],[0.62,0.72],[0.4,0.82],[0.25,0.78]), // 3: right arc
    ],
  }),
  base({
    id: 'k-su', character: 'ス', romaji: 'su', meaning: 'su',
    exampleWord: 'スシ', exampleReading: 'sushi', exampleMeaning: 'Sushi',
    strokes: [
      s([0.22,0.28],[0.78,0.28]),                          // 1: top horizontal
      s([0.5,0.28],[0.62,0.5],[0.65,0.65],[0.5,0.82],[0.32,0.88],[0.22,0.78]), // 2: diagonal + curve
    ],
  }),
  base({
    id: 'k-se', character: 'セ', romaji: 'se', meaning: 'se',
    exampleWord: 'センセイ', exampleReading: 'sensei', exampleMeaning: 'Lehrer',
    strokes: [
      s([0.32,0.18],[0.32,0.62]),                          // 1: left vertical
      s([0.28,0.42],[0.78,0.42]),                          // 2: horizontal (crosses vertical)
      s([0.72,0.42],[0.78,0.62],[0.65,0.78],[0.45,0.85],[0.28,0.82]), // 3: right curve
    ],
  }),
  base({
    id: 'k-so', character: 'ソ', romaji: 'so', meaning: 'so',
    exampleWord: 'ソラ', exampleReading: 'sora', exampleMeaning: 'Himmel',
    strokes: [
      s([0.3,0.22],[0.48,0.45]),                           // 1: left diagonal
      s([0.55,0.18],[0.72,0.38],[0.75,0.58],[0.6,0.78],[0.38,0.88],[0.22,0.82]), // 2: right arc
    ],
  }),

  // ── T-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'k-ta', character: 'タ', romaji: 'ta', meaning: 'ta',
    exampleWord: 'タベル', exampleReading: 'taberu', exampleMeaning: 'essen',
    strokes: [
      s([0.22,0.28],[0.78,0.28]),                          // 1: top horizontal
      s([0.52,0.15],[0.62,0.38],[0.65,0.55],[0.52,0.72],[0.32,0.82],[0.2,0.75]), // 2: right curve down
      s([0.48,0.5],[0.28,0.65],[0.22,0.82]),               // 3: left diagonal
    ],
  }),
  base({
    id: 'k-ti', character: 'チ', romaji: 'chi', meaning: 'chi',
    exampleWord: 'チズ', exampleReading: 'chizu', exampleMeaning: 'Landkarte',
    strokes: [
      s([0.22,0.28],[0.78,0.28]),                          // 1: top horizontal
      s([0.22,0.5],[0.78,0.5]),                            // 2: middle horizontal
      s([0.52,0.5],[0.65,0.65],[0.68,0.8],[0.52,0.9],[0.32,0.88],[0.22,0.75]), // 3: curve
    ],
  }),
  base({
    id: 'k-tu', character: 'ツ', romaji: 'tsu', meaning: 'tsu',
    exampleWord: 'ツキ', exampleReading: 'tsuki', exampleMeaning: 'Mond',
    strokes: [
      s([0.22,0.35],[0.38,0.28]),                          // 1: top-left dot
      s([0.38,0.52],[0.52,0.45]),                          // 2: middle dot
      s([0.62,0.18],[0.75,0.35],[0.78,0.55],[0.62,0.72],[0.4,0.82],[0.22,0.75]), // 3: right arc
    ],
  }),
  base({
    id: 'k-te', character: 'テ', romaji: 'te', meaning: 'te',
    exampleWord: 'テガミ', exampleReading: 'tegami', exampleMeaning: 'Brief',
    strokes: [
      s([0.22,0.28],[0.78,0.28]),                          // 1: top horizontal
      s([0.38,0.28],[0.38,0.55]),                          // 2: left-center drop
      s([0.22,0.55],[0.78,0.55]),                          // 3: middle horizontal
      s([0.5,0.55],[0.5,0.88]),                            // 4: bottom vertical
    ],
  }),
  base({
    id: 'k-to', character: 'ト', romaji: 'to', meaning: 'to',
    exampleWord: 'トリ', exampleReading: 'tori', exampleMeaning: 'Vogel',
    strokes: [
      s([0.45,0.12],[0.45,0.88]),                          // 1: vertical
      s([0.45,0.42],[0.72,0.55]),                          // 2: right diagonal
    ],
  }),

  // ── N-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'k-na', character: 'ナ', romaji: 'na', meaning: 'na',
    exampleWord: 'ナマエ', exampleReading: 'namae', exampleMeaning: 'Name',
    strokes: [
      s([0.22,0.38],[0.78,0.38]),                          // 1: horizontal
      s([0.5,0.15],[0.5,0.88]),                            // 2: vertical
    ],
  }),
  base({
    id: 'k-ni', character: 'ニ', romaji: 'ni', meaning: 'ni',
    exampleWord: 'ニホン', exampleReading: 'nihon', exampleMeaning: 'Japan',
    strokes: [
      s([0.28,0.35],[0.72,0.35]),                          // 1: top horizontal (shorter)
      s([0.18,0.65],[0.82,0.65]),                          // 2: bottom horizontal (wider)
    ],
  }),
  base({
    id: 'k-nu', character: 'ヌ', romaji: 'nu', meaning: 'nu',
    exampleWord: 'ヌノ', exampleReading: 'nuno', exampleMeaning: 'Stoff',
    strokes: [
      s([0.22,0.32],[0.78,0.32]),                          // 1: top horizontal
      s([0.5,0.12],[0.45,0.55],[0.28,0.72],[0.22,0.85]),  // 2: vertical + left
      s([0.55,0.45],[0.75,0.6],[0.78,0.78]),              // 3: right flick
    ],
  }),
  base({
    id: 'k-ne', character: 'ネ', romaji: 'ne', meaning: 'ne',
    exampleWord: 'ネコ', exampleReading: 'neko', exampleMeaning: 'Katze',
    strokes: [
      s([0.22,0.32],[0.78,0.32]),                          // 1: top horizontal
      s([0.5,0.15],[0.5,0.58]),                            // 2: vertical
      s([0.28,0.52],[0.72,0.52]),                          // 3: middle horizontal
      s([0.35,0.52],[0.28,0.72],[0.22,0.88]),             // 4: left drop
      s([0.62,0.52],[0.72,0.7],[0.78,0.88]),              // 5: right drop
    ],
  }),
  base({
    id: 'k-no', character: 'ノ', romaji: 'no', meaning: 'no (Partikel)',
    exampleWord: 'ワタシノ', exampleReading: 'watashi no', exampleMeaning: 'mein/e',
    strokes: [
      s([0.7,0.15],[0.3,0.85]),                            // 1: single diagonal
    ],
  }),

  // ── H-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'k-ha', character: 'ハ', romaji: 'ha', meaning: 'ha',
    exampleWord: 'ハナ', exampleReading: 'hana', exampleMeaning: 'Blume',
    strokes: [
      s([0.42,0.22],[0.28,0.58],[0.22,0.82]),             // 1: left stroke
      s([0.55,0.18],[0.72,0.52],[0.78,0.75]),             // 2: right stroke
    ],
  }),
  base({
    id: 'k-hi', character: 'ヒ', romaji: 'hi', meaning: 'hi',
    exampleWord: 'ヒト', exampleReading: 'hito', exampleMeaning: 'Person',
    strokes: [
      s([0.28,0.18],[0.28,0.72],[0.42,0.82],[0.72,0.82]), // 1: left+base
      s([0.28,0.5],[0.72,0.5]),                            // 2: middle horizontal
    ],
  }),
  base({
    id: 'k-hu', character: 'フ', romaji: 'fu', meaning: 'fu',
    exampleWord: 'フユ', exampleReading: 'fuyu', exampleMeaning: 'Winter',
    strokes: [
      s([0.22,0.22],[0.78,0.22]),                          // 1: top horizontal
      s([0.72,0.22],[0.62,0.52],[0.42,0.72],[0.28,0.88]), // 2: right diagonal drop
    ],
  }),
  base({
    id: 'k-he', character: 'ヘ', romaji: 'he', meaning: 'he / e (Partikel)',
    exampleWord: 'ウエヘ', exampleReading: 'ue he', exampleMeaning: 'nach oben',
    strokes: [
      s([0.18,0.62],[0.5,0.22],[0.82,0.62]),               // 1: single peak
    ],
  }),
  base({
    id: 'k-ho', character: 'ホ', romaji: 'ho', meaning: 'ho',
    exampleWord: 'ホン', exampleReading: 'hon', exampleMeaning: 'Buch',
    strokes: [
      s([0.22,0.38],[0.78,0.38]),                          // 1: top horizontal
      s([0.5,0.15],[0.5,0.88]),                            // 2: vertical
      s([0.28,0.6],[0.5,0.75],[0.72,0.6]),                // 3: left-right diagonals from center
    ],
  }),

  // ── M-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'k-ma', character: 'マ', romaji: 'ma', meaning: 'ma',
    exampleWord: 'マチ', exampleReading: 'machi', exampleMeaning: 'Stadt',
    strokes: [
      s([0.22,0.28],[0.78,0.28]),                          // 1: top horizontal
      s([0.65,0.28],[0.45,0.52],[0.28,0.72],[0.22,0.88]), // 2: right-to-left diagonal
    ],
  }),
  base({
    id: 'k-mi', character: 'ミ', romaji: 'mi', meaning: 'mi',
    exampleWord: 'ミズ', exampleReading: 'mizu', exampleMeaning: 'Wasser',
    strokes: [
      s([0.28,0.28],[0.72,0.28]),                          // 1: top horizontal (shorter)
      s([0.22,0.5],[0.78,0.5]),                            // 2: middle horizontal (full)
      s([0.28,0.72],[0.72,0.72]),                          // 3: bottom horizontal
    ],
  }),
  base({
    id: 'k-mu', character: 'ム', romaji: 'mu', meaning: 'mu',
    exampleWord: 'ムシ', exampleReading: 'mushi', exampleMeaning: 'Insekt',
    strokes: [
      s([0.55,0.15],[0.38,0.38],[0.22,0.62],[0.28,0.78],[0.5,0.85],[0.72,0.78],[0.78,0.58],[0.62,0.38]), // 1: left loop
      s([0.62,0.38],[0.78,0.25]),                          // 2: upper right stroke
    ],
  }),
  base({
    id: 'k-me', character: 'メ', romaji: 'me', meaning: 'me',
    exampleWord: 'メ', exampleReading: 'me', exampleMeaning: 'Auge',
    strokes: [
      s([0.22,0.42],[0.78,0.42]),                          // 1: horizontal
      s([0.62,0.22],[0.38,0.55],[0.28,0.78]),             // 2: left diagonal
    ],
  }),
  base({
    id: 'k-mo', character: 'モ', romaji: 'mo', meaning: 'mo (auch)',
    exampleWord: 'モ', exampleReading: 'mo', exampleMeaning: 'auch',
    strokes: [
      s([0.22,0.28],[0.78,0.28]),                          // 1: top horizontal
      s([0.22,0.52],[0.78,0.52]),                          // 2: middle horizontal
      s([0.5,0.15],[0.5,0.88]),                            // 3: vertical
    ],
  }),

  // ── Y-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'k-ya', character: 'ヤ', romaji: 'ya', meaning: 'ya',
    exampleWord: 'ヤマ', exampleReading: 'yama', exampleMeaning: 'Berg',
    strokes: [
      s([0.22,0.38],[0.78,0.38]),                          // 1: horizontal
      s([0.62,0.18],[0.62,0.88]),                          // 2: right vertical
      s([0.22,0.55],[0.62,0.72]),                          // 3: left diagonal
    ],
  }),
  base({
    id: 'k-yu', character: 'ユ', romaji: 'yu', meaning: 'yu',
    exampleWord: 'ユキ', exampleReading: 'yuki', exampleMeaning: 'Schnee',
    strokes: [
      s([0.28,0.32],[0.72,0.32]),                          // 1: top horizontal
      s([0.5,0.32],[0.5,0.72]),                            // 2: vertical
      s([0.22,0.72],[0.78,0.72]),                          // 3: bottom horizontal
    ],
  }),
  base({
    id: 'k-yo', character: 'ヨ', romaji: 'yo', meaning: 'yo',
    exampleWord: 'ヨル', exampleReading: 'yoru', exampleMeaning: 'Nacht',
    strokes: [
      s([0.22,0.22],[0.78,0.22]),                          // 1: top horizontal
      s([0.22,0.5],[0.78,0.5]),                            // 2: middle horizontal
      s([0.22,0.78],[0.78,0.78]),                          // 3: bottom horizontal
      s([0.72,0.22],[0.72,0.78]),                          // 4: right vertical
    ],
  }),

  // ── R-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'k-ra', character: 'ラ', romaji: 'ra', meaning: 'ra',
    exampleWord: 'ラジオ', exampleReading: 'rajio', exampleMeaning: 'Radio',
    strokes: [
      s([0.28,0.28],[0.72,0.28]),                          // 1: top horizontal
      s([0.62,0.28],[0.45,0.52],[0.28,0.72],[0.22,0.88]), // 2: right diagonal drop
    ],
  }),
  base({
    id: 'k-ri', character: 'リ', romaji: 'ri', meaning: 'ri',
    exampleWord: 'リンゴ', exampleReading: 'ringo', exampleMeaning: 'Apfel',
    strokes: [
      s([0.35,0.18],[0.35,0.62],[0.45,0.78]),             // 1: left stroke + hook
      s([0.62,0.18],[0.62,0.88]),                          // 2: right vertical
    ],
  }),
  base({
    id: 'k-ru', character: 'ル', romaji: 'ru', meaning: 'ru',
    exampleWord: 'ルーム', exampleReading: 'ruumu', exampleMeaning: 'Zimmer',
    strokes: [
      s([0.38,0.18],[0.38,0.65],[0.28,0.82]),             // 1: left vertical + flick
      s([0.55,0.18],[0.65,0.42],[0.72,0.62],[0.62,0.78],[0.45,0.85]), // 2: right curve
    ],
  }),
  base({
    id: 'k-re', character: 'レ', romaji: 're', meaning: 're',
    exampleWord: 'レストラン', exampleReading: 'resutoran', exampleMeaning: 'Restaurant',
    strokes: [
      s([0.42,0.18],[0.42,0.65],[0.55,0.78],[0.72,0.82]), // 1: vertical + right base
    ],
  }),
  base({
    id: 'k-ro', character: 'ロ', romaji: 'ro', meaning: 'ro',
    exampleWord: 'ロク', exampleReading: 'roku', exampleMeaning: 'sechs',
    strokes: [
      s([0.22,0.22],[0.78,0.22]),                          // 1: top horizontal
      s([0.22,0.22],[0.22,0.78]),                          // 2: left vertical
      s([0.78,0.22],[0.78,0.78]),                          // 3: right vertical
      s([0.22,0.78],[0.78,0.78]),                          // 4: bottom horizontal
    ],
  }),

  // ── W-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'k-wa', character: 'ワ', romaji: 'wa', meaning: 'wa',
    exampleWord: 'ワタシ', exampleReading: 'watashi', exampleMeaning: 'ich',
    strokes: [
      s([0.22,0.22],[0.78,0.22]),                          // 1: top horizontal
      s([0.72,0.22],[0.65,0.55],[0.5,0.72],[0.35,0.82],[0.22,0.88]), // 2: right drop
    ],
  }),
  base({
    id: 'k-wi', character: 'ヰ', romaji: 'wi', meaning: 'wi (veraltet)',
    exampleWord: 'ヰ', exampleReading: 'wi', exampleMeaning: 'veraltet',
    strokes: [
      s([0.22,0.38],[0.78,0.38]),
      s([0.5,0.15],[0.5,0.85]),
    ],
  }),
  base({
    id: 'k-we', character: 'ヱ', romaji: 'we', meaning: 'we (veraltet)',
    exampleWord: 'ヱ', exampleReading: 'we', exampleMeaning: 'veraltet',
    strokes: [
      s([0.22,0.28],[0.78,0.28]),
      s([0.5,0.15],[0.5,0.85]),
      s([0.22,0.72],[0.78,0.72]),
    ],
  }),
  base({
    id: 'k-wo', character: 'ヲ', romaji: 'wo / o', meaning: 'wo (Partikel)',
    exampleWord: 'ホンヲヨム', exampleReading: 'hon wo yomu', exampleMeaning: 'ein Buch lesen',
    strokes: [
      s([0.22,0.22],[0.78,0.22]),                          // 1: top horizontal
      s([0.22,0.42],[0.78,0.42]),                          // 2: middle horizontal
      s([0.52,0.12],[0.52,0.5],[0.65,0.65],[0.72,0.8],[0.55,0.9],[0.35,0.9],[0.22,0.78]), // 3: vertical+loop
    ],
  }),

  // ── N (nasal) ───────────────────────────────────────────────────────────────
  base({
    id: 'k-nn', character: 'ン', romaji: 'n', meaning: 'n (nasal)',
    exampleWord: 'ニホン', exampleReading: 'nihon', exampleMeaning: 'Japan',
    strokes: [
      s([0.28,0.32],[0.45,0.25]),                          // 1: upper left dot
      s([0.58,0.18],[0.75,0.35],[0.78,0.55],[0.62,0.72],[0.4,0.82],[0.25,0.78]), // 2: right arc
    ],
  }),
]
