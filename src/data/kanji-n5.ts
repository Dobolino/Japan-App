import type { LearningItem } from '../types'

const today = new Date().toISOString()

function kj(
  id: string,
  character: string,
  onyomi: string[],
  kunyomi: string[],
  meaning: string,
  strokeCount: number,
  exampleWord?: string,
  exampleReading?: string,
  exampleMeaning?: string,
): LearningItem {
  return {
    id: `kj-${id}`,
    character,
    romaji: [...onyomi, ...kunyomi].join(' / '),
    meaning,
    category: 'kanji',
    onyomi,
    kunyomi,
    strokeCount,
    exampleWord,
    exampleReading,
    exampleMeaning,
    status: 'new',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: today,
    lastReviewDate: null,
    errorCount: 0,
    correctCount: 0,
  }
}

// JLPT N5 Kanji – 80 Zeichen
export const kanjiN5Data: LearningItem[] = [
  // ── Zahlen ──────────────────────────────────────────────────────────────
  kj('一', '一', ['イチ'], ['ひと・つ'], 'Eins',       1, '一つ',   'hitotsu',  'eines'),
  kj('二', '二', ['ニ'],   ['ふた・つ'], 'Zwei',       2, '二人',   'futari',   'zwei Personen'),
  kj('三', '三', ['サン'], ['みっ・つ'], 'Drei',       3, '三月',   'sangatsu', 'März'),
  kj('四', '四', ['シ'],   ['よ・つ'],   'Vier',       5, '四月',   'shigatsu', 'April'),
  kj('五', '五', ['ゴ'],   ['いつ・つ'], 'Fünf',       4, '五時',   'goji',     '5 Uhr'),
  kj('六', '六', ['ロク'], ['むっ・つ'], 'Sechs',      4, '六月',   'rokugatsu','Juni'),
  kj('七', '七', ['シチ'], ['なな・つ'], 'Sieben',     2, '七月',   'shichigatsu','Juli'),
  kj('八', '八', ['ハチ'], ['やっ・つ'], 'Acht',       2, '八月',   'hachigatsu','August'),
  kj('九', '九', ['ク','キュウ'], ['ここの・つ'], 'Neun', 2, '九時', 'kuji',    '9 Uhr'),
  kj('十', '十', ['ジュウ'], ['とお'],  'Zehn',        2, '十月',   'juugatsu', 'Oktober'),
  kj('百', '百', ['ヒャク'], [],         'Hundert',    6, '三百',   'sanbyaku', '300'),
  kj('千', '千', ['セン'],  ['ち'],      'Tausend',    3, '千円',   'senen',    '1000 Yen'),
  kj('万', '万', ['マン','バン'], [],    'Zehntausend', 3, '一万円', 'ichimanen','10.000 Yen'),

  // ── Zeit & Kalender ─────────────────────────────────────────────────────
  kj('年', '年', ['ネン'], ['とし'],     'Jahr',       6, '今年',   'kotoshi',  'dieses Jahr'),
  kj('月', '月', ['ゲツ','ガツ'], ['つき'], 'Monat / Mond', 4, '月曜日', 'getsuyoubi', 'Montag'),
  kj('日', '日', ['ニチ','ジツ'], ['ひ','か'], 'Tag / Sonne', 4, '今日', 'kyou', 'heute'),
  kj('時', '時', ['ジ'],   ['とき'],     'Zeit / Uhr', 10, '何時',  'nanji',    'wie viel Uhr'),
  kj('分', '分', ['フン','ブン'], ['わ・ける'], 'Minute / teilen', 4, '五分', 'gofun', '5 Minuten'),
  kj('週', '週', ['シュウ'], [],          'Woche',      11, '来週',  'raishuu',  'nächste Woche'),
  kj('午', '午', ['ゴ'],    [],           'Mittag / Stunde', 4, '午前', 'gozen', 'Vormittag'),
  kj('前', '前', ['ゼン'],  ['まえ'],     'Vorne / Vor', 9, '名前',  'namae',    'Name'),
  kj('後', '後', ['ゴ','コウ'], ['あと','うし・ろ'], 'Hinten / Nach', 9, '午後', 'gogo', 'Nachmittag'),

  // ── Natur & Elemente ────────────────────────────────────────────────────
  kj('山', '山', ['サン'],  ['やま'],     'Berg',       3, '富士山', 'fujisan',  'Mt. Fuji'),
  kj('川', '川', ['セン'],  ['かわ'],     'Fluss',      3, '川',     'kawa',     'Fluss'),
  kj('水', '水', ['スイ'],  ['みず'],     'Wasser',     4, '水曜日', 'suiyoubi', 'Mittwoch'),
  kj('火', '火', ['カ'],    ['ひ'],       'Feuer',      4, '火曜日', 'kayoubi',  'Dienstag'),
  kj('木', '木', ['モク','ボク'], ['き'], 'Baum / Holz', 4, '木曜日','mokuyoubi','Donnerstag'),
  kj('金', '金', ['キン','コン'], ['かね'], 'Gold / Geld', 8, '金曜日','kin\'youbi','Freitag'),
  kj('土', '土', ['ド','ト'], ['つち'],   'Erde / Boden', 3, '土曜日','doyoubi', 'Samstag'),
  kj('空', '空', ['クウ'],  ['そら','あ・く'], 'Himmel / leer', 8, '青空', 'aozora', 'blauer Himmel'),
  kj('雨', '雨', ['ウ'],    ['あめ'],     'Regen',      8, '大雨',   'oosame',   'Starkregen'),
  kj('花', '花', ['カ'],    ['はな'],     'Blume',      7, '花見',   'hanami',   'Kirschblüten-fest'),
  kj('草', '草', ['ソウ'],  ['くさ'],     'Gras',       9, '草原',   'sougen',   'Wiese'),

  // ── Menschen & Familie ──────────────────────────────────────────────────
  kj('人', '人', ['ジン','ニン'], ['ひと'], 'Person / Mensch', 2, '日本人', 'nihonjin', 'Japaner'),
  kj('男', '男', ['ダン','ナン'], ['おとこ'], 'Mann / männlich', 7, '男の人', 'otoko no hito', 'Mann'),
  kj('女', '女', ['ジョ','ニョ'], ['おんな'], 'Frau / weiblich', 3, '女の人', 'onna no hito', 'Frau'),
  kj('子', '子', ['シ','ス'], ['こ'],      'Kind',       3, '子供',   'kodomo',   'Kind'),
  kj('父', '父', ['フ'],    ['ちち'],      'Vater',      4, '父の日', 'chichi no hi', 'Vatertag'),
  kj('母', '母', ['ボ'],    ['はは'],      'Mutter',     5, '母の日', 'haha no hi', 'Muttertag'),

  // ── Richtungen & Positionen ─────────────────────────────────────────────
  kj('大', '大', ['ダイ','タイ'], ['おお・きい'], 'Groß',  3, '大学',  'daigaku',  'Universität'),
  kj('小', '小', ['ショウ'], ['ちい・さい','こ'], 'Klein', 3, '小学校','shougakkou','Grundschule'),
  kj('上', '上', ['ジョウ','ショウ'], ['うえ','あ・がる'], 'Oben / Hoch', 3, '上手', 'jouzu', 'geschickt'),
  kj('下', '下', ['カ','ゲ'], ['した','お・りる'], 'Unten / Tief', 3, '地下', 'chika', 'Untergrund'),
  kj('右', '右', ['ウ','ユウ'], ['みぎ'],  'Rechts',     5, '右手',   'migite',   'rechte Hand'),
  kj('左', '左', ['サ'],    ['ひだり'],    'Links',      5, '左手',   'hidarite', 'linke Hand'),
  kj('中', '中', ['チュウ'], ['なか'],     'Mitte / Innen', 4, '中国', 'chuugoku', 'China'),
  kj('外', '外', ['ガイ','ゲ'], ['そと'],  'Außen',      5, '外国',   'gaikoku',  'Ausland'),

  // ── Orte & Institutionen ────────────────────────────────────────────────
  kj('国', '国', ['コク','コッ'], ['くに'], 'Land',      8, '外国',   'gaikoku',  'Ausland'),
  kj('学', '学', ['ガク','ガッ'], ['まな・ぶ'], 'Lernen', 8, '学校',  'gakkou',   'Schule'),
  kj('校', '校', ['コウ'],   [],            'Schule',    10, '学校',  'gakkou',   'Schule'),
  kj('先', '先', ['セン'],  ['さき'],       'Zuerst / Vorne', 6, '先生', 'sensei', 'Lehrer'),
  kj('生', '生', ['セイ','ショウ'], ['い・きる','う・まれる'], 'Leben / gebären', 5, '先生', 'sensei', 'Lehrer'),
  kj('電', '電', ['デン'],   [],            'Elektrizität', 13, '電車', 'densha', 'Zug'),
  kj('車', '車', ['シャ'],  ['くるま'],     'Auto / Fahrzeug', 7, '電車', 'densha', 'Zug'),
  kj('駅', '駅', ['エキ'],   [],            'Bahnhof',   14, '東京駅','toukyoueki','Tokio Bahnhof'),

  // ── Sprache & Schrift ───────────────────────────────────────────────────
  kj('語', '語', ['ゴ'],   ['かた・る'],   'Sprache',    14, '日本語','nihongo',  'Japanisch'),
  kj('文', '文', ['ブン','モン'], ['ふみ'], 'Text / Satz', 4, '文字',  'moji',    'Schriftzeichen'),
  kj('字', '字', ['ジ'],    ['あざ'],      'Zeichen / Schrift', 6, '漢字', 'kanji', 'Kanji'),
  kj('話', '話', ['ワ'],   ['はな・す','はなし'], 'Gespräch / sprechen', 13, '電話', 'denwa', 'Telefon'),
  kj('読', '読', ['ドク','トク'], ['よ・む'], 'Lesen',    14, '読書',  'dokusho',  'Lesen (Hobby)'),
  kj('書', '書', ['ショ'], ['か・く'],     'Schreiben',  10, '書道',  'shodou',   'Kalligraphie'),

  // ── Essen & Trinken ─────────────────────────────────────────────────────
  kj('食', '食', ['ショク'], ['た・べる','く・う'], 'Essen', 9, '食べ物', 'tabemono', 'Speise'),
  kj('飲', '飲', ['イン'],  ['の・む'],     'Trinken',   12, '飲み物', 'nomimono', 'Getränk'),

  // ── Bewegung ────────────────────────────────────────────────────────────
  kj('来', '来', ['ライ'],  ['く・る','き・た'],  'Kommen',  7, '来年',  'rainen',   'nächstes Jahr'),
  kj('行', '行', ['コウ','ギョウ'], ['い・く','おこな・う'], 'Gehen', 6, '旅行', 'ryokou', 'Reise'),
  kj('見', '見', ['ケン'],  ['み・る','み・せる'], 'Sehen',  7, '見物',  'kenbutsu', 'Sightseeing'),
  kj('聞', '聞', ['ブン','モン'], ['き・く'],  'Hören / Fragen', 14, '新聞', 'shinbun', 'Zeitung'),

  // ── Sonstiges N5 ────────────────────────────────────────────────────────
  kj('今', '今', ['コン','キン'], ['いま'],  'Jetzt / Heute', 4, '今日', 'kyou',    'heute'),
  kj('何', '何', ['カ'],    ['なに','なん'], 'Was / Wie viele', 7, '何時', 'nanji',  'wie viel Uhr'),
  kj('円', '円', ['エン'],   [],            'Kreis / Yen',  4, '千円',  'senen',   '1000 Yen'),
  kj('本', '本', ['ホン','ボン'], ['もと'], 'Buch / Ursprung', 5, '日本', 'nihon',  'Japan'),
  kj('白', '白', ['ハク','ビャク'], ['しろ','しら'], 'Weiß', 5, '白い', 'shiroi',  'weiß (Adj.)'),
  kj('私', '私', ['シ'],    ['わたし','わたくし'], 'Ich / privat', 7, '私の', 'watashi no', 'mein/e'),
  kj('出', '出', ['シュツ','スイ'], ['で・る','だ・す'], 'Herausgehen / ausgeben', 5, '出口', 'deguchi', 'Ausgang'),
  kj('入', '入', ['ニュウ'], ['い・る','い・れる'], 'Eintreten', 2, '入口', 'iriguchi', 'Eingang'),
  kj('口', '口', ['コウ','ク'], ['くち'],   'Mund / Öffnung', 3, '出口', 'deguchi', 'Ausgang'),
  kj('目', '目', ['モク','ボク'], ['め'],   'Auge',       5, '目的',  'mokuteki', 'Ziel / Zweck'),
  kj('手', '手', ['シュ'],  ['て'],        'Hand',        4, '手紙',  'tegami',   'Brief'),
  kj('足', '足', ['ソク'],  ['あし','た・りる'], 'Fuß / genug', 7, '足りる', 'tariru', 'ausreichen'),
]
