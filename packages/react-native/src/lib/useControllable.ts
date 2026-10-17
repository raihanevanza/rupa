import { useCallback, useState } from 'react'

/**
 * State that can be controlled (value + onChange from the parent) or uncontrolled
 * (defaultValue). Mirrors how native inputs behave.
 */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const [inner, setInner] = useState(defaultValue)
  const controlled = value !== undefined

  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next)
      onChange?.(next)
    },
    [controlled, onChange],
  )
  return [controlled ? value : inner, set] as const
}
