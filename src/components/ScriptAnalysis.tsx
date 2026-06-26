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
          <span key={i} className={`jp font-medium ${SCRIPT_COLOR[g.type]} ${sz.inline}`}>
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
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium ${SCRIPT_BG[c.type]} ${sz.badge}`}
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
