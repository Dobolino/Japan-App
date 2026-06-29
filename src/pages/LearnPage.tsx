import { useState } from 'react'
import { useStore } from '@/store/useStore'
import type { ItemCategory } from '@/types'
import HiraganaGrid from '@/components/HiraganaGrid'
import KatakanaGrid from '@/components/KatakanaGrid'
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
  const [grammarOpen, setGrammarOpen] = useState(false)

  const tab: Tab = grammarOpen ? 'grammar' : activeCategory

  const handleTab = (t: Tab) => {
    if (t === 'grammar') {
      setGrammarOpen(true)
    } else {
      setGrammarOpen(false)
      setActiveCategory(t)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="tab-bar px-2 pt-1 overflow-x-auto scrollbar-none">
        {TABS.map(({ key, label, kana }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleTab(key)}
            className={`tab-bar-btn ${tab === key ? 'tab-bar-btn--active' : ''}`}
          >
            <span className="text-base leading-none jp">{kana}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'hiragana' && <HiraganaGrid />}
        {tab === 'katakana' && <KatakanaGrid />}
        {tab === 'kanji' && <KanjiPage />}
        {tab === 'vocabulary' && <VocabPage />}
        {tab === 'grammar' && <GrammarPage />}
      </div>
    </div>
  )
}
