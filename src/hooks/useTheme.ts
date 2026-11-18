import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import type { ThemeMode } from '@/types'

export function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

/** Applies light/dark theme to document root from store preference. */
export function useTheme() {
  const theme = useStore((s) => s.displayPrefs.theme ?? 'light')

  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(theme)
      document.documentElement.dataset.theme = resolved
      document.documentElement.style.colorScheme = resolved
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', resolved === 'dark' ? '#1d2228' : '#fbf8f3')
    }

    apply()

    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])
}
