import { useStore } from '../store/useStore'
import type { ItemCategory } from '../types'
import HiraganaGrid from '../components/HiraganaGrid'
import KatakanaGrid from '../components/KatakanaGrid'
import KanjiPage from './KanjiPage'
import VocabPage from './VocabPage'

const TABS: { key: ItemCategory; label: string; kana: string }[] = [
  { key: 'hiragana',   label: 'Hiragana',  kana: 'あ' },
  { key: 'katakana',   label: 'Katakana',  kana: 'ア' },
  { key: 'kanji',      label: 'Kanji',     kana: '漢' },
  { key: 'vocabulary', label: 'Vokabeln',  kana: '語' },
]

export default function LearnPage() {
  const { activeCategory, setActiveCategory } = useStore()

  return (
    <div className="flex flex-col h-full">
      {/* Category tabs */}
      <div className="flex border-b border-white/10 px-2 pt-2 overflow-x-auto scrollbar-none">
        {TABS.map(({ key, label, kana }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex-none flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeCategory === key
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-white/40'
            }`}
          >
            <span className="text-base leading-none">{kana}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Active category content */}
      <div className="flex-1 overflow-hidden">
        {activeCategory === 'hiragana'   && <HiraganaGrid />}
        {activeCategory === 'katakana'   && <KatakanaGrid />}
        {activeCategory === 'kanji'      && <KanjiPage />}
        {activeCategory === 'vocabulary' && <VocabPage />}
      </div>
    </div>
  )
}
