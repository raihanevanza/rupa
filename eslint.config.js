import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/dist',
      '**/storybook-static',
      '**/node_modules',
      'playwright-report',
      'test-results',
      '**/.expo',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['packages/react/src/**/*.tsx'],
    ...jsxA11y.flatConfigs.strict,
    rules: {
      ...jsxA11y.flatConfigs.strict.rules,
      // A <label> wrapping Rupa's bare controls labels them, like a native input.
      'jsx-a11y/label-has-associated-control': [
        'error',
        { controlComponents: ['Input', 'Textarea', 'NativeSelect'], assert: 'either', depth: 3 },
      ],
    },
  },
  {
    // CommonJS config files (Babel for Jest, Metro for the Expo example).
    files: ['**/*.cjs', 'examples/mobile/metro.config.js'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  ...storybook.configs['flat/recommended'],
  {
    // Story render functions use hooks without being named components.
    files: ['**/*.stories.tsx'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
)
