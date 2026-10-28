import RubyText from './RubyText'
import { romajiFromReading } from '@/utils/kanaRomaji'
import { AudioIcon } from './icons/UiIcons'
import { playJapanese, unlockAudio } from '@/utils/audio'
interface Props {
  jp: string
  reading: string
  de: string
  audioId?: string
  size?: 'compact' | 'sentence'
  showMeaning?: boolean
  className?: string
}
export default function JapaneseExample({
  jp,
  reading,
  de,
  audioId,
  size = 'compact',
  showMeaning = true,
  className = '',
}: Props) {
  return (
    <div className={`japanese-example ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <RubyText text={jp} reading={reading} romaji={romajiFromReading(reading, jp)} size={size} />
          {showMeaning && <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">{de}</p>}
        </div>
        {audioId && (
          <button
            type="button"
            className="audio-fab shrink-0"
            aria-label="Anhören"
            onClick={() => {
              unlockAudio()
              playJapanese(audioId, jp)
            }}
          >
            <AudioIcon />
          </button>
        )}
      </div>
    </div>
  )
}
