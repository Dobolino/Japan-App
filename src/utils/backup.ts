import type { PersistentState, ScheduleState, SessionSnapshot } from '@/store/types'
import { restoreState, persistentSnapshot, scheduleFields } from '@/store/persistence'
import { catalogById } from '@/data/catalog'
import { lessonById } from '@/data/curriculum'
import { grammarData } from '@/data/grammar'
import { stories } from '@/data/stories'
import { lemmaCard, sentenceCard, grammarSentenceCard } from '@/types/review'
export const BACKUP_LIMIT = 5 * 1024 * 1024
function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error(`${label}: Objekt erwartet.`)
  const result = value as Record<string, unknown>
  if (Object.keys(result).some((key) => ['__proto__', 'constructor', 'prototype'].includes(key)))
    throw new Error('Ungültiger Schlüssel.')
  return result
}
function number(value: unknown, label: string, max = 1e9) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max)
    throw new Error(`${label}: ungültige Zahl.`)
}
function text(value: unknown, label: string, max = 10000) {
  if (typeof value !== 'string' || value.length > max) throw new Error(`${label}: ungültiger Text.`)
}
function date(value: unknown, label: string) {
  text(value, label, 40)
  if (!/^\d{4}-\d\d-\d\dT/.test(value as string) || !Number.isFinite(Date.parse(value as string)))
    throw new Error(`${label}: ungültiges Datum.`)
}
function strings(value: unknown, label: string, max = 1000) {
  if (
    !Array.isArray(value) ||
    value.length > max ||
    value.some((item) => typeof item !== 'string' || item.length > 200)
  )
    throw new Error(`${label}: ungültige Liste.`)
  return value as string[]
}
function schedule(value: unknown): ScheduleState {
  const entry = record(value, 'Wiederholungsstand')
  if (!['new', 'learning', 'uncertain', 'mastered'].includes(String(entry.status)))
    throw new Error('Ungültiger Lernstatus.')
  for (const field of ['easeFactor', 'interval', 'repetitions', 'errorCount', 'correctCount'])
    number(entry[field], field, field === 'easeFactor' ? 5 : 1e7)
  for (const field of ['repetitions', 'errorCount', 'correctCount'])
    if (!Number.isInteger(entry[field])) throw new Error('Ungültiger Wiederholungszähler.')
  if (Number(entry.easeFactor) < 1) throw new Error('Ungültiger Lernfaktor.')
  date(entry.nextReviewDate, 'Nächster Termin')
  if (entry.lastReviewDate !== null) date(entry.lastReviewDate, 'Letzte Bewertung')
  return entry as unknown as ScheduleState
}
function restoreSession(raw: unknown, state: PersistentState): SessionSnapshot | null {
  if (raw === null || raw === undefined) return null
  const session = record(raw, 'Sitzung')
  text(session.id, 'Sitzungs-ID', 100)
  date(session.startedAt, 'Sitzungsbeginn')
  if (
    !['question', 'answer', 'done'].includes(String(session.phase)) ||
    !['de-jp', 'jp-de'].includes(String(session.direction)) ||
    !['srs', 'flashcard'].includes(String(session.mode))
  )
    throw new Error('Ungültiger Sitzungsmodus.')
  if (!Array.isArray(session.queue) || session.queue.length < 1 || session.queue.length > 100)
    throw new Error('Ungültige Warteschlange.')
  const queue = session.queue.map((rawCard) => {
    const card = record(rawCard, 'Karte')
    text(card.srsId, 'Karten-ID', 150)
    text(card.cardId, 'Kartenkennung', 200)
    const id = String(card.srsId)
    let rebuilt
    if (id.startsWith('grammar:')) {
      const entry = state.grammarSrs[id],
        point = grammarData.find((g) => g.id === entry?.grammarId)
      if (point && entry)
        rebuilt = grammarSentenceCard(point, entry.exampleIndex, point.examples[entry.exampleIndex])
    } else if (id.endsWith(':ex')) {
      const item = state.items[id.slice(0, -3)]
      if (item) rebuilt = sentenceCard(item)
    } else if (state.items[id]) rebuilt = lemmaCard(state.items[id])
    if (!rebuilt) throw new Error('Unbekannte Karte in der Sitzung.')
    return { ...rebuilt, cardId: String(card.cardId) }
  })
  number(session.index, 'Kartenposition', queue.length)
  if (!Number.isInteger(session.index)) throw new Error('Ungültige Kartenposition.')
  if (
    !Array.isArray(session.ratings) ||
    session.ratings.length !== session.index ||
    session.ratings.some((r) => ![0, 1, 2, 3].includes(r))
  )
    throw new Error('Ungültige Sitzungsbewertungen.')
  if ((session.phase === 'done') !== (session.index === queue.length))
    throw new Error('Sitzungsstatus und Position passen nicht zusammen.')
  if (session.correct !== null && typeof session.correct !== 'boolean')
    throw new Error('Ungültige Antwortauswertung.')
  text(session.typed, 'Eingabe')
  if (strings(session.retries, 'Fehlerrunde', 100).some((id) => !queue.some((card) => card.srsId === id)))
    throw new Error('Unbekannte Karte in der Fehlerrunde.')
  return { ...session, queue } as unknown as SessionSnapshot
}
export function createBackup(state: PersistentState) {
  const snapshot = persistentSnapshot(state)
  const items = Object.fromEntries(
    Object.entries(snapshot.items).map(([id, item]) => [
      id,
      Object.fromEntries(scheduleFields.map((key) => [key, item[key]])),
    ])
  )
  return JSON.stringify(
    { format: 'japp-backup', version: 1, createdAt: new Date().toISOString(), state: { ...snapshot, items } },
    null,
    2
  )
}
export function parseBackup(contents: string): {
  state: PersistentState
  createdAt: string
  reviewed: number
  notes: number
  xp: number
} {
  if (new TextEncoder().encode(contents).length > BACKUP_LIMIT)
    throw new Error('Die Datei ist größer als 5 MB.')
  let parsed: unknown
  try {
    parsed = JSON.parse(contents)
  } catch {
    throw new Error('Die Datei enthält kein gültiges JSON.')
  }
  const envelope = record(parsed, 'Sicherung')
  if (envelope.format !== 'japp-backup' || envelope.version !== 1)
    throw new Error('Dieses Sicherungsformat oder diese Version wird nicht unterstützt.')
  date(envelope.createdAt, 'Sicherungsdatum')
  const source = record(envelope.state, 'Lernstand'),
    items = record(source.items, 'Inhalte'),
    grammar = record(source.grammarSrs, 'Grammatik')
  for (const [id, item] of Object.entries(items)) {
    if (!catalogById[id]) throw new Error(`Unbekannter Inhalt: ${id}`)
    schedule(item)
  }
  const state = restoreState(source)
  for (const [id, entry] of Object.entries(grammar)) {
    if (!state.grammarSrs[id] || !/^grammar:g-[\w-]+:\d+$/.test(id))
      throw new Error('Unbekannte Grammatikkarte.')
    schedule(entry)
  }
  for (const [id, entry] of Object.entries(record(source.exampleSrs ?? {}, 'Beispiele'))) {
    if (!id.endsWith(':ex') || !catalogById[id.slice(0, -3)]?.exampleWord)
      throw new Error('Unbekanntes Beispiel.')
    schedule(entry)
  }
  const progress = record(source.progress, 'Fortschritt')
  for (const key of [
    'studySessions',
    'cardsReviewed',
    'currentStreak',
    'longestStreak',
    'totalCorrect',
    'totalErrors',
    'xp',
    'level',
    'todayCorrect',
  ]) {
    number(progress[key], key)
    if (!Number.isInteger(progress[key])) throw new Error('Ungültiger Zähler.')
  }
  if (Number(progress.totalCorrect) + Number(progress.totalErrors) !== Number(progress.cardsReviewed))
    throw new Error('Bewertungen und Antwortzähler passen nicht zusammen.')
  if (progress.lastStudyDate !== null) date(progress.lastStudyDate, 'Letzter Lerntag')
  if (progress.todayDate !== null && !/^\d{4}-\d\d-\d\d$/.test(String(progress.todayDate)))
    throw new Error('Ungültiger Lerntag.')
  const prefs = record(source.displayPrefs, 'Einstellungen')
  if (
    !['light', 'dark', 'system'].includes(String(prefs.theme)) ||
    ![10, 20, 30].includes(Number(prefs.dailyGoal)) ||
    typeof prefs.showRomaji !== 'boolean' ||
    typeof prefs.showFurigana !== 'boolean' ||
    (prefs.adaptiveAids !== undefined && typeof prefs.adaptiveAids !== 'boolean')
  )
    throw new Error('Ungültige Einstellungen.')
  if (
    !['hiragana', 'katakana', 'kanji', 'vocabulary'].includes(String(source.activeCategory)) ||
    !['foundation', 'travel', 'jlpt'].includes(String(source.learningGoal))
  )
    throw new Error('Ungültiges Lernziel.')
  for (const key of ['introducedIds', 'pinnedReviewIds'])
    if (strings(source[key], key).some((id) => !catalogById[id]))
      throw new Error('Unbekannter Lerninhalt in der Auswahl.')
  if (
    strings(source.introducedGrammarIds, 'Grammatikauswahl').some(
      (id) => !grammarData.some((point) => point.id === id)
    )
  )
    throw new Error('Unbekannte Grammatik.')
  const completed = strings(record(source.storyProgress, 'Lesefortschritt').completed, 'Geschichten')
  if (completed.some((id) => !stories.some((story) => story.id === id)))
    throw new Error('Ungültige Geschichte.')
  for (const [id, raw] of Object.entries(record(source.notebook, 'Lernheft'))) {
    if (!catalogById[id]) throw new Error('Unbekannter Lernheft-Eintrag.')
    const entry = record(raw, 'Notiz')
    text(entry.note, 'Notiz', 5000)
    text(entry.example, 'Eigener Beispielsatz', 2000)
    strings(entry.tags, 'Sammlungen', 20)
    date(entry.updatedAt, 'Notizdatum')
  }
  for (const key of ['completedLessons', 'trainingResults'])
    for (const [id, raw] of Object.entries(record(source[key], key))) {
      if (key === 'completedLessons' && !lessonById[id]) throw new Error('Unbekannte Lektion.')
      const result = record(raw, 'Lernergebnis')
      number(result.correct, 'Richtig')
      number(result.total, 'Gesamt')
      if (
        !Number.isInteger(result.correct) ||
        !Number.isInteger(result.total) ||
        Number(result.correct) > Number(result.total)
      )
        throw new Error('Ungültiges Lernergebnis.')
      date(result.completedAt, 'Abschlussdatum')
    }
  for (const [id, raw] of Object.entries(record(source.lessonDrafts, 'Lektionsstand'))) {
    const draft = record(raw, 'Lektionsstand')
    if (!lessonById[id] || !['intro', 'recognition', 'production'].includes(String(draft.stage)))
      throw new Error('Ungültiger Lektionsstand.')
    const lesson = lessonById[id]
    const count =
      lesson.category === 'grammar'
        ? grammarData
            .filter((point) => lesson.grammarIds?.includes(point.id))
            .reduce((sum, point) => sum + point.examples.length, 0)
        : lesson.itemIds.length
    for (const field of ['index', 'correct', 'attempted']) {
      number(draft[field], field, count * 2)
      if (!Number.isInteger(draft[field])) throw new Error('Ungültiger Lektionszähler.')
    }
    if (Number(draft.index) >= count || Number(draft.correct) > Number(draft.attempted))
      throw new Error('Ungültige Lektionsposition.')
    if (draft.feedback !== undefined && draft.feedback !== null && typeof draft.feedback !== 'boolean')
      throw new Error('Ungültige Lektionsantwort.')
    if (draft.typed !== undefined) text(draft.typed, 'Lektionseingabe')
    if (draft.runId !== undefined) text(draft.runId, 'Lektions-ID', 100)
  }
  for (const [day, raw] of Object.entries(record(source.dailyHistory, 'Lernverlauf'))) {
    if (!/^\d{4}-\d\d-\d\d$/.test(day)) throw new Error('Ungültiges Verlaufsdatum.')
    const entry = record(raw, 'Lerntag')
    for (const field of ['reviewed', 'correct', 'xp']) number(entry[field], field)
    if (['reviewed', 'correct', 'xp'].some((field) => !Number.isInteger(entry[field])))
      throw new Error('Ungültiger Tageszähler.')
    if (Number(entry.correct) > Number(entry.reviewed)) throw new Error('Ungültiger Tagesverlauf.')
  }
  if (!Array.isArray(source.events) || source.events.length > 5000)
    throw new Error('Ungültiges Lernprotokoll.')
  const ids = new Set<string>()
  for (const raw of source.events) {
    const event = record(raw, 'Lernereignis')
    text(event.id, 'Ereignis-ID', 200)
    text(event.srsId, 'Lern-ID', 200)
    date(event.at, 'Ereignisdatum')
    if (![0, 1, 2, 3].includes(Number(event.rating)) || ids.has(String(event.id)))
      throw new Error('Ungültiges oder doppeltes Lernereignis.')
    ids.add(String(event.id))
  }
  for (const [id, raw] of Object.entries(record(source.activityDrafts ?? {}, 'Trainingsstände'))) {
    const draft = record(raw, 'Trainingsstand')
    number(draft.index, 'Aufgabe', 1000)
    if (!Number.isInteger(draft.index)) throw new Error('Ungültige Aufgabenposition.')
    if (
      !Array.isArray(draft.answers) ||
      draft.answers.some((answer) => !Number.isInteger(answer) || Number(answer) < 0 || Number(answer) > 20)
    )
      throw new Error('Ungültige Trainingsantworten.')
    const questionIds = strings(draft.questionIds, 'Trainingsfragen', 10)
    if (new Set(questionIds).size !== questionIds.length) throw new Error('Doppelte Trainingsfragen.')
    if (draft.runId !== undefined) text(draft.runId, 'Trainings-ID', 100)
    if (draft.questions !== undefined) {
      if (!Array.isArray(draft.questions) || draft.questions.length !== questionIds.length)
        throw new Error('Ungültige Trainingsaufgaben.')
      for (const rawQuestion of draft.questions) {
        const question = record(rawQuestion, 'Trainingsaufgabe')
        text(question.id, 'Aufgaben-ID', 200)
        text(question.prompt, 'Aufgabe')
        text(question.explanation, 'Erklärung')
        const choices = strings(question.choices, 'Antwortmöglichkeiten', 20)
        if (
          !Number.isInteger(question.answer) ||
          Number(question.answer) < 0 ||
          Number(question.answer) >= choices.length
        )
          throw new Error('Ungültige richtige Antwort.')
        if (question.jp !== undefined) text(question.jp, 'Japanischer Satz')
        if (question.reading !== undefined) text(question.reading, 'Lesung')
      }
      const questions = draft.questions as { id: string; choices: string[] }[]
      if (questions.some((question, index) => question.id !== questionIds[index]))
        throw new Error('Trainingsfragen passen nicht zur Reihenfolge.')
      if (
        draft.answers.some(
          (answer, index) => !questions[index] || Number(answer) >= questions[index].choices.length
        )
      )
        throw new Error('Ungültige Antwortauswahl.')
    }
    if (id.startsWith('reader:')) {
      const story = stories.find((story) => story.id === id.slice(7))
      if (!story || Number(draft.index) > story.lines.length || draft.answers.length || questionIds.length)
        throw new Error('Ungültiger Lesestand.')
    } else if (
      !questionIds.length ||
      Number(draft.index) > questionIds.length ||
      draft.answers.length < Number(draft.index) ||
      draft.answers.length > Math.min(questionIds.length, Number(draft.index) + 1)
    )
      throw new Error('Trainingsposition und Antworten passen nicht zusammen.')
  }
  state.activeSession = restoreSession(source.activeSession, state)
  return {
    state,
    createdAt: String(envelope.createdAt),
    reviewed: state.progress.cardsReviewed,
    notes: Object.keys(state.notebook).length,
    xp: state.progress.xp,
  }
}
export function downloadBackup(state: PersistentState) {
  const url = URL.createObjectURL(new Blob([createBackup(state)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `japp-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}
