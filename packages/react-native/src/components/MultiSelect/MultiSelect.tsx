import { forwardRef, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  AccessibilityInfo,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewProps,
} from 'react-native'
import { fontSize, radius, size as sizes, space } from '@rupa-ui/tokens/react-native'
import { textOf, TextOrNode, type RupaComponent, type ViewRef } from '../../lib/content.js'
import { BangMark, CheckMark, ChevronMark, SearchMark } from '../../lib/marks.js'
import { useControllable } from '../../lib/useControllable.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'
import { Button } from '../Button/Button.js'

export interface MultiSelectOption {
  value: string
  /** Plain text, so the search can match it. */
  label: string
  /** Second line under the label; also searched. */
  description?: string
  disabled?: boolean
}

export interface MultiSelectLabels {
  /** Name and placeholder of the search box. */
  search: string
  noResults: string
  /** Chooses every option that matches the search. */
  selectAll: string
  clear: string
  /** Closes the sheet. */
  done: string
  /** Spoken after the chosen labels; the trigger shows only the number. */
  count: (count: number) => string
  /** Announced to screen readers after the search changes. */
  results: (count: number) => string
}

export interface MultiSelectProps extends Omit<ViewProps, 'children'> {
  /** Shown above the trigger and as the sheet title. */
  label: string
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  /** Trigger text while nothing is chosen, e.g. "All branches". */
  placeholder?: string
  /** Show the search box. Turn it off for short lists. */
  searchable?: boolean
  hint?: ReactNode
  /** Error message under the trigger, also spoken as its hint. */
  error?: ReactNode
  disabled?: boolean
  labels?: Partial<MultiSelectLabels>
}

const defaultLabels: MultiSelectLabels = {
  search: 'Search',
  noResults: 'No matches',
  selectAll: 'Select all',
  clear: 'Clear',
  done: 'Done',
  count: (n) => `${n} selected`,
  results: (n) => (n === 1 ? '1 result' : `${n} results`),
}

const none: string[] = []

/** Case- and accent-insensitive, so "jak" finds "Jakarta" and "medan" finds "Médan". */
const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/**
 * Choose several options from a list you can search. The trigger opens a bottom sheet with
 * a search box and a checkbox per option; choices apply as they are tapped, and Done, the
 * backdrop, or Android back close it. A `testID` also names the sheet's Modal `<testID>-sheet`.
 */
