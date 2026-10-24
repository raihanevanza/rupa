import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

const external = [
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.dependencies),
  'react/jsx-runtime',
]

const SERVER_MODULES = new Set(['index.js', 'components/Table/Table.js', 'lib/cx.js'])

export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'] },
    sourcemap: true,
    emptyOutDir: true,
    minify: false,
    rolldownOptions: {
      external: (id) => external.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        // One file per module: importing Button never pulls in Radix (Dialog, Tooltip).
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        // Interactive components use hooks, so they are client modules for Next.js. A few
        // modules stay server modules: the entry (so each export keeps its own boundary) and
        // Table with its helper, so a Server Component can pass column `render` functions.
        banner: (chunk) => (SERVER_MODULES.has(chunk.fileName) ? '' : "'use client';"),
      },
    },
  },
})
