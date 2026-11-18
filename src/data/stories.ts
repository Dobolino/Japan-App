import { studySentence, type StudyWord } from './studySentence'
import type { ChoiceQuestion } from './activities'
export interface StoryLine {
  speaker?: string
  words: StudyWord[]
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
const line = (annotated: string, de: string, speaker?: string): StoryLine => ({
  ...studySentence(annotated),
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
      line('すみません 。 コーヒー を ください 。', 'Entschuldigung. Einen Kaffee, bitte.', 'Gast'),
      line('はい 。 温[あたた]かい コーヒー です か 。', 'Gerne. Einen warmen Kaffee?', 'Bedienung'),
      line('はい 、 お願[ねが]いします 。', 'Ja, bitte.', 'Gast'),
      line('三百円[さんびゃくえん] です 。', 'Das macht 300 Yen.', 'Bedienung'),
      line('ありがとうございます 。', 'Vielen Dank.', 'Gast'),
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
      line('今日[きょう] は 雨[あめ] です 。', 'Heute regnet es.'),
      line('私[わたし] は 傘[かさ] を 持[も]っています 。', 'Ich habe einen Regenschirm dabei.'),
      line('駅[えき] まで 歩[ある]きます 。', 'Ich gehe zu Fuß bis zum Bahnhof.'),
      line('駅[えき] で 友達[ともだち] に 会[あ]います 。', 'Am Bahnhof treffe ich einen Freund.'),
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
      line('友達[ともだち] と 昼[ひる]ごはん を 食[た]べます 。', 'Ich esse mit einem Freund zu Mittag.'),
      line('私[わたし] は ごはん と 魚[さかな] を 食[た]べます 。', 'Ich esse Reis und Fisch.'),
      line('友達[ともだち] も 魚[さかな] を 食[た]べます 。', 'Mein Freund isst auch Fisch.'),
      line('二人[ふたり] で お茶[ちゃ] を 飲[の]みます 。', 'Wir trinken zu zweit Tee.'),
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
      line('朝[あさ] 、 学校[がっこう] に 行[い]きます 。', 'Morgens gehe ich zur Schule.'),
      line(
        '教室[きょうしつ] で 日本語[にほんご] を 勉強[べんきょう] します 。',
        'Im Klassenzimmer lerne ich Japanisch.'
      ),
      line(
        '午後[ごご] 、 友達[ともだち] と 図書館[としょかん] に 行[い]きます 。',
        'Nachmittags gehe ich mit einem Freund in die Bibliothek.'
      ),
      line(
        '図書館[としょかん] で 日本語[にほんご] の 本[ほん] を 読[よ]みます 。',
        'In der Bibliothek lese ich ein Buch auf Japanisch.'
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
      line('スーパー で りんご を 買[か]います 。', 'Ich kaufe im Supermarkt Äpfel.'),
      line('りんご を 三[みっ]つ 買[か]います 。', 'Ich kaufe drei Äpfel.'),
      line('全部[ぜんぶ] で 六百円[ろっぴゃくえん] です 。', 'Zusammen kosten sie 600 Yen.'),
      line('家[いえ] で 家族[かぞく] と 食[た]べます 。', 'Zu Hause esse ich sie mit meiner Familie.'),
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
      line('毎朝[まいあさ] 七時[しちじ] に 起[お]きます 。', 'Ich stehe jeden Morgen um sieben Uhr auf.'),
      line('朝[あさ]ごはん を 食[た]べます 。', 'Ich frühstücke.'),
      line('八時[はちじ] に 家[いえ] を 出[で]ます 。', 'Um acht Uhr verlasse ich das Haus.'),
      line('バス で 学校[がっこう] に 行[い]きます 。', 'Ich fahre mit dem Bus zur Schule.'),
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
      line('今日[きょう] は 日曜日[にちようび] です 。', 'Heute ist Sonntag.'),
      line('友達[ともだち] と 公園[こうえん] に 行[い]きます 。', 'Ich gehe mit Freunden in den Park.'),
      line('公園[こうえん] で サッカー を します 。', 'Wir spielen im Park Fußball.'),
      line(
        'そのあと 、 レストラン で 昼[ひる]ごはん を 食[た]べます 。',
        'Danach essen wir im Restaurant zu Mittag.'
      ),
      line('楽[たの]しい 一日[いちにち] です 。', 'Es ist ein schöner Tag.'),
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
