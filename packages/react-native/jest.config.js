/** @type {import('jest').Config} */
export default {
  preset: '@react-native/jest-preset',
  // Sources import siblings as `./Button.js` (ESM); Jest resolves them to the .tsx file.
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  testMatch: ['<rootDir>/src/**/*.test.tsx'],
}
