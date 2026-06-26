export type ScriptType = 'kanji' | 'hiragana' | 'katakana' | 'other'

export interface CharSegment {
  char: string
  type: ScriptType
}

export function classifyChar(ch: string): ScriptType {
  const cp = ch.codePointAt(0) ?? 0
  if (cp >= 0x4E00 && cp <= 0x9FFF) return 'kanji'   // CJK Unified
  if (cp >= 0x3400 && cp <= 0x4DBF) return 'kanji'   // CJK Extension A
  if (cp >= 0xF900 && cp <= 0xFAFF) return 'kanji'   // CJK Compatibility
  if (cp >= 0x3040 && cp <= 0x309F) return 'hiragana'
  if (cp >= 0x30A0 && cp <= 0x30FF) return 'katakana'
  if (cp >= 0xFF65 && cp <= 0xFF9F) return 'katakana' // half-width katakana
  return 'other'
}

export function analyzeScript(text: string): CharSegment[] {
  const result: CharSegment[] = []
  for (const ch of text) {
    if (ch.trim() === '') continue
    result.push({ char: ch, type: classifyChar(ch) })
  }
  return result
}

export function groupSegments(text: string): { text: string; type: ScriptType }[] {
  const chars = analyzeScript(text)
  if (!chars.length) return []
  const groups: { text: string; type: ScriptType }[] = []
  let cur = { text: chars[0].char, type: chars[0].type }
  for (let i = 1; i < chars.length; i++) {
    if (chars[i].type === cur.type) {
      cur.text += chars[i].char
    } else {
      groups.push(cur)
      cur = { text: chars[i].char, type: chars[i].type }
    }
  }
  groups.push(cur)
  return groups
}

export const SCRIPT_LABEL: Record<ScriptType, string> = {
  kanji: 'Kanji',
  hiragana: 'Hiragana',
  katakana: 'Katakana',
  other: '',
}

export const SCRIPT_COLOR: Record<ScriptType, string> = {
  kanji: 'text-orange-400',
  hiragana: 'text-blue-400',
  katakana: 'text-green-400',
  other: 'text-white/60',
}

export const SCRIPT_BG: Record<ScriptType, string> = {
  kanji: 'bg-orange-500/15 border border-orange-500/30 text-orange-300',
  hiragana: 'bg-blue-500/15 border border-blue-500/30 text-blue-300',
  katakana: 'bg-green-500/15 border border-green-500/30 text-green-300',
  other: 'bg-white/5 border border-white/10 text-white/60',
}
