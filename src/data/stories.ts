export interface StoryLine {
  speaker?: string
  jp: string
  reading: string
  de: string
}

export interface Story {
  id: string
  title: string
  description: string
  level: 'N5'
  grammarTags: string[]
  lines: StoryLine[]
}

/** Mini-Geschichten aus N5-Grammatik-Sätzen (Comprehensible Input). */
export const stories: Story[] = [
  {
    id: 'story-cafe',
    title: 'Im Café',
    description: 'Bestellen, Partikel は・を・に',
    level: 'N5',
    grammarTags: ['は', 'を', 'に'],
    lines: [
      {
        speaker: 'A',
        jp: '私は学生です。',
        reading: 'わたしはがくせいです。',
        de: 'Ich bin Student.',
      },
      {
        speaker: 'B',
        jp: '何を飲みますか？',
        reading: 'なにをのみますか？',
        de: 'Was trinkst du?',
      },
      {
        speaker: 'A',
        jp: '水を飲みます。',
        reading: 'みずをのみます。',
        de: 'Ich trinke Wasser.',
      },
      {
        speaker: 'B',
        jp: '図書館で勉強します。',
        reading: 'としょかんでべんきょうします。',
        de: 'Ich lerne in der Bibliothek.',
      },
      {
        speaker: 'A',
        jp: '三時に起きます。',
        reading: 'さんじにおきます。',
        de: 'Ich stehe um drei Uhr auf.',
      },
    ],
  },
  {
    id: 'story-rain',
    title: 'Regentag',
    description: 'Subjekt が, Wetter & Gefühle',
    level: 'N5',
    grammarTags: ['が', 'は', 'を'],
    lines: [
      {
        speaker: 'A',
        jp: '雨が降っています。',
        reading: 'あめがふっています。',
        de: 'Es regnet.',
      },
      {
        speaker: 'B',
        jp: '猫は魚が好きです。',
        reading: 'ねこはさかながすきです。',
        de: 'Katzen mögen Fisch.',
      },
      {
        speaker: 'A',
        jp: '私は日本語がわかります。',
        reading: 'わたしはにほんごがわかります。',
        de: 'Ich verstehe Japanisch.',
      },
      {
        speaker: 'B',
        jp: '音楽を聞きます。',
        reading: 'おんがくをききます。',
        de: 'Ich höre Musik.',
      },
    ],
  },
  {
    id: 'story-lunch',
    title: 'Mittagessen',
    description: 'SOV-Satzstruktur in Alltagsszenen',
    level: 'N5',
    grammarTags: ['SOV', 'は', 'を'],
    lines: [
      {
        speaker: 'A',
        jp: '私はりんごを食べます。',
        reading: 'わたしはりんごをたべます。',
        de: 'Ich esse einen Apfel.',
      },
      {
        speaker: 'B',
        jp: '田中さんは本を読みます。',
        reading: 'たなかさんはほんをよみます。',
        de: 'Herr Tanaka liest ein Buch.',
      },
      {
        speaker: 'A',
        jp: '箸で食べます。',
        reading: 'はしでたべます。',
        de: 'Ich esse mit Stäbchen.',
      },
      {
        speaker: 'B',
        jp: '友達と映画を見ます。',
        reading: 'ともだちとえいがをみます。',
        de: 'Ich schaue mit Freunden einen Film.',
      },
    ],
  },
  {
    id: 'story-school',
    title: 'Schule',
    description: 'Fragen, Partikel か・に・で',
    level: 'N5',
    grammarTags: ['か', 'に', 'で'],
    lines: [
      {
        speaker: 'A',
        jp: '誰が来ましたか？',
        reading: 'だれがきましたか？',
        de: 'Wer ist gekommen?',
      },
      {
        speaker: 'B',
        jp: '学校に行きます。',
        reading: 'がっこうにいきます。',
        de: 'Ich gehe zur Schule.',
      },
      {
        speaker: 'A',
        jp: '部屋に猫がいます。',
        reading: 'へやにねこがいます。',
        de: 'Im Zimmer ist eine Katze.',
      },
      {
        speaker: 'B',
        jp: 'バスで行きます。',
        reading: 'バスでいきます。',
        de: 'Ich fahre mit dem Bus.',
      },
    ],
  },
  {
    id: 'story-shopping',
    title: 'Einkaufen',
    description: 'Preise, kaufen, を-Partikel',
    level: 'N5',
    grammarTags: ['を', 'は', 'です'],
    lines: [
      { speaker: 'A', jp: 'これは本です。', reading: 'これはほんです。', de: 'Das ist ein Buch.' },
      { speaker: 'B', jp: '五百円を払います。', reading: 'ごひゃくえんをはらいます。', de: 'Ich bezahle 500 Yen.' },
      { speaker: 'A', jp: '水を飲みます。', reading: 'みずをのみます。', de: 'Ich trinke Wasser.' },
      { speaker: 'B', jp: '日本語を勉強します。', reading: 'にほんごをべんきょうします。', de: 'Ich lerne Japanisch.' },
    ],
  },
  {
    id: 'story-morning',
    title: 'Morgenroutine',
    description: 'Zeit mit に, tägliche Handlungen',
    level: 'N5',
    grammarTags: ['に', 'を', 'ます'],
    lines: [
      { speaker: 'A', jp: '六時に起きます。', reading: 'ろくじにおきます。', de: 'Ich stehe um sechs Uhr auf.' },
      { speaker: 'B', jp: '朝ごはんを食べます。', reading: 'あさごはんをたべます。', de: 'Ich esse Frühstück.' },
      { speaker: 'A', jp: '学校に行きます。', reading: 'がっこうにいきます。', de: 'Ich gehe zur Schule.' },
      { speaker: 'B', jp: '友達と話します。', reading: 'ともだちとはなします。', de: 'Ich spreche mit Freunden.' },
    ],
  },
  {
    id: 'story-weekend',
    title: 'Am Wochenende',
    description: 'Freizeit, と-Partikel, Verben',
    level: 'N5',
    grammarTags: ['と', 'で', 'を'],
    lines: [
      { speaker: 'A', jp: '猫と犬が好きです。', reading: 'ねこといぬがすきです。', de: 'Ich mag Katzen und Hunde.' },
      { speaker: 'B', jp: '公園で走ります。', reading: 'こうえんではしります。', de: 'Ich laufe im Park.' },
      { speaker: 'A', jp: '映画を見ます。', reading: 'えいがをみます。', de: 'Ich schaue einen Film.' },
      { speaker: 'B', jp: '家で休みます。', reading: 'いえでやすみます。', de: 'Ich ruhe mich zu Hause aus.' },
    ],
  },
]

export function getStory(id: string): Story | undefined {
  return stories.find((s) => s.id === id)
}
