import { forwardRef } from 'react'
import { ActivityIndicator, View, type ViewProps } from 'react-native'
import type { RupaComponent, ViewRef } from '../../lib/content.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'

export interface SpinnerProps extends ViewProps {
  /** Read by screen readers. Pass `null` when the spinner is decorative (e.g. inside a busy button). */
  label?: string | null
  size?: 'sm' | 'md' | 'lg'
  /** Defaults to the brand accent. */
  color?: string
}

const native = { sm: 'small', md: 'small', lg: 'large' } as const

export const Spinner: RupaComponent<SpinnerProps> = forwardRef<ViewRef, SpinnerProps>(
  function Spinner({ label = 'Loading', size = 'md', color, ...props }, ref) {
    const { palette } = useRupaTheme()
    const decorative = label === null
    return (
      <View
        ref={ref}
        accessible={!decorative}
        accessibilityRole={decorative ? undefined : 'progressbar'}
        accessibilityLabel={decorative ? undefined : label}
        aria-hidden={decorative || undefined}
        {...props}
      >
        <ActivityIndicator
          size={native[size]}
          color={color ?? palette.accent}
          style={size === 'sm' ? { transform: [{ scale: 0.8 }] } : undefined}
        />
      </View>
    )
  },
)
