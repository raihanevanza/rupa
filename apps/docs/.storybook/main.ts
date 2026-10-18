import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const reactSrc = fileURLToPath(new URL('../../../packages/react/src', import.meta.url))
const nativeSrc = fileURLToPath(new URL('../../../packages/react-native/src', import.meta.url))

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.tsx',
    '../../../packages/react/src/**/*.stories.tsx',
    '../../../packages/react-native/src/**/*.stories.tsx',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  core: { disableTelemetry: true },
  typescript: { reactDocgen: 'react-docgen' },
  async viteFinal(config) {
    config.resolve ??= {}
    const existing = config.resolve.alias ?? []
    config.resolve.alias = [
      ...(Array.isArray(existing)
        ? existing
        : Object.entries(existing).map(([find, replacement]) => ({ find, replacement }))),
      // Docs pages import the packages by name; point them at the source for instant reloads.
      { find: /^@rupa-ui\/react$/, replacement: `${reactSrc}/index.ts` },
      { find: /^@rupa-ui\/react-native$/, replacement: `${nativeSrc}/index.ts` },
      // The React Native components render in the browser through react-native-web.
      { find: /^react-native$/, replacement: 'react-native-web' },
    ]
    return config
  },
}

export default config
