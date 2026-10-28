import { create } from 'zustand'
import { registerSW } from 'virtual:pwa-register'

interface UpdateState {
  available: boolean
  checking: boolean
  message: string
}
export const useAppUpdate = create<UpdateState>(() => ({ available: false, checking: false, message: '' }))
let started = false
let registration: ServiceWorkerRegistration | undefined

export async function checkForAppUpdate(manual = true) {
  if (useAppUpdate.getState().checking) return
  if (!navigator.onLine) {
    if (manual)
      useAppUpdate.setState({ message: 'Du bist offline. Versuche es mit Internetverbindung erneut.' })
    return
  }
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) {
    if (manual)
      useAppUpdate.setState({ message: 'Hier ist keine installierte App-Aktualisierung verfügbar.' })
    return
  }
  useAppUpdate.setState({ checking: true, ...(manual ? { message: '' } : {}) })
  try {
    const current = registration ?? (await navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL))
    if (!current) {
      if (manual)
        useAppUpdate.setState({ message: 'Die App wird vorbereitet. Versuche es gleich noch einmal.' })
      return
    }
    await current.update()
    if (manual)
      useAppUpdate.setState({
        message: 'Nach Updates gesucht. Eine neue Version wird angezeigt, sobald sie geladen ist.',
      })
  } catch {
    if (manual)
      useAppUpdate.setState({
        message: 'Die Aktualisierung konnte nicht geprüft werden. Versuche es später erneut.',
      })
  } finally {
    useAppUpdate.setState({ checking: false })
  }
}

export function startAppUpdateChecks() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  if (!started) {
    started = true
    registerSW({
      immediate: true,
      // Activate the new cache, then let the learner choose when to reload the screen.
      onNeedReload: () => useAppUpdate.setState({ available: true, message: '' }),
      onRegisteredSW: (_url, value) => {
        registration = value
      },
      onRegisterError: () =>
        useAppUpdate.setState({
          message: 'Offline-Speicherung ist gerade nicht verfügbar. Du kannst die App weiter benutzen.',
        }),
    })
  }
  const check = () => {
    if (document.visibilityState === 'visible') void checkForAppUpdate(false)
  }
  window.addEventListener('pageshow', check)
  window.addEventListener('online', check)
  document.addEventListener('visibilitychange', check)
  const timer = window.setInterval(check, 10 * 60 * 1000)
  return () => {
    window.removeEventListener('pageshow', check)
    window.removeEventListener('online', check)
    document.removeEventListener('visibilitychange', check)
    window.clearInterval(timer)
  }
}
