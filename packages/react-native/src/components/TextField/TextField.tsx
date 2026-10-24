import {
  forwardRef,
  useState,
  type ComponentRef,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes,
} from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native'
import { fontSize, radius, size as sizes, space } from '@rupa-ui/tokens/react-native'
import { renderIcon, textOf, TextOrNode, type IconSlot } from '../../lib/content.js'
import { BangMark } from '../../lib/marks.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'

export interface TextFieldProps extends Omit<TextInputProps, 'style' | 'editable' | 'aria-label'> {
  /** Shown above the input and spoken as its name. */
  label: string
  hint?: ReactNode
  /** Error message under the input, also spoken as its hint. Draws the danger border. */
  error?: ReactNode
  required?: boolean
  /** Spoken after required labels. */
  requiredLabel?: string
  /** Hide the label visually; screen readers still hear it (e.g. a search box with an icon). */
  hideLabel?: boolean
  /** Text or icon inside the input, before the value (e.g. "Rp"). `(color) => node` matches it. */
  prefix?: IconSlot
  /** After the value, e.g. a clear button. */
  suffix?: IconSlot
  disabled?: boolean
  /** The outer field (label, input, messages); `inputStyle` goes on the TextInput. */
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
}

/** What a ref (and `testID`) on TextField points to: the TextInput, so `ref.current.focus()` works. */
export type TextFieldRef = ComponentRef<typeof TextInput>

/**
 * Label + input + hint + error, the React Native TextField. `multiline` turns it into a text
 * area. The input speaks the label, the required state, and the error or hint.
 */
export const TextField: ForwardRefExoticComponent<
  PropsWithoutRef<TextFieldProps> & RefAttributes<TextFieldRef>
> = forwardRef<TextFieldRef, TextFieldProps>(function TextField(
  {
    label,
    hint,
    error,
    required,
    requiredLabel = 'required',
    hideLabel,
    prefix,
    suffix,
    disabled,
    multiline,
    style,
    inputStyle,
    testID,
    onFocus,
    onBlur,
    ...props
  },
  ref,
) {
  const { palette: p, font } = useRupaTheme()
  const [focused, setFocused] = useState(false)
  const invalid = error != null && error !== false
  const ring = invalid ? p.danger : p.focus

  return (
    <View style={[styles.field, style]}>
      {!hideLabel && (
        // The input speaks the label itself, so the visible one is skipped.
        <Text style={[styles.label, { color: p.ink }, font('medium')]} aria-hidden>
          {label}
          {required && <Text style={{ color: p.dangerInk }}> *</Text>}
        </Text>
      )}
      <View
        style={[
          styles.control,
          multiline && styles.controlMultiline,
          {
            backgroundColor: disabled ? p.surface2 : p.surface,
            borderColor: invalid ? p.danger : focused ? p.focus : p.controlBorder,
            boxShadow: focused ? `0px 0px 0px 1px ${ring}` : undefined,
          },
        ]}
      >
        {prefix != null && (
          <View style={[styles.adornment, multiline && styles.adornmentTop]}>
            <TextOrNode style={[styles.adornmentText, { color: p.ink3 }, font()]}>
              {renderIcon(prefix, p.ink3)}
            </TextOrNode>
          </View>
        )}
        <TextInput
          ref={ref}
          testID={testID}
          aria-label={required ? `${label}, ${requiredLabel}` : label}
          aria-disabled={!!disabled}
          accessibilityHint={invalid ? textOf(error) : hint != null ? textOf(hint) : undefined}
          editable={!disabled}
          multiline={multiline}
          placeholderTextColor={p.ink3}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            { color: disabled ? p.ink3 : p.ink },
            font(),
            inputStyle,
          ]}
          {...props}
        />
        {suffix != null && (
          <View style={[styles.adornment, multiline && styles.adornmentTop]}>
            <TextOrNode style={[styles.adornmentText, { color: p.ink3 }, font()]}>
              {renderIcon(suffix, p.ink3)}
            </TextOrNode>
          </View>
        )}
      </View>
      {invalid && (
        <View style={styles.error}>
          <BangMark color={p.dangerInk} size={14} />
          <TextOrNode style={[styles.message, { color: p.dangerInk }, font('medium')]}>
            {error}
          </TextOrNode>
        </View>
      )}
      {hint != null && (
        <TextOrNode style={[styles.message, { color: p.ink3 }, font()]}>{hint}</TextOrNode>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  field: { gap: space['1'] + 2 },
  label: { fontSize: fontSize.sm, lineHeight: 20 },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space['2'],
    minHeight: sizes.touchTarget,
    paddingHorizontal: space['3'],
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  controlMultiline: { alignItems: 'stretch' },
  adornment: { flexDirection: 'row', alignItems: 'center' },
  adornmentTop: { alignItems: 'flex-start', paddingTop: space['3'] },
  adornmentText: { fontSize: fontSize.md, lineHeight: 22 },
  // 16 pt text stops iOS Safari from zooming into the field.
  // The box shows focus with its border, so the browser outline is off on the web.
  input: {
    flex: 1,
    minHeight: sizes.touchTarget - 2,
    fontSize: fontSize.md,
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  inputMultiline: {
    minHeight: 96,
    paddingTop: space['3'],
    paddingBottom: space['3'],
    textAlignVertical: 'top',
  },
  error: { flexDirection: 'row', alignItems: 'flex-start', gap: space['1'] },
  message: { flexShrink: 1, fontSize: fontSize.xs, lineHeight: 16 },
})
