---
'@rupa-ui/react': minor
'@rupa-ui/react-native': minor
---

New `MultiSelect`: choose several options from a list you can search, e.g. to filter a table or a list screen. It has Select all and Clear, a `searchable={false}` mode for short lists, and replaceable text through `labels`.

React: the search box is a combobox over a multi-select listbox (arrows move, Enter toggles, Esc closes and returns focus), and `name` submits the choices with a form. `Field` passes `labelId` to its render function, so custom controls can name themselves with `aria-labelledby`.

React Native: the trigger opens a bottom sheet with a search box and a checkbox per option. Choices apply as they are tapped; Done, the backdrop, or Android back close it. Screen readers hear the label, the choice, and the count, and the number of matches after a search.
