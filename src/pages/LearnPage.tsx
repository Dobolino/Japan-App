import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import type { ItemCategory } from '@/types'
import HiraganaGrid from '@/components/HiraganaGrid'
import KatakanaGrid from '@/components/KatakanaGrid'
import PageHeader from '@/components/PageHeader'
import KanjiPage from './KanjiPage'
import VocabPage from './VocabPage'
import GrammarPage from './GrammarPage'

type Tab = ItemCategory | 'grammar'
const TABS: { key: Tab; label: string; kana: string }[] = [
  { key: 'hiragana', label: 'Hiragana', kana: 'あ' },
  { key: 'katakana', label: 'Katakana', kana: 'ア' },
  { key: 'kanji', label: 'Kanji', kana: '漢' },
  { key: 'vocabulary', label: 'Vokabeln', kana: '語' },
  { key: 'grammar', label: 'Grammatik', kana: '文' },
]

export default function LearnPage() {
  const activeCategory = useStore((s) => s.activeCategory)
  const setActiveCategory = useStore((s) => s.setActiveCategory)
  const [params, setParams] = useSearchParams()
  const selected = TABS.find((t) => t.key === params.get('category'))
  const tab = selected?.key ?? activeCategory
  const handleTab = (next: Tab) => {
    setParams({ category: next }, { replace: true })
    if (next !== 'grammar') setActiveCategory(next)
  }

  return (
    <div className="page-screen learning-page">
      <PageHeader
        eyebrow="ZEICHEN · WÖRTER · GRAMMATIK"
        title="Deine Lernbibliothek."
        description="Entdecke die Grundlagen und vertiefe dein Japanisch."
      />
      <div className="learning-shortcuts">
        <Link to="/course" className="text-link">
          Geführter Kurs
        </Link>
        <Link to="/training" className="text-link">
          Lernwerkstatt
        </Link>
        <Link to="/notebook" className="text-link">
          Lernheft
        </Link>
      </div>
      <nav className="tab-bar" aria-label="Lernbereiche">
        {TABS.map(({ key, label, kana }) => (
          <button
            key={key}
            type="button"
            aria-pressed={tab === key}
            onClick={() => handleTab(key)}
            className={`tab-bar-btn ${tab === key ? 'tab-bar-btn--active' : ''}`}
          >
            <span className="text-lg leading-none jp" aria-hidden="true">
              {kana}
            </span>
            {label}
          </button>
        ))}
      </nav>
      <div className="flex-1 min-h-0 overflow-hidden" key={tab}>
        {tab === 'hiragana' && <HiraganaGrid />}
        {tab === 'katakana' && <KatakanaGrid />}
        {tab === 'kanji' && <KanjiPage />}
        {tab === 'vocabulary' && <VocabPage />}
        {tab === 'grammar' && <GrammarPage />}
      </div>
    </div>
  )
}
