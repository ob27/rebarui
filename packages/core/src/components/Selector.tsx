import { useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import clsx from "clsx";

export interface SelectorOption<T> {
  label: ReactNode;
  description?: ReactNode;
  value: T;
  disabled?: boolean;
}

export interface SelectorProps<T> {
  options: SelectorOption<T>[];
  multiple?: boolean;
  value?: T[];
  defaultValue?: T[];
  onValueChange?: (value: T[]) => void;
  disabled?: boolean;
  /** How many chips per row before wrapping. Omit for a plain wrapping row (the common case). */
  columns?: number;
  /**
   * Chip semantics. `"button"` (default) keeps toggle buttons with `aria-pressed`. `"choice"`
   * exposes a real choice control: `role="checkbox"` with `aria-checked` when `multiple`, else
   * `role="radio"` inside a `radiogroup` (arrow keys move and select, the selected chip is the tab
   * stop, and pressing the selected chip again does not clear it).
   */
  chipRole?: "button" | "choice";
  "aria-label"?: string;
  className?: string;
}

/**
 * A grid of selectable chips — the antd-mobile `Selector` pattern, distinct from `MultiSelect`'s
 * dropdown: every option is visible and tappable at once, no menu to open first. Reach for this
 * when the option count is small enough to show in full (a handful of filters, a single-choice
 * settings picker); reach for `MultiSelect`/`Combobox` once the list is long enough to need
 * searching or scrolling.
 */
export function Selector<T extends string | number>({
  options,
  multiple = false,
  value,
  defaultValue = [],
  onValueChange,
  disabled = false,
  columns,
  chipRole = "button",
  "aria-label": ariaLabel,
  className,
}: SelectorProps<T>) {
  const [internalValue, setInternalValue] = useState<T[]>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;

  const setValue = (next: T[]) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const choice = chipRole === "choice";
  const radio = choice && !multiple;
  const groupRef = useRef<HTMLDivElement>(null);
  const enabledChips = () => Array.from(groupRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!radio) return;
    const dir = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    const chips = enabledChips();
    const at = chips.indexOf(document.activeElement as HTMLButtonElement);
    if (at < 0 || chips.length === 0) return;
    event.preventDefault();
    const next = chips[(at + dir + chips.length) % chips.length];
    next?.focus();
    next?.click();
  };

  const toggle = (option: SelectorOption<T>) => {
    if (disabled || option.disabled) return;
    const isSelected = current.includes(option.value);
    if (multiple) {
      setValue(isSelected ? current.filter((v) => v !== option.value) : [...current, option.value]);
    } else {
      if (radio && isSelected) return;
      setValue(isSelected ? [] : [option.value]);
    }
  };

  return (
    <div
      className={clsx("rebar-selector", className)}
      data-rebar-component="selector"
      ref={groupRef}
      role={radio ? "radiogroup" : "group"}
      aria-label={ariaLabel}
      onKeyDown={radio ? onKeyDown : undefined}
      style={columns ? { display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}
    >
      {options.map((option, i) => {
        const isSelected = current.includes(option.value);
        const isDisabled = disabled || option.disabled;
        const firstEnabled = options.findIndex((o) => !(disabled || o.disabled));
        const tabStop = current.length > 0 ? isSelected : i === firstEnabled;
        return (
          <button
            key={i}
            type="button"
            className="rebar-selector-chip"
            data-rebar-part="chip"
            {...(choice
              ? { role: multiple ? "checkbox" : "radio", "aria-checked": isSelected, tabIndex: radio && !tabStop ? -1 : undefined }
              : { "aria-pressed": isSelected })}
            disabled={isDisabled}
            onClick={() => toggle(option)}
          >
            <span className="rebar-selector-chip-label" data-rebar-part="chip-label">
              {option.label}
            </span>
            {option.description ? (
              <span className="rebar-selector-chip-description" data-rebar-part="chip-description">
                {option.description}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
