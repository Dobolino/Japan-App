import { useRef, useEffect, useCallback, useState } from 'react'
import type { StrokeSegment, DrawingStroke } from '../types'

const BASE_URL = import.meta.env.BASE_URL

function svgUrl(char: string) {
  const cp = char.codePointAt(0)?.toString(16).padStart(4, '0')
  return cp ? `${BASE_URL}strokes/${cp}.svg` : null
}

interface Props {
  strokes: StrokeSegment[]        // reference stroke order data (fallback)
  mode: 'animate' | 'draw'
  size?: number
  character?: string
  onStrokesChange?: (strokes: DrawingStroke[]) => void
  onEvaluate?: (score: number) => void
}

const PAD = 0.1

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

// ── Animate mode: SVG from animCJK ──────────────────────────────────────────
function AnimateSVG({ character, size }: { character: string; size: number }) {
  const [replayKey, setReplayKey] = useState(0)
  const url = svgUrl(character)

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center"
        style={{ width: size, height: size, background: 'rgba(255,255,255,0.03)' }}
      >
        {url ? (
          <img
            key={replayKey}
            src={url}
            alt={character}
            style={{ width: '85%', height: '85%', objectFit: 'contain', filter: 'invert(1)' }}
          />
        ) : (
          <span className="text-white/20 text-sm text-center px-4">Keine Strichdaten verfügbar</span>
        )}
      </div>
      {url && (
        <button
          onClick={() => setReplayKey(k => k + 1)}
          className="text-indigo-400 text-xs underline"
        >
          Nochmal
        </button>
      )}
    </div>
  )
}

// ── Draw mode: canvas ────────────────────────────────────────────────────────
export default function StrokeCanvas({ strokes, mode, size = 280, character, onStrokesChange, onEvaluate }: Props) {
  // Animate mode: use SVG
  if (mode === 'animate' && character) {
    return <AnimateSVG character={character} size={size} />
  }

  return <DrawCanvas strokes={strokes} size={size} character={character} onStrokesChange={onStrokesChange} onEvaluate={onEvaluate} />
}

function DrawCanvas({ strokes, size = 280, character, onStrokesChange, onEvaluate }: Omit<Props, 'mode'>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const userStrokes = useRef<DrawingStroke[]>([])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, size, size)
    drawGrid(ctx, size)
    // Ghost: real Unicode character
    if (character) {
      ctx.save()
      ctx.globalAlpha = 0.13
      ctx.fillStyle = '#e8e8f0'
      ctx.font = `${size * 0.72}px "Hiragino Sans", "Yu Gothic", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(character, size / 2, size / 2)
      ctx.restore()
    }
    drawUserStrokes(ctx, userStrokes.current)
  }, [size, character])

  useEffect(() => { redraw() }, [redraw])

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: (e.clientX - rect.left) * (size / rect.width), y: (e.clientY - rect.top) * (size / rect.height) }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
    userStrokes.current.push({ points: [getPos(e)] })
    redraw()
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return
    userStrokes.current[userStrokes.current.length - 1].points.push(getPos(e))
    redraw()
  }

  const onPointerUp = () => {
    if (!isDrawing.current) return
    isDrawing.current = false
    onStrokesChange?.(userStrokes.current)
    onEvaluate?.(evaluate(userStrokes.current, strokes, size))
  }

  const clear = () => {
    userStrokes.current = []
    onStrokesChange?.([])
    onEvaluate?.(0)
    redraw()
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
          style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
        />
      </div>
      <button onClick={clear} className="px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-sm active:scale-95 transition-transform">
        Löschen
      </button>
    </div>
  )
}
