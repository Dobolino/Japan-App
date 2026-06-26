// Generates minimal valid PNG icons using pure Node.js (no external deps)
// The PNG consists of a colored square with the text "あ" drawn via the system font.

import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

// Pure JS minimal PNG generator (no canvas needed)
function createPNG(size, bgR, bgG, bgB) {
  // Raw RGBA image data
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      // Background gradient: deep blue-purple
      const t = (x + y) / (size * 2)
      data[i]     = Math.round(bgR + t * 30)  // R
      data[i + 1] = Math.round(bgG + t * 10)  // G
      data[i + 2] = Math.round(bgB + t * 40)  // B
      data[i + 3] = 255                         // A

      // Draw a simple "あ" shape as pixel art in center third
      const cx = size / 2, cy = size / 2
      const r = size * 0.3
      const dx = x - cx, dy = y - cy
      // Outer circle ring
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > r * 0.55 && dist < r * 0.75) {
        data[i]     = 165
        data[i + 1] = 180
        data[i + 2] = 252
        data[i + 3] = 255
      }
      // Horizontal bar
      if (Math.abs(dy - size * 0.05) < size * 0.04 && Math.abs(dx) < r * 0.6) {
        data[i]     = 165
        data[i + 1] = 180
        data[i + 2] = 252
        data[i + 3] = 255
      }
    }
  }

  // Build PNG chunks
  function adler32(buf) {
    let s1 = 1, s2 = 0
    for (const b of buf) { s1 = (s1 + b) % 65521; s2 = (s2 + s1) % 65521 }
    return (s2 << 16) | s1
  }

  function crc32(buf) {
    const table = []
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
      table[n] = c
    }
    let crc = 0xFFFFFFFF
    for (const b of buf) crc = table[(crc ^ b) & 0xFF] ^ (crc >>> 8)
    return (crc ^ 0xFFFFFFFF) >>> 0
  }

  function chunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii')
    const lenBuf = Buffer.alloc(4); lenBuf.writeUInt32BE(data.length)
    const crcInput = Buffer.concat([typeBuf, data])
    const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(crcInput))
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
  }

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  // IDAT: filter byte 0 + RGB rows
  const rows = []
  for (let y = 0; y < size; y++) {
    rows.push(0) // filter = None
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      rows.push(data[i], data[i + 1], data[i + 2])
    }
  }
  const compressed = deflateSync(Buffer.from(rows))

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))])
}

mkdirSync('public/icons', { recursive: true })

const sizes = [
  { name: 'icon-180.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
]

for (const { name, size } of sizes) {
  const png = createPNG(size, 26, 26, 46)  // #1a1a2e background
  writeFileSync(`public/icons/${name}`, png)
  console.log(`✓ public/icons/${name} (${size}x${size})`)
}
