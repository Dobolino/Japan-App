import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

async function loadAudio() {
  vi.resetModules()
  return import('./audio')
}

describe('audio', () => {
  beforeEach(() => {
    vi.stubGlobal('SpeechSynthesisUtterance', class {
      lang = ''
      rate = 1
      volume = 1
      voice = null
      onend: (() => void) | null = null
      onerror: (() => void) | null = null
    })
    vi.stubGlobal('speechSynthesis', {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => [{ lang: 'ja-JP', name: 'Japanese' }]),
      onvoiceschanged: null,
    })
    vi.stubGlobal('Audio', class {
      src = ''
      volume = 1
      addEventListener(event: string, cb: () => void) {
        if (event === 'error') queueMicrotask(() => cb())
      }
      load() {}
      play() {
        return Promise.reject(new Error('no mp3'))
      }
      pause() {}
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('unlockAudio marks audio as ready', async () => {
    const { unlockAudio, isAudioUnlocked } = await loadAudio()
    expect(isAudioUnlocked()).toBe(false)
    unlockAudio()
    expect(isAudioUnlocked()).toBe(true)
  })

  it('playJapanese uses speech synthesis for missing MP3', async () => {
    const { playJapanese } = await loadAudio()
    playJapanese('h-a', 'あ')
    await new Promise((r) => setTimeout(r, 100))
    expect(speechSynthesis.speak).toHaveBeenCalled()
  })
})
