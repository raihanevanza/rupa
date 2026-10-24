import { forwardRef, useEffect, useRef, type ComponentRef, type ReactNode, type Ref } from 'react'
import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native'
import { fontSize, radius, size as sizes, space } from '@rupa-ui/tokens/react-native'
import { renderIcon, TextOrNode, type IconSlot, type ViewRef } from '../../lib/content.js'
import { useControllable } from '../../lib/useControllable.js'
import { useReducedMotion } from '../../lib/useReducedMotion.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'

export interface ChipOption<T extends string = string> {
  value: T
  label: ReactNode
  icon?: IconSlot
  disabled?: boolean
  /** Spoken instead of `label`, e.g. "Pending, 12 calls". */
  accessibilityLabel?: string
}

export interface ChipGroupProps<T extends string = string> extends ViewProps {
  options: ChipOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  /** Spoken name of the group (e.g. "Status filter"). */
  label: string
  /** Wrap onto several rows instead of scrolling sideways in one. */
  wrap?: boolean
  /**
   * Space before the first and after the last chip of a scrolling row, so it lines up with
   * the screen's padding while the chips still scroll to the edge.
   */
  inset?: number
}

const CHIP_HEIGHT = sizes.controlMd - 4
const SLOP = (sizes.touchTarget - CHIP_HEIGHT) / 2

/**
 * A single choice from many options as pills, e.g. a status filter above a list. One row
 * that scrolls sideways (the chosen chip scrolls into view), or `wrap` for several rows.
 * Read as a radio group by screen readers. For 2–5 short options use Segmented.
 */
function ChipGroupInner<T extends string>(
  {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    label,
    wrap,
    inset = 0,
    style,
    ...props
  }: ChipGroupProps<T>,
  ref: Ref<ViewRef>,
) {
  const { palette: p, font } = useRupaTheme()
  const [value, setValue] = useControllable<T | undefined>(
    valueProp,
    defaultValue,
    onChange as (v: T | undefined) => void,
  )
  const reduced = useReducedMotion()
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null)
  // x of every chip, to scroll the chosen one into view
  const positions = useRef(new Map<string, number>())

  useEffect(() => {
    const x = value === undefined ? undefined : positions.current.get(value)
    if (!wrap && x !== undefined) {
      // Jumps instead of gliding under Reduce Motion.
      scroll.current?.scrollTo({ x: Math.max(0, x - inset - space['4']), animated: !reduced })
    }
    // Only a new choice scrolls; turning Reduce Motion on or off does not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, wrap, inset])

  const chips = options.map((option) => {
    const selected = option.value === value
    const fg = selected ? p.accent : p.ink2
    return (
      <Pressable
        key={option.value}
        role="radio"
        aria-checked={selected}
        aria-disabled={!!option.disabled}
        aria-label={option.accessibilityLabel}
        disabled={option.disabled}
        hitSlop={{ top: SLOP, bottom: SLOP }}
        onLayout={(e) => positions.current.set(option.value, e.nativeEvent.layout.x)}
        onPress={() => setValue(option.value)}
        style={({ pressed }) => [
          styles.chip,
          selected
            ? { backgroundColor: p.accentSoft, borderColor: p.accentLine }
            : { backgroundColor: pressed ? p.surface3 : p.surface, borderColor: p.line },
          option.disabled && styles.disabled,
        ]}
      >
        {renderIcon(option.icon, fg)}
        <TextOrNode
          numberOfLines={1}
          style={[styles.text, { color: fg }, font(selected ? 'semibold' : 'medium')]}
        >
          {option.label}
        </TextOrNode>
      </Pressable>
    )
  })

  if (wrap) {
    return (
      <View
        ref={ref}
        role="radiogroup"
        aria-label={label}
        style={[styles.row, styles.wrap, style]}
        {...props}
      >
        {chips}
      </View>
    )
  }
  return (
    <View ref={ref} role="radiogroup" aria-label={label} style={style} {...props}>
      <ScrollView
        ref={scroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.row,
          // Room for the hit slop, so the scroll view does not clip it.
          { paddingHorizontal: inset, paddingVertical: SLOP },
        ]}
      >
        {chips}
      </ScrollView>
    </View>
  )
}

export const ChipGroup = forwardRef(ChipGroupInner) as <T extends string = string>(
  props: ChipGroupProps<T> & { ref?: Ref<ViewRef> },
) => ReactNode

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space['2'] },
  wrap: { flexWrap: 'wrap' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: CHIP_HEIGHT,
    paddingHorizontal: space['3'] + 2,
    borderWidth: 1,
    borderRadius: radius.full,
  },
  text: { fontSize: fontSize.sm, lineHeight: 20 },
  disabled: { opacity: 0.45 },
})
