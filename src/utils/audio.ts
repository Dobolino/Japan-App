// Plays a pre-generated MP3 from public/audio/{id}.mp3
// Falls back to SpeechSynthesis if the file is missing (dev mode).
export function playJapanese(id: string, text: string): void {
  const src = `${import.meta.env.BASE_URL}audio/${id}.mp3`
  const audio = new Audio(src)
  audio.play().catch(() => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    speechSynthesis.speak(u)
  })
}
