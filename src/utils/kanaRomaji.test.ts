import { describe, it, expect } from 'vitest'
import { kanaToRomaji, romajiFromReading } from './kanaRomaji'

describe('kanaToRomaji', () => {
  it('converts basic hiragana', () => {
    expect(kanaToRomaji('だれ')).toBe('dare')
    expect(kanaToRomaji('みず')).toBe('mizu')
  })

  it('handles grammar example reading', () => {
    expect(romajiFromReading('だれがきましたか', '誰が来ましたか')).toMatch(/Dare ga/i)
  })
})
