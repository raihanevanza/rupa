import { forwardRef, type ReactNode } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'
import { fontSize, space } from '@rupa-ui/tokens/react-native'
import { textOf, TextOrNode, type RupaComponent, type ViewRef } from '../../lib/content.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'

export interface InfoItem {
  label: ReactNode
  value: ReactNode
  /** Span the full row (long text, addresses). */
  wide?: boolean
}

export interface InfoListProps extends ViewProps {
  items: InfoItem[]
  /** One column suits phones; two fits short values or tablets. */
  columns?: 1 | 2 | 3
  /** Shown when a value is empty (null, undefined, or ''). */
  emptyValue?: ReactNode
}

/** Label/value pairs, e.g. the details of a request. Each pair is read as one item. */
export const InfoList: RupaComponent<InfoListProps> = forwardRef<ViewRef, InfoListProps>(
  function InfoList({ items, columns = 1, emptyValue = '—', style, ...props }, ref) {
    const { palette: p, font } = useRupaTheme()

    // Wide items take a row of their own; the rest fill rows of `columns`.
    const rows: InfoItem[][] = []
    for (const item of items) {
      const last = rows[rows.length - 1]
      if (item.wide || !last || last.length >= columns || last[0]?.wide) rows.push([item])
      else last.push(item)
    }

    return (
      <View ref={ref} style={[styles.list, style]} {...props}>
        {rows.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((item, i) => {
              const empty = item.value == null || item.value === ''
              const value = empty ? emptyValue : item.value
              const plain = typeof value === 'string' || typeof value === 'number'
              return (
                <View
                  key={i}
                  style={styles.item}
                  // Plain values are grouped so "Status, Approved" is one swipe; rich values
                  // (links, buttons) stay separate so they remain reachable.
                  accessible={plain}
                  accessibilityLabel={plain ? `${textOf(item.label)}, ${textOf(value)}` : undefined}
                >
                  <TextOrNode style={[styles.label, { color: p.ink3 }, font('medium')]}>
                    {item.label}
                  </TextOrNode>
                  <TextOrNode style={[styles.value, { color: p.ink }, font()]}>{value}</TextOrNode>
                </View>
              )
            })}
            {!row[0]?.wide &&
              Array.from({ length: columns - row.length }, (_, i) => (
                <View key={`pad-${i}`} style={styles.item} />
              ))}
          </View>
        ))}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  list: { gap: space['4'] },
  row: { flexDirection: 'row', gap: space['6'] },
  item: { flex: 1, gap: space['1'] },
  label: {
    fontSize: fontSize.xs,
    lineHeight: 16,
    letterSpacing: 0.24,
    textTransform: 'uppercase',
  },
  value: { fontSize: fontSize.sm, lineHeight: 20 },
})
