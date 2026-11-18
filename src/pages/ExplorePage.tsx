import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import { ArrowIcon, BookIcon, PracticeIcon, ReadingIcon } from '@/components/icons/UiIcons'

const activities = [
  {
    to: '/course',
    title: 'Dein Kurs',
    description: 'Zeichen, Wörter und Sätze. Schritt für Schritt.',
    symbol: '道',
    tone: 'indigo',
  },
  {
    to: '/practice',
    title: 'Wissen festigen',
    description: 'Wiederholen oder frei üben.',
    Icon: PracticeIcon,
    tone: 'green',
  },
  {
    to: '/learn',
    title: 'Lernbibliothek',
    description: 'Alle Zeichen, Vokabeln und Grammatik.',
    symbol: 'あ',
    tone: 'red',
  },
  {
    to: '/immerse',
    title: 'Geschichten lesen',
    description: 'Japanisch im Zusammenhang verstehen.',
    Icon: ReadingIcon,
    tone: 'indigo',
  },
  {
    to: '/missions',
    title: 'Alltagsmissionen',
    description: 'Im Café, am Bahnhof, im Gespräch.',
    symbol: '話',
    tone: 'red',
  },
  {
    to: '/training',
    title: 'Lernwerkstatt',
    description: 'Hören, Sprechen und gezielt trainieren.',
    symbol: '声',
    tone: 'green',
  },
  {
    to: '/explore/listening',
    title: 'Japanisch mit Anime und Audio',
    description: 'Finde eine Szene und übe einen Satz für deinen Alltag.',
    symbol: '耳',
    tone: 'green',
  },
  {
    to: '/notebook',
    title: 'Dein Lernheft',
    description: 'Gemerkte Inhalte und eigene Notizen.',
    Icon: BookIcon,
    tone: 'indigo',
  },
]

export default function ExplorePage() {
  return (
    <div className="scroll-area h-full">
      <div className="page-width explore-page">
        <PageHeader eyebrow="DEIN JAPANISCH, DEIN WEG" title="Was möchtest du entdecken?" />
        <div className="explore-grid">
          {activities.map(({ to, title, description, symbol, Icon, tone }) => (
            <Link key={to} to={to} className="card-surface explore-card">
              <span className={`explore-symbol explore-symbol--${tone}`} aria-hidden="true">
                {Icon ? <Icon /> : <span className="jp">{symbol}</span>}
              </span>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <ArrowIcon />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
