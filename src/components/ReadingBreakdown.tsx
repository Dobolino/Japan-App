import { breakdownReading, type ReadingPart } from '@/utils/readingBreakdown'
import { SCRIPT_BG, SCRIPT_COLOR } from '@/utils/scriptAnalyzer'

interface Props {
  character: string
  romaji: string
  size?: 'sm' | 'md' | 'lg'
  compact?: boolean
}

const CHAR_SIZE = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-5xl sm:text-6xl' }
const READ_SIZE = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' }

export default function ReadingBreakdown({ character, romaji, size = 'md', compact = false }: Props) {
  const parts = breakdownReading(character, romaji)
  if (parts.length <= 1 && character.length <= 1) {
    return (
      <div className="text-center">
        <div className={`jp font-bold text-white ${CHAR_SIZE[size]}`}>{character}</div>
        {!compact && <div className={`text-cyan-300/80 mt-1 ${READ_SIZE[size]}`}>{romaji}</div>}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className={`flex flex-wrap justify-center ${compact ? 'gap-2' : 'gap-3'}`}>
        {parts.map((part, i) => (
          <ReadingCell key={`${part.char}-${i}`} part={part} size={size} compact={compact} />
        ))}
      </div>
      {!compact && (
        <p className={`text-center text-cyan-300/70 mt-3 font-medium ${READ_SIZE[size]}`}>
          Gesamt: {romaji}
        </p>
      )}
    </div>
  )
}

function ReadingCell({ part, size, compact }: { part: ReadingPart; size: 'sm' | 'md' | 'lg'; compact?: boolean }) {
  const colorClass = SCRIPT_COLOR[part.type]
  const bgClass = compact ? '' : SCRIPT_BG[part.type]

  return (
    <div
      className={`flex flex-col items-center min-w-[52px] ${compact ? 'px-1' : `px-3 py-2 rounded-2xl border ${bgClass}`}`}
    >
      <span className={`jp font-bold leading-none ${colorClass} ${CHAR_SIZE[size]}`}>{part.char}</span>
      <span className={`text-cyan-300 font-semibold mt-1.5 ${READ_SIZE[size]}`}>{part.reading || '—'}</span>
      {!compact && (
        <span className="text-[9px] text-white/30 mt-0.5 uppercase tracking-wide">
          {part.type === 'kanji' ? 'Kanji' : part.type === 'hiragana' ? 'Hira' : part.type === 'katakana' ? 'Kata' : ''}
        </span>
      )}
    </div>
  )
}
