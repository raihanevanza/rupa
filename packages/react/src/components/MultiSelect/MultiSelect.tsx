import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { cx } from '../../lib/cx.js'
import { CheckIcon, ChevronDownIcon, SearchIcon } from '../../lib/icons.js'
import { useControllable } from '../../lib/useControllable.js'
import { Button } from '../Button/Button.js'
import { Field, type FieldProps } from '../Field/Field.js'

export interface MultiSelectOption {
  value: string
  /** Plain text, so the search can match it. */
  label: string
  /** Second line under the label; also searched. */
  description?: string
  disabled?: boolean
}

export interface MultiSelectLabels {
  /** Name and placeholder of the search box. */
  search: string
  noResults: string
  /** Chooses every option that matches the search. */
  selectAll: string
  clear: string
  /** Read after the chosen labels; the trigger shows only the number. */
  count: (count: number) => string
  /** Announced to screen readers while searching. */
  results: (count: number) => string
}

export interface MultiSelectProps extends Pick<
  FieldProps,
  'label' | 'hint' | 'error' | 'requiredLabel' | 'hideLabel'
> {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  /** Trigger text while nothing is chosen, e.g. "All branches". */
  placeholder?: string
  /** Show the search box. Turn it off for short lists. */
  searchable?: boolean
  /** Submits one `name=value` pair per chosen option with the form. */
  name?: string
  required?: boolean
  disabled?: boolean
  id?: string
  className?: string
  fieldClassName?: string
  labels?: Partial<MultiSelectLabels>
}

const defaultLabels: MultiSelectLabels = {
  search: 'Search',
  noResults: 'No matches',
  selectAll: 'Select all',
  clear: 'Clear',
  count: (n) => `${n} selected`,
  results: (n) => (n === 1 ? '1 result' : `${n} results`),
}

const none: string[] = []

/** Case- and accent-insensitive, so "jak" finds "Jakarta" and "medan" finds "Médan". */
const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/**
 * Choose several options from a list you can search. The trigger opens a popup with a
 * search box (a combobox) that drives a multi-select listbox through aria-activedescendant:
 * focus stays in the search box, arrows move through the options, Enter toggles one, Esc
 * closes and returns focus to the trigger.
 */
