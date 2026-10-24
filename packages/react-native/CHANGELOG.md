# @rupa-ui/react-native

## 0.3.1

### Patch Changes

- Updated dependencies [[`06bdeba`](https://github.com/raihanevanza/rupa/commit/06bdeba395ff14aa83710c0e6ba1aa18a89ac0c1)]:
  - @rupa-ui/tokens@0.4.0

## 0.3.0

### Minor Changes

- [#18](https://github.com/raihanevanza/rupa/pull/18) [`0efffca`](https://github.com/raihanevanza/rupa/commit/0efffcacc123a57cd2bb19445cc7e442a32476a7) Thanks [@raihanevanza](https://github.com/raihanevanza)! - React Native: new `TextField` and `ChipGroup`, and a ConfirmDialog that works with a field inside.
  
  - `TextField` has the web props: `label`, `hint`, `error`, `required`, `hideLabel`, `prefix`, and `suffix`, plus `multiline` for a text area. The input speaks the label, the required state, and the error or hint; its `ref` and `testID` point to the TextInput. With `hideLabel`, an icon `prefix`, and a clear button as `suffix`, it is also the search box.
  - `ChipGroup` is a single choice from many options as pills, e.g. a status filter above a list: one row that scrolls sideways (the chosen chip scrolls into view, without animation under Reduce Motion; `inset` lines it up with the screen padding) or `wrap` for several rows. It is a radio group for screen readers. Use Segmented for 2–5 short options.
  - `ConfirmDialog` moves above the keyboard, so a note field and the buttons stay visible, and Confirm works on the first tap while the keyboard is up.
  
  Both: `ConfirmDialog` takes `confirmDisabled`, e.g. to hold Reject until a required note is long enough.

## 0.2.1

### Patch Changes

- Updated dependencies [[`f34bbcd`](https://github.com/raihanevanza/rupa/commit/f34bbcd07bdaf173fe4ae743e9feb275c36fe442), [`f34bbcd`](https://github.com/raihanevanza/rupa/commit/f34bbcd07bdaf173fe4ae743e9feb275c36fe442)]:
  - @rupa-ui/tokens@0.3.0

## 0.2.0

### Minor Changes

- [#13](https://github.com/raihanevanza/rupa/pull/13) [`ad03a25`](https://github.com/raihanevanza/rupa/commit/ad03a250297e73f551a6ecbb15c59b74c482e993) Thanks [@raihanevanza](https://github.com/raihanevanza)! - New `MultiSelect`: choose several options from a list you can search, e.g. to filter a table or a list screen. It has Select all and Clear, a `searchable={false}` mode for short lists, and replaceable text through `labels`.
  
  React: the search box is a combobox over a multi-select listbox (arrows move, Enter toggles, Esc closes and returns focus), and `name` submits the choices with a form. `Field` passes `labelId` to its render function, so custom controls can name themselves with `aria-labelledby`.
  
  React Native: the trigger opens a bottom sheet with a search box and a checkbox per option. Choices apply as they are tapped; Done, the backdrop, or Android back close it. Screen readers hear the label, the choice, and the count, and the number of matches after a search.

### Patch Changes

- [#13](https://github.com/raihanevanza/rupa/pull/13) [`ad03a25`](https://github.com/raihanevanza/rupa/commit/ad03a250297e73f551a6ecbb15c59b74c482e993) Thanks [@raihanevanza](https://github.com/raihanevanza)! - npm pages link to the live Storybook and show the components; `homepage` points to each package's Storybook page.
  
  React Native: components use ARIA props (`role`, `aria-checked`, `aria-busy`, `aria-label`, `aria-live`) instead of the `accessibility*` props, so they are also accessible when rendered with react-native-web. Spinner puts its role and name on the indicator, StatusFlow steps are list items, ConfirmDialog names its dialog and does not animate on the web.
- Updated dependencies [[`ad03a25`](https://github.com/raihanevanza/rupa/commit/ad03a250297e73f551a6ecbb15c59b74c482e993)]:
  - @rupa-ui/tokens@0.2.2

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
