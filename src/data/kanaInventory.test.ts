import { describe, expect, it } from 'vitest'
import { catalog } from './catalog'
import { lessons } from './curriculum'
import { toHiragana } from '@/utils/transliteration'

// Reference spellings for the forms taught in this course. The two historic
// kana and extended katakana spellings for loans (e.g. ティ) are outside it.
const basic = [
  ...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
]
const marked = [...'がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ']
const contracted = [...'きぎしじちにひびぴみり'].flatMap((base) => [...'ゃゅょ'].map((small) => base + small))
const modern = [...basic, ...marked, ...contracted]

for (const category of ['hiragana', 'katakana'] as const) {
  describe(category, () => {
    const entries = catalog.filter((item) => item.category === category)
    it('teaches each target form once and keeps the two historic forms separate', () => {
      const taught = lessons
        .filter((lesson) => lesson.category === category)
        .flatMap((lesson) => lesson.itemIds)
      const byId = new Map(entries.map((item) => [item.id, item]))
      expect(taught.map((id) => toHiragana(byId.get(id)!.character))).toEqual(modern)
      expect(
        entries
          .filter((item) => !item.historical)
          .map((item) => toHiragana(item.character))
          .sort()
      ).toEqual([...modern].sort())
      expect(entries.filter((item) => item.historical).map((item) => toHiragana(item.character))).toEqual([
        'ゐ',
        'ゑ',
      ])
    })

    it('preserves exceptional kana readings and the spoken particle in context', () => {
      const byForm = new Map(entries.map((item) => [toHiragana(item.character), item]))
      for (const [form, reading] of Object.entries({
        し: 'shi',
        ち: 'chi',
        つ: 'tsu',
        ふ: 'fu',
        じ: 'ji',
        ぢ: 'ji',
        ず: 'zu',
        づ: 'zu',
        しゃ: 'sha',
        ちゅ: 'chu',
        じょ: 'jo',
        へ: 'he',
        ゐ: 'wi',
        ゑ: 'we',
      })) {
        expect(byForm.get(form)?.romaji).toBe(reading)
      }
      expect(byForm.get('へ')?.exampleReading).toBe('ue e')
      expect(byForm.get('を')?.exampleReading).toBe('hon o yomu')
    })
  })
}
