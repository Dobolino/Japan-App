import { studySentence, type StudyWord } from './studySentence'
export interface GrammarExample {
  jp: string
  reading: string
  de: string
  words?: StudyWord[]
}

export interface GrammarPoint {
  id: string
  title: string
  subtitle: string
  level: 'N5'
  category: 'Partikel' | 'Verben' | 'Adjektive' | 'Satzstruktur' | 'Ausdrücke'
  explanation: string
  structure: string
  examples: GrammarExample[]
}

const example = (annotated: string, de: string): GrammarExample => ({ ...studySentence(annotated), de })

export const grammarData: GrammarPoint[] = [
  // ── Satzstruktur ────────────────────────────────────────────────────────────
  {
    id: 'g-sov',
    title: 'SOV-Satzstruktur',
    subtitle: 'Subjekt → Objekt → Verb',
    level: 'N5',
    category: 'Satzstruktur',
    explanation:
      'Im japanischen Hauptsatz steht das Verb normalerweise am Satzende. Eine häufige Grundreihenfolge ist Subjekt–Objekt–Verb. Andere Satzteile können ihre Reihenfolge ändern; die Partikeln zeigen ihre Funktion.',
    structure: '[Subjekt は/が] + [Objekt を] + [Verb]',
    examples: [
      example('私[わたし] は りんご を 食[た]べます 。', 'Ich esse einen Apfel.'),
      example('田中[たなか]さん は 本[ほん] を 読[よ]みます 。', 'Herr Tanaka liest ein Buch.'),
    ],
  },

  // ── Partikel ────────────────────────────────────────────────────────────────
  {
    id: 'g-wa',
    title: 'は (wa)',
    subtitle: 'Thema-Partikel',
    level: 'N5',
    category: 'Partikel',
    explanation:
      'Als Partikel wird は „wa“ gesprochen. Sie markiert das Thema und kann einen Kontrast ausdrücken.',
    structure: '[Thema] は + [Aussage]',
    examples: [
      example('私[わたし] は 学生[がくせい] です 。', 'Ich bin Student.'),
      example('これ は 本[ほん] です 。', 'Das ist ein Buch.'),
      example('猫[ねこ] は 魚[さかな] が 好[す]き です 。', 'Katzen mögen Fisch.'),
    ],
  },
  {
    id: 'g-ga',
    title: 'が (ga)',
    subtitle: 'Subjekt-Partikel',
    level: 'N5',
    category: 'Partikel',
    explanation:
      'が markiert oft das Subjekt, etwa in 誰が来ましたか. Bei 好き (mögen) und わかる (verstehen) steht が häufig bei dem, was jemand mag oder versteht.',
    structure: '[Subjekt] が + [Verb/Adjektiv]',
    examples: [
      example('誰[だれ] が 来[き]ました か ？', 'Wer ist gekommen?'),
      example('私[わたし] は 日本語[にほんご] が わかります 。', 'Ich verstehe Japanisch.'),
      example('雨[あめ] が 降[ふ]っています 。', 'Es regnet.'),
    ],
  },
  {
    id: 'g-wo',
    title: 'を (o)',
    subtitle: 'Objekt-Partikel',
    level: 'N5',
    category: 'Partikel',
    explanation:
      'Die Partikel を wird im Standardjapanischen „o“ gesprochen. In 水を飲みます markiert sie 水 als das, was man trinkt.',
    structure: '[Objekt] を + [transitives Verb]',
    examples: [
      example('水[みず] を 飲[の]みます 。', 'Ich trinke Wasser.'),
      example('日本語[にほんご] を 勉強[べんきょう] します 。', 'Ich lerne Japanisch.'),
      example('音楽[おんがく] を 聞[き]きます 。', 'Ich höre Musik.'),
    ],
  },
  {
    id: 'g-ni',
    title: 'に (ni)',
    subtitle: 'Richtung / Ort / Zeit',
    level: 'N5',
    category: 'Partikel',
    explanation:
      'に hat viele Bedeutungen: 1) Ziel einer Bewegung (gehen zu), 2) Ort des Seins (bei いる/ある), 3) Uhrzeit/Datum, 4) Empfänger einer Handlung.',
    structure: '[Ort/Zeit/Ziel] に + [Verb]',
    examples: [
      example('学校[がっこう] に 行[い]きます 。', 'Ich gehe zur Schule.'),
      example('部屋[へや] に 猫[ねこ] が います 。', 'Im Zimmer ist eine Katze.'),
      example('三時[さんじ] に 起[お]きます 。', 'Ich stehe um drei Uhr auf.'),
    ],
  },
  {
    id: 'g-de',
    title: 'で (de)',
    subtitle: 'Ort der Handlung / Mittel',
    level: 'N5',
    category: 'Partikel',
    explanation:
      'で markiert: 1) den Ort, an dem eine Handlung stattfindet (≠ に für Sein), 2) das Mittel/Werkzeug, 3) Transportmittel.',
    structure: '[Ort/Mittel] で + [Verb]',
    examples: [
      example('図書館[としょかん] で 勉強[べんきょう] します 。', 'Ich lerne in der Bibliothek.'),
      example('箸[はし] で 食[た]べます 。', 'Ich esse mit Stäbchen.'),
      example('バス で 行[い]きます 。', 'Ich fahre mit dem Bus.'),
    ],
  },
  {
    id: 'g-to',
    title: 'と (to)',
    subtitle: 'Und / Zusammen mit',
    level: 'N5',
    category: 'Partikel',
    explanation:
      'と verbindet Nomen ("und", vollständige Liste) oder drückt Begleitung aus ("zusammen mit").',
    structure: '[Nomen] と [Nomen] / [Person] と + [Verb]',
    examples: [
      example('猫[ねこ] と 犬[いぬ] が 好[す]き です 。', 'Ich mag Katzen und Hunde.'),
      example('友達[ともだち] と 映画[えいが] を 見[み]ます 。', 'Ich schaue mit Freunden einen Film.'),
    ],
  },
  {
    id: 'g-mo',
    title: 'も (mo)',
    subtitle: 'Auch / Ebenfalls',
    level: 'N5',
    category: 'Partikel',
    explanation: 'も ersetzt は oder が und bedeutet "auch/ebenfalls". Bei Verneinung: "auch nicht".',
    structure: '[Nomen] も + [Aussage]',
    examples: [
      example('私[わたし] も 学生[がくせい] です 。', 'Ich bin auch Student.'),
      example('これ も 好[す]き です 。', 'Das mag ich auch.'),
      example('何[なに] も ありません 。', 'Es ist gar nichts da.'),
    ],
  },
  {
    id: 'g-no',
    title: 'の (no)',
    subtitle: 'Besitz / Zugehörigkeit',
    level: 'N5',
    category: 'Partikel',
    explanation:
      'の verbindet zwei Nomen: das erste besitzt/beschreibt das zweite. Wie "-s" oder "von" im Deutschen.',
    structure: '[Besitzer] の + [Besitz]',
    examples: [
      example('私[わたし] の 本[ほん] です 。', 'Das ist mein Buch.'),
      example('日本[にほん] の 食[た]べ物[もの] が 好[す]き です 。', 'Ich mag japanisches Essen.'),
      example('山田[やまだ]さん の 車[くるま] は あそこ です 。', 'Herr Yamadas Auto ist dort drüben.'),
    ],
  },
  {
    id: 'g-kara-made',
    title: 'から / まで',
    subtitle: 'Von ... / Bis ...',
    level: 'N5',
    category: 'Partikel',
    explanation: 'から = von/ab (Start), まで = bis (Ende). Können zusammen oder einzeln verwendet werden.',
    structure: '[Start] から [Ziel/Zeit] まで',
    examples: [
      example('九時[くじ] から 五時[ごじ] まで 働[はたら]きます 。', 'Ich arbeite von 9 bis 17 Uhr.'),
      example('東京[とうきょう] から 大阪[おおさか] まで 。', 'Von Tokio nach Osaka.'),
    ],
  },

  // ── Verben ──────────────────────────────────────────────────────────────────
  {
    id: 'g-desu-masu',
    title: 'です / ます',
    subtitle: 'Höfliche Formen',
    level: 'N5',
    category: 'Verben',
    explanation:
      'Nomen und な-Adjektive bilden die höfliche Vergangenheit mit でした und die Verneinung mit ではありません. Bei い-Adjektiven ändert sich das Adjektiv selbst, etwa 寒かったです. Verben bilden höfliche Formen mit ます, ました und ません.',
    structure: '[Nomen/Adj] + です  /  [Verbstamm] + ます',
    examples: [
      example('学生[がくせい] です 。', 'Ich bin Student.'),
      example('食[た]べます 。', 'Ich esse.'),
      example('食[た]べました 。', 'Ich aß / Ich habe gegessen.'),
      example('食[た]べません 。', 'Ich esse nicht.'),
    ],
  },
  {
    id: 'g-te-form',
    title: 'て-Form',
    subtitle: 'Verbindung / Verlaufsform',
    level: 'N5',
    category: 'Verben',
    explanation:
      'Die て-Form verbindet Verben ("und dann"), bildet die Verlaufsform (〜ている), und drückt Bitten aus (〜てください).',
    structure: 'Verb → て-Form + いる / ください / ...',
    examples: [
      example('食[た]べて 、 寝[ね]ます 。', 'Ich esse und schlafe dann.'),
      example('今[いま] 、 勉強[べんきょう] しています 。', 'Ich lerne gerade.'),
      example('ここ に 来[き]て ください 。', 'Bitte kommen Sie hierher.'),
    ],
  },
  {
    id: 'g-nai',
    title: 'ない-Form',
    subtitle: 'Verneinung (informell)',
    level: 'N5',
    category: 'Verben',
    explanation:
      'Bei einstufigen Verben ersetzt ない das letzte る (食べる → 食べない). Bei fünfstufigen Verben wechselt die letzte Silbe zur a-Reihe (書く → 書かない, 帰る → 帰らない). Ein finales う wird zu わ (買う → 買わない). Sonderformen sind しない, こない und ない für する, くる und ある.',
    structure: '食べる → 食べない / 買う → 買わない',
    examples: [
      example('食[た]べない 。', 'Ich esse nicht. (informell)'),
      example('行[い]かない 。', 'Ich gehe nicht.'),
      example('しない 。', 'Ich mache es nicht.'),
    ],
  },
  {
    id: 'g-tai',
    title: '〜たい',
    subtitle: 'Wunsch: möchten',
    level: 'N5',
    category: 'Verben',
    explanation:
      'たい drückt den Wunsch aus, etwas zu tun ("möchte ..."). Wird an den Verbstamm (ます-Stamm) angehängt. Konjugiert wie ein い-Adjektiv.',
    structure: '[Verbstamm] + たい',
    examples: [
      example('日本[にほん] に 行[い]きたい です 。', 'Ich möchte nach Japan gehen.'),
      example('寿司[すし] を 食[た]べたい です 。', 'Ich möchte Sushi essen.'),
      example('何[なに] を したい です か ？', 'Was möchten Sie tun?'),
    ],
  },
  {
    id: 'g-teiru',
    title: '〜ている',
    subtitle: 'Verlaufsform / Zustand',
    level: 'N5',
    category: 'Verben',
    explanation:
      '〜ている hat zwei Bedeutungen: 1) laufende Handlung ("gerade dabei"), 2) anhaltender Zustand nach einer Handlung.',
    structure: '[て-Form] + いる',
    examples: [
      example('テレビ を 見[み]ています 。', 'Ich schaue gerade TV.'),
      example('結婚[けっこん] しています 。', 'Ich bin verheiratet.'),
      example('雨[あめ] が 降[ふ]っています 。', 'Es regnet (gerade).'),
    ],
  },

  // ── Adjektive ───────────────────────────────────────────────────────────────
  {
    id: 'g-i-adj',
    title: 'い-Adjektive',
    subtitle: 'Konjugation',
    level: 'N5',
    category: 'Adjektive',
    explanation:
      'い-Adjektive enden auf い und können direkt vor Nomen oder als Prädikat stehen. Vergangenheit: い→かった. Verneinung: い→くない.',
    structure: '[Adj-い] / [Adj-かった] / [Adj-くない]',
    examples: [
      example('大[おお]きい 犬[いぬ] です 。', 'Das ist ein großer Hund.'),
      example('昨日[きのう] は 寒[さむ]かった です 。', 'Gestern war es kalt.'),
      example('高[たか]くない です 。', 'Es ist nicht teuer.'),
    ],
  },
  {
    id: 'g-na-adj',
    title: 'な-Adjektive',
    subtitle: 'Konjugation',
    level: 'N5',
    category: 'Adjektive',
    explanation:
      'Vor einem Nomen steht な, etwa in 静かな部屋 (ein ruhiges Zimmer). Am Satzende lautet die höfliche Form 静かです, in der Vergangenheit 静かでした und verneint 静かではありません.',
    structure: '[Adj] な + [Nomen] / [Adj] + です',
    examples: [
      example('きれいな 花[はな] です 。', 'Das ist eine schöne Blume.'),
      example('日本語[にほんご] が 好[す]き です 。', 'Ich mag Japanisch.'),
      example('静[しず]か で は ありません 。', 'Es ist nicht ruhig.'),
    ],
  },

  // ── Ausdrücke ───────────────────────────────────────────────────────────────
  {
    id: 'g-question',
    title: 'Fragewörter',
    subtitle: 'なに・どこ・いつ・だれ・どう',
    level: 'N5',
    category: 'Ausdrücke',
    explanation:
      'Fragewörter stehen dort, wo die gesuchte Information stehen würde. In 誰が来ましたか steht 誰 am Anfang. In これは何ですか steht 何 weiter hinten.',
    structure: '[Fragewort] を/が/は/で + [Verb]？',
    examples: [
      example('これ は 何[なん] です か ？', 'Was ist das?'),
      example('どこ に 行[い]きます か ？', 'Wohin gehst du?'),
      example('いつ 来[き]ます か ？', 'Wann kommst du?'),
      example('誰[だれ] が います か ？', 'Wer ist da?'),
    ],
  },
  {
    id: 'g-aru-iru',
    title: 'ある / いる',
    subtitle: 'Es gibt / Existenz',
    level: 'N5',
    category: 'Verben',
    explanation:
      'ある = es gibt / vorhanden sein (für Dinge, Pflanzen). いる = es gibt / vorhanden sein (für Menschen, Tiere). Ort mit に.',
    structure: '[Ort] に [Nomen] が ある/いる',
    examples: [
      example('机[つくえ] の 上[うえ] に 本[ほん] が あります 。', 'Auf dem Tisch ist ein Buch.'),
      example('公園[こうえん] に 子供[こども] が います 。', 'Im Park sind Kinder.'),
      example('お金[かね] が ありません 。', 'Ich habe kein Geld.'),
    ],
  },
  {
    id: 'g-ka',
    title: 'か (ka)',
    subtitle: 'Fragesatz-Partikel',
    level: 'N5',
    category: 'Partikel',
    explanation:
      'か am Satzende macht einen Aussagesatz zur Frage — kein Fragezeichen nötig, keine Wortstellung ändern.',
    structure: '[Aussagesatz] + か？',
    examples: [
      example('日本人[にほんじん] です か ？', 'Sind Sie Japaner?'),
      example('食[た]べました か ？', 'Haben Sie gegessen?'),
      example('わかりました か ？', 'Haben Sie verstanden?'),
    ],
  },
]

export const GRAMMAR_CATEGORIES = [
  'Alle',
  'Partikel',
  'Verben',
  'Adjektive',
  'Satzstruktur',
  'Ausdrücke',
] as const
