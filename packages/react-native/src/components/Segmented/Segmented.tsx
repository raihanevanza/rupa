import { forwardRef, type ReactNode, type Ref } from 'react'
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native'
import { fontSize, radius, size as sizes, space } from '@rupa-ui/tokens/react-native'
import { renderIcon, TextOrNode, type IconSlot, type ViewRef } from '../../lib/content.js'
import { useControllable } from '../../lib/useControllable.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'

export interface SegmentedOption<T extends string = string> {
  value: T
  label: ReactNode
  icon?: IconSlot
  disabled?: boolean
  /** Spoken instead of `label`, e.g. when the label is only an icon. */
  accessibilityLabel?: string
}

export interface SegmentedProps<T extends string = string> extends ViewProps {
  options: SegmentedOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
  /** Spoken name of the group (e.g. "Status filter"). */
  label: string
  size?: 'sm' | 'md'
  /** Stretch to the container width, options sharing it equally. */
  block?: boolean
}

const PAD = 2

/** A single choice from 2–5 options, shown inline. Read as a radio group by screen readers. */
function SegmentedInner<T extends string>(
  {
    options,
    value: valueProp,
    defaultValue,
    onChange,
    label,
    size = 'md',
    block,
    style,
    ...props
  }: SegmentedProps<T>,
  ref: Ref<ViewRef>,
) {
  const { palette: p, shadows, font } = useRupaTheme()
  const [value, setValue] = useControllable<T | undefined>(
    valueProp,
    defaultValue,
    onChange as (v: T | undefined) => void,
  )
  const optionHeight = size === 'sm' ? sizes.controlSm - 6 : sizes.controlMd
  const slop = Math.max(0, (sizes.touchTarget - optionHeight) / 2)

  return (
    <View
      ref={ref}
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={[
        styles.group,
        { backgroundColor: p.surface2, borderColor: p.line },
        block ? styles.block : styles.inline,
        style,
      ]}
      {...props}
    >
      {options.map((option) => {
        const selected = option.value === value
        const fg = selected ? p.ink : p.ink2
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected, disabled: !!option.disabled }}
            accessibilityLabel={option.accessibilityLabel}
            disabled={option.disabled}
            hitSlop={{ top: slop, bottom: slop }}
            onPress={() => setValue(option.value)}
            style={({ pressed }) => [
              styles.option,
              {
                minHeight: optionHeight,
                paddingHorizontal: size === 'sm' ? space['2'] : space['3'],
              },
              block && styles.fill,
              pressed && !selected && { backgroundColor: p.surface3 },
              selected && {
                backgroundColor: p.surface,
                borderColor: p.lineStrong,
                boxShadow: shadows.card,
              },
              option.disabled && styles.disabled,
            ]}
          >
            {renderIcon(option.icon, fg)}
            <TextOrNode
              numberOfLines={1}
              style={[
                { color: fg, fontSize: size === 'sm' ? fontSize.xs : fontSize.sm, lineHeight: 20 },
                font(selected ? 'semibold' : 'medium'),
              ]}
            >
              {option.label}
            </TextOrNode>
          </Pressable>
        )
      })}
    </View>
  )
}

export const Segmented = forwardRef(SegmentedInner) as <T extends string = string>(
  props: SegmentedProps<T> & { ref?: Ref<ViewRef> },
) => ReactNode

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    gap: PAD,
    padding: PAD,
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  inline: { alignSelf: 'flex-start' },
  block: { alignSelf: 'stretch' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: radius.md,
  },
  fill: { flex: 1 },
  disabled: { opacity: 0.45 },
})
