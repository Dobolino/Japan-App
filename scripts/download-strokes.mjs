/**
 * Downloads SVG stroke-order animations from animCJK for all characters in the app.
 * Source: https://github.com/parsimonhi/animCJK
 *
 * Run: node scripts/download-strokes.mjs
 */

import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'node:fs'
import { join } from 'path'

// Hiragana + Katakana → svgsJaKana (decimal codepoint filenames)
const BASE_KANA = 'https://raw.githubusercontent.com/parsimonhi/animCJK/master/svgsJaKana/'
// Kanji → svgsJa (decimal codepoint filenames)
const BASE_KANJI = 'https://raw.githubusercontent.com/parsimonhi/animCJK/master/svgsJa/'
const OUT_DIR = 'public/strokes'

mkdirSync(OUT_DIR, { recursive: true })

// All hiragana characters used in the app
const HIRAGANA =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ'

// All katakana characters used in the app
const KATAKANA =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ'

// All N5 kanji
const KANJI_N5 = [...readFileSync('src/data/kanji-n5.ts', 'utf8').matchAll(/character:\s*'([^']+)'/g)]
  .map((match) => match[1])
  .join('')

async function download(char, baseUrl) {
  const cp = char.codePointAt(0).toString(10) // decimal filename
  const url = baseUrl + cp + '.svg'
  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  ✗ ${char} (U+${cp.toUpperCase()}) — HTTP ${res.status}`)
      return false
    }
    const svg = await res.text()
    // Store by hex codepoint (used in svgUrl() in StrokeCanvas)
    const hex = char.codePointAt(0).toString(16).padStart(4, '0')
    writeFileSync(join(OUT_DIR, hex + '.svg'), svg, 'utf8')
    console.log(`  ✓ ${char} (${cp} → ${hex}.svg)`)
    return true
  } catch (e) {
    console.warn(`  ✗ ${char} — ${e.message}`)
    return false
  }
}

async function downloadAll(chars, baseUrl, label) {
  console.log(`\n${label} (${[...new Set(chars)].length} Zeichen)`)
  let ok = 0,
    fail = 0
  for (const ch of [...new Set(chars)]) {
    const success = await download(ch, baseUrl)
    success ? ok++ : fail++
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 80))
  }
  console.log(`  → ${ok} OK, ${fail} nicht gefunden`)
}

console.log('Lade animCJK SVGs herunter...')
await downloadAll(HIRAGANA, BASE_KANA, 'Hiragana')
await downloadAll(KATAKANA, BASE_KANA, 'Katakana')
await downloadAll(KANJI_N5, BASE_KANJI, 'Kanji N5')
console.log(`\nFertig! SVGs gespeichert in ./${OUT_DIR}/`)

const available = readdirSync(OUT_DIR)
  .filter((name) => /^[a-f0-9]+\.svg$/i.test(name))
  .map((name) => String.fromCodePoint(parseInt(name, 16)))
writeFileSync(
  'src/data/strokeAssets.ts',
  '// Local AnimCJK assets: see public/strokes/COPYING.txt and the accompanying APL/LGPL licenses.\nexport const strokeCharacters = new Set(' +
    JSON.stringify(available, null, 2) +
    ')\n'
)
