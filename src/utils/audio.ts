/** Japanese audio: MP3 if available, else Web Speech (works without pre-generated files). */

let unlocked = false
let currentAudio: HTMLAudioElement | null = null
const mp3Known = new Map<string, boolean>()

/** Call on first user interaction — required for iOS audio/TTS. */
export function unlockAudio(): void {
  if (unlocked) return
  unlocked = true

  // Prime speech synthesis (iOS Safari)
  if (typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined') {
    speechSynthesis.getVoices()
    const silent = new SpeechSynthesisUtterance('\u200b')
    silent.volume = 0
    speechSynthesis.speak(silent)
    speechSynthesis.cancel()
  }

  // Prime HTMLAudio
  if (typeof Audio !== 'undefined') {
    const probe = new Audio()
    probe.volume = 0.01
    probe.src =
      'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAA='
    void probe.play().catch(() => {})
  }
}

export function isAudioUnlocked(): boolean {
  return unlocked
}

function mp3Url(id: string): string {
  return `${import.meta.env.BASE_URL}audio/${encodeURIComponent(id)}.mp3`
}

function getJapaneseVoice(): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === 'ja-JP') ??
    voices.find((v) => v.lang.startsWith('ja')) ??
    undefined
  )
}

function speakWithTTS(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof speechSynthesis === 'undefined') {
      resolve()
      return
    }

    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 0.9
    const voice = getJapaneseVoice()
    if (voice) utterance.voice = voice

    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()

    // iOS needs a short delay after cancel
    globalThis.setTimeout(() => speechSynthesis.speak(utterance), 50)
  })
}

function stopCurrent(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.src = ''
    currentAudio = null
  }
  speechSynthesis.cancel()
}

async function tryMp3(src: string): Promise<boolean> {
  if (typeof Audio === 'undefined') return false
  if (mp3Known.has(src)) return mp3Known.get(src)!

  return new Promise((resolve) => {
    const audio = new Audio()
    let settled = false

    const finish = (ok: boolean) => {
      if (settled) return
      settled = true
      mp3Known.set(src, ok)
      resolve(ok)
    }

    audio.addEventListener('canplaythrough', () => finish(true), { once: true })
    audio.addEventListener('error', () => finish(false), { once: true })
    audio.src = src
    audio.load()
    globalThis.setTimeout(() => finish(false), 1200)
  })
}

async function playMp3(src: string): Promise<boolean> {
  if (typeof Audio === 'undefined') return false
  try {
    const audio = new Audio(src)
    currentAudio = audio
    await audio.play()
    return true
  } catch {
    return false
  }
}

async function playJapaneseAsync(id: string, text: string): Promise<void> {
  const trimmed = text?.trim()
  if (!trimmed) return

  stopCurrent()

  const src = mp3Url(id)
  const hasMp3 = await tryMp3(src)
  if (hasMp3 && (await playMp3(src))) return

  await speakWithTTS(trimmed)
}

/** Play pronunciation for a learning item or example. */
export function playJapanese(id: string, text: string): void {
  void playJapaneseAsync(id, text)
}

// Preload voices when available (Chrome / Safari)
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => getJapaneseVoice()
  speechSynthesis.getVoices()
}
