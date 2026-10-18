import { forwardRef, useEffect, type ReactNode } from 'react'
import { AccessibilityInfo, StyleSheet, View, type ViewProps } from 'react-native'
import { fontSize, radius, space } from '@rupa-ui/tokens/react-native'
import {
  textOf,
  TextOrNode,
  withAlpha,
  type RupaComponent,
  type ViewRef,
} from '../../lib/content.js'
import { BangMark, CheckMark } from '../../lib/marks.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'

export interface AlertProps extends ViewProps {
  tone?: 'info' | 'success' | 'warning' | 'danger'
  title?: ReactNode
  children?: ReactNode
  /** A button below the text, e.g. "Retry". */
  action?: ReactNode
  /** Announce the alert when it appears (form errors, failed actions). */
  live?: boolean
}

/** A message inside the page. Each tone has its own icon, so color is not the only cue. */
export const Alert: RupaComponent<AlertProps> = forwardRef<ViewRef, AlertProps>(function Alert(
  { tone = 'info', title, children, action, live, style, ...props },
  ref,
) {
  const { palette: p, font } = useRupaTheme()
  const c = {
    info: { bg: p.infoSoft, fg: p.infoInk, base: p.info },
    success: { bg: p.successSoft, fg: p.successInk, base: p.success },
    warning: { bg: p.warningSoft, fg: p.warningInk, base: p.warning },
    danger: { bg: p.dangerSoft, fg: p.dangerInk, base: p.danger },
  }[tone]
  const spoken = [textOf(title), textOf(children)].filter(Boolean).join('. ')

  useEffect(() => {
    // iOS has no live regions; Android's liveRegion only fires on change, not on mount.
    if (live && spoken) AccessibilityInfo.announceForAccessibility(spoken)
  }, [live, spoken])

  return (
    <View
      ref={ref}
      // A live alert is read as one element. With an action it stays ungrouped, so the
      // button inside remains reachable.
      accessible={live && action == null}
      role={live ? 'alert' : undefined}
      aria-live={live ? 'assertive' : undefined}
      style={[styles.alert, { backgroundColor: c.bg, borderColor: withAlpha(c.base, 0.3) }, style]}
      {...props}
    >
      <View style={[styles.icon, { borderColor: c.fg }]}>
        {tone === 'success' ? (
          <CheckMark color={c.fg} size={10} weight={2} />
        ) : (
          <BangMark color={c.fg} size={11} info={tone === 'info'} />
        )}
      </View>
      <View style={styles.body}>
        {title != null && (
          <TextOrNode style={[styles.text, { color: c.fg }, font('semibold')]}>{title}</TextOrNode>
        )}
        {children != null && (
          <TextOrNode style={[styles.text, { color: p.ink2 }, font()]}>{children}</TextOrNode>
        )}
        {action != null && <View style={styles.action}>{action}</View>}
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  alert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space['3'],
    paddingVertical: space['3'],
    paddingHorizontal: space['4'],
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  icon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: radius.full,
  },
  body: { flex: 1, gap: space['1'] },
  text: { fontSize: fontSize.sm, lineHeight: 20 },
  action: { marginTop: space['2'] },
})
