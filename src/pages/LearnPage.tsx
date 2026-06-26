import { useState } from 'react'
import { useStore } from '../store/useStore'
import type { ItemCategory } from '../types'
import HiraganaGrid from '../components/HiraganaGrid'
import KatakanaGrid from '../components/KatakanaGrid'
import KanjiPage from './KanjiPage'
import VocabPage from './VocabPage'
import GrammarPage from './GrammarPage'

type Tab = ItemCategory | 'grammar'

const TABS: { key: Tab; label: string; kana: string }[] = [
  { key: 'hiragana',   label: 'Hiragana',  kana: 'あ' },
  { key: 'katakana',   label: 'Katakana',  kana: 'ア' },
  { key: 'kanji',      label: 'Kanji',     kana: '漢' },
  { key: 'vocabulary', label: 'Vokabeln',  kana: '語' },
  { key: 'grammar',    label: 'Grammatik', kana: '文' },
]

export default function LearnPage() {
  const { activeCategory, setActiveCategory } = useStore()
  const [tab, setTab] = useState<Tab>(activeCategory)

  const handleTab = (t: Tab) => {
    setTab(t)
    if (t !== 'grammar') setActiveCategory(t as ItemCategory)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Category tabs */}
      <div className="flex border-b border-white/10 px-2 pt-2 overflow-x-auto scrollbar-none">
        {TABS.map(({ key, label, kana }) => (
          <button
            key={key}
            onClick={() => handleTab(key)}
            className={`flex-none flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === key
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-white/40'
            }`}
          >
            <span className="text-base leading-none">{kana}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'hiragana'   && <HiraganaGrid />}
        {tab === 'katakana'   && <KatakanaGrid />}
        {tab === 'kanji'      && <KanjiPage />}
        {tab === 'vocabulary' && <VocabPage />}
        {tab === 'grammar'    && <GrammarPage />}
      </div>
    </div>
  )
}
