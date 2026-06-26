import { describe, it, expect } from 'vitest'
import { breakdownReading, splitRomajiMorae } from './readingBreakdown'

describe('breakdownReading', () => {
  it('splits okurigana 高い → taka + i', () => {
    const parts = breakdownReading('高い', 'takai')
    expect(parts).toHaveLength(2)
    expect(parts[0].char).toBe('高')
    expect(parts[0].reading).toBe('taka')
    expect(parts[1].char).toBe('い')
    expect(parts[1].reading).toBe('i')
  })

  it('splits compound 来年 → rai + nen', () => {
    const parts = breakdownReading('来年', 'rainen')
    expect(parts).toHaveLength(2)
    expect(parts[0].reading).toBe('rai')
    expect(parts[1].reading).toBe('nen')
  })
})

describe('splitRomajiMorae', () => {
  it('splits takai into morae', () => {
    expect(splitRomajiMorae('takai')).toEqual(['ta', 'ka', 'i'])
  })
})
