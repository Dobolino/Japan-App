import { useState, useEffect, useRef, useCallback } from 'react'
import { evaluateDrawing, extractReference } from '@/utils/drawing'
import type { DrawingStroke, StrokeSegment } from '@/types'
interface Props {
  mode: 'animate' | 'draw'
  character?: string
  size?: number
  strokes?: StrokeSegment[]
  onEvaluate?: (score: number) => void
  onReset?: () => void
}
export default function StrokeCanvas({ mode, character = '', size = 280, onEvaluate, onReset }: Props) {
  const [replay, setReplay] = useState(0),
    [reference, setReference] = useState<StrokeSegment[]>([]),
    [error, setError] = useState('')
  const [result, setResult] = useState<ReturnType<typeof evaluateDrawing> | null>(null),
    [count, setCount] = useState(0)
  const canvas = useRef<HTMLCanvasElement>(null),
    drawn = useRef<DrawingStroke[]>([]),
    drawing = useRef(false)
  const url = `${import.meta.env.BASE_URL}strokes/${character.codePointAt(0)?.toString(16).padStart(4, '0')}.svg`
  useEffect(() => {
    if (mode !== 'draw') return
    let cancelled = false
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Keine Strichdaten verfügbar.')
        return response.text()
      })
      .then((text) => {
        if (!cancelled) setReference(extractReference(text))
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [url, mode])
  const redraw = useCallback(() => {
    const element = canvas.current,
      ctx = element?.getContext('2d')
    if (!element || !ctx) return
    ctx.clearRect(0, 0, size, size)
    const style = getComputedStyle(document.documentElement)
    ctx.strokeStyle = style.getPropertyValue('--border')
    ctx.lineWidth = 1
    ctx.setLineDash([4, 5])
    ctx.beginPath()
    ctx.moveTo(size / 2, 0)
    ctx.lineTo(size / 2, size)
    ctx.moveTo(0, size / 2)
    ctx.lineTo(size, size / 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = style.getPropertyValue('--text-muted')
    ctx.globalAlpha = 0.16
    ctx.lineWidth = size * 0.025
    for (const stroke of reference) {
      ctx.beginPath()
      stroke.points.forEach(([x, y], index) =>
        index ? ctx.lineTo(x * size, y * size) : ctx.moveTo(x * size, y * size)
      )
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    ctx.strokeStyle = style.getPropertyValue('--blue')
    ctx.lineWidth = size * 0.027
    for (const stroke of drawn.current) {
      ctx.beginPath()
      stroke.points.forEach((point, index) =>
        index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)
      )
      ctx.stroke()
    }
  }, [reference, size])
  useEffect(() => {
    redraw()
    const observer = new MutationObserver(redraw)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [redraw])
  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) * size) / rect.width,
      y: ((event.clientY - rect.top) * size) / rect.height,
    }
  }
  if (mode === 'animate')
    return (
      <div className="stroke-workspace">
        <img key={replay} src={url} alt={`Strichreihenfolge für ${character}`} className="stroke-animation" />
        <button type="button" className="btn-duo btn-duo--outline mt-4" onClick={() => setReplay(replay + 1)}>
          Animation wiederholen
        </button>
      </div>
    )
  const clear = () => {
    drawn.current = []
    drawing.current = false
    setCount(0)
    setResult(null)
    onReset?.()
    redraw()
  }
  return (
    <div className="stroke-workspace">
      <p id="drawing-help" className="text-sm text-[var(--text-secondary)] mb-3">
        {reference.length
          ? `${reference.length} Striche: Zeichne die Vorlage nach und prüfe erst das fertige Zeichen.`
          : 'Strichvorlage wird geladen …'}
      </p>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <canvas
        ref={canvas}
        width={size}
        height={size}
        className="drawing-canvas"
        aria-label={`${character} zeichnen`}
        aria-describedby="drawing-help"
        onPointerDown={(event) => {
          if (!reference.length) return
          drawing.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          drawn.current.push({ points: [point(event)] })
          setResult(null)
          onReset?.()
          redraw()
        }}
        onPointerMove={(event) => {
          if (drawing.current) {
            drawn.current[drawn.current.length - 1].points.push(point(event))
            redraw()
          }
        }}
        onPointerUp={() => {
          drawing.current = false
          setCount(drawn.current.filter((stroke) => stroke.points.length > 1).length)
        }}
        onPointerCancel={() => {
          drawing.current = false
          setCount(drawn.current.length)
        }}
      />
      <div className="flex gap-3 mt-4">
        <button type="button" className="btn-duo btn-duo--outline" onClick={clear}>
          Löschen
        </button>
        <button
          type="button"
          className="btn-duo"
          disabled={!count || !reference.length}
          onClick={() => {
            const evaluation = evaluateDrawing(drawn.current, reference, size)
            setResult(evaluation)
            onEvaluate?.(evaluation.score)
          }}
        >
          Zeichnung prüfen
        </button>
      </div>
      {result && (
        <p role="status" className="text-sm mt-4 leading-relaxed">
          {result.score}% · {result.message}
        </p>
      )}
      <p className="text-xs text-[var(--text-muted)] mt-4">
        Die Formhilfe vergleicht Strichzahl, Verlauf, Richtung und Reihenfolge mit der Animationsvorlage.
      </p>
    </div>
  )
}
