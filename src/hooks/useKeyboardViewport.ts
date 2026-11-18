import { useEffect } from 'react'

function revealField(field: HTMLElement, viewport: VisualViewport) {
  for (let parent = field.parentElement; parent; parent = parent.parentElement) {
    if (parent.scrollHeight <= parent.clientHeight) continue
    if (!['auto', 'scroll'].includes(getComputedStyle(parent).overflowY)) continue

    const parentTop = parent.getBoundingClientRect().top + parent.clientTop
    const top = Math.max(viewport.offsetTop, parentTop)
    const bottom = Math.min(viewport.offsetTop + viewport.height, parentTop + parent.clientHeight)
    if (bottom <= top) return
    const rect = field.getBoundingClientRect()
    const start = rect.top - top
    const end = rect.bottom - bottom
    if (start < 0 && end < 0) parent.scrollTop += Math.floor(Math.max(start, end))
    else if (start > 0 && end > 0) parent.scrollTop += Math.ceil(Math.min(start, end))
    return
  }
}

/** Safari's on-screen keyboard can shrink and pan only the visual viewport. */
export function useKeyboardViewport() {
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const { style } = document.documentElement
    let frame = 0

    const clear = () => {
      cancelAnimationFrame(frame)
      style.removeProperty('--keyboard-height')
      style.removeProperty('--keyboard-top')
      style.removeProperty('--keyboard-overlap')
    }
    const update = () => {
      const field = document.activeElement
      const editing =
        field instanceof HTMLElement &&
        field.matches(
          'input:not([type]), input[type="text"], input[type="search"], textarea, [contenteditable="true"]'
        )
      if (!editing || viewport.scale !== 1) {
        clear()
        return
      }
      if (viewport.height < window.innerHeight) {
        const overlap = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        style.setProperty('--keyboard-height', `${viewport.height}px`)
        style.setProperty('--keyboard-top', `${viewport.offsetTop}px`)
        style.setProperty('--keyboard-overlap', `${overlap}px`)
      } else {
        clear()
      }
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (document.activeElement === field && viewport.scale === 1) revealField(field, viewport)
      })
    }

    update()
    window.addEventListener('resize', update)
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    document.addEventListener('focusin', update)
    document.addEventListener('focusout', clear)
    return () => {
      window.removeEventListener('resize', update)
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      document.removeEventListener('focusin', update)
      document.removeEventListener('focusout', clear)
      clear()
    }
  }, [])
}
