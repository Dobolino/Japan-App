import { useState } from 'react'
import { storageState, useStore } from '@/store/useStore'
import { createBackup, parseBackup, downloadBackup, BACKUP_LIMIT } from '@/utils/backup'
import { persistentSnapshot, STORE_VERSION } from '@/store/persistence'
export default function BackupSettings() {
  const [preview, setPreview] = useState<ReturnType<typeof parseBackup> | null>(null),
    [message, setMessage] = useState(''),
    [error, setError] = useState('')
  const [recovery, setRecovery] = useState(false)
  const inspect = async (file: File | undefined) => {
    setPreview(null)
    setMessage('')
    setError('')
    if (!file) return
    try {
      if (file.size > BACKUP_LIMIT) throw new Error('Bitte eine Sicherung bis 5 MB auswählen.')
      setPreview(parseBackup(await file.text()))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Die Sicherung konnte nicht gelesen werden.')
    }
  }
  return (
    <section className="card-surface settings-section" aria-labelledby="backup-title">
      <h2 id="backup-title" className="settings-legend">
        Deinen Lernstand sichern
      </h2>
      <p className="settings-help">
        Die Datei enthält deinen Fortschritt, Lektionsstände, dein Lernheft und deine Einstellungen. Bewahre
        sie für einen Gerätewechsel auf.
      </p>
      <button
        type="button"
        className="btn-duo"
        onClick={() => {
          downloadBackup(useStore.getState())
          setMessage('Sicherungsdatei erstellt.')
        }}
      >
        Sicherung herunterladen
      </button>
      <label className="file-picker">
        Sicherungsdatei auswählen
        <input
          type="file"
          accept="application/json,.json"
          aria-label="Sicherungsdatei auswählen"
          onChange={(event) => void inspect(event.target.files?.[0])}
        />
      </label>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="form-success">
          {message}
        </p>
      )}
      {preview && (
        <div className="panel-muted p-4 mt-4">
          <h3 className="font-semibold">Sicherung prüfen</h3>
          <p className="text-sm my-3">
            {new Date(preview.createdAt).toLocaleString('de-CH')}
            <br />
            {preview.reviewed} Bewertungen · {preview.xp} XP · {preview.notes} Notizen
          </p>
          <p className="settings-help">
            Beim Import wird der aktuelle Stand ersetzt. Eine Wiederherstellungskopie wird vorher auf diesem
            Gerät gespeichert.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-duo"
              onClick={() => {
                try {
                  localStorage.setItem('japp-recovery', createBackup(useStore.getState()))
                  // Confirm the replacement can be persisted before changing in-memory state.
                  localStorage.setItem(
                    'japp-store',
                    JSON.stringify({ version: STORE_VERSION, state: persistentSnapshot(preview.state) })
                  )
                  useStore.getState().replaceState(preview.state)
                  storageState.failed = false
                  storageState.damagedRaw = null
                  window.dispatchEvent(new CustomEvent('japp-storage-restored'))
                  setPreview(null)
                  setRecovery(true)
                  setMessage(
                    'Sicherung importiert. Deine vorherigen Daten lassen sich unten wiederherstellen.'
                  )
                } catch {
                  setError(
                    'Der Import konnte nicht gespeichert werden. Dein bisheriger Lernstand bleibt aktiv.'
                  )
                }
              }}
            >
              Importieren und aktuellen Stand ersetzen
            </button>
            <button type="button" className="btn-duo btn-duo--outline" onClick={() => setPreview(null)}>
              Abbrechen
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        className="text-link mt-3"
        onClick={() => {
          setError('')
          setMessage('')
          try {
            const raw = localStorage.getItem('japp-recovery')
            if (!raw) throw new Error('Es gibt noch keine Wiederherstellungskopie.')
            setPreview(parseBackup(raw))
            setRecovery(true)
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Keine Wiederherstellung möglich.')
          }
        }}
      >
        {recovery ? 'Vorherigen Lernstand wiederherstellen' : 'Wiederherstellungskopie prüfen'}
      </button>
    </section>
  )
}
