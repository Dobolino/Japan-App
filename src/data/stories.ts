import type { ChoiceQuestion } from './activities'
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
  questions: ChoiceQuestion[]
}
const line = (jp: string, reading: string, de: string, speaker?: string): StoryLine => ({
  jp,
  reading,
  de,
  speaker,
})
const question = (
  id: string,
  prompt: string,
  choices: string[],
  answer: number,
  explanation: string
): ChoiceQuestion => ({ id, prompt, choices, answer, explanation })
export const stories: Story[] = [
  {
    id: 'story-cafe',
    title: 'Im Café',
    description: 'Ein Getränk bestellen und den Preis verstehen',
    level: 'N5',
    grammarTags: ['を', 'です', 'か'],
    lines: [
      line(
        'すみません。コーヒーをください。',
        'すみません。こーひーをください。',
        'Entschuldigung. Einen Kaffee, bitte.',
        'Gast'
      ),
      line(
        'はい。温かいコーヒーですか。',
        'はい。あたたかいこーひーですか。',
        'Gerne. Einen warmen Kaffee?',
        'Bedienung'
      ),
      line('はい、お願いします。', 'はい、おねがいします。', 'Ja, bitte.', 'Gast'),
      line('三百円です。', 'さんびゃくえんです。', 'Das macht 300 Yen.', 'Bedienung'),
      line('ありがとうございます。', 'ありがとうございます。', 'Vielen Dank.', 'Gast'),
    ],
    questions: [
      question(
        'cafe-q1',
        'Was bestellt der Gast?',
        ['Tee', 'Kaffee', 'Wasser'],
        1,
        'コーヒー bedeutet Kaffee.'
      ),
      question(
        'cafe-q2',
        'Wie viel kostet das Getränk?',
        ['300 Yen', '200 Yen', '500 Yen'],
        0,
        '三百円: 三 = drei, 百 = hundert, 円 = Yen.'
      ),
    ],
  },
  {
    id: 'story-rain',
    title: 'Regentag',
    description: 'Mit dem Schirm zum Bahnhof',
    level: 'N5',
    grammarTags: ['は', 'を', 'で'],
    lines: [
      line('今日は雨です。', 'きょうはあめです。', 'Heute regnet es.'),
      line('私は傘を持っています。', 'わたしはかさをもっています。', 'Ich habe einen Regenschirm dabei.'),
      line('駅まで歩きます。', 'えきまであるきます。', 'Ich gehe zu Fuß bis zum Bahnhof.'),
      line('駅で友達に会います。', 'えきでともだちにあいます。', 'Am Bahnhof treffe ich einen Freund.'),
    ],
    questions: [
      question(
        'rain-q1',
        'Wie ist das Wetter?',
        ['Sonnig', 'Es schneit', 'Es regnet'],
        2,
        '雨 bedeutet Regen.'
      ),
      question(
        'rain-q2',
        'Wo findet das Treffen statt?',
        ['Am Bahnhof', 'In der Schule', 'Im Café'],
        0,
        '駅で markiert den Ort des Treffens: am Bahnhof.'
      ),
    ],
  },
  {
    id: 'story-lunch',
    title: 'Mittagessen',
    description: 'Gemeinsam essen und trinken',
    level: 'N5',
    grammarTags: ['と', 'を', 'も'],
    lines: [
      line(
        '友達と昼ごはんを食べます。',
        'ともだちとひるごはんをたべます。',
        'Ich esse mit einem Freund zu Mittag.'
      ),
      line('私はごはんと魚を食べます。', 'わたしはごはんとさかなをたべます。', 'Ich esse Reis und Fisch.'),
      line('友達も魚を食べます。', 'ともだちもさかなをたべます。', 'Mein Freund isst auch Fisch.'),
      line('二人でお茶を飲みます。', 'ふたりでおちゃをのみます。', 'Wir trinken zu zweit Tee.'),
    ],
    questions: [
      question(
        'lunch-q1',
        'Was essen beide?',
        ['Brot', 'Fisch', 'Äpfel'],
        1,
        '魚 bedeutet Fisch. も zeigt an: auch.'
      ),
      question('lunch-q2', 'Was trinken die beiden?', ['Kaffee', 'Wasser', 'Tee'], 2, 'お茶 bedeutet Tee.'),
    ],
  },
  {
    id: 'story-school',
    title: 'Schule',
    description: 'Nach dem Unterricht in die Bibliothek',
    level: 'N5',
    grammarTags: ['に', 'で', 'を'],
    lines: [
      line('朝、学校に行きます。', 'あさ、がっこうにいきます。', 'Morgens gehe ich zur Schule.'),
      line(
        '教室で日本語を勉強します。',
        'きょうしつでにほんごをべんきょうします。',
        'Im Klassenzimmer lerne ich Japanisch.'
      ),
      line(
        '午後、友達と図書館に行きます。',
        'ごご、ともだちととしょかんにいきます。',
        'Nachmittags gehe ich mit einem Freund in die Bibliothek.'
      ),
      line(
        '図書館で日本語の本を読みます。',
        'としょかんでにほんごのほんをよみます。',
        'In der Bibliothek lese ich ein japanisches Buch.'
      ),
    ],
    questions: [
      question(
        'school-q1',
        'Was wird im Klassenzimmer gelernt?',
        ['Englisch', 'Japanisch', 'Mathematik'],
        1,
        '日本語 bedeutet Japanisch.'
      ),
      question(
        'school-q2',
        'Wo wird das Buch gelesen?',
        ['In der Bibliothek', 'Am Bahnhof', 'Zu Hause'],
        0,
        '図書館で: Die Bibliothek ist der Ort der Handlung.'
      ),
    ],
  },
  {
    id: 'story-shopping',
    title: 'Einkaufen',
    description: 'Äpfel für die Familie',
    level: 'N5',
    grammarTags: ['で', 'を', 'と'],
    lines: [
      line('スーパーでりんごを買います。', 'すーぱーでりんごをかいます。', 'Ich kaufe im Supermarkt Äpfel.'),
      line('りんごを三つ買います。', 'りんごをみっつかいます。', 'Ich kaufe drei Äpfel.'),
      line('全部で六百円です。', 'ぜんぶでろっぴゃくえんです。', 'Zusammen kosten sie 600 Yen.'),
      line('家で家族と食べます。', 'いえでかぞくとたべます。', 'Zu Hause esse ich sie mit meiner Familie.'),
    ],
    questions: [
      question(
        'shopping-q1',
        'Wie viele Äpfel werden gekauft?',
        ['Zwei', 'Vier', 'Drei'],
        2,
        '三つ liest man みっつ: drei Stück.'
      ),
      question(
        'shopping-q2',
        'Mit wem werden die Äpfel gegessen?',
        ['Mit der Familie', 'Mit dem Lehrer', 'Allein'],
        0,
        '家族と bedeutet mit der Familie.'
      ),
    ],
  },
  {
    id: 'story-morning',
    title: 'Morgenroutine',
    description: 'Vom Aufstehen bis zum Schulweg',
    level: 'N5',
    grammarTags: ['に', 'を', 'で'],
    lines: [
      line('毎朝七時に起きます。', 'まいあさしちじにおきます。', 'Ich stehe jeden Morgen um sieben Uhr auf.'),
      line('朝ごはんを食べます。', 'あさごはんをたべます。', 'Ich frühstücke.'),
      line('八時に家を出ます。', 'はちじにいえをでます。', 'Um acht Uhr verlasse ich das Haus.'),
      line('バスで学校に行きます。', 'ばすでがっこうにいきます。', 'Ich fahre mit dem Bus zur Schule.'),
    ],
    questions: [
      question(
        'morning-q1',
        'Wann steht die Person auf?',
        ['Um sieben', 'Um acht', 'Um neun'],
        0,
        '七時に bedeutet um sieben Uhr.'
      ),
      question(
        'morning-q2',
        'Wie geht es zur Schule?',
        ['Zu Fuß', 'Mit dem Zug', 'Mit dem Bus'],
        2,
        'バスで benennt das Verkehrsmittel: mit dem Bus.'
      ),
    ],
  },
  {
    id: 'story-weekend',
    title: 'Am Wochenende',
    description: 'Ein Sonntag mit Freunden',
    level: 'N5',
    grammarTags: ['と', 'に', 'で'],
    lines: [
      line('今日は日曜日です。', 'きょうはにちようびです。', 'Heute ist Sonntag.'),
      line('友達と公園に行きます。', 'ともだちとこうえんにいきます。', 'Ich gehe mit Freunden in den Park.'),
      line('公園でサッカーをします。', 'こうえんでさっかーをします。', 'Wir spielen im Park Fußball.'),
      line(
        'そのあと、レストランで昼ごはんを食べます。',
        'そのあと、れすとらんでひるごはんをたべます。',
        'Danach essen wir im Restaurant zu Mittag.'
      ),
      line('楽しい一日です。', 'たのしいいちにちです。', 'Es ist ein schöner Tag.'),
    ],
    questions: [
      question(
        'weekend-q1',
        'Was machen die Freunde im Park?',
        ['Sie lesen', 'Sie spielen Fußball', 'Sie lernen'],
        1,
        'サッカーをします bedeutet Fußball spielen.'
      ),
      question(
        'weekend-q2',
        'Was passiert danach?',
        ['Es geht zum Bahnhof', 'Alle schlafen', 'Sie essen im Restaurant'],
        2,
        'そのあと verbindet die nächste Handlung: danach.'
      ),
    ],
  },
]
export function getStory(id: string) {
  return stories.find((story) => story.id === id)
}
