import { forwardRef, type ReactNode } from 'react'
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native'
import { fontSize, radius, size as sizes, space } from '@rupa-ui/tokens/react-native'
import {
  renderIcon,
  TextOrNode,
  type IconSlot,
  type RupaComponent,
  type ViewRef,
} from '../../lib/content.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'
import { Spinner } from '../Spinner/Spinner.js'

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner, reports busy to screen readers, and ignores presses so the action cannot run twice. */
  loading?: boolean
  /** A node, or `(color) => node` to match the label color (e.g. a lucide-react-native icon). */
  iconStart?: IconSlot
  iconEnd?: IconSlot
  /** Stretch to the container width. */
  block?: boolean
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const metrics = {
  // `md` is 44 pt tall, the minimum touch target; `sm` reaches it through hitSlop.
  sm: { minHeight: sizes.controlSm, px: space['3'], radius: radius.md, text: fontSize.xs },
  md: { minHeight: sizes.touchTarget, px: space['4'], radius: radius.lg, text: fontSize.sm },
  lg: { minHeight: sizes.controlLg, px: space['6'], radius: radius.lg, text: fontSize.md },
}

export const Button: RupaComponent<ButtonProps> = forwardRef<ViewRef, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading = false,
    iconStart,
    iconEnd,
    block,
    disabled,
    children,
    style,
    textStyle,
    onPress,
    hitSlop,
    accessibilityState,
    ...props
  },
  ref,
) {
  const { palette: p, font } = useRupaTheme()
  const m = metrics[size]
  const look = {
    primary: { bg: p.primary, pressed: p.primaryHover, fg: p.onPrimary, border: 'transparent' },
    secondary: { bg: p.surface, pressed: p.surface3, fg: p.ink, border: p.lineStrong },
    // No lighter/darker token for these, so pressing dims them with an overlay instead.
    danger: { bg: p.danger, pressed: null, fg: p.onDanger, border: 'transparent' },
    success: { bg: p.success, pressed: null, fg: p.onSuccess, border: 'transparent' },
    ghost: { bg: 'transparent', pressed: p.surface3, fg: p.ink2, border: 'transparent' },
  }[variant]
  const slop = size === 'sm' ? (sizes.touchTarget - sizes.controlSm) / 2 : undefined

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: !!disabled || loading, busy: loading }}
      disabled={disabled}
      hitSlop={hitSlop ?? slop}
      onPress={loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: m.minHeight,
          paddingHorizontal: m.px,
          borderRadius: m.radius,
          borderColor: look.border,
          backgroundColor: pressed && !loading && look.pressed ? look.pressed : look.bg,
        },
        block && styles.block,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {({ pressed }) => (
        <>
          {pressed && !loading && !look.pressed && (
            <View style={[StyleSheet.absoluteFill, styles.dim, { borderRadius: m.radius }]} />
          )}
          {loading ? (
            <Spinner label={null} size="sm" color={look.fg} />
          ) : (
            renderIcon(iconStart, look.fg)
          )}
          <TextOrNode
            numberOfLines={1}
            style={[
              { color: look.fg, fontSize: m.text, lineHeight: Math.round(m.text * 1.25) },
              font('semibold'),
              textStyle,
            ]}
          >
            {children}
          </TextOrNode>
          {!loading && renderIcon(iconEnd, look.fg)}
        </>
      )}
    </Pressable>
  )
})

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    gap: space['2'],
    borderWidth: 1,
    overflow: 'hidden',
  },
  block: { alignSelf: 'stretch' },
  disabled: { opacity: 0.5 },
  dim: { backgroundColor: '#00000024' },
})
