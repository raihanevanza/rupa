import { render, type RenderOptions } from '@testing-library/react-native'
import type { ReactElement } from 'react'
import { ThemeProvider, type ThemeProviderProps } from './theme/ThemeProvider.js'

/** Renders inside a ThemeProvider (violet, light by default). */
export function renderWithTheme(
  ui: ReactElement,
  theme: Partial<Omit<ThemeProviderProps, 'children'>> = {},
  options?: RenderOptions,
) {
  return render(
    <ThemeProvider defaultBrand="violet" defaultMode="light" {...theme}>
      {ui}
    </ThemeProvider>,
    options,
  )
}
