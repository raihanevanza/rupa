export const PREFIX = 'rupa'
/** The first brand is the default (applied to :root). */
export const BRANDS = ['violet', 'signal', 'latte', 'ledger', 'mono', 'candy', 'iris'] as const
export const MODES = ['light', 'dark'] as const
export type Brand = (typeof BRANDS)[number]
export type Mode = (typeof MODES)[number]
