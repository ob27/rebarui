import { forwardRef } from "react";
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
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { options, value, defaultValue, onValueChange, placeholder, disabled, size = "md", className, invalid, ...props },
  ref,
) {
  const schemeAttr = useSchemeAttr();
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
