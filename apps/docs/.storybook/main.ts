import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const reactSrc = fileURLToPath(new URL('../../../packages/react/src', import.meta.url))

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.tsx',
    '../../../packages/react/src/**/*.stories.tsx',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  core: { disableTelemetry: true },
  typescript: { reactDocgen: 'react-docgen' },
  async viteFinal(config) {
    // Docs pages import the package by name; point it at the source for instant reloads.
    config.resolve ??= {}
    config.resolve.alias = { ...config.resolve.alias, '@rupa-ui/react': `${reactSrc}/index.ts` }
    return config
  },
}

export default config
