import { forwardRef, type ReactNode } from 'react'
import { StyleSheet, Text, View, type ViewProps } from 'react-native'
import { fontSize, radius, space } from '@rupa-ui/tokens/react-native'
import { textOf, TextOrNode, type RupaComponent, type ViewRef } from '../../lib/content.js'
import { CheckMark, CrossMark, MinusMark } from '../../lib/marks.js'
import { useRupaTheme } from '../../theme/ThemeProvider.js'

export interface StatusStep {
  key: string
  label: ReactNode
  /** e.g. who acted and when. */
  description?: ReactNode
}

export type StepState = 'complete' | 'current' | 'upcoming' | 'rejected' | 'cancelled'

export interface StatusFlowProps extends ViewProps {
  steps: StatusStep[]
  /** Key of the step the document is at now. */
  current: string
  /** The current step ended the flow without success. */
  outcome?: 'rejected' | 'cancelled'
  /** Every step, including the current one, is done. */
  completed?: boolean
  /** Screen reader text for each state; replace for other languages. */
  stateLabels?: Partial<Record<StepState, string>>
  /** Vertical suits phones; horizontal fits 3–4 short steps. */
  orientation?: 'horizontal' | 'vertical'
}

const defaultLabels: Record<StepState, string> = {
  complete: 'Completed',
  current: 'Current step',
  upcoming: 'Not started',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
}

const MARKER = 28

/** Where a document is in its approval flow. Each state has its own mark, not only a color. */
export const StatusFlow: RupaComponent<StatusFlowProps> = forwardRef<ViewRef, StatusFlowProps>(
  function StatusFlow(
    { steps, current, outcome, completed, stateLabels, orientation = 'vertical', style, ...props },
    ref,
  ) {
    const { palette: p, font } = useRupaTheme()
    const labels = { ...defaultLabels, ...stateLabels }
    const currentIndex = steps.findIndex((s) => s.key === current)
    const vertical = orientation === 'vertical'

    const stateOf = (i: number): StepState => {
      if (completed || i < currentIndex) return 'complete'
      if (i > currentIndex) return 'upcoming'
      return outcome ?? 'current'
    }

    const look: Record<StepState, { fill: string; ring: string; mark: string; line: string }> = {
      complete: { fill: p.success, ring: p.success, mark: p.onSuccess, line: p.success },
      current: { fill: p.accentSoft, ring: p.accent, mark: p.accent, line: p.lineStrong },
      upcoming: { fill: p.surface, ring: p.controlBorder, mark: p.ink3, line: p.lineStrong },
      rejected: { fill: p.danger, ring: p.danger, mark: p.onDanger, line: p.lineStrong },
      cancelled: { fill: p.surface3, ring: p.controlBorder, mark: p.ink2, line: p.lineStrong },
    }

    return (
      <View
        ref={ref}
        accessibilityRole="list"
        style={[vertical ? styles.column : styles.row, style]}
        {...props}
      >
        {steps.map((step, i) => {
          const state = stateOf(i)
          const c = look[state]
          const last = i === steps.length - 1
          const marker = (
            <View style={[styles.marker, { backgroundColor: c.fill, borderColor: c.ring }]}>
              {state === 'complete' && <CheckMark color={c.mark} />}
              {state === 'rejected' && <CrossMark color={c.mark} />}
              {state === 'cancelled' && <MinusMark color={c.mark} />}
              {(state === 'current' || state === 'upcoming') && (
                <Text style={[styles.number, { color: c.mark }, font('bold')]}>{i + 1}</Text>
              )}
            </View>
          )
          const connector = !last && (
            <View
              style={[vertical ? styles.lineDown : styles.lineAcross, { backgroundColor: c.line }]}
            />
          )
          return (
            <View
              key={step.key}
              accessible
              accessibilityLabel={[textOf(step.label), labels[state], textOf(step.description)]
                .filter(Boolean)
                .join(', ')}
              style={vertical ? styles.stepRow : styles.stepColumn}
            >
              <View style={vertical ? styles.rail : styles.track}>
                {marker}
                {connector}
              </View>
              <View style={[styles.text, vertical ? !last && styles.textGap : styles.textAcross]}>
                <TextOrNode
                  style={[
                    styles.label,
                    { color: state === 'upcoming' ? p.ink3 : p.ink },
                    font('semibold'),
                  ]}
                >
                  {step.label}
                </TextOrNode>
                {step.description != null && (
                  <TextOrNode style={[styles.description, { color: p.ink3 }, font()]}>
                    {step.description}
                  </TextOrNode>
                )}
              </View>
            </View>
          )
        })}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  column: {},
  row: { flexDirection: 'row' },
  stepRow: { flexDirection: 'row', gap: space['3'] },
  stepColumn: { flex: 1, minWidth: 0, gap: space['2'] },
  rail: { alignItems: 'center' },
  track: { flexDirection: 'row', alignItems: 'center' },
  marker: {
    width: MARKER,
    height: MARKER,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: radius.full,
  },
  number: { fontSize: fontSize.xs, lineHeight: 16 },
  lineDown: {
    flex: 1,
    width: 2,
    minHeight: space['4'],
    marginVertical: space['1'],
    borderRadius: 1,
  },
  lineAcross: { flex: 1, height: 2, marginHorizontal: space['2'], borderRadius: 1 },
  text: { flexShrink: 1, gap: 2, paddingTop: 4 },
  textGap: { paddingBottom: space['5'] },
  textAcross: { paddingTop: 0, paddingRight: space['3'] },
  label: { fontSize: fontSize.sm, lineHeight: 20 },
  description: { fontSize: fontSize.xs, lineHeight: 16 },
})
