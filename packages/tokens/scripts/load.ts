import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Brand, Mode } from './config.ts'

export interface Built {
  brands: Brand[]
  modes: Mode[]
  colors: Record<Brand, Record<Mode, Record<string, string>>>
}

const file = join(dirname(fileURLToPath(import.meta.url)), '../dist/tokens.json')

export async function loadBuilt(): Promise<Built> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as Built
  } catch {
    throw new Error('dist/tokens.json not found. Run `npm run build -w @rupa-ui/tokens` first.')
  }
}

export function report(title: string, failures: string[], warnings: string[] = []) {
  for (const w of warnings) console.warn(`  warn  ${w}`)
  for (const f of failures) console.error(`  FAIL  ${f}`)
  console.log(`${failures.length ? '✗' : '✓'} ${title}`)
  if (failures.length) process.exitCode = 1
}
