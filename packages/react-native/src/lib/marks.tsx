import { StyleSheet, View } from 'react-native'

/**
 * Small status marks drawn with Views, so the package needs no SVG library.
 * `size` is the box they are centered in.
 */
interface MarkProps {
  color: string
  size?: number
  weight?: number
}

export function CheckMark({ color, size = 14, weight = 2.5 }: MarkProps) {
  return (
    <View style={[styles.box, { width: size, height: size }]} aria-hidden>
      <View
        style={{
          width: size * 0.7,
          height: size * 0.38,
          borderLeftWidth: weight,
          borderBottomWidth: weight,
          borderColor: color,
          transform: [{ translateY: -size * 0.08 }, { rotate: '-45deg' }],
        }}
      />
    </View>
  )
}

export function CrossMark({ color, size = 14, weight = 2.5 }: MarkProps) {
  const bar = {
    position: 'absolute' as const,
    width: size * 0.85,
    height: weight,
    borderRadius: weight,
    backgroundColor: color,
  }
  return (
    <View style={[styles.box, { width: size, height: size }]} aria-hidden>
      <View style={[bar, { transform: [{ rotate: '45deg' }] }]} />
      <View style={[bar, { transform: [{ rotate: '-45deg' }] }]} />
    </View>
  )
}

export function MinusMark({ color, size = 14, weight = 2.5 }: MarkProps) {
  return (
    <View style={[styles.box, { width: size, height: size }]} aria-hidden>
      <View
        style={{ width: size * 0.7, height: weight, borderRadius: weight, backgroundColor: color }}
      />
    </View>
  )
}

/** A downward chevron, e.g. on a control that opens a list. */
export function ChevronMark({ color, size = 14, weight = 2 }: MarkProps) {
  return (
    <View style={[styles.box, { width: size, height: size }]} aria-hidden>
      <View
        style={{
          width: size * 0.5,
          height: size * 0.5,
          borderRightWidth: weight,
          borderBottomWidth: weight,
          borderColor: color,
          transform: [{ translateY: -size * 0.12 }, { rotate: '45deg' }],
        }}
      />
    </View>
  )
}

/** A magnifying glass: a ring and a handle. */
export function SearchMark({ color, size = 16, weight = 2 }: MarkProps) {
  const ring = size * 0.62
  return (
    <View style={{ width: size, height: size }} aria-hidden>
      <View
        style={{
          width: ring,
          height: ring,
          borderWidth: weight,
          borderRadius: ring,
          borderColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: size * 0.04,
          bottom: size * 0.1,
          width: size * 0.36,
          height: weight,
          borderRadius: weight,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  )
}

/** "!" (alert) or "i" (info) drawn as a dot and a bar, so it does not depend on the font. */
export function BangMark({ color, size = 14, info }: MarkProps & { info?: boolean }) {
  const w = Math.max(2, size * 0.16)
  const dot = <View style={{ width: w, height: w, borderRadius: w, backgroundColor: color }} />
  const bar = (
    <View style={{ width: w, height: size * 0.42, borderRadius: w, backgroundColor: color }} />
  )
  return (
    <View style={[styles.box, { width: size, height: size, gap: w * 0.9 }]} aria-hidden>
      {info ? dot : bar}
      {info ? bar : dot}
    </View>
  )
}

/** An empty tray, the default icon of the empty state. */
export function TrayMark({ color, size = 24 }: MarkProps) {
  return (
    <View style={[styles.box, { width: size, height: size }]} aria-hidden>
      <View
        style={{
          width: size * 0.82,
          height: size * 0.62,
          borderWidth: 2,
          borderColor: color,
          borderRadius: size * 0.14,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: size * 0.12,
        }}
      >
        <View style={{ width: size * 0.32, height: 2, borderRadius: 2, backgroundColor: color }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
})
