import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import TappableSentence from '@/components/TappableSentence'
import { alignFurigana } from './furigana'
import { romajiFromReading } from './kanaRomaji'
import { lookupToken } from './lexicon'
import { tokenizeJapanese } from './tokenize'
import { buildChunkExercise } from './chunkExercise'
import { studySentence } from '@/data/studySentence'
import { stories } from '@/data/stories'
import { grammarData } from '@/data/grammar'
import { missions } from '@/data/activities'
import { vocabularyData } from '@/data/vocabulary'
import { sentenceCard } from '@/types/review'
import { reviewCardMatchesAnswer } from './buildReviewQueue'

describe('authored readings for lessons and reading practice', () => {
  it.each([
    ['はい、お願いします。', 'はい、おねがいします。', 'Hai onegaishimasu'],
    ['音楽を聞きます。', 'おんがくをききます。', 'Ongaku o kikimasu'],
    ['スーパーでりんごを買います。', 'すーぱーでりんごをかいます。', 'Suupaa de ringo o kaimasu'],
    ['友達と昼ごはんを食べます。', 'ともだちとひるごはんをたべます。', 'Tomodachi to hirugohan o tabemasu'],
  ])('preserves the spoken reading of %s', (jp, reading, expected) => {
    expect(romajiFromReading(reading, jp)).toBe(expected)
  })
  it('aligns okurigana and katakana without swallowing the next word', () => {
    const line = stories.find((s) => s.id === 'story-shopping')!.lines[0]
    expect(alignFurigana(line.jp, line.reading)).toContainEqual({ text: '買', reading: 'か' })
    expect(buildChunkExercise('shopping', line.jp, line.reading, line.de).answer).toEqual([
      'スーパー',
      'で',
      'りんご',
      'を',
      '買います',
    ])
  })
  it.each([
    ['私はりんごを食べます。', 'わたしはりんごをたべます。', '<ruby class="ruby-base">食<rt class="ruby-reading">た</rt></ruby><span>べます</span>'],
    ['日本の食べ物が好きです。', 'にほんのたべものがすきです。', '<ruby class="ruby-base">食<rt class="ruby-reading">た</rt></ruby><span>べ</span><ruby class="ruby-base">物<rt class="ruby-reading">もの</rt></ruby>'],
  ])('renders furigana over each kanji run in the tappable words of %s', (text, reading, expected) => {
    const page = renderToStaticMarkup(createElement(MemoryRouter, {}, createElement(TappableSentence, { text, reading })))
    expect(page).toContain(expected)
  })
  it.each(['聞きます', '本[hon]', '本[ほん', '本[ほん]]', '本[]', ''])(
    'rejects malformed authored text %s',
    (text) => {
      expect(() => studySentence(text)).toThrow()
    }
  )
  it('preserves every bundled sentence, supplying kana for all kanji', () => {
    const entries = [
      ...stories.flatMap((s) => s.lines),
      ...grammarData.flatMap((g) => g.examples),
      ...missions.flatMap((m) => m.questions),
    ]
    for (const entry of entries) {
      if (!entry.jp || !entry.reading) continue
      expect(entry.reading).toMatch(/^[ぁ-ゖァ-ヺー。、！？]+$/u)
      expect(
        tokenizeJapanese(entry.jp, entry.reading)
          .map((token) => token.surface)
          .join('')
      ).toBe(entry.jp)
      for (const part of alignFurigana(entry.jp, entry.reading)) {
        if (/\p{Script=Han}/u.test(part.text)) expect(part.reading).toMatch(/^[ぁ-ゖ]+$/u)
      }
    }
  })
  it('links a word to its own meaning, and leaves ambiguous kana readings unresolved', () => {
    expect(lookupToken('雨', 'あめ')).toMatchObject({ surface: '雨', meaning: 'Regen', id: 'v-n-07' })
    expect(lookupToken('あめ', 'あめ')).toMatchObject({ surface: 'あめ', meaning: 'Regen', romaji: 'ame' })
    expect(lookupToken('はな', 'はな')).toBeUndefined()
  })
  it('explains every tappable word in the reading texts and gives its reading in context', () => {
    for (const line of stories.flatMap((story) => story.lines)) {
      for (const word of tokenizeJapanese(line.jp, line.reading)) {
        if (word.pos !== 'punctuation') expect(word.meaning, word.surface).toBeTruthy()
      }
    }
    const line = stories.find((story) => story.id === 'story-shopping')!.lines[3]
    const words = tokenizeJapanese(line.jp, line.reading)
    expect(words[0]).toMatchObject({ surface: '家', reading: 'いえ', romaji: 'ie' })
    expect(words[words.length - 2]).toMatchObject({ surface: '食べます', meaning: 'essen', lemmaId: 'v-vb-01' })
  })
  it('accepts the reading of 五百円 as a vocabulary example', () => {
    const card = sentenceCard(vocabularyData.find((item) => item.id === 'v-z-14')!)!
    expect(reviewCardMatchesAnswer('gohyakuen', card)).toBe(true)
    expect(reviewCardMatchesAnswer('ごひゃくえん', card)).toBe(true)
    expect(reviewCardMatchesAnswer('gohyaku', card)).toBe(false)
  })
})
