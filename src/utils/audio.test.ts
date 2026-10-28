import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
let completeSpeech = true
const spoken: { text: string; rate: number; lang: string }[] = []
async function loadAudio() {
  vi.resetModules()
  return import('./audio')
}
describe('audio sequences', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    completeSpeech = true
    spoken.length = 0
    vi.stubGlobal(
      'SpeechSynthesisUtterance',
      class {
        constructor(public text: string) {}
        lang = ''
        rate = 1
        volume = 1
        voice = null
        onend: (() => void) | null = null
        onerror: (() => void) | null = null
      }
    )
    vi.stubGlobal('speechSynthesis', {
      speak: vi.fn((voice: SpeechSynthesisUtterance) => {
        if (voice.volume === 0) return
        spoken.push({ text: voice.text, rate: voice.rate, lang: voice.lang })
        if (completeSpeech) setTimeout(() => voice.onend?.(new Event('end') as SpeechSynthesisEvent), 10)
      }),
      cancel: vi.fn(),
      getVoices: vi.fn(() => [{ lang: 'ja-JP', name: 'Japanese' }]),
    })
    vi.stubGlobal(
      'Audio',
      class {
        src = ''
        addEventListener(event: string, callback: () => void) {
          if (event === 'error') Promise.resolve().then(callback)
        }
        load() {}
      }
    )
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })
  it('unlocks the speech engine only once', async () => {
    const { unlockAudio, isAudioUnlocked } = await loadAudio()
    expect(isAudioUnlocked()).toBe(false)
    unlockAudio()
    unlockAudio()
    expect(isAudioUnlocked()).toBe(true)
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1)
  })
  it('falls back to Japanese speech and repeats at the requested tempo', async () => {
    const { playJapaneseSequence } = await loadAudio()
    const result = playJapaneseSequence('missing-audio', 'こんにちは', { rate: 0.8, repetitions: 3 })
    await vi.runAllTimersAsync()
    expect(await result).toBe('finished')
    expect(spoken).toHaveLength(3)
    expect(
      spoken.every(
        (voice) => voice.text === 'こんにちは' && voice.lang === 'ja-JP' && Math.abs(voice.rate - 0.72) < 1e-6
      )
    ).toBe(true)
  })
  it('cancels an active utterance and prevents all later repetitions', async () => {
    completeSpeech = false
    const { playJapaneseSequence, stopAudio } = await loadAudio()
    const result = playJapaneseSequence('missing-audio', 'あ', { repetitions: 5 })
    await vi.advanceTimersByTimeAsync(100)
    expect(spoken).toHaveLength(1)
    stopAudio()
    expect(await result).toBe('cancelled')
    await vi.runAllTimersAsync()
    expect(spoken).toHaveLength(1)
  })
  it('cancels during the pause between repetitions', async () => {
    const { playJapaneseSequence, stopAudio } = await loadAudio()
    const result = playJapaneseSequence('missing-audio', 'あ', { repetitions: 3 })
    await vi.advanceTimersByTimeAsync(100)
    stopAudio()
    expect(await result).toBe('cancelled')
    await vi.runAllTimersAsync()
    expect(spoken).toHaveLength(1)
  })
  it('reports unavailable when the device has neither MP3 nor speech support', async () => {
    vi.stubGlobal('speechSynthesis', undefined)
    const { playJapaneseSequence } = await loadAudio()
    const result = playJapaneseSequence('missing-audio', 'あ')
    await vi.runAllTimersAsync()
    expect(await result).toBe('unavailable')
  })
})
