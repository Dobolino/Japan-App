import type { DrawingStroke, StrokeSegment } from '@/types'
type Point = { x: number; y: number }
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)
export function resample(points: Point[], count = 32): Point[] {
  if (points.length < 2) return Array.from({ length: count }, () => points[0] ?? { x: 0, y: 0 })
  const lengths = [0]
  for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1] + distance(points[i - 1], points[i]))
  const total = lengths[lengths.length - 1] ?? 0
  if (!total) return Array.from({ length: count }, () => points[0])
  return Array.from({ length: count }, (_, i) => {
    const target = (total * i) / (count - 1)
    let right = 1
    while (right < lengths.length - 1 && lengths[right] < target) right++
    const left = right - 1,
      fraction = (target - lengths[left]) / Math.max(1e-9, lengths[right] - lengths[left])
    return {
      x: points[left].x + (points[right].x - points[left].x) * fraction,
      y: points[left].y + (points[right].y - points[left].y) * fraction,
    }
  })
}
export function evaluateDrawing(strokes: DrawingStroke[], reference: StrokeSegment[], size: number) {
  const valid = strokes.filter((stroke) => stroke.points.length >= 2)
  if (!valid.length || !reference.length)
    return {
      score: 0,
      message: 'Zeichne zuerst das vollständige Zeichen.',
      expected: reference.length,
      actual: valid.length,
    }
  const user = valid.map((stroke) =>
      resample(stroke.points.map((point) => ({ x: point.x / size, y: point.y / size })))
    ),
    ref = reference.map((stroke) => resample(stroke.points.map(([x, y]) => ({ x, y }))))
  const paired = Math.min(user.length, ref.length)
  let error = 0,
    ends = 0
  for (let i = 0; i < paired; i++) {
    error += user[i].reduce((sum, point, index) => sum + distance(point, ref[i][index]), 0) / 32
    ends += distance(user[i][0], ref[i][0]) + distance(user[i][31], ref[i][31])
  }
  let score = Math.round(
    Math.max(0, 100 - (error / paired) * 190 - (ends / paired) * 35 - Math.abs(user.length - ref.length) * 25)
  )
  if (user.length !== ref.length) score = Math.min(40, score)
  return {
    score,
    message:
      user.length !== ref.length
        ? `Vergleiche die Strichzahl: ${user.length} statt ${ref.length}.`
        : score >= 70
          ? 'Form, Reihenfolge und Strichrichtung passen gut zur Vorlage.'
          : 'Vergleiche Ansatzpunkte, Strichrichtung und Reihenfolge mit der Animation.',
    expected: ref.length,
    actual: user.length,
  }
}
/** Measure only median paths; split AnimCJK paths with one delay represent one pen stroke. */
export function extractReference(svgText: string): StrokeSegment[] {
  const parsed = new DOMParser().parseFromString(svgText, 'image/svg+xml')
  if (parsed.querySelector('parsererror')) throw new Error('Ungültige Strichdaten.')
  const viewBox = (parsed.documentElement.getAttribute('viewBox') ?? '0 0 1024 1024')
      .split(/\s+/)
      .map(Number),
    width = viewBox[2] || 1024,
    height = viewBox[3] || 1024
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', viewBox.join(' '))
  svg.style.cssText =
    'position:absolute;left:-10000px;width:1024px;height:1024px;visibility:hidden;pointer-events:none'
  document.body.append(svg)
  try {
    const seen = new Set<string>(),
      result: StrokeSegment[] = []
    for (const source of parsed.querySelectorAll('path[clip-path]')) {
      const delay = source.getAttribute('style')?.match(/--d:\s*([\d.]+)s/)?.[1] ?? String(result.length)
      if (seen.has(delay)) continue
      seen.add(delay)
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', source.getAttribute('d') ?? '')
      svg.append(path)
      const length = path.getTotalLength()
      if (!length) continue
      result.push({
        points: Array.from({ length: 48 }, (_, index) => {
          const point = path.getPointAtLength((length * index) / 47)
          return [(point.x - viewBox[0]) / width, (point.y - viewBox[1]) / height] as [number, number]
        }),
      })
    }
    if (!result.length) throw new Error('Keine geeigneten Strichpfade gefunden.')
    return result
  } finally {
    svg.remove()
  }
}
