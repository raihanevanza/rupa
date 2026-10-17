import {
  fontFamily,
  palettes,
  shadows as shadowTokens,
  type Brand,
  type Mode,
  type Palette,
  type Weight,
} from '@rupa-ui/tokens/react-native'
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useColorScheme, type TextStyle } from 'react-native'
import { useControllable } from '../lib/useControllable.js'

export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * `rupa` uses the Plus Jakarta Sans files the app bundles (one family per weight, so Android
 * never double-bolds). `system` uses the platform font with `fontWeight`, for apps that do not
 * ship the font.
 */
export type ThemeFonts = 'rupa' | 'system'

export interface Theme {
  brand: Brand
  mode: ThemeMode
  /** `mode` with `system` resolved to what the OS prefers. */
  resolvedMode: Mode
  /** Every semantic color of the active brand and mode. */
  palette: Palette
  /** `boxShadow` strings (React Native 0.76+, New Architecture). */
  shadows: { card: string; pop: string }
  /** Spread into a text style: `{ ...theme.font('semibold') }`. */
  font: (weight?: Weight) => TextStyle
  setBrand: (brand: Brand) => void
  setMode: (mode: ThemeMode) => void
}

type ThemeValue = Theme & { fonts: ThemeFonts }

const ThemeContext = createContext<ThemeValue | null>(null)

const systemWeight: Record<Weight, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

export interface ThemeProviderProps {
  children: ReactNode
  /** Controlled brand. Leave it out and use `defaultBrand` to let the provider hold it. */
  brand?: Brand
  defaultBrand?: Brand
  onBrandChange?: (brand: Brand) => void
  /** Controlled mode; `system` follows the OS setting and updates when it changes. */
  mode?: ThemeMode
  defaultMode?: ThemeMode
  onModeChange?: (mode: ThemeMode) => void
  fonts?: ThemeFonts
}

/**
 * Supplies the brand, mode, and palette to every Rupa component below it. Providers can be
 * nested (a dark panel in a light screen); an inner provider starts from the outer one's
 * values. To remember the choice across launches, control `brand`/`mode` and save them with
 * your app's storage (AsyncStorage, MMKV).
 */
export function ThemeProvider({
  children,
  brand: brandProp,
  defaultBrand,
  onBrandChange,
  mode: modeProp,
  defaultMode,
  onModeChange,
  fonts,
}: ThemeProviderProps) {
  const parent = useContext(ThemeContext)
  const [brand, setBrand] = useControllable<Brand>(
    brandProp,
    defaultBrand ?? parent?.brand ?? 'violet',
    onBrandChange,
  )
  const [mode, setMode] = useControllable<ThemeMode>(
    modeProp,
    defaultMode ?? parent?.mode ?? 'system',
    onModeChange,
  )
  const scheme = useColorScheme()
  const resolvedMode: Mode = mode === 'system' ? (scheme === 'dark' ? 'dark' : 'light') : mode
  const fontSet = fonts ?? parent?.fonts ?? 'rupa'

  const value = useMemo(
    () => ({ ...buildTheme(brand, mode, resolvedMode, fontSet), setBrand, setMode }),
    [brand, mode, resolvedMode, fontSet, setBrand, setMode],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

type BuiltTheme = Omit<Theme, 'setBrand' | 'setMode'> & { fonts: ThemeFonts }

function buildTheme(brand: Brand, mode: ThemeMode, resolvedMode: Mode, fonts: ThemeFonts) {
  return {
    brand,
    mode,
    resolvedMode,
    fonts,
    palette: palettes[brand][resolvedMode],
    shadows: shadowTokens[brand][resolvedMode],
    font: (weight: Weight = 'regular'): TextStyle =>
      fonts === 'rupa' ? { fontFamily: fontFamily(weight) } : { fontWeight: systemWeight[weight] },
  } satisfies BuiltTheme
}

/** The theme from the nearest ThemeProvider, with setters to change it at runtime. */
export function useTheme(): Theme {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>')
  return value
}

/**
 * Components read the theme through this, so they still render without a provider:
 * violet brand, the OS light/dark setting, and the Rupa font.
 */
export function useRupaTheme(): Omit<Theme, 'setBrand' | 'setMode'> {
  const value = useContext(ThemeContext)
  const scheme = useColorScheme()
  const resolvedMode: Mode = scheme === 'dark' ? 'dark' : 'light'
  const fallback = useMemo(
    () => buildTheme('violet', 'system', resolvedMode, 'rupa'),
    [resolvedMode],
  )
  return value ?? fallback
}
