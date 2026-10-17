/** Color math for the token checks: WCAG contrast, OKLab/OKLCH, and CVD simulation. */

export type RGB = [number, number, number]

export function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  const n = parseInt(h.slice(0, 6), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const toLinear = (c: number) => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
const toSrgb = (l: number) => {
  const c = Math.min(1, Math.max(0, l))
  return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055
}

export const linear = (hex: string): RGB => hexToRgb(hex).map(toLinear) as RGB

export function luminance(hex: string) {
  const [r, g, b] = linear(hex)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** Linear sRGB → OKLab (Björn Ottosson). */
export function oklab([r, g, b]: RGB): RGB {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

export function oklch(hex: string) {
  const [L, a, b] = oklab(linear(hex))
  return { L, C: Math.hypot(a, b) }
}

/** Machado, Oliveira & Fernandes (2009), severity 1.0, applied in linear RGB. */
const MACHADO: Record<'protan' | 'deutan' | 'tritan', number[][]> = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
}
export type Vision = keyof typeof MACHADO | 'normal'

function simulate(hex: string, vision: Vision): RGB {
  const lin = linear(hex)
  if (vision === 'normal') return lin
  // Clamp through sRGB like a display would.
  return MACHADO[vision].map((row) =>
    toLinear(toSrgb(row[0]! * lin[0] + row[1]! * lin[1] + row[2]! * lin[2]) * 255),
  ) as RGB
}

/** OKLab Euclidean distance × 100 between two colors as seen with the given vision. */
export function deltaE(a: string, b: string, vision: Vision = 'normal') {
  const [x, y] = [oklab(simulate(a, vision)), oklab(simulate(b, vision))]
  return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2])
}
