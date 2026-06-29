import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { playJapanese, unlockAudio } from '@/utils/audio'
import { AudioIcon } from '@/components/icons/UiIcons'
import { tokenizeJapanese } from '@/utils/tokenize'
import { romajiFromReading } from '@/utils/kanaRomaji'
import { useStore } from '@/store/useStore'
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
  const navigate = useNavigate()
  const { pinForReview, unpinForReview, pinnedReviewIds } = useStore()
  const showRomaji = useStore((s) => s.displayPrefs.showRomaji)

  const speak = useCallback(() => {
    if (!audioId) return
    unlockAudio()
    playJapanese(audioId, text)
  }, [audioId, text])

  const romaji = reading ? romajiFromReading(reading, text) : ''

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
            isPinned={token.lemmaId ? pinnedReviewIds.includes(token.lemmaId) : false}
            onPin={() => {
              if (!token.lemmaId) return
              if (pinnedReviewIds.includes(token.lemmaId)) {
                unpinForReview(token.lemmaId)
              } else {
                pinForReview(token.lemmaId)
              }
            }}
            onPractice={() => navigate('/practice')}
          />
        ))}
      </div>

      {showRomaji && romaji && (
        <p className="text-center text-sm text-[var(--blue)] font-bold mt-3">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold block mb-0.5">
            Aussprache
          </span>
          {romaji}
        </p>
      )}

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
  isPinned,
  onPin,
  onPractice,
}: {
  token: Token
  open: boolean
  onToggle: () => void
  size: 'sentence' | 'compact'
  isPinned: boolean
  onPin: () => void
  onPractice: () => void
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
        className={`${chipClass} jp ${fontSize} font-medium px-1 py-0.5 rounded-lg transition-transform active:scale-95 ${isPinned ? 'ring-2 ring-[var(--green)]' : ''}`}
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
          {token.romaji && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Romaji: {token.romaji}</p>
          )}
          {token.meaning && (
            <p className="text-sm text-[var(--text-secondary)] font-semibold mt-1">{token.meaning}</p>
          )}
          {!token.meaning && !isParticle && (
            <p className="text-xs text-[var(--text-muted)] mt-1">Noch nicht im Wörterbuch</p>
          )}
          <div className="flex flex-col gap-1.5 mt-2">
            {token.lemmaId && (
              <>
                <Link to={`/learn/${token.lemmaId}`} className="action-chip text-xs inline-block text-center">
                  Im Lexikon →
                </Link>
                <button type="button" onClick={onPin} className="action-chip text-xs w-full">
                  {isPinned ? '✓ Gemerkt' : '+ Für Üben merken'}
                </button>
                {isPinned && (
                  <button type="button" onClick={onPractice} className="action-chip text-xs w-full">
                    Zur Übung →
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </span>
  )
}
