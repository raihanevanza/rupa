import { forwardRef, type ReactNode } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'
import { fontSize, space } from '@rupa-ui/tokens/react-native'
import { TextOrNode, type RupaComponent, type ViewRef } from '../../lib/content.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'

export interface PageHeaderProps extends ViewProps {
  title: ReactNode
  description?: ReactNode
  /** Rendered next to the title, e.g. a status Badge. */
  meta?: ReactNode
  /** Buttons below the heading. */
  actions?: ReactNode
}

/**
 * The heading block of a screen. There is no breadcrumb as on the web: the navigation
 * header and back gesture do that job on mobile.
 */
export const PageHeader: RupaComponent<PageHeaderProps> = forwardRef<ViewRef, PageHeaderProps>(
  function PageHeader({ title, description, meta, actions, style, ...props }, ref) {
    const { palette: p, font } = useRupaTheme()
    return (
      <View ref={ref} style={[styles.header, style]} {...props}>
        <View style={styles.titleRow}>
          <View accessible accessibilityRole="header" style={styles.title}>
            <TextOrNode style={[styles.titleText, { color: p.ink }, font('bold')]}>
              {title}
            </TextOrNode>
          </View>
          {meta}
        </View>
        {description != null && (
          <TextOrNode style={[styles.description, { color: p.ink2 }, font()]}>
            {description}
          </TextOrNode>
        )}
        {actions != null && <View style={styles.actions}>{actions}</View>}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  header: { gap: space['2'] },
  titleRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space['3'] },
  title: { flexShrink: 1 },
  titleText: { fontSize: fontSize['2xl'], lineHeight: 30, letterSpacing: -0.24 },
  description: { fontSize: fontSize.sm, lineHeight: 20 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space['2'], marginTop: space['2'] },
})
