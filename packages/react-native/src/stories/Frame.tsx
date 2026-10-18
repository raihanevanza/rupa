import type { ReactNode } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../theme/ThemeProvider.js'

/** A phone-width column on the theme canvas, so stories look like a screen in the app. */
export function Phone({ children, width = 390 }: { children: ReactNode; width?: number }) {
  const { palette } = useTheme()
  return (
    <View
      style={[styles.phone, { width, backgroundColor: palette.canvas, borderColor: palette.line }]}
    >
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </View>
  )
}

/** Body text in the theme's ink and font, for example content. */
export function Body({ children }: { children: ReactNode }) {
  const { palette, font } = useTheme()
  return <Text style={[styles.body, { color: palette.ink2 }, font()]}>{children}</Text>
}

/** Lays out examples in a wrapping row. */
export function Row({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>
}

/** Stacks examples with a gap. */
export function Stack({ children }: { children: ReactNode }) {
  return <View style={styles.stack}>{children}</View>
}

const styles = StyleSheet.create({
  phone: { maxWidth: '100%', borderWidth: 1, borderRadius: 28, overflow: 'hidden' },
  content: { gap: 16, padding: 16 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  stack: { gap: 12, maxWidth: 420 },
  body: { fontSize: 14, lineHeight: 20 },
})
