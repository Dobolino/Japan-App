import { describe, it, expect, vi } from 'vitest'
import { SyncConflict, uploadWithRevision } from './sync'
import { initialState } from '@/store/persistence'
import { parseBackup } from '@/utils/backup'
describe('future sync boundary', () => {
  it('passes a validated backup and the expected revision to its provider', async () => {
    const provider = {
      read: vi.fn(async () => ({ revision: 'r1', backup: '' })),
      write: vi.fn(async (backup: string) => ({ revision: 'r2', backup })),
    }
    const result = await uploadWithRevision(provider, initialState(), 'r1')
    expect(provider.write).toHaveBeenCalledWith(result.backup, 'r1')
    expect(parseBackup(result.backup).xp).toBe(0)
  })
  it('does not overwrite a remote change or deletion', async () => {
    for (const remote of [null, { revision: 'r2', backup: '' }]) {
      const provider = { read: vi.fn(async () => remote), write: vi.fn() }
      await expect(uploadWithRevision(provider, initialState(), 'r1')).rejects.toBeInstanceOf(SyncConflict)
      expect(provider.write).not.toHaveBeenCalled()
    }
  })
})
