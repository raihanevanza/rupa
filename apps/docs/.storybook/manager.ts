import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Rupa design system',
    brandUrl: 'https://github.com/raihanevanza/rupa',
    colorPrimary: '#6a46d6',
    colorSecondary: '#6a46d6',
    fontBase: '"Plus Jakarta Sans Variable", ui-sans-serif, system-ui, sans-serif',
  }),
  sidebar: { showRoots: true },
})
