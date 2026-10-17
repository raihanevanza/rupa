import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

/** Follows the OS "Reduce motion" setting (iOS) / "Remove animations" (Android). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    let active = true
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduced(value)
    })
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced)
    return () => {
      active = false
      sub.remove()
    }
  }, [])
  return reduced
}
