import { groupSegments, analyzeScript, SCRIPT_BG, SCRIPT_COLOR, SCRIPT_LABEL } from '@/utils/scriptAnalyzer'

interface Props {
  text: string
  showBreakdown?: boolean
}

export default function ScriptAnalysis({ text, showBreakdown = true }: Props) {
  const groups = groupSegments(text)
  const chars = analyzeScript(text)
  const hasMultiple = new Set(chars.map(c => c.type)).size > 1

  if (!hasMultiple && !showBreakdown) return null

  return (
    <div className="space-y-2">
      {/* Colored inline display */}
      <div className="flex flex-wrap gap-1 items-baseline">
        {groups.map((g, i) => (
          <span key={i} className={`text-2xl jp font-medium ${SCRIPT_COLOR[g.type]}`}>
            {g.text}
          </span>
        ))}
      </div>

      {/* Per-character breakdown */}
      {showBreakdown && chars.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chars.filter(c => c.type !== 'other').map((c, i) => (
            <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${SCRIPT_BG[c.type]}`}>
              <span className="jp text-sm">{c.char}</span>
              <span className="opacity-70">{SCRIPT_LABEL[c.type]}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
