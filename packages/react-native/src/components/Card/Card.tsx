import { forwardRef, type ReactNode } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'
import { fontSize, radius, space } from '@rupa-ui/tokens/react-native'
import { TextOrNode, type RupaComponent, type ViewRef } from '../../lib/content.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'

export interface CardProps extends ViewProps {
  title?: ReactNode
  description?: ReactNode
  /** Buttons shown at the top right of the header. */
  actions?: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children?: ReactNode
}

const pads = { none: 0, sm: space['3'], md: space['5'], lg: space['8'] }

export const Card: RupaComponent<CardProps> = forwardRef<ViewRef, CardProps>(function Card(
  { title, description, actions, padding = 'md', children, style, ...props },
  ref,
) {
  const { palette: p, shadows, font } = useRupaTheme()
  const hasHeader = title != null || actions != null
  return (
    <View
      ref={ref}
      style={[
        styles.card,
        {
          padding: pads[padding],
          backgroundColor: p.surface,
          borderColor: p.line,
          boxShadow: shadows.card,
        },
        style,
      ]}
      {...props}
    >
      {hasHeader && (
        <View style={[styles.header, padding === 'none' && styles.headerInset]}>
          <View style={styles.heading}>
            {title != null && (
              <View accessible accessibilityRole="header">
                <TextOrNode style={[styles.title, { color: p.ink }, font('semibold')]}>
                  {title}
                </TextOrNode>
              </View>
            )}
            {description != null && (
              <TextOrNode style={[styles.description, { color: p.ink3 }, font()]}>
                {description}
              </TextOrNode>
            )}
          </View>
          {actions != null && <View style={styles.actions}>{actions}</View>}
        </View>
      )}
      {children}
    </View>
  )
})

const styles = StyleSheet.create({
  card: { gap: space['4'], borderWidth: 1, borderRadius: radius.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space['4'],
  },
  headerInset: { paddingTop: space['5'], paddingHorizontal: space['5'] },
  heading: { flex: 1, gap: space['1'] },
  title: { fontSize: fontSize.md, lineHeight: 22 },
  description: { fontSize: fontSize.sm, lineHeight: 20 },
  actions: { flexDirection: 'row', gap: space['2'] },
})
