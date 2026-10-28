import { useEffect, useState } from 'react'
import { storageState, useStore } from '@/store/useStore'
import { downloadBackup } from '@/utils/backup'
import { Link } from 'react-router-dom'
export default function StorageNotice() {
  const [failed, setFailed] = useState(storageState.failed)
  useEffect(() => {
    const fail = () => setFailed(true)
    const restored = () => setFailed(false)
    window.addEventListener('japp-storage-error', fail)
    window.addEventListener('japp-storage-restored', restored)
    return () => {
      window.removeEventListener('japp-storage-error', fail)
      window.removeEventListener('japp-storage-restored', restored)
    }
  }, [])
  return failed ? (
    <div role="alert" className="storage-notice">
      {storageState.damagedRaw ? (
        <>
          Dein gespeicherter Lernstand ist beschädigt und konnte nicht geladen werden. Du kannst in den{' '}
          <Link to="/settings" className="text-link">
            Einstellungen eine Sicherung importieren
          </Link>
          .
          <button
            type="button"
            className="text-link"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([storageState.damagedRaw!], { type: 'application/json' })
              )
              const link = document.createElement('a')
              link.href = url
              link.download = 'japp-beschaedigt.json'
              link.click()
              URL.revokeObjectURL(url)
            }}
          >
            Beschädigte Datei herunterladen
          </button>
        </>
      ) : (
        <>
          Dein Browser konnte die letzten Änderungen nicht speichern. Sichere deinen aktuellen Stand, bevor du
          die App schließt.
        </>
      )}
      <button type="button" className="text-link" onClick={() => downloadBackup(useStore.getState())}>
        Lernstand herunterladen
      </button>
    </div>
  ) : null
}
