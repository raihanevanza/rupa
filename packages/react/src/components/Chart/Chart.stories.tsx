import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, type PointerEvent } from 'react'
import { expect, userEvent } from 'storybook/test'
import { useElementWidth } from '../../lib/useElementWidth.js'
import { Segmented } from '../Segmented/Segmented.js'
import { ChartFrame, ChartPlot, ChartTooltip } from './Chart.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const DATA = {
  requests: [
    { name: 'Mini ERP', color: 'var(--rupa-color-series-1)', values: [42, 51, 38, 64, 58, 71] },
    { name: 'AgentGate', color: 'var(--rupa-color-series-2)', values: [18, 26, 33, 31, 45, 52] },
  ],
  approved: [
    { name: 'Mini ERP', color: 'var(--rupa-color-series-1)', values: [39, 47, 35, 60, 51, 66] },
    { name: 'AgentGate', color: 'var(--rupa-color-series-2)', values: [15, 22, 30, 27, 41, 47] },
  ],
}
const H = 180
const PAD = { top: 12, right: 12, bottom: 24, left: 32 }

/** A small line chart built from ChartFrame, ChartPlot, ChartTooltip, and useElementWidth. */
function LineChart({ initialHover = null }: { initialHover?: number | null }) {
  const [metric, setMetric] = useState<'requests' | 'approved'>('requests')
  const [hover, setHover] = useState<number | null>(initialHover)
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const series = DATA[metric]
  const top = 80
  const plotW = Math.max(width - PAD.left - PAD.right, 60)
  const x = (i: number) => PAD.left + (i / (MONTHS.length - 1)) * plotW
  const y = (v: number) => PAD.top + (1 - v / top) * (H - PAD.top - PAD.bottom)
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - box.left - PAD.left) / plotW) * (MONTHS.length - 1))
    setHover(Math.min(Math.max(i, 0), MONTHS.length - 1))
  }

  return (
    <ChartFrame
      title="Requests per month"
      description="First half of 2026, both apps"
      legend={series.map((s) => ({ label: s.name, color: s.color }))}
      actions={
        <Segmented
          size="sm"
          label="Metric"
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'requests', label: 'Requests' },
            { value: 'approved', label: 'Approved' },
          ]}
        />
      }
      note="Counts requests created in the month, whatever their status today."
      table={
        <table>
          <thead>
            <tr>
              <th>Month</th>
              {series.map((s) => (
                <th key={s.name}>{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MONTHS.map((m, i) => (
              <tr key={m}>
                <th>{m}</th>
                {series.map((s) => (
                  <td key={s.name}>{s.values[i]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <ChartPlot ref={ref} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <svg width={width} height={H} role="img" aria-label={`Requests per month: ${metric}`}>
          {[0, 40, 80].map((v) => (
            <g key={v}>
              <line
                x1={PAD.left}
                x2={PAD.left + plotW}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--rupa-color-chart-grid)"
              />
              <text
                x={PAD.left - 8}
                y={y(v)}
                dy="0.35em"
                textAnchor="end"
                fontSize={11}
                fill="var(--rupa-color-ink-3)"
              >
                {v}
              </text>
            </g>
          ))}
          {MONTHS.map((m, i) => (
            <text
              key={m}
              x={x(i)}
              y={H - 6}
              textAnchor="middle"
              fontSize={11}
              fill="var(--rupa-color-ink-3)"
            >
              {m}
            </text>
          ))}
          {hover != null && (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="var(--rupa-color-chart-axis)"
            />
          )}
          {series.map((s) => (
            <g key={s.name}>
              <path
                d={s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join('')}
                fill="none"
                stroke={s.color}
                strokeWidth={2}
              />
              {s.values.map((v, i) => (
                <circle
                  key={i}
                  cx={x(i)}
                  cy={y(v)}
                  r={4}
                  fill={s.color}
                  stroke="var(--rupa-color-surface)"
                  strokeWidth={2}
                />
              ))}
            </g>
          ))}
        </svg>
        {hover != null && (
          <ChartTooltip
            x={x(hover)}
            plotWidth={width}
            width={168}
            title={MONTHS[hover]}
            items={series.map((s) => ({ label: s.name, value: s.values[hover], color: s.color }))}
          />
        )}
      </ChartPlot>
    </ChartFrame>
  )
}

const meta = {
  title: 'Components/Chart',
  component: ChartFrame,
  tags: ['stable'],
} satisfies Meta<typeof ChartFrame>

export default meta
type Story = StoryObj<typeof meta>

export const LineChartExample: Story = {
  name: 'Line chart',
  render: () => <LineChart />,
}

/** The tooltip at a point (shown here without hovering). */
export const WithTooltip: Story = {
  render: () => <LineChart initialHover={3} />,
}

/** The data table behind the disclosure is how keyboard and screen reader users read it. */
export const Table: Story = {
  tags: ['!autodocs'],
  render: () => <LineChart />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText('Show as table'))
    await expect(canvas.getByRole('table')).toBeVisible()
    await expect(canvas.getByRole('columnheader', { name: 'AgentGate' })).toBeVisible()
  },
}
