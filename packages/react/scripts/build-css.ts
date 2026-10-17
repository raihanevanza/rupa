/**
 * Bundles src/styles.css (tokens + component CSS) into dist/styles.css, and the optional
 * document defaults into dist/base.css. Targets browsers with native light-dark() so
 * Lightning CSS keeps it as-is instead of lowering it.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import browserslist from 'browserslist'
import { bundleAsync, browserslistToTargets } from 'lightningcss'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)

// Chrome 123 / Edge 123 / Firefox 120 / Safari 17.5: first versions with light-dark().
const targets = browserslistToTargets(
  browserslist([
    'chrome >= 123',
    'edge >= 123',
    'firefox >= 120',
    'safari >= 17.5',
    'ios_saf >= 17.5',
  ]),
)

async function build(entry: string, out: string) {
  const { code } = await bundleAsync({
    filename: join(root, entry),
    targets,
    minify: true,
    resolver: {
      resolve(specifier, from) {
        return specifier.startsWith('.')
          ? join(dirname(from), specifier)
          : require.resolve(specifier)
      },
    },
  })
  await mkdir(join(root, 'dist'), { recursive: true })
  await writeFile(join(root, 'dist', out), code)
  return code.length
}

const sizes = await Promise.all([
  build('src/styles.css', 'styles.css'),
  build('src/styles/document.css', 'base.css'),
])
console.log(
  `@rupa-ui/react: styles.css ${(sizes[0] / 1024).toFixed(1)} kB, base.css ${(sizes[1] / 1024).toFixed(1)} kB (minified)`,
)
