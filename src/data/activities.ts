export interface ChoiceQuestion {
  id: string
  prompt: string
  choices: string[]
  answer: number
  explanation: string
  jp?: string
  reading?: string
}
export interface Mission {
  id: string
  title: string
  goal: string
  grammar: string[]
  questions: ChoiceQuestion[]
}
export const missions: Mission[] = [
  {
    id: 'cafe',
    title: 'Im Café bestellen',
    goal: 'Du bestellst höflich ein Getränk und fragst nach dem Preis.',
    grammar: ['g-wo', 'g-ka'],
    questions: [
      {
        id: 'cafe-1',
        prompt: 'Du möchtest Wasser bestellen. Was sagst du?',
        choices: ['水をください。', '水ですか。', '水に行きます。'],
        answer: 0,
        explanation: '水をください bedeutet „Wasser, bitte“. を markiert hier das Gewünschte.',
        jp: '水をください。',
        reading: 'みずをください。',
      },
      {
        id: 'cafe-2',
        prompt: 'Der Kellner fragt: コーヒーですか。 Du möchtest Tee.',
        choices: ['はい、コーヒーです。', 'いいえ、お茶をください。', 'お茶にいます。'],
        answer: 1,
        explanation: 'いいえ verneint höflich. Mit お茶をください bittest du anschließend um Tee.',
        jp: 'いいえ、お茶をください。',
        reading: 'いいえ、おちゃをください。',
      },
      {
        id: 'cafe-3',
        prompt: 'Wie fragst du „Wie viel kostet das?“',
        choices: ['どこですか。', '何時ですか。', 'いくらですか。'],
        answer: 2,
        explanation: 'いくら fragt nach dem Preis. どこ fragt nach einem Ort, 何時 nach der Uhrzeit.',
        jp: 'いくらですか。',
        reading: 'いくらですか。',
      },
    ],
  },
  {
    id: 'station',
    title: 'Den Weg finden',
    goal: 'Du fragst nach dem Bahnhof und verstehst eine einfache Ortsangabe.',
    grammar: ['g-ni', 'g-de'],
    questions: [
      {
        id: 'station-1',
        prompt: 'Du suchst den Bahnhof.',
        choices: ['駅はどこですか。', '駅を食べます。', '駅はだれですか。'],
        answer: 0,
        explanation: 'どこ fragt „wo“. は benennt das Thema: den Bahnhof.',
        jp: '駅はどこですか。',
        reading: 'えきはどこですか。',
      },
      {
        id: 'station-2',
        prompt: 'Welche Partikel passt? 学校＿行きます。 (Ich gehe zur Schule.)',
        choices: ['で', 'を', 'に'],
        answer: 2,
        explanation:
          'に markiert das Ziel einer Bewegung. で bezeichnet hier nicht das Ziel, sondern beispielsweise den Ort einer Handlung.',
        jp: '学校に行きます。',
        reading: 'がっこうにいきます。',
      },
      {
        id: 'station-3',
        prompt: 'Welche Partikel passt? 駅＿友達を待ちます。 (Ich warte am Bahnhof auf einen Freund.)',
        choices: ['に', 'で', 'の'],
        answer: 1,
        explanation:
          'で markiert den Ort, an dem das Warten stattfindet. に würde bei 行きます das Ziel angeben.',
        jp: '駅で友達を待ちます。',
        reading: 'えきでともだちをまちます。',
      },
    ],
  },
  {
    id: 'introduce',
    title: 'Dich vorstellen',
    goal: 'Du stellst dich höflich vor und sagst, was du lernst.',
    grammar: ['g-wa', 'g-desu-masu'],
    questions: [
      {
        id: 'intro-1',
        prompt: 'Du triffst jemanden zum ersten Mal.',
        choices: ['おやすみなさい。', 'はじめまして。', 'いただきます。'],
        answer: 1,
        explanation: 'はじめまして ist die Begrüßung beim ersten Kennenlernen.',
        jp: 'はじめまして。',
        reading: 'はじめまして。',
      },
      {
        id: 'intro-2',
        prompt: 'Welche Partikel passt? 私＿学生です。 (Ich bin Student.)',
        choices: ['は', 'を', 'で'],
        answer: 0,
        explanation:
          'は markiert das Thema des Satzes: 私. を markiert ein Objekt und passt vor 学生です nicht.',
        jp: '私は学生です。',
        reading: 'わたしはがくせいです。',
      },
      {
        id: 'intro-3',
        prompt: 'Wie sagst du „Ich lerne Japanisch“?',
        choices: ['日本語を勉強します。', '日本語が駅です。', '日本語に飲みます。'],
        answer: 0,
        explanation: '日本語を勉強します: 日本語 ist hier das direkte Objekt zu 勉強します.',
        jp: '日本語を勉強します。',
        reading: 'にほんごをべんきょうします。',
      },
    ],
  },
]
export const confusionPairs = [
  {
    chars: ['シ', 'ツ'],
    hint: 'シ (shi) und ツ (tsu): Achte auf die Ausrichtung der kurzen Striche und den Ansatz des langen Strichs.',
  },
  {
    chars: ['ソ', 'ン'],
    hint: 'ソ (so) und ン (n): Vergleiche die Richtung und den Ansatz des langen Strichs.',
  },
  {
    chars: ['ぬ', 'め'],
    hint: 'ぬ (nu) hat am Ende eine kleine Schleife; め (me) hat diese Schleife nicht.',
  },
  { chars: ['れ', 'ね'], hint: 'ね (ne) endet in einer Schleife; れ (re) endet offen.' },
  {
    chars: ['わ', 'ね'],
    hint: 'Vergleiche den rechten Abschluss: わ (wa) bleibt offen, ね (ne) bildet eine Schleife.',
  },
  { chars: ['さ', 'き'], hint: 'き (ki) hat zwei kurze Querstriche, さ (sa) nur einen.' },
  { chars: ['あ', 'お'], hint: 'お (o) besitzt rechts oben einen getrennten kurzen Strich.' },
  { chars: ['ク', 'ケ'], hint: 'ケ (ke) besitzt einen zusätzlichen Querstrich.' },
]
