import { palettes } from '@rupa-ui/tokens/react-native'
import { act, render, renderHook, screen } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import * as RN from 'react-native'
import { Text } from 'react-native'
import { Badge } from '../components/Badge/Badge.js'
import { ThemeProvider, useTheme } from './ThemeProvider.js'

const scheme = jest.spyOn(RN, 'useColorScheme')
afterEach(() => scheme.mockReset())

test('useTheme outside a provider fails loudly', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  await expect(renderHook(() => useTheme())).rejects.toThrow(/inside <ThemeProvider>/)
})

test('system mode follows the OS scheme', async () => {
  scheme.mockReturnValue('dark')
  const { result } = await renderHook(() => useTheme(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider defaultBrand="signal">{children}</ThemeProvider>
    ),
  })
  expect(result.current.mode).toBe('system')
  expect(result.current.resolvedMode).toBe('dark')
  expect(result.current.palette).toEqual(palettes.signal.dark)
})

test('setBrand and setMode switch the palette at runtime', async () => {
  const { result } = await renderHook(() => useTheme(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider defaultMode="light">{children}</ThemeProvider>
    ),
  })
  expect(result.current.palette.primary).toBe(palettes.violet.light.primary)
  await act(() => {
    result.current.setBrand('signal')
    result.current.setMode('dark')
  })
  expect(result.current.palette).toEqual(palettes.signal.dark)
})

test('controlled brand reports changes and keeps the prop value', async () => {
  const onBrandChange = jest.fn()
  const { result } = await renderHook(() => useTheme(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider brand="violet" mode="light" onBrandChange={onBrandChange}>
        {children}
      </ThemeProvider>
    ),
  })
  await act(() => result.current.setBrand('signal'))
  expect(onBrandChange).toHaveBeenCalledWith('signal')
  expect(result.current.brand).toBe('violet')
})

test('a nested provider inherits what it does not override', async () => {
  function Probe() {
    const t = useTheme()
    return <Text>{`${t.brand}/${t.resolvedMode}`}</Text>
  }
  await render(
    <ThemeProvider defaultBrand="signal" defaultMode="light">
      <ThemeProvider defaultMode="dark">
        <Probe />
      </ThemeProvider>
    </ThemeProvider>,
  )
  expect(screen.getByText('signal/dark')).toBeOnTheScreen()
})

test('fonts="system" uses fontWeight instead of the bundled families', async () => {
  const { result } = await renderHook(() => useTheme(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider fonts="system">{children}</ThemeProvider>
    ),
  })
  expect(result.current.font('semibold')).toEqual({ fontWeight: '600' })
})

test('components render without a provider (violet, OS scheme)', async () => {
  scheme.mockReturnValue('dark')
  await render(<Badge tone="accent">New</Badge>)
  expect(screen.getByText('New')).toHaveStyle({ color: palettes.violet.dark.accent })
})
