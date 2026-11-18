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
it('uses both ends of an unlisted word to separate okurigana and Katakana from the kanji reading', () => {
  expect(alignFurigana('聞き', 'きき')).toEqual([{ text: '聞', reading: 'き' }, { text: 'き' }])
  const mixed = alignFurigana('バスで帰る', 'ばすでかえる')
  expect(mixed.filter((part) => part.reading)).toEqual([{ text: '帰', reading: 'かえ' }])
  expect(alignFurigana('バスで帰る', 'かえる')).toEqual([{ text: 'バスで帰る' }])
})
