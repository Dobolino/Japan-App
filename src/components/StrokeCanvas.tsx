import { useRef, useEffect, useCallback, useState } from 'react'
import type { StrokeSegment, DrawingStroke } from '../types'

interface Props {
  strokes: StrokeSegment[]        // reference stroke order data
  mode: 'animate' | 'draw'        // show animation or let user draw
  size?: number                   // canvas pixel size
  character?: string              // actual Unicode character for ghost in draw mode
  onStrokesChange?: (strokes: DrawingStroke[]) => void
  onEvaluate?: (score: number) => void
}

const PAD = 0.1  // padding around the character in the canvas

// Draw a single reference stroke segment
function drawSegment(
  ctx: CanvasRenderingContext2D,
  seg: StrokeSegment,
  size: number,
  alpha: number,
  color: string,
) {
  if (seg.points.length < 2) return
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = size * 0.04
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  const [fx, fy] = seg.points[0]
  ctx.moveTo(fx * size * (1 - 2 * PAD) + size * PAD, fy * size * (1 - 2 * PAD) + size * PAD)
  for (let i = 1; i < seg.points.length; i++) {
    const [x, y] = seg.points[i]
    ctx.lineTo(x * size * (1 - 2 * PAD) + size * PAD, y * size * (1 - 2 * PAD) + size * PAD)
  }
  ctx.stroke()
  // Arrow head at end
  const last = seg.points[seg.points.length - 1]
  const prev = seg.points[seg.points.length - 2]
  const angle = Math.atan2(
    (last[1] - prev[1]) * size * (1 - 2 * PAD),
    (last[0] - prev[0]) * size * (1 - 2 * PAD),
  )
  const ex = last[0] * size * (1 - 2 * PAD) + size * PAD
  const ey = last[1] * size * (1 - 2 * PAD) + size * PAD
  const aLen = size * 0.035
  ctx.beginPath()
  ctx.moveTo(ex, ey)
  ctx.lineTo(ex - aLen * Math.cos(angle - 0.4), ey - aLen * Math.sin(angle - 0.4))
  ctx.moveTo(ex, ey)
  ctx.lineTo(ex - aLen * Math.cos(angle + 0.4), ey - aLen * Math.sin(angle + 0.4))
  ctx.stroke()
  ctx.restore()
}

// Draw grid guide lines
function drawGrid(ctx: CanvasRenderingContext2D, size: number) {
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  // Cross lines
  ctx.beginPath()
  ctx.moveTo(size / 2, 0)
  ctx.lineTo(size / 2, size)
  ctx.moveTo(0, size / 2)
  ctx.lineTo(size, size / 2)
  ctx.stroke()
  // Diagonal guides
  ctx.strokeStyle = 'rgba(255,255,255,0.03)'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(size, size)
  ctx.moveTo(size, 0)
  ctx.lineTo(0, size)
  ctx.stroke()
  ctx.restore()
}

// Draw user strokes
function drawUserStrokes(ctx: CanvasRenderingContext2D, userStrokes: DrawingStroke[]) {
  ctx.save()
  ctx.strokeStyle = '#818cf8'
  ctx.lineWidth = ctx.canvas.width * 0.035
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const stroke of userStrokes) {
    if (stroke.points.length < 2) continue
    ctx.beginPath()
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
    }
    ctx.stroke()
  }
  ctx.restore()
}

// Heuristic evaluation: compare bounding boxes and stroke count
function evaluate(userStrokes: DrawingStroke[], refStrokes: StrokeSegment[], size: number): number {
  if (userStrokes.length === 0) return 0

  // Stroke count similarity (max 40 pts)
  const countDiff = Math.abs(userStrokes.length - refStrokes.length)
  const countScore = Math.max(0, 40 - countDiff * 15)

  // Bounding box coverage (max 60 pts)
  const allPts = userStrokes.flatMap((s) => s.points)
  const minX = Math.min(...allPts.map((p) => p.x)) / size
  const maxX = Math.max(...allPts.map((p) => p.x)) / size
  const minY = Math.min(...allPts.map((p) => p.y)) / size
  const maxY = Math.max(...allPts.map((p) => p.y)) / size

  const refPts = refStrokes.flatMap((s) => s.points)
  const refMinX = Math.min(...refPts.map(([x]) => x)) * (1 - 2 * PAD) + PAD
  const refMaxX = Math.max(...refPts.map(([x]) => x)) * (1 - 2 * PAD) + PAD
  const refMinY = Math.min(...refPts.map(([, y]) => y)) * (1 - 2 * PAD) + PAD
  const refMaxY = Math.max(...refPts.map(([, y]) => y)) * (1 - 2 * PAD) + PAD

  const overlap = (
    Math.max(0, Math.min(maxX, refMaxX) - Math.max(minX, refMinX)) *
    Math.max(0, Math.min(maxY, refMaxY) - Math.max(minY, refMinY))
  )
  const union = (
    (Math.max(maxX, refMaxX) - Math.min(minX, refMinX)) *
    (Math.max(maxY, refMaxY) - Math.min(minY, refMinY))
  )
  const iou = union > 0 ? overlap / union : 0
  const bbScore = Math.round(iou * 60)

  return Math.min(100, countScore + bbScore)
}

