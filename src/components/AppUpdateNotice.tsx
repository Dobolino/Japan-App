import { useEffect } from 'react'
import { startAppUpdateChecks, useAppUpdate } from '@/hooks/useAppUpdate'

export default function AppUpdateNotice() {
  const available = useAppUpdate((state) => state.available)
  useEffect(startAppUpdateChecks, [])
  return available ? (
    <div className="app-update-notice" role="status">
      <p>Eine neue Version ist bereit. Dein Lernstand bleibt beim Neuladen erhalten.</p>
      <button type="button" className="text-link" onClick={() => window.location.reload()}>
        Jetzt aktualisieren
      </button>
    </div>
  ) : null
}
