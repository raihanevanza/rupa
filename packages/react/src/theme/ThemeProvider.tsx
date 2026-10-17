import { brands, type Brand } from '@rupa-ui/tokens'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeValue {
  brand: Brand
  mode: ThemeMode
  /** `mode` with `system` resolved to what the OS prefers. */
  resolvedMode: 'light' | 'dark'
  setBrand: (brand: Brand) => void
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeValue | null>(null)

export interface ThemeProviderProps {
  children: ReactNode
  defaultBrand?: Brand
  defaultMode?: ThemeMode
  /** localStorage key that remembers the choice; `null` to not persist. */
  storageKey?: string | null
  /** Element that receives data-brand / data-theme. Defaults to <html>. */
  target?: () => HTMLElement
}

const read = (key: string | null) => {
  if (!key) return null
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') as {
      brand?: Brand
      mode?: ThemeMode
    } | null
  } catch {
    return null
  }
}

/**
 * Optional helper: sets `data-brand` and `data-theme` on <html> and remembers the choice.
 * Setting the attributes yourself works just as well; the CSS does the rest.
 */
export function ThemeProvider({
  children,
  defaultBrand = 'violet',
  defaultMode = 'system',
  storageKey = 'rupa-theme',
  target = () => document.documentElement,
}: ThemeProviderProps) {
  const [brand, setBrand] = useState<Brand>(() => {
    const saved = typeof window === 'undefined' ? null : read(storageKey)?.brand
    return saved && brands.includes(saved) ? saved : defaultBrand
  })
  const [mode, setMode] = useState<ThemeMode>(
    () => (typeof window === 'undefined' ? null : read(storageKey)?.mode) ?? defaultMode,
  )
  const [prefersDark, setPrefersDark] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setPrefersDark(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const el = target()
    el.dataset.brand = brand
    el.dataset.theme = mode
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ brand, mode }))
      } catch {
        // Private mode or blocked storage: the theme still applies for this visit.
      }
    }
  }, [brand, mode, storageKey, target])

  const value = useMemo<ThemeValue>(
    () => ({
      brand,
      mode,
      resolvedMode: mode === 'system' ? (prefersDark ? 'dark' : 'light') : mode,
      setBrand,
      setMode,
    }),
    [brand, mode, prefersDark],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>')
  return value
}
