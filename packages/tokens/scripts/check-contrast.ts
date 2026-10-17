/**
 * WCAG 2.2 contrast for every text/background and UI/background pair the components use,
 * in every brand × mode. Fails the build when a pair drops below its threshold.
 */
import { contrast } from './color.ts'
import { loadBuilt, report } from './load.ts'

const TEXT = 4.5 // 1.4.3 normal text
const UI = 3 // 1.4.11 non-text: input borders, focus ring, status icons

const tones = ['success', 'warning', 'danger', 'info'] as const

const pairs: [fg: string, bgs: string[], min: number][] = [
  ['ink', ['canvas', 'surface', 'surface-2', 'surface-3', 'accent-soft'], TEXT],
  ['ink-2', ['canvas', 'surface', 'surface-2', 'surface-3'], TEXT],
  ['ink-3', ['canvas', 'surface', 'surface-2'], TEXT],
  ['accent', ['canvas', 'surface', 'surface-2', 'accent-soft'], TEXT],
  ['on-primary', ['primary', 'primary-hover'], TEXT],
  ...tones.flatMap((t): [string, string[], number][] => [
    [`on-${t}`, [t], TEXT],
    [`${t}-ink`, [`${t}-soft`, 'surface', 'canvas'], TEXT],
    [t, ['surface', 'canvas'], UI],
  ]),
  ['control-border', ['surface', 'canvas'], UI],
  ['focus', ['surface', 'canvas', 'surface-2'], UI],
]

const { brands, modes, colors } = await loadBuilt()
const failures: string[] = []
let checked = 0
let worst = { ratio: Infinity, label: '' }

for (const brand of brands)
  for (const mode of modes) {
    const c = colors[brand][mode]
    for (const [fg, bgs, min] of pairs)
      for (const bg of bgs) {
        const a = c[fg]
        const b = c[bg]
        if (!a || !b) {
          failures.push(`${brand}/${mode}: unknown token ${a ? bg : fg}`)
          continue
        }
        const ratio = contrast(a, b)
        checked++
        const label = `${brand}/${mode} ${fg} (${a}) on ${bg} (${b}): ${ratio.toFixed(2)}:1`
        if (ratio < min) failures.push(`${label}, needs ${min}:1`)
        if (ratio / min < worst.ratio) worst = { ratio: ratio / min, label }
      }
  }

console.log(`  closest to its threshold: ${worst.label}`)
report(`contrast: ${checked} pairs across ${brands.length * modes.length} themes`, failures)