export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect(
  {
    label,
    hint,
    error,
    requiredLabel,
    hideLabel,
    options,
    value: valueProp,
    defaultValue = none,
    onChange,
    placeholder,
    searchable = true,
    name,
    required,
    disabled,
    id,
    className,
    fieldClassName,
    labels: labelsProp,
  },
  ref,
) {
  const labels = { ...defaultLabels, ...labelsProp }
  const base = useId()
  const [selected, setSelected] = useControllable(valueProp, defaultValue, onChange)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => trigger.current!)

  const listId = `${base}-list`
  const valueId = `${base}-value`
  const countId = `${base}-count`
  const optionId = (value: string) =>
    `${base}-option-${options.findIndex((o) => o.value === value)}`

  const q = fold(query.trim())
  const filtered = q
    ? options.filter((o) => fold(`${o.label} ${o.description ?? ''}`).includes(q))
    : options
  const enabled = filtered.filter((o) => !o.disabled)
  // With no active option (or one the search filtered out), the first match is active.
  const current = enabled.some((o) => o.value === active) ? active : (enabled[0]?.value ?? null)
  const chosen = options.filter((o) => selected.includes(o.value))
  const focusInside = () => (search.current ?? list.current)?.focus()

  const show = () => {
    setQuery('')
    setActive(options.find((o) => !o.disabled && selected.includes(o.value))?.value ?? null)
    setOpen(true)
  }
  const hide = (returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) trigger.current?.focus()
  }

  useEffect(() => {
    if (open) (search.current ?? list.current)?.focus()
  }, [open])

  useEffect(() => {
    if (!open || current == null) return
    document.getElementById(optionId(current))?.scrollIntoView?.({ block: 'nearest' })
  })

  // A click anywhere else closes the popup, like a native select.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const toggle = (value: string) =>
    setSelected(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
    )
  const unchosen = enabled.filter((o) => !selected.includes(o.value))
  // Disabled options cannot be changed, so Clear keeps the ones that were already chosen.
  const kept = selected.filter((v) => options.find((o) => o.value === v)?.disabled)
  const selectAll = () => {
    setSelected([...selected, ...unchosen.map((o) => o.value)])
    focusInside()
  }
  const clear = () => {
    setSelected(kept)
    focusInside()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const i = enabled.findIndex((o) => o.value === current)
    const inSearch = e.currentTarget === search.current
    let to: number | null = null
    switch (e.key) {
      case 'ArrowDown':
        to = Math.min(i + 1, enabled.length - 1)
        break
      case 'ArrowUp':
        to = Math.max(i - 1, 0)
        break
      // In the search box Home/End move the caret, as in any text field.
      case 'Home':
        if (!inSearch) to = 0
        break
      case 'End':
        if (!inSearch) to = enabled.length - 1
        break
      case 'Enter':
        e.preventDefault() // never submit the surrounding form
        if (current != null) toggle(current)
        return
      case ' ':
        if (inSearch) return
        e.preventDefault()
        if (current != null) toggle(current)
        return
      case 'Escape':
        e.preventDefault()
        e.stopPropagation()
        hide(true)
        return
    }
    const next = to === null ? undefined : enabled[to]
    if (!next) return
    e.preventDefault()
    setActive(next.value)
  }

  // Clicks on the popup must not take focus away from the search box (or the listbox).
  const keepFocus = (e: MouseEvent) => {
    if (!(e.target as HTMLElement).closest('input, button')) e.preventDefault()
  }

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      requiredLabel={requiredLabel}
      hideLabel={hideLabel}
      id={id}
      className={fieldClassName}
    >
      {({ id, labelId, describedBy }) => (
        // onBlur only watches focus leaving the component; it is not an interaction.
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          ref={root}
          className={cx('rupa-multi-select', className)}
          onBlur={(e) => {
            // Tab out of the popup closes it. (A null target is a click; pointerdown handles it.)
            const to = e.relatedTarget as Node | null
            if (open && to && !root.current?.contains(to)) setOpen(false)
          }}
        >
          <button
            ref={trigger}
            id={id}
            type="button"
            className="rupa-control rupa-multi-select__trigger"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? `${base}-popup` : undefined}
            aria-labelledby={cx(labelId, valueId, chosen.length > 1 && countId)}
            aria-describedby={describedBy}
            disabled={disabled}
            data-disabled={disabled || undefined}
            onClick={() => (open ? hide(false) : show())}
            onKeyDown={(e) => {
              if (open || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return
              e.preventDefault()
              show()
            }}
          >
            <span
              id={valueId}
              className="rupa-multi-select__value"
              data-placeholder={chosen.length === 0 || undefined}
            >
              {chosen.length ? chosen.map((o) => o.label).join(', ') : placeholder}
            </span>
            {/* Keeps the label and the number apart in the text that axe compares to the name. */}
            {chosen.length > 1 && ' '}
            {chosen.length > 1 && (
              <span id={countId} className="rupa-multi-select__count">
                <span aria-hidden="true">{chosen.length}</span>
                <span className="rupa-visually-hidden">{labels.count(chosen.length)}</span>
              </span>
            )}
            <ChevronDownIcon className="rupa-multi-select__chevron" />
          </button>

          {open && (
            // onMouseDown only keeps focus where it is; every control inside is keyboard-usable.
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div id={`${base}-popup`} className="rupa-multi-select__popup" onMouseDown={keepFocus}>
              {searchable && (
                <div className="rupa-multi-select__search">
                  <SearchIcon />
                  <input
                    ref={search}
                    type="text"
                    role="combobox"
                    className="rupa-multi-select__search-input"
                    aria-label={labels.search}
                    aria-autocomplete="list"
                    aria-expanded={filtered.length > 0}
                    aria-controls={filtered.length > 0 ? listId : undefined}
                    aria-activedescendant={current != null ? optionId(current) : undefined}
                    placeholder={labels.search}
                    autoComplete="off"
                    spellCheck={false}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setActive(null)
                    }}
                    onKeyDown={onKeyDown}
                  />
                </div>
              )}

              {filtered.length > 0 ? (
                <div
                  ref={list}
                  id={listId}
                  role="listbox"
                  aria-multiselectable="true"
                  aria-labelledby={labelId}
                  aria-activedescendant={
                    !searchable && current != null ? optionId(current) : undefined
                  }
                  tabIndex={searchable ? -1 : 0}
                  className="rupa-multi-select__list"
                  onKeyDown={searchable ? undefined : onKeyDown}
                >
                  {filtered.map((o) => (
                    // Options are never focused: keyboard users reach them through
                    // aria-activedescendant on the search box (or the listbox).
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus
                    <div
                      key={o.value}
                      id={optionId(o.value)}
                      role="option"
                      aria-selected={selected.includes(o.value)}
                      aria-disabled={o.disabled || undefined}
                      data-active={o.value === current || undefined}
                      className="rupa-multi-select__option"
                      onPointerMove={() => !o.disabled && o.value !== active && setActive(o.value)}
                      onClick={() => !o.disabled && toggle(o.value)}
                    >
                      <span className="rupa-multi-select__check" aria-hidden="true">
                        <CheckIcon />
                      </span>
                      <span className="rupa-multi-select__text">
                        <span className="rupa-multi-select__label">{o.label}</span>
                        {o.description && (
                          <span className="rupa-multi-select__description">{o.description}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rupa-multi-select__empty">{labels.noResults}</p>
              )}

              <div className="rupa-visually-hidden" aria-live="polite">
                {q ? labels.results(filtered.length) : ''}
              </div>

              <div className="rupa-multi-select__footer">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={unchosen.length === 0}
                  onClick={selectAll}
                >
                  {labels.selectAll}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={selected.length === kept.length}
                  onClick={clear}
                >
                  {labels.clear}
                </Button>
              </div>
            </div>
          )}

          {name && selected.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
        </div>
      )}
    </Field>
  )
})
