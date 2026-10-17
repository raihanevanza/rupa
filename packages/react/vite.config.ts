import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import pkg from './package.json' with { type: 'json' }

const external = [
  ...Object.keys(pkg.peerDependencies),
  ...Object.keys(pkg.dependencies),
  'react/jsx-runtime',
]

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
        // Interactive components use hooks, so every module is a client module for Next.js.
        banner: "'use client';",
      },
    },
  },
})
