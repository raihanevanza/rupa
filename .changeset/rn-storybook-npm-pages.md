---
'@rupa-ui/react-native': patch
'@rupa-ui/react': patch
'@rupa-ui/tokens': patch
---

npm pages link to the live Storybook and show the components; `homepage` points to each package's Storybook page.

React Native: components use ARIA props (`role`, `aria-checked`, `aria-busy`, `aria-label`, `aria-live`) instead of the `accessibility*` props, so they are also accessible when rendered with react-native-web. Spinner puts its role and name on the indicator, StatusFlow steps are list items, ConfirmDialog names its dialog and does not animate on the web.
