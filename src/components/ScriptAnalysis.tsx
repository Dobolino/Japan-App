import { groupSegments, analyzeScript, SCRIPT_BG, SCRIPT_COLOR, SCRIPT_LABEL } from '@/utils/scriptAnalyzer'

interface Props {
  text: string
  showBreakdown?: boolean
  size?: 'md' | 'lg' | 'xl'
}

const SIZE_CLASS = {
  md: { inline: 'text-2xl', badge: 'text-sm', char: 'text-sm' },
  lg: { inline: 'text-3xl', badge: 'text-sm', char: 'text-base' },
  xl: { inline: 'text-4xl sm:text-5xl', badge: 'text-xs', char: 'text-base' },
}

const SCRIPT_COLOR_LIGHT: Record<string, string> = {
  kanji: 'text-[var(--orange)]',
  hiragana: 'text-[var(--blue)]',
  katakana: 'text-[var(--green)]',
  other: 'text-[var(--text-muted)]',
}

const SCRIPT_BG_LIGHT: Record<string, string> = {
  kanji: 'bg-[#fff3e0] border border-[#ffcc80] text-[var(--orange)]',
  hiragana: 'bg-[#eef2ff] border border-[#bce8ff] text-[var(--blue)]',
  katakana: 'bg-[#e5f9e5] border border-[#b7e4b7] text-[var(--green)]',
  other: 'bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-muted)]',
}

export default function ScriptAnalysis({ text, showBreakdown = true, size = 'md' }: Props) {
  const groups = groupSegments(text)
  const chars = analyzeScript(text)
  const hasMultiple = new Set(chars.map((c) => c.type)).size > 1
  const sz = SIZE_CLASS[size]

  if (!hasMultiple && !showBreakdown && size === 'md') {
    return <span className={`jp font-medium ${sz.inline}`}>{text}</span>
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 items-baseline justify-center">
        {groups.map((g, i) => (
          <span key={i} className={`jp font-medium ${SCRIPT_COLOR_LIGHT[g.type] ?? SCRIPT_COLOR[g.type]} ${sz.inline}`}>
            {g.text}
          </span>
        ))}
      </div>

      {showBreakdown && chars.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {chars
            .filter((c) => c.type !== 'other')
            .map((c, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium ${SCRIPT_BG_LIGHT[c.type] ?? SCRIPT_BG[c.type]} ${sz.badge}`}
              >
                <span className={`jp ${sz.char}`}>{c.char}</span>
                <span className="opacity-70">{SCRIPT_LABEL[c.type]}</span>
              </span>
            ))}
        </div>
      )}
    </div>
  )
}
