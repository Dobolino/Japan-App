import { describe, it, expect } from 'vitest'
import { alignFurigana, isKanaReading } from './furigana'

describe('furigana', () => {
  it('detects kana readings', () => {
    expect(isKanaReading('わたしは')).toBe(true)
    expect(isKanaReading('watashi')).toBe(false)
  })

  it('aligns kanji with hiragana reading', () => {
    const segs = alignFurigana('私は', 'わたしは')
    expect(segs.some((s) => s.text === '私' && s.reading === 'わたし')).toBe(true)
    expect(segs.some((s) => s.text === 'は')).toBe(true)
  })

  it('passes through kana-only text', () => {
    const segs = alignFurigana('あめ', 'あめ')
    expect(segs).toEqual([{ text: 'あ' }, { text: 'め' }])
  })
})
