import { forwardRef, useState } from "react";
import type * as React from "react";
import { useSchemeAttr } from "./ThemeScope";
import * as RadixSelect from "@radix-ui/react-select";
import clsx from "clsx";
import { ChevronDownIcon } from "./icons";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** A labelled group of options; the label renders as a non-selectable heading above them. */
export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

function isGroup(entry: SelectOption | SelectOptionGroup): entry is SelectOptionGroup {
  return "options" in entry;
}

export interface SelectProps {
  /** Options, or `{ label, options }` groups (mixed is fine). Group labels render above their options. */
  options: (SelectOption | SelectOptionGroup)[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Matches `Button`'s own three-tier scale (`sm`=32px, `md`=44px, `lg`=48px) exactly, so a
   * `Select` placed beside a `Button` in the same toolbar/row lines up by default instead of
   * needing a one-off height override — see `ref/HEURISTICS.md`'s form-control sizing heuristic.
   * Default `"md"`. */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Marks the field as failing validation: sets `aria-invalid="true"` and `data-rebar-invalid` on the trigger. */
  invalid?: boolean;
  "aria-label"?: string;
  /**
   * Renders the platform's own `<select>` (the OS picker on a phone, the browser's list on a desktop) with the same
   * options, value and `onValueChange`, styled by the same tokens as the custom trigger. Use it where the native
   * control's look and behaviour are the point. The ref then points at the `<select>`.
   */
  native?: boolean;
  /** `id` of the field (native: on the `<select>`, so a `<label htmlFor>` finds it). */
  id?: string;
  name?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { options, value, defaultValue, onValueChange, placeholder, disabled, size = "md", className, invalid, native, ...props },
  ref,
) {
  const schemeAttr = useSchemeAttr();
  // Native mode keeps its own value the way Radix does when `value` is not passed.
  const [internal, setInternal] = useState(defaultValue ?? "");
  if (native) {
    const renderOption = (option: SelectOption) => (
      <option key={option.value} value={option.value} disabled={option.disabled}>
        {option.label}
      </option>
    );
    // A placeholder is an empty first option, shown while nothing is chosen (the custom trigger shows it the same way).
    const firstValue = options.flatMap((entry) => (isGroup(entry) ? entry.options : [entry])).find((option) => !option.disabled)?.value ?? "";
    const raw = value ?? internal;
    const empty = placeholder !== undefined && raw === "";
    // With no placeholder, an unset field shows its first option, as a native <select> does.
    const current = raw === "" && placeholder === undefined ? firstValue : raw;
    return (
      <select
        ref={ref as unknown as React.Ref<HTMLSelectElement>}
        className={clsx("rebar-select-trigger", "rebar-select-native", className)}
        data-rebar-component="select"
        data-rebar-native="true"
        data-rebar-size={size}
        data-rebar-invalid={invalid ? "true" : undefined}
        aria-invalid={invalid ? true : undefined}
        disabled={disabled}
        value={current}
        onChange={(event) => {
          setInternal(event.target.value);
          onValueChange?.(event.target.value);
        }}
        {...props}
      >
        {placeholder !== undefined && empty ? (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        ) : null}
        {options.map((entry, index) =>
          isGroup(entry) ? (
            <optgroup key={`group-${index}`} label={entry.label}>
              {entry.options.map((option) => renderOption(option))}
            </optgroup>
          ) : (
            renderOption(entry)
          ),
        )}
      </select>
    );
  }
  const renderItem = (option: SelectOption) => (
    <RadixSelect.Item
      key={option.value}
      value={option.value}
      disabled={option.disabled}
      className="rebar-select-item"
      data-rebar-part="item"
    >
      <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="rebar-select-item-indicator">
        ✓
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <RadixSelect.Trigger
        ref={ref}
        className={clsx("rebar-select-trigger", className)}
        data-rebar-component="select"
        data-rebar-size={size}
        aria-invalid={invalid ? true : undefined}
        data-rebar-invalid={invalid ? "true" : undefined}
        {...props}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className="rebar-select-icon" aria-hidden="true">
          <ChevronDownIcon />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content {...schemeAttr} className="rebar-select-content" data-rebar-part="content">
          <RadixSelect.Viewport>
            {options.map((entry, index) =>
              isGroup(entry) ? (
                <RadixSelect.Group key={`group-${index}`} className="rebar-select-group" data-rebar-part="group">
                  <RadixSelect.Label className="rebar-select-group-label" data-rebar-part="group-label">
                    {entry.label}
                  </RadixSelect.Label>
                  {entry.options.map((option) => renderItem(option))}
                </RadixSelect.Group>
              ) : (
                renderItem(entry)
              ),
            )}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
});
