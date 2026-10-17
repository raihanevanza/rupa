import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Rupa design system',
    brandUrl: 'https://github.com/raihanevanza/rupa',
    // Orange is the darkest step that keeps white selected-item text at AA (4.7:1); teal is the second accent.
    colorPrimary: '#1f4e5f',
    colorSecondary: '#c94a12',
    barSelectedColor: '#c94a12',
    barHoverColor: '#e05a1c',
    fontBase: '"Plus Jakarta Sans Variable", ui-sans-serif, system-ui, sans-serif',
  }),
  sidebar: { showRoots: true },
})
