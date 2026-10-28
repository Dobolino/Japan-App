import { beforeEach, describe, expect, it } from 'vitest'
import { useStore } from './useStore'
import { initialState } from './persistence'
import { lemmaCard } from '@/types/review'
import { createBackup, parseBackup } from '@/utils/backup'
function begin() {
  const state = useStore.getState()
  state.saveSession({
    id: 'run-1',
    queue: [lemmaCard(state.items['h-a']), lemmaCard(state.items['h-i'])],
    index: 0,
    ratings: [],
    phase: 'answer',
    direction: 'de-jp',
    mode: 'srs',
    typed: 'a',
    correct: true,
    startedAt: new Date().toISOString(),
    retries: [],
  })
}
describe('persisted study sessions', () => {
  beforeEach(() => useStore.setState(initialState()))
  it('advances and counts an answer once even on a repeated submit', () => {
    begin()
    useStore.getState().submitSessionRating(2)
    useStore.getState().submitSessionRating(2)
    const state = useStore.getState()
    expect(state.activeSession?.index).toBe(1)
    expect(state.progress.cardsReviewed).toBe(1)
    expect(state.items['h-a'].correctCount).toBe(1)
    expect(state.items['h-i'].correctCount).toBe(0)
  })
  it('schedules only one retry for the same failed card in a session', () => {
    begin()
    useStore.getState().submitSessionRating(0)
    let session = useStore.getState().activeSession!
    expect(session.queue).toHaveLength(3)
    expect(session.queue[2].srsId).toBe('h-a')
    useStore.getState().saveSession({ ...session, phase: 'answer' })
    useStore.getState().submitSessionRating(2)
    session = useStore.getState().activeSession!
    useStore.getState().saveSession({ ...session, phase: 'answer' })
    useStore.getState().submitSessionRating(0)
    session = useStore.getState().activeSession!
    expect(session.queue).toHaveLength(3)
    expect(session.phase).toBe('done')
    expect(useStore.getState().progress.cardsReviewed).toBe(3)
  })
  it('resumes an answered card after a backup round trip without counting it twice', () => {
    begin()
    const snapshot = parseBackup(createBackup(useStore.getState())).state
    useStore.setState(initialState())
    useStore.getState().replaceState(snapshot)
    expect(useStore.getState().activeSession?.typed).toBe('a')
    useStore.getState().submitSessionRating(2)
    useStore.getState().submitSessionRating(2)
    expect(useStore.getState().progress.xp).toBe(10)
  })
})
