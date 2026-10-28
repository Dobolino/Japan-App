import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import DisplaySettings from '@/components/DisplaySettings'
import BackupSettings from '@/components/BackupSettings'
import { useStore } from '@/store/useStore'
import { checkForAppUpdate, useAppUpdate } from '@/hooks/useAppUpdate'

export default function SettingsPage() {
  const resetProgress = useStore((s) => s.resetProgress)
  const { available, checking, message } = useAppUpdate()
  return (
    <div className="scroll-area h-full">
      <div className="page-width settings-page">
        <Link to="/" className="text-link mb-5">
          ← Zur Startseite
        </Link>
        <PageHeader
          eyebrow="DEIN LERNALLTAG"
          title="So lernst du am liebsten."
          description="Passe dein Ziel und die Darstellung an dich an."
          showSettings={false}
        />
        <DisplaySettings />
        <div className="mt-5">
          <BackupSettings />
        </div>
        <section className="card-surface settings-section mt-5">
          <h2 className="settings-legend">Deine App-Version</h2>
          <p className="settings-help">
            Version {__APP_VERSION__} · Updates ändern deinen gespeicherten Lernstand nicht.
          </p>
          <button
            type="button"
            className="btn-duo btn-duo--outline"
            disabled={checking}
            onClick={() => void checkForAppUpdate()}
          >
            {checking ? 'Aktualisierung wird geprüft …' : 'Nach Aktualisierungen suchen'}
          </button>
          {available && (
            <button type="button" className="text-link mt-3" onClick={() => window.location.reload()}>
              Neue Version laden
            </button>
          )}
          {message && (
            <p role="status" className="settings-help mt-3">
              {message}
            </p>
          )}
        </section>
        <section className="card-surface settings-section mt-5">
          <h2 className="settings-legend">Auf diesem Gerät gespeichert</h2>
          <p className="settings-help">
            Dein Lernfortschritt wird in diesem Browser gespeichert. Wenn du die Browserdaten löschst oder das
            Gerät wechselst, wird er nicht automatisch übertragen.
          </p>
          <button
            type="button"
            className="btn-duo btn-duo--outline text-[var(--red)]"
            onClick={() => {
              if (
                window.confirm(
                  'Den gesamten Lernfortschritt auf diesem Gerät löschen? Das lässt sich nicht rückgängig machen.'
                )
              )
                resetProgress()
            }}
          >
            Fortschritt zurücksetzen
          </button>
        </section>
      </div>
    </div>
  )
}
