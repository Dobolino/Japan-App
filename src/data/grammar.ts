export interface GrammarExample {
  jp: string
  reading: string
  de: string
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

export const grammarData: GrammarPoint[] = [
  // ── Satzstruktur ────────────────────────────────────────────────────────────
  {
    id: 'g-sov',
    title: 'SOV-Satzstruktur',
    subtitle: 'Subjekt → Objekt → Verb',
    level: 'N5',
    category: 'Satzstruktur',
    explanation: 'Im Japanischen steht das Verb immer am Satzende. Subjekt und Objekt kommen davor, in der Reihenfolge S-O-V.',
    structure: '[Subjekt は/が] + [Objekt を] + [Verb]',
    examples: [
      { jp: '私はりんごを食べます。', reading: 'わたしはりんごをたべます。', de: 'Ich esse einen Apfel.' },
      { jp: '田中さんは本を読みます。', reading: 'たなかさんはほんをよみます。', de: 'Herr Tanaka liest ein Buch.' },
    ],
  },

  // ── Partikel ────────────────────────────────────────────────────────────────
  {
    id: 'g-wa',
    title: 'は (wa)',
    subtitle: 'Thema-Partikel',
    level: 'N5',
    category: 'Partikel',
    explanation: 'は markiert das Thema des Satzes — worüber gerade gesprochen wird. Es betont Kontrast oder gibt bekannte Information an.',
    structure: '[Thema] は + [Aussage]',
    examples: [
      { jp: '私は学生です。', reading: 'わたしはがくせいです。', de: 'Ich bin Student.' },
      { jp: 'これは本です。', reading: 'これはほんです。', de: 'Das ist ein Buch.' },
      { jp: '猫は魚が好きです。', reading: 'ねこはさかながすきです。', de: 'Katzen mögen Fisch.' },
    ],
  },
  {
    id: 'g-ga',
    title: 'が (ga)',
    subtitle: 'Subjekt-Partikel',
    level: 'N5',
    category: 'Partikel',
    explanation: 'が markiert das grammatische Subjekt. Wird benutzt bei neuer Information, bei Fragen nach dem Subjekt (だれが？), und bei bestimmten Verben (好き、わかる、ある、いる).',
    structure: '[Subjekt] が + [Verb/Adjektiv]',
    examples: [
      { jp: '誰が来ましたか？', reading: 'だれがきましたか？', de: 'Wer ist gekommen?' },
      { jp: '私は日本語がわかります。', reading: 'わたしはにほんごがわかります。', de: 'Ich verstehe Japanisch.' },
      { jp: '雨が降っています。', reading: 'あめがふっています。', de: 'Es regnet.' },
    ],
  },
  {
    id: 'g-wo',
    title: 'を (wo)',
    subtitle: 'Objekt-Partikel',
    level: 'N5',
    category: 'Partikel',
    explanation: 'を markiert das direkte Objekt einer Handlung — also das, womit etwas getan wird.',
    structure: '[Objekt] を + [transitives Verb]',
    examples: [
      { jp: '水を飲みます。', reading: 'みずをのみます。', de: 'Ich trinke Wasser.' },
      { jp: '日本語を勉強します。', reading: 'にほんごをべんきょうします。', de: 'Ich lerne Japanisch.' },
      { jp: '音楽を聞きます。', reading: 'おんがくをききます。', de: 'Ich höre Musik.' },
    ],
  },
  {
    id: 'g-ni',
    title: 'に (ni)',
    subtitle: 'Richtung / Ort / Zeit',
    level: 'N5',
    category: 'Partikel',
    explanation: 'に hat viele Bedeutungen: 1) Ziel einer Bewegung (gehen zu), 2) Ort des Seins (bei いる/ある), 3) Uhrzeit/Datum, 4) Empfänger einer Handlung.',
    structure: '[Ort/Zeit/Ziel] に + [Verb]',
    examples: [
      { jp: '学校に行きます。', reading: 'がっこうにいきます。', de: 'Ich gehe zur Schule.' },
      { jp: '部屋に猫がいます。', reading: 'へやにねこがいます。', de: 'Im Zimmer ist eine Katze.' },
      { jp: '三時に起きます。', reading: 'さんじにおきます。', de: 'Ich stehe um drei Uhr auf.' },
    ],
  },
  {
    id: 'g-de',
    title: 'で (de)',
    subtitle: 'Ort der Handlung / Mittel',
    level: 'N5',
    category: 'Partikel',
    explanation: 'で markiert: 1) den Ort, an dem eine Handlung stattfindet (≠ に für Sein), 2) das Mittel/Werkzeug, 3) Transportmittel.',
    structure: '[Ort/Mittel] で + [Verb]',
    examples: [
      { jp: '図書館で勉強します。', reading: 'としょかんでべんきょうします。', de: 'Ich lerne in der Bibliothek.' },
      { jp: '箸で食べます。', reading: 'はしでたべます。', de: 'Ich esse mit Stäbchen.' },
      { jp: 'バスで行きます。', reading: 'バスでいきます。', de: 'Ich fahre mit dem Bus.' },
    ],
  },
  {
    id: 'g-to',
    title: 'と (to)',
    subtitle: 'Und / Zusammen mit',
    level: 'N5',
    category: 'Partikel',
    explanation: 'と verbindet Nomen ("und", vollständige Liste) oder drückt Begleitung aus ("zusammen mit").',
    structure: '[Nomen] と [Nomen] / [Person] と + [Verb]',
    examples: [
      { jp: '猫と犬が好きです。', reading: 'ねこといぬがすきです。', de: 'Ich mag Katzen und Hunde.' },
      { jp: '友達と映画を見ます。', reading: 'ともだちとえいがをみます。', de: 'Ich schaue mit Freunden einen Film.' },
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
      { jp: '私も学生です。', reading: 'わたしもがくせいです。', de: 'Ich bin auch Student.' },
      { jp: 'これも好きです。', reading: 'これもすきです。', de: 'Das mag ich auch.' },
      { jp: '何もありません。', reading: 'なにもありません。', de: 'Es ist gar nichts da.' },
    ],
  },
  {
    id: 'g-no',
    title: 'の (no)',
    subtitle: 'Besitz / Zugehörigkeit',
    level: 'N5',
    category: 'Partikel',
    explanation: 'の verbindet zwei Nomen: das erste besitzt/beschreibt das zweite. Wie "-s" oder "von" im Deutschen.',
    structure: '[Besitzer] の + [Besitz]',
    examples: [
      { jp: '私の本です。', reading: 'わたしのほんです。', de: 'Das ist mein Buch.' },
      { jp: '日本の食べ物が好きです。', reading: 'にほんのたべものがすきです。', de: 'Ich mag japanisches Essen.' },
      { jp: '山田さんの車はあそこです。', reading: 'やまださんのくるまはあそこです。', de: 'Herr Yamadas Auto ist dort drüben.' },
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
      { jp: '九時から五時まで働きます。', reading: 'くじからごじまではたらきます。', de: 'Ich arbeite von 9 bis 17 Uhr.' },
      { jp: '東京から大阪まで。', reading: 'とうきょうからおおさかまで。', de: 'Von Tokyo nach Osaka.' },
    ],
  },

  // ── Verben ──────────────────────────────────────────────────────────────────
  {
    id: 'g-desu-masu',
    title: 'です / ます',
    subtitle: 'Höfliche Formen',
    level: 'N5',
    category: 'Verben',
    explanation: 'です macht Nomen/Adjektive höflich. ます ist die höfliche Verbendung. Für Vergangenheit: でした / ました. Für Verneinung: ではありません / ません.',
    structure: '[Nomen/Adj] + です  /  [Verbstamm] + ます',
    examples: [
      { jp: '学生です。', reading: 'がくせいです。', de: 'Ich bin Student.' },
      { jp: '食べます。', reading: 'たべます。', de: 'Ich esse.' },
      { jp: '食べました。', reading: 'たべました。', de: 'Ich aß / Ich habe gegessen.' },
      { jp: '食べません。', reading: 'たべません。', de: 'Ich esse nicht.' },
    ],
  },
  {
    id: 'g-te-form',
    title: 'て-Form',
    subtitle: 'Verbindung / Verlaufsform',
    level: 'N5',
    category: 'Verben',
    explanation: 'Die て-Form verbindet Verben ("und dann"), bildet die Verlaufsform (〜ている), und drückt Bitten aus (〜てください).',
    structure: 'Verb → て-Form + いる / ください / ...',
    examples: [
      { jp: '食べて、寝ます。', reading: 'たべて、ねます。', de: 'Ich esse und schlafe dann.' },
      { jp: '今、勉強しています。', reading: 'いま、べんきょうしています。', de: 'Ich lerne gerade.' },
      { jp: 'ここに来てください。', reading: 'ここにきてください。', de: 'Bitte kommen Sie hier her.' },
    ],
  },
  {
    id: 'g-nai',
    title: 'ない-Form',
    subtitle: 'Verneinung (informell)',
    level: 'N5',
    category: 'Verben',
    explanation: 'Die ない-Form ist die informelle Verneinung eines Verbs. る-Verben: る→ない. う-Verben: u→aない. する→しない, くる→こない.',
    structure: '[Verbstamm] + ない',
    examples: [
      { jp: '食べない。', reading: 'たべない。', de: 'Ich esse nicht. (informell)' },
      { jp: '行かない。', reading: 'いかない。', de: 'Ich gehe nicht.' },
      { jp: 'しない。', reading: 'しない。', de: 'Ich mache es nicht.' },
    ],
  },
  {
    id: 'g-tai',
    title: '〜たい',
    subtitle: 'Wunsch: möchten',
    level: 'N5',
    category: 'Verben',
    explanation: 'たい drückt den Wunsch aus, etwas zu tun ("möchte ..."). Wird an den Verbstamm (ます-Stamm) angehängt. Konjugiert wie ein い-Adjektiv.',
    structure: '[Verbstamm] + たい',
    examples: [
      { jp: '日本に行きたいです。', reading: 'にほんにいきたいです。', de: 'Ich möchte nach Japan gehen.' },
      { jp: '寿司を食べたいです。', reading: 'すしをたべたいです。', de: 'Ich möchte Sushi essen.' },
      { jp: '何をしたいですか？', reading: 'なにをしたいですか？', de: 'Was möchten Sie tun?' },
    ],
  },
  {
    id: 'g-teiru',
    title: '〜ている',
    subtitle: 'Verlaufsform / Zustand',
    level: 'N5',
    category: 'Verben',
    explanation: '〜ている hat zwei Bedeutungen: 1) laufende Handlung ("gerade dabei"), 2) anhaltender Zustand nach einer Handlung.',
    structure: '[て-Form] + いる',
    examples: [
      { jp: 'テレビを見ています。', reading: 'テレビをみています。', de: 'Ich schaue gerade TV.' },
      { jp: '結婚しています。', reading: 'けっこんしています。', de: 'Ich bin verheiratet.' },
      { jp: '雨が降っています。', reading: 'あめがふっています。', de: 'Es regnet (gerade).' },
    ],
  },

  // ── Adjektive ───────────────────────────────────────────────────────────────
  {
    id: 'g-i-adj',
    title: 'い-Adjektive',
    subtitle: 'Konjugation',
    level: 'N5',
    category: 'Adjektive',
    explanation: 'い-Adjektive enden auf い und können direkt vor Nomen oder als Prädikat stehen. Vergangenheit: い→かった. Verneinung: い→くない.',
    structure: '[Adj-い] / [Adj-かった] / [Adj-くない]',
    examples: [
      { jp: '大きい犬です。', reading: 'おおきいいぬです。', de: 'Das ist ein großer Hund.' },
      { jp: '昨日は寒かったです。', reading: 'きのうはさむかったです。', de: 'Gestern war es kalt.' },
      { jp: '高くないです。', reading: 'たかくないです。', de: 'Es ist nicht teuer.' },
    ],
  },
  {
    id: 'g-na-adj',
    title: 'な-Adjektive',
    subtitle: 'Konjugation',
    level: 'N5',
    category: 'Adjektive',
    explanation: 'な-Adjektive brauchen な vor Nomen und です als Prädikat. Verneinung: ではありません. Vergangenheit: でした.',
    structure: '[Adj] な + [Nomen] / [Adj] + です',
    examples: [
      { jp: 'きれいな花です。', reading: 'きれいなはなです。', de: 'Das ist eine schöne Blume.' },
      { jp: '日本語が好きです。', reading: 'にほんごがすきです。', de: 'Ich mag Japanisch.' },
      { jp: '静かではありません。', reading: 'しずかではありません。', de: 'Es ist nicht ruhig.' },
    ],
  },

  // ── Ausdrücke ───────────────────────────────────────────────────────────────
  {
    id: 'g-question',
    title: 'Fragewörter',
    subtitle: 'なに・どこ・いつ・だれ・どう',
    level: 'N5',
    category: 'Ausdrücke',
    explanation: 'Fragewörter stehen an derselben Stelle wie die Antwort im Satz — nicht am Satzanfang wie im Deutschen/Englischen.',
    structure: '[Fragewort] を/が/は/で + [Verb]？',
    examples: [
      { jp: 'これは何ですか？', reading: 'これはなんですか？', de: 'Was ist das?' },
      { jp: 'どこに行きますか？', reading: 'どこにいきますか？', de: 'Wohin gehst du?' },
      { jp: 'いつ来ますか？', reading: 'いつきますか？', de: 'Wann kommst du?' },
      { jp: '誰がいますか？', reading: 'だれがいますか？', de: 'Wer ist da?' },
    ],
  },
  {
    id: 'g-aru-iru',
    title: 'ある / いる',
    subtitle: 'Es gibt / Existenz',
    level: 'N5',
    category: 'Verben',
    explanation: 'ある = es gibt / vorhanden sein (für Dinge, Pflanzen). いる = es gibt / vorhanden sein (für Menschen, Tiere). Ort mit に.',
    structure: '[Ort] に [Nomen] が ある/いる',
    examples: [
      { jp: '机の上に本があります。', reading: 'つくえのうえにほんがあります。', de: 'Auf dem Tisch ist ein Buch.' },
      { jp: '公園に子供がいます。', reading: 'こうえんにこどもがいます。', de: 'Im Park sind Kinder.' },
      { jp: 'お金がありません。', reading: 'おかねがありません。', de: 'Ich habe kein Geld.' },
    ],
  },
  {
    id: 'g-ka',
    title: 'か (ka)',
    subtitle: 'Fragesatz-Partikel',
    level: 'N5',
    category: 'Partikel',
    explanation: 'か am Satzende macht einen Aussagesatz zur Frage — kein Fragezeichen nötig, keine Wortstellung ändern.',
    structure: '[Aussagesatz] + か？',
    examples: [
      { jp: '日本人ですか？', reading: 'にほんじんですか？', de: 'Sind Sie Japaner?' },
      { jp: '食べましたか？', reading: 'たべましたか？', de: 'Haben Sie gegessen?' },
      { jp: 'わかりましたか？', reading: 'わかりましたか？', de: 'Haben Sie verstanden?' },
    ],
  },
]

export const GRAMMAR_CATEGORIES = ['Alle', 'Partikel', 'Verben', 'Adjektive', 'Satzstruktur', 'Ausdrücke'] as const
