import type { PersistentState } from '@/store/types'
/** Provider-neutral boundary for a future account service. No network or login is enabled. */
export interface RemoteSnapshot {
  revision: string
  backup: string
}
export interface SyncProvider {
  read(): Promise<RemoteSnapshot | null>
  write(backup: string, expectedRevision: string | null): Promise<RemoteSnapshot>
}
export class SyncConflict extends Error {
  constructor(public readonly remote: RemoteSnapshot | null) {
    super('Der entfernte Lernstand wurde zwischenzeitlich geändert.')
  }
}
export async function uploadWithRevision(
  provider: SyncProvider,
  state: PersistentState,
  revision: string | null
) {
  const { createBackup } = await import('@/utils/backup')
  const remote = await provider.read()
  if ((remote?.revision ?? null) !== revision) throw new SyncConflict(remote)
  // The eventual provider must also enforce this comparison atomically on its server.
  return provider.write(createBackup(state), revision)
}
