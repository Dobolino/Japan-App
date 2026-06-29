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
]

export function getStory(id: string): Story | undefined {
  return stories.find((s) => s.id === id)
}
