import { useStore } from '@/store/useStore'
import type { ThemeMode } from '@/types'

const THEME_OPTIONS: { key: ThemeMode; label: string }[] = [
  { key: 'light', label: 'Hell' },
  { key: 'dark', label: 'Dunkel' },
  { key: 'system', label: 'System' },
]

/** Global display prefs: theme, furigana, romaji. */
export default function DisplaySettings() {
  const { displayPrefs, setDisplayPrefs } = useStore()

  return (
    <div className="card-surface w-full p-3 space-y-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
          Erscheinungsbild
        </p>
        <div className="flex gap-2">
          {THEME_OPTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setDisplayPrefs({ theme: key })}
              className={`flex-1 chip text-xs ${displayPrefs.theme === key ? 'chip--active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
          Lesehilfen
        </p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Furigana (über Kanji)</span>
            <input
              type="checkbox"
              checked={displayPrefs.showFurigana}
              onChange={(e) => setDisplayPrefs({ showFurigana: e.target.checked })}
              className="accent-[var(--green)] w-5 h-5"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Romaji (unter dem Text)</span>
            <input
              type="checkbox"
              checked={displayPrefs.showRomaji}
              onChange={(e) => setDisplayPrefs({ showRomaji: e.target.checked })}
              className="accent-[var(--blue)] w-5 h-5"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
