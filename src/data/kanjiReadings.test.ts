import { describe, expect, it } from 'vitest'
import { catalogById } from './catalog'
import { lemmaCard, sentenceCard } from '@/types/review'
import { reviewCardMatchesAnswer } from '@/utils/buildReviewQueue'

describe('Kanji readings in context', () => {
  it('keeps contractions, voiced forms and conjugations out of isolated readings', () => {
    for (const [character, contextualForm] of [
      ['学', 'がっ'],
      ['国', 'こっ'],
      ['本', 'ぼん'],
      ['来', 'きた'],
    ]) {
      expect(reviewCardMatchesAnswer(contextualForm, lemmaCard(catalogById[`kj-${character}`]))).toBe(false)
    }
    const school = sentenceCard(catalogById['kj-学'])!
    expect(reviewCardMatchesAnswer('がっこう', school)).toBe(true)
    expect(reviewCardMatchesAnswer('がく', school)).toBe(false)
  })

  it('distinguishes the written Kun word from the isolated character', () => {
    const entry = catalogById['kj-入']
    expect(entry.readings).toContainEqual({
      kind: 'kun',
      kana: 'はいる',
      romaji: 'hairu',
      writtenForm: '入る',
    })
    expect(entry.readings).toContainEqual({ kind: 'on', kana: 'ニュウ', romaji: 'nyuu' })
    for (const [character, reading] of [
      ['四', 'よん'],
      ['七', 'なな'],
      ['白', 'しろい'],
    ]) {
      expect(reviewCardMatchesAnswer(reading, lemmaCard(catalogById[`kj-${character}`]))).toBe(true)
    }
  })
})
