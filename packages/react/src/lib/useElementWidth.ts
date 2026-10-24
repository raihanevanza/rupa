import { useEffect, useRef, useState } from 'react'

/**
 * Width of an element in px, updated when it resizes. Draw SVG charts at their real width
 * instead of scaling them, so text stays sharp and undistorted on phones. `initial` is used
 * for the server render.
 *
 * Measure an element with `container-type: inline-size` (ChartPlot has it). Without it, the
 * first SVG width pushes the parent wider, the observer reads the widened size, and the page
 * starts to scroll sideways.
 */
export function useElementWidth<T extends HTMLElement>(initial = 640) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(initial)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}
