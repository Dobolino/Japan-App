import { useStore } from '@/store/useStore'
export function useReadingAids(text: string, force = false) {
  const prefs = useStore((state) => state.displayPrefs)
  const item = useStore((state) => Object.values(state.items).find((entry) => entry.character === text))
  const known = Boolean(
    prefs.adaptiveAids && item && item.correctCount >= 3 && item.correctCount > item.errorCount * 3
  )
  return {
    showRomaji: force || Boolean(prefs.showRomaji && !known),
    showFurigana: force || Boolean(prefs.showFurigana && !(known && item?.status === 'mastered')),
  }
}
