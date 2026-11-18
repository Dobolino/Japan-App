import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'

const films = [
  {
    title: 'Mein Nachbar Totoro',
    jp: 'となりのトトロ',
    level: 'Mit ersten Wörtern',
    task: 'Wähle eine Familienszene. Wer ruft nach wem? Höre auf Namen und Anreden, auch wenn du erst einzelne Wörter erkennst.',
    source: 'Filmseite von Studio Ghibli',
    url: 'https://www.ghibli.jp/works/totoro/',
  },
  {
    title: 'Shirokuma Café',
    jp: 'しろくまカフェ',
    level: 'Mit ersten Alltagssätzen',
    task: 'Suche eine Szene, in der jemand ein Getränk bestellt. Was bestellt die Person? Höre ein zweites Mal auf die höfliche Bitte. Die Wortspiele kannst du für später aufheben.',
    source: 'Serienseite von TV Tokyo',
    url: 'https://www.tv-tokyo.co.jp/anime/shirokumacafe/',
  },
  {
    title: 'Laid-Back Camp',
    jp: 'ゆるキャン△',
    level: 'Mit etwas Hörpraxis',
    task: 'Suche ein Gespräch über einen Ausflug. Wohin wollen die Figuren und wie wird das Wetter? Die Namen der Campingausrüstung brauchst du dafür kaum.',
    source: 'Offizielle Serienseite',
    url: 'https://yurucamp.jp/first/',
  },
]

export default function ListeningGuidePage() {
  return (
    <div className="scroll-area h-full">
      <div className="page-width listening-guide">
        <Link to="/explore" className="text-link mb-3">
          ← Entdecken
        </Link>
        <PageHeader eyebrow="HÖRVERSTEHEN" title="Japanisch mit Anime und Audio" showSettings={false} />
        <section className="card-surface p-5 mb-5" aria-labelledby="first-audio">
          <h2 id="first-audio">Dein erster Dialog</h2>
          <p>
            Fängst du gerade an? Höre eine Begrüßung aus der ersten Irodori-Lektion der Japan Foundation.
            Sprich die Antwort nach und überlege, wen du so begrüßen würdest.
          </p>
          <a className="text-link" href="https://www.irodori.jpf.go.jp/en/starter/audio/lesson01.html">
            Irodori Starter · japanisches Audio, englische Seite
          </a>
          <p>
            Suchst du einen Kurs mit deutschen Erklärungen? Wähle im Minato-Katalog das Niveau A1 und bei
            „Language of Explanation“ die Option „Deutsch“.
          </p>
          <a className="text-link" href="https://minato-jf.jp/">
            Minato-Kurskatalog öffnen
          </a>
        </section>
        <section aria-labelledby="scene-practice" className="mb-6">
          <h2 id="scene-practice">Eine Szene in zehn Minuten</h2>
          <ol className="list-decimal pl-6 space-y-2 mt-3">
            <li>
              Wähle 20–40 Sekunden mit japanischem Ton. Höre einmal ohne Untertitel. Wer spricht mit wem, und
              was möchte die Person?
            </li>
            <li>
              Prüfe einen kurzen Satz mit japanischen Untertiteln, falls vorhanden. Höre erneut, pausiere und
              sprich ihn mit demselben Rhythmus nach.
            </li>
            <li>
              Tausche ein Wort aus. Aus <span lang="ja">水をください。</span> (Wasser, bitte) wird{' '}
              <span lang="ja">お茶をください。</span> (Tee, bitte). Sag deine Variante morgen noch einmal aus
              dem Kopf.
            </li>
          </ol>
          <Link className="text-link mt-2" to="/missions/cafe">
            Eine Bestellung in der App ausprobieren →
          </Link>
        </section>
        <section aria-labelledby="film-picks">
          <h2 id="film-picks">Welcher Anime passt zu dir?</h2>
          <div className="space-y-3 mt-3">
            {films.map((film) => (
              <article key={film.title} className="card-surface p-5">
                <p className="eyebrow">{film.level}</p>
                <h3>
                  {film.title}{' '}
                  <span lang="ja" className="jp">
                    {film.jp}
                  </span>
                </h3>
                <p>{film.task}</p>
                <a className="text-link" href={film.url}>
                  {film.source}
                </a>
              </article>
            ))}
          </div>
        </section>
        <section className="mt-6">
          <h2>Würdest du selbst so sprechen?</h2>
          <p>
            Unter Freunden hörst du oft kurze, lockere Formen. Achte auf die Beziehung der Figuren, bevor du
            einen Satz beim Einkaufen oder mit Fremden verwendest.
          </p>
          <a className="text-link" href="https://anime-manga.jp/en/character-expressions/">
            Figurensprache bei der Japan Foundation erkunden
          </a>
        </section>
      </div>
    </div>
  )
}
