import type { LearningItem, StrokeSegment } from '../types'

// Stroke data: normalized coordinates (0..1 in a unit square, top-left origin).
// Each stroke is a polyline of [x, y] control points drawn in order.
// These are simplified approximations for visual learning — not pixel-perfect calligraphy.
// A full production dataset should use KanjiVG-derived paths.

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
    category: 'hiragana',
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

// All 46 basic Hiragana with simplified stroke guides.
// Stroke order follows traditional Japanese calligraphy conventions.
export const hiraganaData: LearningItem[] = [
  // ── Vowels ──────────────────────────────────────────────────────────────────
  base({
    id: 'h-a', character: 'あ', romaji: 'a', meaning: 'a',
    exampleWord: 'あめ', exampleReading: 'ame', exampleMeaning: 'Regen',
    strokes: [
      s([0.2,0.3],[0.8,0.3]),                          // 1: horizontal bar
      s([0.5,0.15],[0.5,0.55],[0.35,0.75],[0.2,0.85]), // 2: vertical + curve left
      s([0.55,0.5],[0.75,0.6],[0.8,0.75],[0.65,0.88],[0.4,0.9],[0.25,0.82]), // 3: right loop
    ],
  }),
  base({
    id: 'h-i', character: 'い', romaji: 'i', meaning: 'i',
    exampleWord: 'いぬ', exampleReading: 'inu', exampleMeaning: 'Hund',
    strokes: [
      s([0.3,0.2],[0.25,0.5],[0.3,0.75],[0.4,0.85]),   // 1: left stroke
      s([0.6,0.15],[0.65,0.45],[0.7,0.65],[0.6,0.82],[0.45,0.88]), // 2: right stroke
    ],
  }),
  base({
    id: 'h-u', character: 'う', romaji: 'u', meaning: 'u',
    exampleWord: 'うみ', exampleReading: 'umi', exampleMeaning: 'Meer',
    strokes: [
      s([0.35,0.2],[0.65,0.2]),                         // 1: top horizontal
      s([0.5,0.25],[0.45,0.5],[0.35,0.65],[0.4,0.8],[0.55,0.88],[0.7,0.82],[0.75,0.65]), // 2: main body
    ],
  }),
  base({
    id: 'h-e', character: 'え', romaji: 'e', meaning: 'e',
    exampleWord: 'えき', exampleReading: 'eki', exampleMeaning: 'Bahnhof',
    strokes: [
      s([0.2,0.35],[0.8,0.35]),                         // 1: horizontal bar
      s([0.5,0.15],[0.5,0.4],[0.35,0.6],[0.25,0.8]),   // 2: vertical left drop
      s([0.55,0.4],[0.7,0.55],[0.75,0.7],[0.6,0.85],[0.4,0.88]), // 3: right curl
    ],
  }),
  base({
    id: 'h-o', character: 'お', romaji: 'o', meaning: 'o',
    exampleWord: 'おかあさん', exampleReading: 'okaasan', exampleMeaning: 'Mutter',
    strokes: [
      s([0.2,0.3],[0.8,0.3]),                           // 1: horizontal
      s([0.5,0.15],[0.5,0.55]),                         // 2: vertical
      s([0.3,0.55],[0.7,0.55]),                         // 3: middle horizontal
      s([0.55,0.55],[0.7,0.7],[0.65,0.85],[0.45,0.9],[0.3,0.82]), // 4: right loop
    ],
  }),

  // ── K-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'h-ka', character: 'か', romaji: 'ka', meaning: 'ka',
    exampleWord: 'かわ', exampleReading: 'kawa', exampleMeaning: 'Fluss',
    strokes: [
      s([0.2,0.3],[0.8,0.3]),                           // 1: horizontal
      s([0.4,0.15],[0.4,0.88]),                         // 2: left vertical
      s([0.45,0.5],[0.7,0.6],[0.78,0.75],[0.65,0.88],[0.45,0.9]), // 3: right arm
    ],
  }),
  base({
    id: 'h-ki', character: 'き', romaji: 'ki', meaning: 'ki',
    exampleWord: 'き', exampleReading: 'ki', exampleMeaning: 'Baum',
    strokes: [
      s([0.2,0.3],[0.8,0.3]),                           // 1: top horizontal
      s([0.2,0.55],[0.8,0.55]),                         // 2: middle horizontal
      s([0.5,0.15],[0.5,0.65],[0.35,0.82],[0.25,0.88]),// 3: vertical + left
      s([0.55,0.65],[0.72,0.75],[0.78,0.88]),           // 4: right leg
    ],
  }),
  base({
    id: 'h-ku', character: 'く', romaji: 'ku', meaning: 'ku',
    exampleWord: 'くに', exampleReading: 'kuni', exampleMeaning: 'Land',
    strokes: [
      s([0.7,0.2],[0.35,0.5],[0.7,0.82]),               // 1: single angled stroke
    ],
  }),
  base({
    id: 'h-ke', character: 'け', romaji: 'ke', meaning: 'ke',
    exampleWord: 'けが', exampleReading: 'kega', exampleMeaning: 'Verletzung',
    strokes: [
      s([0.3,0.15],[0.3,0.88]),                         // 1: left vertical
      s([0.25,0.38],[0.75,0.38]),                       // 2: horizontal
      s([0.72,0.38],[0.78,0.62],[0.65,0.78],[0.45,0.85]), // 3: right curve
    ],
  }),
  base({
    id: 'h-ko', character: 'こ', romaji: 'ko', meaning: 'ko',
    exampleWord: 'こども', exampleReading: 'kodomo', exampleMeaning: 'Kind',
    strokes: [
      s([0.2,0.3],[0.8,0.3]),                           // 1: top horizontal
      s([0.2,0.72],[0.8,0.72]),                         // 2: bottom horizontal
    ],
  }),

  // ── S-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'h-sa', character: 'さ', romaji: 'sa', meaning: 'sa',
    exampleWord: 'さくら', exampleReading: 'sakura', exampleMeaning: 'Kirschblüte',
    strokes: [
      s([0.2,0.3],[0.8,0.3]),                           // 1: top horizontal
      s([0.45,0.12],[0.45,0.42],[0.35,0.6],[0.25,0.75]), // 2: left drop
      s([0.5,0.42],[0.72,0.55],[0.78,0.7],[0.62,0.85],[0.4,0.9]), // 3: right curve
    ],
  }),
  base({
    id: 'h-si', character: 'し', romaji: 'shi', meaning: 'shi',
    exampleWord: 'しろ', exampleReading: 'shiro', exampleMeaning: 'weiß / Burg',
    strokes: [
      s([0.45,0.15],[0.45,0.7],[0.5,0.82],[0.62,0.88],[0.75,0.8]), // 1: vertical + bottom curl right
    ],
  }),
  base({
    id: 'h-su', character: 'す', romaji: 'su', meaning: 'su',
    exampleWord: 'すし', exampleReading: 'sushi', exampleMeaning: 'Sushi',
    strokes: [
      s([0.25,0.28],[0.75,0.28]),                       // 1: horizontal
      s([0.5,0.15],[0.5,0.52],[0.38,0.68],[0.28,0.8]), // 2: vertical + left
      s([0.52,0.52],[0.7,0.62],[0.75,0.75],[0.62,0.88],[0.45,0.9],[0.35,0.82]), // 3: right loop
    ],
  }),
  base({
    id: 'h-se', character: 'せ', romaji: 'se', meaning: 'se',
    exampleWord: 'せんせい', exampleReading: 'sensei', exampleMeaning: 'Lehrer',
    strokes: [
      s([0.3,0.2],[0.3,0.75],[0.4,0.85],[0.55,0.88]),  // 1: left vertical
      s([0.25,0.42],[0.75,0.42]),                       // 2: horizontal
      s([0.7,0.42],[0.78,0.6],[0.72,0.78],[0.55,0.88],[0.38,0.9]), // 3: right curve
    ],
  }),
  base({
    id: 'h-so', character: 'そ', romaji: 'so', meaning: 'so',
    exampleWord: 'そら', exampleReading: 'sora', exampleMeaning: 'Himmel',
    strokes: [
      s([0.2,0.28],[0.8,0.28]),                         // 1: top horizontal
      s([0.5,0.12],[0.5,0.42],[0.65,0.6],[0.7,0.75],[0.55,0.88],[0.35,0.9],[0.22,0.82]), // 2: body
    ],
  }),

  // ── T-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'h-ta', character: 'た', romaji: 'ta', meaning: 'ta',
    exampleWord: 'たべる', exampleReading: 'taberu', exampleMeaning: 'essen',
    strokes: [
      s([0.2,0.3],[0.8,0.3]),                           // 1: horizontal
      s([0.45,0.15],[0.45,0.5],[0.35,0.68],[0.25,0.8]),// 2: left vertical drop
      s([0.5,0.5],[0.7,0.6],[0.78,0.75],[0.62,0.88],[0.42,0.9]), // 3: right loop
    ],
  }),
  base({
    id: 'h-ti', character: 'ち', romaji: 'chi', meaning: 'chi',
    exampleWord: 'ちず', exampleReading: 'chizu', exampleMeaning: 'Landkarte',
    strokes: [
      s([0.25,0.3],[0.75,0.3]),                         // 1: top horizontal
      s([0.5,0.12],[0.5,0.42],[0.65,0.58],[0.72,0.72],[0.58,0.85],[0.38,0.9],[0.25,0.82]), // 2: body loop
    ],
  }),
  base({
    id: 'h-tu', character: 'つ', romaji: 'tsu', meaning: 'tsu',
    exampleWord: 'つき', exampleReading: 'tsuki', exampleMeaning: 'Mond',
    strokes: [
      s([0.75,0.25],[0.5,0.35],[0.28,0.55],[0.28,0.72],[0.42,0.85],[0.62,0.88],[0.78,0.78]), // 1: single arc
    ],
  }),
  base({
    id: 'h-te', character: 'て', romaji: 'te', meaning: 'te',
    exampleWord: 'てがみ', exampleReading: 'tegami', exampleMeaning: 'Brief',
    strokes: [
      s([0.2,0.32],[0.8,0.32]),                         // 1: horizontal
      s([0.5,0.12],[0.5,0.45],[0.62,0.62],[0.7,0.78],[0.55,0.9],[0.35,0.88]), // 2: vertical + right curl
    ],
  }),
  base({
    id: 'h-to', character: 'と', romaji: 'to', meaning: 'to',
    exampleWord: 'とり', exampleReading: 'tori', exampleMeaning: 'Vogel',
    strokes: [
      s([0.45,0.15],[0.45,0.72]),                       // 1: vertical
      s([0.48,0.52],[0.68,0.6],[0.75,0.75],[0.6,0.88],[0.42,0.88]), // 2: right bump
    ],
  }),

  // ── N-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'h-na', character: 'な', romaji: 'na', meaning: 'na',
    exampleWord: 'なまえ', exampleReading: 'namae', exampleMeaning: 'Name',
    strokes: [
      s([0.22,0.32],[0.78,0.32]),                       // 1: horizontal
      s([0.42,0.15],[0.42,0.55],[0.3,0.72],[0.22,0.82]),// 2: left vertical drop
      s([0.48,0.55],[0.68,0.65],[0.75,0.78],[0.6,0.9],[0.42,0.92]), // 3: right loop
    ],
  }),
  base({
    id: 'h-ni', character: 'に', romaji: 'ni', meaning: 'ni',
    exampleWord: 'にほん', exampleReading: 'nihon', exampleMeaning: 'Japan',
    strokes: [
      s([0.3,0.2],[0.3,0.82]),                          // 1: left vertical
      s([0.25,0.48],[0.75,0.48]),                       // 2: horizontal
      s([0.68,0.38],[0.72,0.6],[0.65,0.78],[0.5,0.88],[0.35,0.9]), // 3: right curve
    ],
  }),
  base({
    id: 'h-nu', character: 'ぬ', romaji: 'nu', meaning: 'nu',
    exampleWord: 'ぬの', exampleReading: 'nuno', exampleMeaning: 'Stoff',
    strokes: [
      s([0.3,0.2],[0.3,0.62],[0.4,0.75],[0.55,0.8]),   // 1: left vertical + base
      s([0.55,0.2],[0.55,0.55],[0.68,0.68],[0.72,0.82],[0.58,0.9],[0.38,0.92],[0.25,0.82]), // 2: right loop
    ],
  }),
  base({
    id: 'h-ne', character: 'ね', romaji: 'ne', meaning: 'ne',
    exampleWord: 'ねこ', exampleReading: 'neko', exampleMeaning: 'Katze',
    strokes: [
      s([0.3,0.2],[0.3,0.62],[0.42,0.75],[0.58,0.78]), // 1: left stroke + base
      s([0.55,0.2],[0.55,0.55],[0.68,0.68],[0.72,0.82],[0.55,0.9],[0.38,0.92],[0.25,0.82],[0.22,0.7],[0.35,0.58]), // 2: right loop
    ],
  }),
  base({
    id: 'h-no', character: 'の', romaji: 'no', meaning: 'no (Partikel)',
    exampleWord: 'わたしのほん', exampleReading: 'watashi no hon', exampleMeaning: 'mein Buch',
    strokes: [
      s([0.6,0.18],[0.38,0.32],[0.25,0.5],[0.28,0.68],[0.42,0.82],[0.6,0.85],[0.75,0.72],[0.72,0.52],[0.55,0.35],[0.62,0.18]), // 1: full loop
    ],
  }),

  // ── H-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'h-ha', character: 'は', romaji: 'ha', meaning: 'ha / wa (Partikel)',
    exampleWord: 'はな', exampleReading: 'hana', exampleMeaning: 'Blume',
    strokes: [
      s([0.3,0.15],[0.3,0.88]),                         // 1: left vertical
      s([0.28,0.38],[0.75,0.38]),                       // 2: horizontal
      s([0.52,0.38],[0.52,0.65],[0.42,0.8],[0.28,0.88]),// 3: middle drop
      s([0.62,0.5],[0.78,0.62],[0.8,0.78],[0.65,0.88],[0.48,0.9]), // 4: right loop
    ],
  }),
  base({
    id: 'h-hi', character: 'ひ', romaji: 'hi', meaning: 'hi',
    exampleWord: 'ひと', exampleReading: 'hito', exampleMeaning: 'Person / Mensch',
    strokes: [
      s([0.55,0.18],[0.32,0.38],[0.25,0.58],[0.32,0.75],[0.5,0.85],[0.68,0.82],[0.78,0.65],[0.72,0.45],[0.58,0.32],[0.62,0.18]), // 1: left loop
      s([0.72,0.52],[0.85,0.65],[0.88,0.8]),            // 2: right flick
    ],
  }),
  base({
    id: 'h-hu', character: 'ふ', romaji: 'fu', meaning: 'fu',
    exampleWord: 'ふゆ', exampleReading: 'fuyu', exampleMeaning: 'Winter',
    strokes: [
      s([0.25,0.28],[0.75,0.28]),                       // 1: horizontal
      s([0.5,0.12],[0.5,0.38],[0.35,0.55],[0.25,0.7]), // 2: top vertical left
      s([0.5,0.38],[0.68,0.52],[0.75,0.68]),            // 3: top vertical right
      s([0.3,0.62],[0.48,0.75],[0.55,0.88],[0.42,0.95],[0.28,0.9]), // 4: bottom left
      s([0.55,0.62],[0.72,0.75],[0.78,0.88],[0.65,0.96],[0.5,0.95]), // 5: bottom right
    ],
  }),
  base({
    id: 'h-he', character: 'へ', romaji: 'he', meaning: 'he / e (Partikel)',
    exampleWord: 'うえへ', exampleReading: 'ue he', exampleMeaning: 'nach oben',
    strokes: [
      s([0.15,0.62],[0.5,0.25],[0.85,0.62]),            // 1: single peak stroke
    ],
  }),
  base({
    id: 'h-ho', character: 'ほ', romaji: 'ho', meaning: 'ho',
    exampleWord: 'ほん', exampleReading: 'hon', exampleMeaning: 'Buch',
    strokes: [
      s([0.3,0.15],[0.3,0.88]),                         // 1: left vertical
      s([0.25,0.4],[0.75,0.4]),                         // 2: horizontal
      s([0.5,0.4],[0.5,0.68],[0.38,0.8],[0.28,0.88]),  // 3: center drop
      s([0.55,0.5],[0.72,0.62],[0.78,0.75],[0.62,0.88],[0.45,0.9]), // 4: right loop
    ],
  }),

  // ── M-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'h-ma', character: 'ま', romaji: 'ma', meaning: 'ma',
    exampleWord: 'まち', exampleReading: 'machi', exampleMeaning: 'Stadt',
    strokes: [
      s([0.22,0.32],[0.78,0.32]),                       // 1: top horizontal
      s([0.22,0.55],[0.78,0.55]),                       // 2: middle horizontal
      s([0.5,0.12],[0.5,0.62],[0.38,0.78],[0.5,0.88],[0.65,0.82],[0.7,0.65]), // 3: vertical + loop
    ],
  }),
  base({
    id: 'h-mi', character: 'み', romaji: 'mi', meaning: 'mi',
    exampleWord: 'みず', exampleReading: 'mizu', exampleMeaning: 'Wasser',
    strokes: [
      s([0.28,0.28],[0.72,0.42]),                       // 1: first diagonal
      s([0.3,0.52],[0.65,0.52],[0.75,0.65],[0.62,0.82],[0.4,0.88],[0.25,0.78]), // 2: second stroke + loop
    ],
  }),
  base({
    id: 'h-mu', character: 'む', romaji: 'mu', meaning: 'mu',
    exampleWord: 'むし', exampleReading: 'mushi', exampleMeaning: 'Insekt',
    strokes: [
      s([0.22,0.38],[0.75,0.38]),                       // 1: horizontal
      s([0.45,0.18],[0.45,0.52],[0.32,0.68],[0.22,0.8]),// 2: vertical left
      s([0.5,0.52],[0.68,0.62],[0.75,0.75],[0.6,0.88],[0.4,0.9],[0.25,0.82]), // 3: right loop
      s([0.72,0.62],[0.82,0.58]),                       // 4: right flick
    ],
  }),
  base({
    id: 'h-me', character: 'め', romaji: 'me', meaning: 'me',
    exampleWord: 'め', exampleReading: 'me', exampleMeaning: 'Auge',
    strokes: [
      s([0.3,0.22],[0.3,0.72],[0.42,0.82],[0.58,0.82]),// 1: left vertical + base
      s([0.55,0.22],[0.55,0.58],[0.68,0.7],[0.72,0.82],[0.55,0.9],[0.35,0.92],[0.22,0.8],[0.2,0.65],[0.35,0.52]), // 2: right loop
    ],
  }),
  base({
    id: 'h-mo', character: 'も', romaji: 'mo', meaning: 'mo (auch)',
    exampleWord: 'わたしもいきます', exampleReading: 'watashi mo ikimasu', exampleMeaning: 'Ich gehe auch',
    strokes: [
      s([0.22,0.32],[0.78,0.32]),                       // 1: top horizontal
      s([0.22,0.52],[0.78,0.52]),                       // 2: middle horizontal
      s([0.5,0.12],[0.5,0.62],[0.38,0.78],[0.28,0.88]),// 3: vertical + drop
    ],
  }),

  // ── Y-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'h-ya', character: 'や', romaji: 'ya', meaning: 'ya',
    exampleWord: 'やま', exampleReading: 'yama', exampleMeaning: 'Berg',
    strokes: [
      s([0.55,0.2],[0.28,0.5],[0.28,0.72],[0.42,0.85],[0.62,0.88],[0.78,0.78],[0.78,0.58],[0.62,0.42],[0.55,0.2]), // 1: left loop
      s([0.65,0.35],[0.82,0.25]),                       // 2: right flick
    ],
  }),
  base({
    id: 'h-yu', character: 'ゆ', romaji: 'yu', meaning: 'yu',
    exampleWord: 'ゆき', exampleReading: 'yuki', exampleMeaning: 'Schnee',
    strokes: [
      s([0.3,0.22],[0.3,0.75],[0.42,0.85],[0.58,0.85]),// 1: left stroke + base
      s([0.55,0.22],[0.55,0.58],[0.68,0.7],[0.72,0.82],[0.55,0.9],[0.35,0.92],[0.22,0.82],[0.2,0.65]), // 2: right loop
    ],
  }),
  base({
    id: 'h-yo', character: 'よ', romaji: 'yo', meaning: 'yo',
    exampleWord: 'よる', exampleReading: 'yoru', exampleMeaning: 'Nacht',
    strokes: [
      s([0.45,0.15],[0.45,0.85]),                       // 1: vertical
      s([0.2,0.38],[0.75,0.38]),                        // 2: top horizontal
      s([0.2,0.62],[0.75,0.62]),                        // 3: bottom horizontal
    ],
  }),

  // ── R-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'h-ra', character: 'ら', romaji: 'ra', meaning: 'ra',
    exampleWord: 'らいねん', exampleReading: 'rainen', exampleMeaning: 'nächstes Jahr',
    strokes: [
      s([0.22,0.28],[0.78,0.28]),                       // 1: horizontal
      s([0.5,0.15],[0.5,0.52],[0.65,0.68],[0.7,0.82],[0.55,0.9],[0.35,0.9],[0.22,0.78]), // 2: vertical + loop
    ],
  }),
  base({
    id: 'h-ri', character: 'り', romaji: 'ri', meaning: 'ri',
    exampleWord: 'りんご', exampleReading: 'ringo', exampleMeaning: 'Apfel',
    strokes: [
      s([0.35,0.2],[0.32,0.62],[0.4,0.78],[0.52,0.82]),// 1: left stroke
      s([0.62,0.2],[0.65,0.52],[0.72,0.68],[0.62,0.85],[0.45,0.9]), // 2: right curve
    ],
  }),
  base({
    id: 'h-ru', character: 'る', romaji: 'ru', meaning: 'ru',
    exampleWord: 'みる', exampleReading: 'miru', exampleMeaning: 'sehen',
    strokes: [
      s([0.5,0.18],[0.5,0.52],[0.65,0.65],[0.7,0.8],[0.55,0.9],[0.35,0.9],[0.22,0.78],[0.25,0.62],[0.42,0.52]), // 1: body + small loop
    ],
  }),
  base({
    id: 'h-re', character: 'れ', romaji: 're', meaning: 're',
    exampleWord: 'れいぞうこ', exampleReading: 'reizouko', exampleMeaning: 'Kühlschrank',
    strokes: [
      s([0.32,0.18],[0.32,0.62],[0.42,0.75],[0.58,0.78]), // 1: left vertical + base
      s([0.58,0.18],[0.58,0.52],[0.72,0.65],[0.75,0.8],[0.58,0.9],[0.38,0.92],[0.25,0.82]), // 2: right + loop
    ],
  }),
  base({
    id: 'h-ro', character: 'ろ', romaji: 'ro', meaning: 'ro',
    exampleWord: 'ろく', exampleReading: 'roku', exampleMeaning: 'sechs',
    strokes: [
      s([0.22,0.32],[0.78,0.32]),                       // 1: horizontal
      s([0.5,0.18],[0.5,0.5],[0.65,0.65],[0.72,0.8],[0.55,0.9],[0.35,0.9],[0.22,0.78]), // 2: vertical + loop
    ],
  }),

  // ── W-row ───────────────────────────────────────────────────────────────────
  base({
    id: 'h-wa', character: 'わ', romaji: 'wa', meaning: 'wa',
    exampleWord: 'わたし', exampleReading: 'watashi', exampleMeaning: 'ich',
    strokes: [
      s([0.32,0.18],[0.32,0.65],[0.42,0.78],[0.58,0.8]),// 1: left stroke + base
      s([0.58,0.18],[0.58,0.52],[0.72,0.65],[0.75,0.8],[0.58,0.9],[0.38,0.92],[0.25,0.82]), // 2: right loop
    ],
  }),
  base({
    id: 'h-wi', character: 'ゐ', romaji: 'wi', meaning: 'wi (veraltet)',
    exampleWord: 'ゐ', exampleReading: 'wi', exampleMeaning: 'veraltet / historisch',
    strokes: [
      s([0.22,0.32],[0.78,0.32]),
      s([0.5,0.15],[0.5,0.88]),
    ],
  }),
  base({
    id: 'h-we', character: 'ゑ', romaji: 'we', meaning: 'we (veraltet)',
    exampleWord: 'ゑ', exampleReading: 'we', exampleMeaning: 'veraltet / historisch',
    strokes: [
      s([0.2,0.3],[0.8,0.3]),
      s([0.5,0.15],[0.5,0.88]),
    ],
  }),
  base({
    id: 'h-wo', character: 'を', romaji: 'wo / o', meaning: 'wo (Partikel)',
    exampleWord: 'ほんをよむ', exampleReading: 'hon wo yomu', exampleMeaning: 'ein Buch lesen',
    strokes: [
      s([0.22,0.25],[0.78,0.25]),                       // 1: top horizontal
      s([0.22,0.42],[0.78,0.42]),                       // 2: middle horizontal
      s([0.5,0.12],[0.5,0.5],[0.38,0.68],[0.28,0.8],[0.38,0.9],[0.55,0.9],[0.7,0.82],[0.72,0.68],[0.55,0.55]), // 3: vertical + loop
    ],
  }),

  // ── N (nasal) ───────────────────────────────────────────────────────────────
  base({
    id: 'h-nn', character: 'ん', romaji: 'n', meaning: 'n (nasal)',
    exampleWord: 'にほん', exampleReading: 'nihon', exampleMeaning: 'Japan',
    strokes: [
      s([0.55,0.2],[0.32,0.42],[0.28,0.62],[0.38,0.78],[0.55,0.85],[0.72,0.78],[0.75,0.58],[0.55,0.42],[0.62,0.2]), // 1: loop
    ],
  }),
]
