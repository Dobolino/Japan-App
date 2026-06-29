import { describe, it, expect } from 'vitest'
import { tokenizeJapanese } from './tokenize'

describe('tokenizeJapanese', () => {
  it('splits SOV sentence with particles', () => {
    const tokens = tokenizeJapanese('私はりんごを食べます', 'わたしはりんごをたべます')
    const surfaces = tokens.map((t) => t.surface)
    expect(surfaces).toContain('は')
    expect(surfaces).toContain('を')
    expect(tokens.find((t) => t.surface === 'は')?.pos).toBe('particle')
  })

  it('assigns particle meanings', () => {
    const tokens = tokenizeJapanese('水を飲みます', 'みずをのみます')
    const wo = tokens.find((t) => t.surface === 'を')
    expect(wo?.meaning).toMatch(/Objekt/)
  })

  it('handles kana-only input', () => {
    const tokens = tokenizeJapanese('みずをのみます')
    expect(tokens.some((t) => t.surface === 'を')).toBe(true)
  })
})
