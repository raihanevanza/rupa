import type { KeyboardEvent } from 'react'

/**
 * Arrow/Home/End navigation for a group of buttons (tabs, radios). Returns the index to
 * move to, or null when the key is not a navigation key. Disabled items are skipped.
 */
export function nextIndex(
  event: KeyboardEvent,
  current: number,
  disabled: boolean[],
  orientation: 'horizontal' | 'vertical' = 'horizontal',
): number | null {
  const prev = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
  const n = disabled.length
  const step = (from: number, dir: 1 | -1) => {
    for (let i = 1; i <= n; i++) {
      const j = (from + dir * i + n) % n
      if (!disabled[j]) return j
    }
    return from
  }
  switch (event.key) {
    case prev:
      return step(current, -1)
    case next:
      return step(current, 1)
    case 'Home':
      return step(-1, 1)
    case 'End':
      return step(n, -1)
    default:
      return null
  }
}
