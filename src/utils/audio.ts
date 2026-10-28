let unlocked = false,
  currentAudio: HTMLAudioElement | null = null,
  generation = 0,
  settle: (() => void) | null = null
const mp3Known = new Map<string, boolean>()
export type AudioResult = 'finished' | 'cancelled' | 'unavailable'
export function unlockAudio() {
  if (unlocked) return
  unlocked = true
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.getVoices()
    if (typeof SpeechSynthesisUtterance !== 'undefined') {
      const silent = new SpeechSynthesisUtterance('\u200b')
      silent.volume = 0
      speechSynthesis.speak(silent)
      speechSynthesis.cancel()
    }
  }
}
export function isAudioUnlocked() {
  return unlocked
}
export function stopAudio() {
  generation++
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.src = ''
    currentAudio = null
  }
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
  settle?.()
  settle = null
}
async function hasMp3(src: string) {
  if (typeof Audio === 'undefined') return false
  if (mp3Known.has(src)) return mp3Known.get(src)!
  return new Promise<boolean>((resolve) => {
    const audio = new Audio()
    let done = false
    const finish = (ok: boolean) => {
      if (done) return
      done = true
      clearTimeout(timer)
      mp3Known.set(src, ok)
      resolve(ok)
    }
    audio.addEventListener('canplaythrough', () => finish(true), { once: true })
    audio.addEventListener('error', () => finish(false), { once: true })
    const timer = setTimeout(() => finish(false), 1000)
    audio.src = src
    audio.load()
  })
}
async function playOne(id: string, text: string, rate: number, token: number): Promise<AudioResult> {
  const src = `${import.meta.env.BASE_URL}audio/${encodeURIComponent(id)}.mp3`
  const available = await hasMp3(src)
  if (token !== generation) return 'cancelled'
  if (available) {
    const result = await new Promise<AudioResult>((resolve) => {
      const audio = new Audio(src)
      currentAudio = audio
      audio.playbackRate = rate
      const cancel = () => finish('cancelled')
      const finish = (result: AudioResult) => {
        if (currentAudio === audio) currentAudio = null
        if (settle === cancel) settle = null
        resolve(result)
      }
      settle = cancel
      audio.addEventListener('ended', () => finish('finished'), { once: true })
      audio.addEventListener('error', () => finish('unavailable'), { once: true })
      void audio.play().catch(() => finish('unavailable'))
    })
    if (result !== 'unavailable') return result
  }
  if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined')
    return 'unavailable'
  return new Promise<AudioResult>((resolve) => {
    const voice = new SpeechSynthesisUtterance(text)
    voice.lang = 'ja-JP'
    voice.rate = 0.9 * rate
    voice.voice = speechSynthesis.getVoices().find((entry) => entry.lang.startsWith('ja')) ?? null
    const cancel = () => finish('cancelled')
    const finish = (result: AudioResult) => {
      if (settle === cancel) settle = null
      resolve(result)
    }
    settle = cancel
    voice.onend = () => finish(token === generation ? 'finished' : 'cancelled')
    voice.onerror = () => finish(token === generation ? 'unavailable' : 'cancelled')
    setTimeout(() => {
      if (token === generation) speechSynthesis.speak(voice)
      else finish('cancelled')
    }, 50)
  })
}
export async function playJapaneseSequence(
  id: string,
  text: string,
  options: { rate?: number; repetitions?: number } = {}
): Promise<AudioResult> {
  stopAudio()
  unlockAudio()
  const token = generation,
    rate = Math.min(1.25, Math.max(0.6, options.rate ?? 1)),
    repetitions = Math.min(5, Math.max(1, options.repetitions ?? 1))
  if (!text.trim()) return 'unavailable'
  for (let index = 0; index < repetitions; index++) {
    if (token !== generation) return 'cancelled'
    const result = await playOne(id, text.trim(), rate, token)
    if (result !== 'finished') return result
    if (index + 1 < repetitions)
      await new Promise<void>((resolve) => {
        const finish = () => {
          clearTimeout(timer)
          if (settle === finish) settle = null
          resolve()
        }
        const timer = setTimeout(finish, 700)
        settle = finish
      })
  }
  return token === generation ? 'finished' : 'cancelled'
}
export function playJapanese(id: string, text: string, options: { rate?: number } = {}): void {
  void playJapaneseSequence(id, text, options)
}