export const MultiSelect: RupaComponent<MultiSelectProps> = forwardRef<ViewRef, MultiSelectProps>(
  function MultiSelect(
    {
      label,
      options,
      value: valueProp,
      defaultValue = none,
      onChange,
      placeholder,
      searchable = true,
      hint,
      error,
      disabled,
      labels: labelsProp,
      style,
      testID,
      ...props
    },
    ref,
  ) {
    const { palette: p, shadows, font } = useRupaTheme()
    const labels = { ...defaultLabels, ...labelsProp }
    const [selected, setSelected] = useControllable(valueProp, defaultValue, onChange)
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [searchFocused, setSearchFocused] = useState(false)
    const trigger = useRef<ViewRef>(null)
    const titleRef = useRef<ViewRef>(null)

    const q = fold(query.trim())
    const filtered = q
      ? options.filter((o) => fold(`${o.label} ${o.description ?? ''}`).includes(q))
      : options
    const chosen = options.filter((o) => selected.includes(o.value))
    const summary = chosen.map((o) => o.label).join(', ')
    const unchosen = filtered.filter((o) => !o.disabled && !selected.includes(o.value))
    // Disabled options cannot be changed, so Clear keeps the ones that were already chosen.
    const kept = selected.filter((v) => options.find((o) => o.value === v)?.disabled)
    const invalid = error != null && error !== false

    const show = () => {
      setQuery('')
      setOpen(true)
    }
    const hide = () => {
      setOpen(false)
      // Screen readers go back to the trigger, like focus returning on the web.
      if (trigger.current) AccessibilityInfo.sendAccessibilityEvent?.(trigger.current, 'focus')
    }
    // Screen readers start on the title, so the sheet is introduced before the list.
    const focusTitle = () => {
      if (titleRef.current) AccessibilityInfo.sendAccessibilityEvent?.(titleRef.current, 'focus')
    }

    const toggle = (value: string) =>
      setSelected(
        selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
      )

    // Tell screen reader users how many options match once they pause typing.
    const count = filtered.length
    useEffect(() => {
      if (!open || !q) return
      const timer = setTimeout(
        () => AccessibilityInfo.announceForAccessibility(labels.results(count)),
        500,
      )
      return () => clearTimeout(timer)
      // eslint-disable-next-line react-hooks/exhaustive-deps -- labels is a new object each render
    }, [open, q, count])

    const spokenValue = chosen.length
      ? chosen.length > 1
        ? `${summary}, ${labels.count(chosen.length)}`
        : summary
      : (placeholder ?? '')

    return (
      <View ref={ref} style={[styles.field, style]} testID={testID} {...props}>
        {/* The trigger speaks the label itself, so the visible one is skipped. */}
        <Text style={[styles.label, { color: p.ink }, font('medium')]} aria-hidden>
          {label}
        </Text>
        <Pressable
          ref={trigger}
          role="button"
          aria-label={spokenValue ? `${label}, ${spokenValue}` : label}
          aria-expanded={open}
          aria-disabled={!!disabled}
          accessibilityHint={invalid ? textOf(error) : hint != null ? textOf(hint) : undefined}
          disabled={disabled}
          onPress={show}
          style={({ pressed }) => [
            styles.trigger,
            {
              backgroundColor: disabled ? p.surface2 : p.surface,
              borderColor: invalid ? p.danger : open || pressed ? p.focus : p.controlBorder,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[styles.value, { color: chosen.length && !disabled ? p.ink : p.ink3 }, font()]}
          >
            {summary || placeholder}
            {/* Keeps the labels and the number apart in the text axe compares to the name. */}
            {chosen.length > 1 && ' '}
          </Text>
          {chosen.length > 1 && (
            <View style={[styles.count, { backgroundColor: p.accentSoft }]}>
              <Text style={[styles.countText, { color: p.accent }, font('semibold')]}>
                {chosen.length}
              </Text>
            </View>
          )}
          <ChevronMark color={p.ink3} />
        </Pressable>
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

        <Modal
          visible={open}
          // Names the dialog element react-native-web renders around the content.
          aria-label={label}
          transparent
          // react-native-web unmounts an animated Modal on `animationend`, which never fires
          // when animations are off (reduced motion, tests), so the web build does not animate.
          animationType={Platform.OS === 'web' ? 'none' : 'slide'}
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={hide}
          onShow={focusTitle}
          testID={testID && `${testID}-sheet`}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.bottom}
          >
            <Pressable
              style={[StyleSheet.absoluteFill, { backgroundColor: p.overlay }]}
              onPress={hide}
              aria-hidden
            />
            <View
              role="dialog"
              aria-modal
              aria-label={label}
              style={[
                styles.sheet,
                { backgroundColor: p.surface, borderColor: p.line, boxShadow: shadows.pop },
              ]}
            >
              <View style={styles.header}>
                <View ref={titleRef} accessible role="heading" style={styles.title}>
                  <Text style={[styles.titleText, { color: p.ink }, font('semibold')]}>
                    {label}
                  </Text>
                </View>
                <Button size="sm" variant="ghost" onPress={hide}>
                  {labels.done}
                </Button>
              </View>

              {searchable && (
                <View
                  style={[
                    styles.search,
                    {
                      backgroundColor: p.surface2,
                      borderColor: searchFocused ? p.focus : p.controlBorder,
                    },
                  ]}
                >
                  <SearchMark color={p.ink3} />
                  <TextInput
                    aria-label={labels.search}
                    placeholder={labels.search}
                    placeholderTextColor={p.ink3}
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    returnKeyType="search"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    style={[styles.searchInput, { color: p.ink }, font()]}
                  />
                </View>
              )}

              <FlatList
                data={filtered}
                keyExtractor={(o) => o.value}
                // A tap on an option works while the keyboard is up, without closing it first.
                keyboardShouldPersistTaps="handled"
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <Text style={[styles.empty, { color: p.ink3 }, font()]}>{labels.noResults}</Text>
                }
                renderItem={({ item: o }) => {
                  const on = selected.includes(o.value)
                  return (
                    <Pressable
                      role="checkbox"
                      aria-checked={on}
                      aria-disabled={!!o.disabled}
                      disabled={o.disabled}
                      onPress={() => toggle(o.value)}
                      style={({ pressed }) => [
                        styles.option,
                        pressed && { backgroundColor: p.surface2 },
                        o.disabled && styles.disabled,
                      ]}
                    >
                      <View
                        style={[
                          styles.box,
                          on
                            ? { backgroundColor: p.primary, borderColor: p.primary }
                            : { backgroundColor: p.surface, borderColor: p.controlBorder },
                        ]}
                      >
                        {on && <CheckMark color={p.onPrimary} size={12} weight={2.5} />}
                      </View>
                      <View style={styles.text}>
                        <Text style={[styles.optionLabel, { color: p.ink }, font('medium')]}>
                          {o.label}
                        </Text>
                        {o.description != null && (
                          <Text style={[styles.description, { color: p.ink3 }, font()]}>
                            {o.description}
                          </Text>
                        )}
                      </View>
                    </Pressable>
                  )
                }}
              />

              <View style={[styles.footer, { borderColor: p.line }]}>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={unchosen.length === 0}
                  onPress={() => setSelected([...selected, ...unchosen.map((o) => o.value)])}
                >
                  {labels.selectAll}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={selected.length === kept.length}
                  onPress={() => setSelected(kept)}
                >
                  {labels.clear}
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  field: { gap: space['1'] + 2 },
  label: { fontSize: fontSize.sm, lineHeight: 20 },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space['2'],
    minHeight: sizes.touchTarget,
    paddingHorizontal: space['3'],
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  value: { flex: 1, fontSize: fontSize.md, lineHeight: 22 },
  count: {
    minWidth: 22,
    paddingHorizontal: space['1'] + 2,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  countText: { fontSize: fontSize.xs, lineHeight: 20 },
  error: { flexDirection: 'row', alignItems: 'flex-start', gap: space['1'] },
  message: { flexShrink: 1, fontSize: fontSize.xs, lineHeight: 16 },
  bottom: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '85%',
    alignSelf: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    paddingBottom: space['6'],
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space['2'],
    paddingLeft: space['5'],
    paddingRight: space['3'],
    paddingTop: space['4'],
    paddingBottom: space['2'],
  },
  title: { flex: 1 },
  titleText: { fontSize: fontSize.lg, lineHeight: 24 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space['2'],
    marginHorizontal: space['4'],
    marginBottom: space['2'],
    paddingHorizontal: space['3'],
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  // 16 pt text stops iOS Safari from zooming into the field.
  // The box shows focus with its border, so the browser outline is off on the web.
  searchInput: {
    flex: 1,
    minHeight: sizes.touchTarget,
    fontSize: fontSize.md,
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  list: { flexGrow: 0, flexShrink: 1 },
  listContent: { paddingHorizontal: space['2'] },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space['3'],
    minHeight: sizes.touchTarget,
    paddingHorizontal: space['3'],
    paddingVertical: space['2'],
    borderRadius: radius.md,
  },
  disabled: { opacity: 0.45 },
  box: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: radius.sm,
  },
  text: { flex: 1, gap: 2 },
  optionLabel: { fontSize: fontSize.md, lineHeight: 22 },
  description: { fontSize: fontSize.xs, lineHeight: 16 },
  empty: { paddingVertical: space['6'], fontSize: fontSize.sm, textAlign: 'center' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: space['3'],
    paddingTop: space['2'],
    borderTopWidth: 1,
  },
})
