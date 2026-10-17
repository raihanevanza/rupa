import { forwardRef, useEffect, useState, type ReactNode } from 'react'
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
} from 'react-native'
import { fontSize, radius, space } from '@rupa-ui/tokens/react-native'
import { TextOrNode, type RupaComponent, type ViewRef } from '../../lib/content.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'

export type BadgeTone = 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger'

export interface BadgeProps extends ViewProps {
  tone?: BadgeTone
  /** A leading dot. The text still carries the meaning; the dot only reinforces it. */
  dot?: boolean
  /** Animate the dot for live states (e.g. "Executing"). Implies `dot`. Respects reduced motion. */
  pulse?: boolean
  size?: 'sm' | 'md'
  children?: ReactNode
  textStyle?: StyleProp<TextStyle>
}

export const Badge: RupaComponent<BadgeProps> = forwardRef<ViewRef, BadgeProps>(function Badge(
  { tone = 'neutral', dot, pulse, size = 'md', children, style, textStyle, ...props },
  ref,
) {
  const { palette: p, font } = useRupaTheme()
  const colors = {
    neutral: { bg: p.surface3, fg: p.ink2, dot: p.ink3 },
    accent: { bg: p.accentSoft, fg: p.accent, dot: p.accent },
    info: { bg: p.infoSoft, fg: p.infoInk, dot: p.info },
    success: { bg: p.successSoft, fg: p.successInk, dot: p.success },
    warning: { bg: p.warningSoft, fg: p.warningInk, dot: p.warning },
    danger: { bg: p.dangerSoft, fg: p.dangerInk, dot: p.danger },
  }[tone]
  return (
    <View
      ref={ref}
      style={[
        styles.badge,
        { backgroundColor: colors.bg, minHeight: size === 'sm' ? 20 : 24 },
        style,
      ]}
      {...props}
    >
      {(dot || pulse) && <Dot color={colors.dot} pulse={!!pulse} />}
      <TextOrNode
        numberOfLines={1}
        style={[styles.text, { color: colors.fg }, font('semibold'), textStyle]}
      >
        {children}
      </TextOrNode>
    </View>
  )
})

function Dot({ color, pulse }: { color: string; pulse: boolean }) {
  const reduced = useReducedMotion()
  // State, not a ref: the animated value is created once and read during render.
  const [value] = useState(() => new Animated.Value(0))
  useEffect(() => {
    if (!pulse || reduced) {
      value.setValue(0)
      return
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [pulse, reduced, value])
  return (
    <Animated.View
      aria-hidden
      style={[
        styles.dot,
        {
          backgroundColor: color,
          opacity: value.interpolate({ inputRange: [0, 1], outputRange: [1, 0.35] }),
          transform: [{ scale: value.interpolate({ inputRange: [0, 1], outputRange: [1, 0.7] }) }],
        },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: space['2'],
    borderRadius: radius.full,
  },
  text: { fontSize: fontSize.xs, lineHeight: 16 },
  dot: { width: 6, height: 6, borderRadius: radius.full },
})