export default function StrokeCanvas({ strokes, mode, size = 280, character, onStrokesChange, onEvaluate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const userStrokes = useRef<DrawingStroke[]>([])
  const animFrame = useRef<number>(0)
  const [animIndex, setAnimIndex] = useState(0)
  const [animDone, setAnimDone] = useState(false)

  // Reset animation whenever strokes data changes (= navigated to new character)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setAnimDone(false); setAnimIndex(0) }, [strokes])

  const redraw = useCallback((highlightUpTo?: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, size, size)
    drawGrid(ctx, size)

    if (mode === 'animate') {
      // Ghost: actual character behind the stroke animation
      if (character) {
        ctx.save()
        ctx.globalAlpha = 0.08
        ctx.fillStyle = '#e8e8f0'
        ctx.font = `${size * 0.72}px "Hiragino Sans", "Yu Gothic", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(character, size / 2, size / 2)
        ctx.restore()
      }
      const limit = highlightUpTo ?? strokes.length
      strokes.forEach((seg, i) => {
        if (i < limit) {
          drawSegment(ctx, seg, size, i === limit - 1 ? 1.0 : 0.3, i === limit - 1 ? '#a5b4fc' : '#4b5563')
        }
      })
    } else {
      // Ghost: render actual Unicode character for accuracy
      if (character) {
        ctx.save()
        ctx.globalAlpha = 0.12
        ctx.fillStyle = '#e8e8f0'
        ctx.font = `${size * 0.72}px "Hiragino Sans", "Yu Gothic", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(character, size / 2, size / 2)
        ctx.restore()
      } else {
        strokes.forEach((seg) => drawSegment(ctx, seg, size, 0.12, '#94a3b8'))
      }
      drawUserStrokes(ctx, userStrokes.current)
    }
  }, [mode, size, strokes, character])

  // Animate stroke by stroke
  useEffect(() => {
    if (mode !== 'animate') return
    if (animDone) { redraw(strokes.length); return }

    let current = 0
    setAnimIndex(0)
    setAnimDone(false)

    function step() {
      current++
      setAnimIndex(current)
      redraw(current)
      if (current < strokes.length) {
        animFrame.current = window.setTimeout(step, 700)
      } else {
        setAnimDone(true)
      }
    }
    animFrame.current = window.setTimeout(step, 400)
    return () => clearTimeout(animFrame.current)
  }, [mode, strokes, redraw, animDone])

  useEffect(() => {
    if (mode === 'draw') redraw()
  }, [mode, redraw])

  // Pointer handlers for drawing mode
  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const scaleX = size / rect.width
    const scaleY = size / rect.height
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== 'draw') return
    isDrawing.current = true
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
    userStrokes.current.push({ points: [getPos(e)] })
    redraw()
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || mode !== 'draw') return
    const last = userStrokes.current[userStrokes.current.length - 1]
    last.points.push(getPos(e))
    redraw()
  }

  const onPointerUp = () => {
    if (!isDrawing.current) return
    isDrawing.current = false
    onStrokesChange?.(userStrokes.current)
    const score = evaluate(userStrokes.current, strokes, size)
    onEvaluate?.(score)
  }

  const clear = () => {
    userStrokes.current = []
    onStrokesChange?.([])
    onEvaluate?.(0)
    redraw()
  }

  const replay = () => {
    setAnimDone(false)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="rounded-2xl overflow-hidden border border-white/10"
        style={{ width: size, height: size, background: 'rgba(255,255,255,0.03)' }}
      >
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ width: '100%', height: '100%', cursor: mode === 'draw' ? 'crosshair' : 'default' }}
        />
      </div>

      {mode === 'animate' && (
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs">Strich {Math.min(animIndex, strokes.length)} / {strokes.length}</span>
          <button onClick={replay} className="text-indigo-400 text-xs underline">Nochmal</button>
        </div>
      )}

      {mode === 'draw' && (
        <button
          onClick={clear}
          className="px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-sm active:scale-95 transition-transform"
        >
          Löschen
        </button>
      )}
    </div>
  )
}
