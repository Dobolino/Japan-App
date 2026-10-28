import { describe, it, expect } from 'vitest'
import { createBackup, parseBackup } from './backup'
import { initialState, restoreState } from '@/store/persistence'
import { lemmaCard } from '@/types/review'
import { buildTrainingQuestions } from './training'
import { applyReview } from '@/store/reviewModel'
const envelope = () => JSON.parse(createBackup(initialState()))
describe('versioned backups', () => {
  it('round-trips progress, notes, preferences and actual history', () => {
    const base = initialState(),
      id = Object.keys(base.items)[0]
    const state = { ...base, ...applyReview(base, id, 2, 'event-1', new Date('2026-10-27T12:00:00Z')) }
    state.notebook[id] = {
      note: '日本reise',
      example: 'あ',
      tags: ['Reise'],
      updatedAt: new Date().toISOString(),
    }
    const result = parseBackup(createBackup(state))
    expect(result.state.items[id].correctCount).toBe(1)
    expect(result.state.dailyHistory['2026-10-27'].reviewed).toBe(1)
    expect(result.state.notebook[id].tags).toEqual(['Reise'])
    expect(result.xp).toBe(10)
  })
  it('ignores exported content definitions and restores current seed content', () => {
    const input = envelope(),
      id = Object.keys(input.state.items)[0]
    input.state.items[id].meaning = 'Falsche Übersetzung'
    expect(parseBackup(JSON.stringify(input)).state.items[id].meaning).not.toBe('Falsche Übersetzung')
  })
  it.each(['not-json', '{"format":"japp-backup","version":99}', '[]'])('rejects invalid format %s', (input) =>
    expect(() => parseBackup(input)).toThrow()
  )
  it.each(['xp', 'cardsReviewed', 'totalCorrect'])('rejects negative or fractional %s', (field) => {
    const input = envelope()
    input.state.progress[field] = -0.5
    expect(() => parseBackup(JSON.stringify(input))).toThrow()
  })
  it('rejects inconsistent counters', () => {
    const input = envelope()
    input.state.progress.totalCorrect = 2
    expect(() => parseBackup(JSON.stringify(input))).toThrow()
  })
  it('rejects unknown cards, invalid schedules and invalid settings', () => {
    const input = envelope()
    input.state.items.unknown = input.state.items[Object.keys(input.state.items)[0]]
    expect(() => parseBackup(JSON.stringify(input))).toThrow()
    delete input.state.items.unknown
    input.state.displayPrefs.theme = 'invalid'
    expect(() => parseBackup(JSON.stringify(input))).toThrow()
  })
  it('rejects prototype keys and will not replace store actions', () => {
    const input = envelope()
    input.state.rateReview = 'overwritten'
    const restored = parseBackup(JSON.stringify(input)).state
    expect('rateReview' in restored).toBe(false)
    expect(() => parseBackup('{"format":"japp-backup","version":1,"__proto__":{}}')).toThrow()
  })
  it('rejects files over the size limit before parsing', () =>
    expect(() => parseBackup(' '.repeat(5 * 1024 * 1024 + 1))).toThrow(/5 MB/))
  it('migrates a v3 learner without fabricating previous daily history', () => {
    const original = initialState(),
      id = Object.keys(original.items)[0]
    original.items[id].correctCount = 4
    original.items[id].lastReviewDate = '2026-10-20T10:00:00Z'
    original.progress.xp = 40
    const migrated = restoreState({
      items: original.items,
      progress: original.progress,
      displayPrefs: { theme: 'dark', showRomaji: false, showFurigana: true, dailyGoal: 20 },
    })
    expect(migrated.items[id].correctCount).toBe(4)
    expect(migrated.introducedIds).toContain(id)
    expect(migrated.dailyHistory).toEqual({})
    expect(migrated.progress.xp).toBe(40)
    expect(migrated.displayPrefs.theme).toBe('dark')
  })
  it('round-trips an answered training snapshot with its option order intact', () => {
    const state = initialState()
    const questions = buildTrainingQuestions('confusions', state).slice(0, 10)
    state.activityDrafts['training:confusions'] = {
      runId: 'training-run',
      index: 0,
      answers: [1],
      questionIds: questions.map((question) => question.id),
      questions,
    }
    expect(parseBackup(createBackup(state)).state.activityDrafts).toEqual(state.activityDrafts)
  })
  it('rebuilds resumed cards from trusted content and retains typed feedback', () => {
    const state = initialState()
    state.activeSession = {
      id: 'session',
      queue: [lemmaCard(state.items['h-a'])],
      index: 0,
      ratings: [],
      phase: 'answer',
      direction: 'de-jp',
      mode: 'srs',
      typed: 'a',
      correct: true,
      startedAt: new Date().toISOString(),
      retries: [],
    }
    const input = JSON.parse(createBackup(state))
    input.state.activeSession.queue[0].answerCharacter = 'wrong'
    const restored = parseBackup(JSON.stringify(input)).state.activeSession!
    expect(restored.queue[0].answerCharacter).toBe('あ')
    expect(restored.typed).toBe('a')
    expect(restored.phase).toBe('answer')
  })
  it('rejects out-of-range lesson and training positions before applying them', () => {
    const input = envelope()
    input.state.lessonDrafts['hiragana-0'] = { index: 5, stage: 'production', correct: 0, attempted: 0 }
    expect(() => parseBackup(JSON.stringify(input))).toThrow(/Lektionsposition/)
    input.state.lessonDrafts = {}
    input.state.activityDrafts['training:confusions'] = { index: 3, answers: [], questionIds: ['a'] }
    expect(() => parseBackup(JSON.stringify(input))).toThrow(/Trainingsposition/)
  })
  it('preserves grammar metadata when an imported backup contains altered definitions', () => {
    const input = envelope()
    const id = Object.keys(input.state.grammarSrs)[0]
    input.state.grammarSrs[id].grammarId = 'invalid'
    const restored = parseBackup(JSON.stringify(input)).state
    expect(restored.grammarSrs[id].grammarId).toBe(initialState().grammarSrs[id].grammarId)
  })
})
