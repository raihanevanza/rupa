/** @type {import('jest').Config} */
export default {
  preset: '@react-native/jest-preset',
  // Sources import siblings as `./Button.js` (ESM); Jest resolves them to the .tsx file.
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  testMatch: ['<rootDir>/src/**/*.test.tsx'],
  // The first test in a file pays for loading React Native; on 2-core CI runners that alone
  // passed the default 5 s (ConfirmDialog, MultiSelect). Locally the whole suite takes ~2 s.
  testTimeout: 20000,
}
