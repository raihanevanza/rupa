# @rupa-ui/react-native

## 0.1.2

### Patch Changes

- [#10](https://github.com/raihanevanza/rupa/pull/10) [`87700e6`](https://github.com/raihanevanza/rupa/commit/87700e60f80a8ea8e6fb9355110db942014fcbad) Thanks [@raihanevanza](https://github.com/raihanevanza)! - npm pages link to the live Storybook and show the components; `homepage` points to each package's Storybook page.
  
  React Native: components use ARIA props (`role`, `aria-checked`, `aria-busy`, `aria-label`, `aria-live`) instead of the `accessibility*` props, so they are also accessible when rendered with react-native-web. Spinner puts its role and name on the indicator, StatusFlow steps are list items, ConfirmDialog names its dialog and does not animate on the web.
- Updated dependencies [[`87700e6`](https://github.com/raihanevanza/rupa/commit/87700e60f80a8ea8e6fb9355110db942014fcbad)]:
  - @rupa-ui/tokens@0.2.1

## 0.1.1

### Patch Changes

- Updated dependencies [[`154e46c`](https://github.com/raihanevanza/rupa/commit/154e46cb9e8dca7194adf9f25c981e36727ab912)]:
  - @rupa-ui/tokens@0.2.0

## 0.1.0

### Minor Changes

- [#6](https://github.com/raihanevanza/rupa/pull/6) [`ece2bdd`](https://github.com/raihanevanza/rupa/commit/ece2bdd5d429e2bf331dd6cf75bab4263e5853b9) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New package: React Native components for Android and iOS, themed by the same tokens as the web. Includes `ThemeProvider`/`useTheme` (brand, light/dark/system, nested providers) and Alert, Badge, Button, Card, ConfirmDialog, InfoList, PageHeader, Segmented, Spinner, StateView, and StatusFlow, with the same props as `@rupa-ui/react` where the platform allows.
