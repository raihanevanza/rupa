/**
 * Validates the categorical chart series (series-1…5) in every brand × mode with the
 * dataviz method: OKLCH lightness band, chroma floor, adjacent-pair separation under
 * protan/deutan simulation, a normal-vision floor, and contrast against the surface.
 */
import { contrast, deltaE, oklch } from './color.ts'
import { loadBuilt, report } from './load.ts'

const BAND = { light: [0.43, 0.77], dark: [0.48, 0.67] } as const
const CHROMA_FLOOR = 0.1
const CVD_TARGET = 8 // below: warning, legal only with direct labels/texture
const CVD_FLOOR = 6 // below: failure
const NORMAL_FLOOR = 15
const CONTRAST_MIN = 3

const { brands, modes, colors } = await loadBuilt()
const failures: string[] = []
const warnings: string[] = []

for (const brand of brands)
  for (const mode of modes) {
    const c = colors[brand][mode]
    const surface = c.surface!
    const series = Object.keys(c)
      .filter((k) => /^series-\d$/.test(k))
      .map((k) => c[k]!)
    const at = `${brand}/${mode}`
    const [lo, hi] = BAND[mode]

    series.forEach((hex, i) => {
      const { L, C } = oklch(hex)
      if (L < lo || L > hi)
        failures.push(`${at} series-${i + 1} ${hex}: L ${L.toFixed(2)} outside ${lo}–${hi}`)
      if (C < CHROMA_FLOOR)
        failures.push(`${at} series-${i + 1} ${hex}: chroma ${C.toFixed(3)} reads as gray`)
      const ratio = contrast(hex, surface)
      if (ratio < CONTRAST_MIN)
        failures.push(
          `${at} series-${i + 1} ${hex}: ${ratio.toFixed(2)}:1 against surface ${surface}`,
        )
    })

    for (let i = 1; i < series.length; i++) {
      const [a, b] = [series[i - 1]!, series[i]!]
      const pair = `${at} series-${i}/${i + 1} (${a}, ${b})`
      const cvd = Math.min(deltaE(a, b, 'protan'), deltaE(a, b, 'deutan'))
      if (cvd < CVD_FLOOR) failures.push(`${pair}: CVD ΔE ${cvd.toFixed(1)} < ${CVD_FLOOR}`)
      else if (cvd < CVD_TARGET)
        warnings.push(`${pair}: CVD ΔE ${cvd.toFixed(1)}; needs direct labels`)
      const normal = deltaE(a, b)
      if (normal < NORMAL_FLOOR) failures.push(`${pair}: ΔE ${normal.toFixed(1)} < ${NORMAL_FLOOR}`)
    }
  }

report(`chart series: ${brands.length * modes.length} themes`, failures, warnings)
