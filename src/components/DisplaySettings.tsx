import { useStore } from '@/store/useStore'

/** Global Furigana / Romaji display toggles (Home + all readers). */
export default function DisplaySettings() {
  const { displayPrefs, setDisplayPrefs } = useStore()

  return (
    <div className="card-surface w-full p-3">
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
  )
}
