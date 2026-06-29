import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { playJapanese, unlockAudio } from '@/utils/audio'
import { AudioIcon } from '@/components/icons/UiIcons'
import { tokenizeJapanese } from '@/utils/tokenize'
import type { Token } from '@/types/token'

interface Props {
  text: string
  reading?: string
  audioId?: string
  size?: 'sentence' | 'compact'
  className?: string
}

export default function TappableSentence({
  text,
  reading,
  audioId,
  size = 'sentence',
  className = '',
}: Props) {
  const tokens = tokenizeJapanese(text, reading)
  const [active, setActive] = useState<number | null>(null)

  const speak = useCallback(() => {
    if (!audioId) return
    unlockAudio()
    playJapanese(audioId, text)
  }, [audioId, text])

  return (
    <div className={`tappable-sentence ${className}`.trim()}>
      <div className="flex flex-wrap items-baseline justify-center gap-x-0.5 gap-y-2 leading-relaxed">
        {tokens.map((token, i) => (
          <TokenChip
            key={`${i}-${token.surface}`}
            token={token}
            open={active === i}
            onToggle={() => setActive(active === i ? null : i)}
            size={size}
          />
        ))}
      </div>

      {audioId && (
        <div className="mt-3 flex justify-center">
          <button type="button" onClick={speak} className="audio-fab audio-fab--sm" aria-label="Anhören">
            <AudioIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

function TokenChip({
  token,
  open,
  onToggle,
  size,
}: {
  token: Token
  open: boolean
  onToggle: () => void
  size: 'sentence' | 'compact'
}) {
  const isParticle = token.pos === 'particle'
  const chipClass = isParticle
    ? 'token-chip token-chip--particle'
    : token.lemmaId
      ? 'token-chip token-chip--known'
      : 'token-chip'

  const fontSize = size === 'sentence' ? 'text-lg sm:text-xl' : 'text-base'

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={onToggle}
        className={`${chipClass} jp ${fontSize} font-medium px-1 py-0.5 rounded-lg transition-transform active:scale-95`}
        aria-expanded={open}
      >
        {token.surface}
      </button>

      {open && (
        <div className="token-popover" role="tooltip">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold mb-1">
            {isParticle ? 'Partikel' : 'Wort'}
          </p>
          <p className="jp text-lg font-bold text-[var(--text-primary)]">{token.surface}</p>
          {token.reading && token.reading !== token.surface && (
            <p className="text-sm text-[var(--blue)] font-semibold mt-0.5">{token.reading}</p>
          )}
          {token.romaji && <p className="text-xs text-[var(--text-muted)]">{token.romaji}</p>}
          {token.meaning && (
            <p className="text-sm text-[var(--text-secondary)] font-semibold mt-1">{token.meaning}</p>
          )}
          {!token.meaning && !isParticle && (
            <p className="text-xs text-[var(--text-muted)] mt-1">Noch nicht im Wörterbuch</p>
          )}
          {token.lemmaId && (
            <Link to={`/learn/${token.lemmaId}`} className="action-chip mt-2 text-xs inline-block">
              Im Lexikon →
            </Link>
          )}
        </div>
      )}
    </span>
  )
}
