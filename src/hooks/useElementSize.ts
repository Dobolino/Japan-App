import { useEffect, useState, type RefObject } from 'react'

/** Observe element size; returns square size capped by max. */
export function useSquareSize(ref: RefObject<HTMLElement | null>, max = 280, padding = 16): number {
  const [size, setSize] = useState(220)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const w = el.clientWidth - padding
      const h = el.clientHeight - padding
      setSize(Math.max(120, Math.min(max, w, h)))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, max, padding])

  return size
}
