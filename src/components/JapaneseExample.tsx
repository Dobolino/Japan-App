import RubyText from '@/components/RubyText'
import { useStore } from '@/store/useStore'
import { romajiFromReading } from '@/utils/kanaRomaji'
import { AudioIcon } from '@/components/icons/UiIcons'
import { playJapanese, unlockAudio } from '@/utils/audio'

interface Props {
  jp: string
  reading: string
  de: string
  audioId?: string
  size?: 'compact' | 'sentence'
  /** Show German meaning line */
  showMeaning?: boolean
  className?: string
}

/**
 * Clear Japanese example layout for learners:
 * 1. Kanji line (small furigana above kanji = how to read that kanji)
 * 2. Aussprache in Romaji (Latin letters)
 * 3. Deutsche Übersetzung
 *
 * When furigana is off, shows full hiragana reading instead of ruby.
 */
export default function JapaneseExample({
  jp,
  reading,
  de,
  audioId,
  size = 'compact',
  showMeaning = true,
  className = '',
}: Props) {
  const { showFurigana } = useStore((s) => s.displayPrefs)
  const romaji = romajiFromReading(reading, jp)
  const sizeClass = size === 'sentence' ? 'jp-sentence' : 'jp-compact'

  const speak = () => {
    if (!audioId) return
    unlockAudio()
    playJapanese(audioId, jp)
  }

  return (
    <div className={`japanese-example ${className}`.trim()}>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          {showFurigana ? (
            <>
              <RubyText text={jp} reading={reading} size={size} showRomaji={false} />
              <p className="text-[10px] text-[var(--text-muted)] mt-1 font-semibold">
                Kleine Zeichen über Kanji = Furigana (Lesung)
              </p>
            </>
          ) : (
            <div>
              <p className={`jp font-bold text-[var(--text-primary)] ${sizeClass}`}>{jp}</p>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mt-1.5 font-bold">
                Lesung (Hiragana)
              </p>
              <p className="jp text-sm text-[var(--blue)] font-semibold">{reading}</p>
            </div>
          )}

          {romaji && (
            <div className="mt-2 pt-2 border-t border-[var(--border)]">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                Aussprache (Romaji)
              </p>
              <p className="text-sm text-[var(--blue)] font-bold mt-0.5">{romaji}</p>
            </div>
          )}

          {showMeaning && (
            <div className="mt-2">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Deutsch</p>
              <p className="text-sm text-[var(--text-secondary)] font-semibold mt-0.5">{de}</p>
            </div>
          )}
        </div>

        {audioId && (
          <button type="button" onClick={speak} className="audio-fab audio-fab--sm shrink-0 mt-0.5" aria-label="Anhören">
            <AudioIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
