import { describe, it, expect } from 'vitest'
import { kanaToRomaji, matchesAlternatives } from './transliteration'
import { matchesJapaneseAnswer } from './answerMatch'
import { catalog } from '@/data/catalog'
import { lemmaCard, sentenceCard } from '@/types/review'
import { reviewCardMatchesAnswer } from './buildReviewQueue'
describe('Japanese answer recognition', () => {
  it.each([
    ['きゃ', 'kya'],
    ['しゅ', 'shu'],
    ['ちょ', 'cho'],
    ['ぎゅ', 'gyu'],
    ['がっこう', 'gakkou'],
    ['まっちゃ', 'matcha'],
    ['コーヒー', 'koohii'],
    ['ｶﾞ', 'ga'],
  ])('transliterates %s', (jp, roman) => expect(kanaToRomaji(jp)).toBe(roman))
  it('accepts individual On and Kun readings in kana and romaji', () => {
    const item = catalog.find((entry) => entry.character === '一')!
    for (const answer of ['一', 'いち', 'イチ', 'ichi', 'ひとつ', 'hitotsu'])
      expect(matchesJapaneseAnswer(answer, item)).toBe(true)
    expect(reviewCardMatchesAnswer('ichi', lemmaCard(item))).toBe(true)
  })
  it('accepts kana for a vocabulary item without accepting an unrelated kanji prefix', () => {
    const item = catalog.find((entry) => entry.category === 'vocabulary' && entry.romaji === 'mizu')!
    expect(matchesJapaneseAnswer('みず', item)).toBe(true)
    expect(matchesJapaneseAnswer('火みず', item)).toBe(false)
  })
  it('preserves meaningful vowel length while accepting macrons and spelling conventions', () => {
    expect(matchesAlternatives('obasan', ['obaasan'])).toBe(false)
    expect(matchesAlternatives('tōkyō', ['toukyou'])).toBe(true)
    expect(matchesAlternatives('si', ['shi'])).toBe(true)
  })
  it('assigns an example its own stable SRS identity', () => {
    const item = catalog.find((entry) => entry.exampleWord)!
    expect(sentenceCard(item)?.srsId).toBe(`${item.id}:ex`)
    expect(lemmaCard(item).srsId).toBe(item.id)
  })
})
