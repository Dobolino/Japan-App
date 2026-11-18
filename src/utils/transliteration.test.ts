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

describe('Japanese spelling and kana reading prompts', () => {
  it.each([
    ['じ', 'ぢ', 'ji'],
    ['ぢ', 'じ', 'ji'],
    ['ず', 'づ', 'zu'],
    ['ヅ', 'ズ', 'zu'],
  ])('keeps written %s distinct from %s while accepting its reading %s', (expected, other, romaji) => {
    const item = catalog.find((entry) => entry.character === expected)!
    expect(matchesJapaneseAnswer(other, item)).toBe(false)
    expect(matchesJapaneseAnswer(expected, item)).toBe(true)
    const card = lemmaCard(item)
    expect(reviewCardMatchesAnswer(romaji, card)).toBe(true)
    expect(reviewCardMatchesAnswer(other, card)).toBe(false)
    expect(reviewCardMatchesAnswer(expected, card)).toBe(false)
  })
  it('checks the written particle and greeting when a spelling is known', () => {
    const greeting = catalog.find((item) => item.character === 'こんにちは')!
    expect(reviewCardMatchesAnswer('こんにちわ', lemmaCard(greeting))).toBe(false)
    expect(reviewCardMatchesAnswer('こんにちは', lemmaCard(greeting))).toBe(true)
    expect(reviewCardMatchesAnswer('konnichiwa', lemmaCard(greeting))).toBe(true)
    expect(matchesAlternatives('みずおください', ['水をください', 'みずをください', 'mizu o kudasai'])).toBe(
      false
    )
  })
  it('does not turn みづ or みずっ into みず on romaji-only vocabulary cards', () => {
    const water = catalog.find((item) => item.character === '水' && item.category === 'vocabulary')!
    expect(reviewCardMatchesAnswer('ﾐｽﾞ', lemmaCard(water))).toBe(true)
    expect(reviewCardMatchesAnswer('みづ', lemmaCard(water))).toBe(false)
    expect(reviewCardMatchesAnswer('みずっ', lemmaCard(water))).toBe(false)
  })
  it('accepts the full written form of a listed Kun reading including okurigana', () => {
    const item = catalog.find((entry) => entry.character === '入' && entry.category === 'kanji')!
    expect(reviewCardMatchesAnswer('入る', lemmaCard(item))).toBe(true)
    expect(reviewCardMatchesAnswer('入た', lemmaCard(item))).toBe(false)
  })
})
