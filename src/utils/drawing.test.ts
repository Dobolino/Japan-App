import { describe, it, expect } from 'vitest'
import { evaluateDrawing } from './drawing'
import type { StrokeSegment, DrawingStroke } from '@/types'
const reference: StrokeSegment[] = [
  {
    points: [
      [0.2, 0.3],
      [0.8, 0.3],
    ],
  },
  {
    points: [
      [0.5, 0.1],
      [0.5, 0.9],
    ],
  },
]
const strokes: DrawingStroke[] = reference.map((stroke) => ({
  points: stroke.points.map(([x, y]) => ({ x: x * 100, y: y * 100 })),
}))
describe('drawing comparison', () => {
  it('accepts the matching paths in order and direction', () =>
    expect(evaluateDrawing(strokes, reference, 100).score).toBe(100))
  it('does not reward a reversed stroke', () => {
    const reversed = strokes.map((stroke) => ({ points: [...stroke.points].reverse() }))
    expect(evaluateDrawing(reversed, reference, 100).score).toBeLessThan(50)
  })
  it('does not reward swapped stroke order', () =>
    expect(evaluateDrawing([...strokes].reverse(), reference, 100).score).toBeLessThan(50))
  it('does not treat an incomplete shape as a correct drawing', () =>
    expect(evaluateDrawing(strokes.slice(0, 1), reference, 100).score).toBeLessThan(50))
  it('does not reward scribbles having the same bounding box', () => {
    const scribble = strokes.map(() => ({
      points: [
        { x: 20, y: 10 },
        { x: 80, y: 90 },
        { x: 20, y: 90 },
        { x: 80, y: 10 },
      ],
    }))
    expect(evaluateDrawing(scribble, reference, 100).score).toBeLessThan(70)
  })
  it('handles taps and empty input without NaN', () => {
    expect(evaluateDrawing([], reference, 100).score).toBe(0)
    expect(evaluateDrawing([{ points: [{ x: 1, y: 1 }] }], reference, 100).score).toBe(0)
  })
})
