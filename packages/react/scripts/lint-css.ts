/**
 * Component CSS must use tokens: no hex colors, no rgb()/hsl() with literal numbers, and
 * no px lengths except hairlines (1px, 1.5px, 2px) and the -1px used by visually-hidden.
 * Rule B7.2 in docs/spec.md.
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../src', import.meta.url))
const ALLOWED_PX = new Set(['1px', '1.5px', '2px', '-1px'])

const rules: [RegExp, (m: string) => string | null][] = [
  [/#[0-9a-fA-F]{3,8}\b/g, (m) => `raw color ${m}`],
  [/\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\(\s*[\d.]/g, (m) => `raw color ${m}…)`],
  [/-?\d*\.?\d+px\b/g, (m) => (ALLOWED_PX.has(m) ? null : `raw length ${m}; use a token`)],
]

async function* cssFiles(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* cssFiles(path)
    else if (entry.name.endsWith('.css')) yield path
  }
}

let problems = 0
let files = 0
for await (const file of cssFiles(root)) {
  files++
  const lines = (await readFile(file, 'utf8')).split('\n')
  lines.forEach((line, i) => {
    // Data URIs (mask images) are drawn shapes, not theme values.
    const code = line.replace(/url\([^)]*\)/g, 'url()').replace(/\/\*.*?\*\//g, '')
    for (const [pattern, message] of rules) {
      for (const match of code.matchAll(pattern)) {
        const text = message(match[0])
        if (!text) continue
        problems++
        console.error(`${relative(process.cwd(), file)}:${i + 1}  ${text}`)
      }
    }
  })
}

// Every component stylesheet must be part of the published styles.css.
const entry = await readFile(join(root, 'styles.css'), 'utf8')
for await (const file of cssFiles(join(root, 'components'))) {
  const rel = `./${relative(root, file)}`
  if (!entry.includes(`@import '${rel}'`)) {
    problems++
    console.error(`src/styles.css  missing @import '${rel}'`)
  }
}

console.log(`${problems ? '✗' : '✓'} lint:css: ${files} files, ${problems} problem(s)`)
if (problems) process.exitCode = 1
