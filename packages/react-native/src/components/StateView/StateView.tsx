import { forwardRef, useEffect, type ReactNode } from 'react'
import {
  AccessibilityInfo,
  ActivityIndicator,
  StyleSheet,
  View,
  type ViewProps,
} from 'react-native'
import { fontSize, radius, space } from '@rupa-ui/tokens/react-native'
import { textOf, TextOrNode, type RupaComponent, type ViewRef } from '../../lib/content.js'
import { BangMark, TrayMark } from '../../lib/marks.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'
import { Button } from '../Button/Button.js'

export type ViewState = 'loading' | 'empty' | 'error'

export interface StateViewProps extends ViewProps {
  state: ViewState
  title?: ReactNode
  /** Defaults to a generic English sentence; pass `null` for none. */
  description?: ReactNode
  /** Custom icon for the empty state. */
  icon?: ReactNode
  /** Extra action, e.g. "Create request" for an empty list. */
  action?: ReactNode
  /** Shows a retry button in the error state. */
  onRetry?: () => void
  retryLabel?: string
  /** Shrinks paddings for use inside cards and list footers. */
  compact?: boolean
}

const defaults: Record<ViewState, { title: string; description?: string }> = {
  loading: { title: 'Loading…' },
  empty: { title: 'Nothing here yet', description: 'Items you add will show up here.' },
  error: { title: 'Something went wrong', description: 'Check your connection and try again.' },
}

/** One consistent look for loading, empty, and error states across every screen. */
export const StateView: RupaComponent<StateViewProps> = forwardRef<ViewRef, StateViewProps>(
  function StateView(
    {
      state,
      title,
      description,
      icon,
      action,
      onRetry,
      retryLabel = 'Try again',
      compact,
      style,
      ...props
    },
    ref,
  ) {
    const { palette: p, font } = useRupaTheme()
    const text = defaults[state]
    const heading = title ?? text.title
    // `null` means "no description"; only `undefined` falls back to the default text.
    const desc = description === undefined ? text.description : description
    const hasActions = action != null || (state === 'error' && onRetry)
    const spoken = [textOf(heading), textOf(desc)].filter(Boolean).join('. ')

    useEffect(() => {
      // The error replaces the content the user was looking at, so say it out loud (iOS has no
      // live regions; Android gets the live region below as well).
      if (state === 'error' && spoken) AccessibilityInfo.announceForAccessibility(spoken)
    }, [state, spoken])

    return (
      <View
        ref={ref}
        style={[styles.view, compact ? styles.compact : styles.roomy, style]}
        {...props}
      >
        {/* The icon only decorates; the title says what happened. */}
        <View
          aria-hidden
          style={[
            styles.icon,
            state === 'empty' && { backgroundColor: p.surface3 },
            state === 'error' && { backgroundColor: p.dangerSoft },
          ]}
        >
          {state === 'loading' && <ActivityIndicator size="large" color={p.accent} />}
          {state === 'empty' && (icon ?? <TrayMark color={p.ink3} />)}
          {state === 'error' && <BangMark color={p.dangerInk} size={22} />}
        </View>
        <View
          accessible
          accessibilityLabel={spoken}
          accessibilityRole={
            state === 'loading' ? 'progressbar' : state === 'error' ? 'alert' : undefined
          }
          accessibilityLiveRegion={state === 'empty' ? undefined : 'polite'}
        >
          <TextOrNode style={[styles.title, { color: p.ink }, font('semibold')]}>
            {heading}
          </TextOrNode>
          {desc != null && (
            <TextOrNode style={[styles.description, { color: p.ink3 }, font()]}>{desc}</TextOrNode>
          )}
        </View>
        {hasActions && (
          <View style={styles.actions}>
            {state === 'error' && onRetry && <Button onPress={onRetry}>{retryLabel}</Button>}
            {action}
          </View>
        )}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  view: { alignItems: 'center', gap: space['2'] },
  roomy: { paddingVertical: space['12'], paddingHorizontal: space['6'] },
  compact: { paddingVertical: space['6'], paddingHorizontal: space['4'] },
  icon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space['2'],
    borderRadius: radius.full,
  },
  title: { fontSize: fontSize.md, lineHeight: 22, textAlign: 'center' },
  description: {
    maxWidth: 320,
    marginTop: space['2'],
    fontSize: fontSize.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: space['2'],
    marginTop: space['3'],
  },
})
