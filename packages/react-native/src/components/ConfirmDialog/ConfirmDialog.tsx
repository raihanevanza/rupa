import { useRef, useState, type ReactNode } from 'react'
import {
  AccessibilityInfo,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { fontSize, radius, space } from '@rupa-ui/tokens/react-native'
import { textOf, TextOrNode, type ViewRef } from '../../lib/content.js'
import { useControllable } from '../../lib/useControllable.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'
import { Alert } from '../Alert/Alert.js'
import { Button } from '../Button/Button.js'

export interface ConfirmDialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** `danger` for actions that cannot be undone. */
  tone?: 'primary' | 'danger' | 'success'
  confirmLabel?: ReactNode
  cancelLabel?: ReactNode
  /**
   * Runs the action. While the promise is pending the buttons are locked and the dialog
   * cannot be dismissed (backdrop, Android back), so a double tap cannot submit twice.
   * Resolve to close; throw to keep the dialog open and show the error.
   */
  onConfirm: () => void | Promise<void>
  /** Shown when onConfirm throws something without a message. */
  errorMessage?: ReactNode
  errorTitle?: ReactNode
  testID?: string
}

/**
 * Asks before an action that matters. Open it from your own button with `open` /
 * `onOpenChange`; there is no `trigger` prop as on the web.
 */
export function ConfirmDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  tone = 'primary',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  errorMessage = 'The action could not be completed. Please try again.',
  errorTitle = 'Something went wrong',
  testID,
}: ConfirmDialogProps) {
  const { palette: p, shadows, font } = useRupaTheme()
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<ReactNode>(null)
  // A ref, not state: two taps in the same frame both see the state before re-render.
  const running = useRef(false)
  const titleRef = useRef<ViewRef>(null)

  const changeOpen = (next: boolean) => {
    if (running.current) return
    if (!next) setError(null)
    setOpen(next)
  }

  const confirm = async () => {
    if (running.current) return
    running.current = true
    setPending(true)
    setError(null)
    try {
      await onConfirm()
      running.current = false
      setPending(false)
      setOpen(false)
    } catch (e) {
      running.current = false
      setPending(false)
      setError(e instanceof Error && e.message ? e.message : errorMessage)
    }
  }

  // Screen readers start on the title, so the question is read before the buttons.
  const focusTitle = () => {
    // Optional call: react-native-web (Storybook, web builds) has no sendAccessibilityEvent.
    if (titleRef.current) AccessibilityInfo.sendAccessibilityEvent?.(titleRef.current, 'focus')
  }

  return (
    <Modal
      visible={open}
      // Names the dialog element react-native-web renders around the content.
      aria-label={textOf(title)}
      transparent
      // react-native-web unmounts a faded Modal on `animationend`, which never fires when
      // animations are off (reduced motion, tests), so the web build does not animate.
      animationType={Platform.OS === 'web' ? 'none' : 'fade'}
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => changeOpen(false)}
      onShow={focusTitle}
      testID={testID}
    >
      <View style={styles.center}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: p.overlay }]}
          onPress={() => changeOpen(false)}
          aria-hidden
        />
        <View
          role="alertdialog"
          aria-modal
          aria-label={textOf(title)}
          style={[
            styles.panel,
            { backgroundColor: p.surface, borderColor: p.line, boxShadow: shadows.pop },
          ]}
        >
          <ScrollView contentContainerStyle={styles.content} bounces={false}>
            <View ref={titleRef} accessible role="heading">
              <TextOrNode style={[styles.title, { color: p.ink }, font('semibold')]}>
                {title}
              </TextOrNode>
            </View>
            {description != null && (
              <TextOrNode style={[styles.description, { color: p.ink2 }, font()]}>
                {description}
              </TextOrNode>
            )}
            {children}
            {error != null && (
              <Alert tone="danger" title={errorTitle} live>
                {error}
              </Alert>
            )}
          </ScrollView>
          <View style={styles.footer}>
            <Button
              block
              style={styles.footerButton}
              onPress={() => changeOpen(false)}
              disabled={pending}
            >
              {cancelLabel}
            </Button>
            <Button
              block
              style={styles.footerButton}
              variant={tone}
              loading={pending}
              onPress={confirm}
            >
              {confirmLabel}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space['4'] },
  panel: {
    width: '100%',
    maxWidth: 416,
    maxHeight: '85%',
    borderWidth: 1,
    borderRadius: radius['2xl'],
    overflow: 'hidden',
  },
  content: { gap: space['3'], padding: space['6'], paddingBottom: space['3'] },
  title: { fontSize: fontSize.lg, lineHeight: 24 },
  description: { fontSize: fontSize.sm, lineHeight: 20 },
  footer: {
    flexDirection: 'row',
    gap: space['2'],
    paddingHorizontal: space['6'],
    paddingTop: space['3'],
    paddingBottom: space['6'],
  },
  footerButton: { flex: 1 },
})
