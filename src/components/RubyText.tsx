import { alignFurigana, isKanaReading } from '@/utils/furigana'
import { useStore } from '@/store/useStore'

interface Props {
  text: string
  /** Hiragana/katakana reading or romaji fallback */
  reading?: string
  romaji?: string
  size?: 'sentence' | 'display' | 'compact'
  showFurigana?: boolean
  showRomaji?: boolean
  className?: string
}

const SIZE_CLASS = {
  sentence: 'jp-sentence',
  display: 'jp-display',
  compact: 'jp-compact',
}

export default function RubyText({
  text,
  reading,
  romaji,
  size = 'sentence',
  showFurigana: furiganaProp,
  showRomaji: romajiProp,
  className = '',
}: Props) {
  const prefs = useStore((s) => s.displayPrefs)
  const showFurigana = furiganaProp ?? prefs.showFurigana
  const showRomaji = romajiProp ?? prefs.showRomaji

  const sizeClass = SIZE_CLASS[size]
  const canRuby = reading && isKanaReading(reading) && showFurigana
  const segments = canRuby ? alignFurigana(text, reading) : [{ text }]

  return (
    <span className={`jp inline-block ${sizeClass} ${className}`.trim()}>
      {segments.map((seg, i) =>
        seg.reading ? (
          <ruby key={i} className="ruby-base">
            {seg.text}
            <rt className="ruby-reading">{seg.reading}</rt>
          </ruby>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
      {showRomaji && romaji && (
        <span className="block text-[var(--blue)] font-semibold text-sm mt-1 romaji-line">{romaji}</span>
      )}
      {showRomaji && !romaji && reading && !isKanaReading(reading) && (
        <span className="block text-[var(--blue)] font-semibold text-sm mt-1 romaji-line">{reading}</span>
      )}
    </span>
  )
}
