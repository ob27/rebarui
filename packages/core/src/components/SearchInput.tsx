import { forwardRef, useRef, useState } from "react";
import type { ChangeEvent, ComponentPropsWithoutRef, KeyboardEvent, ReactNode } from "react";
import clsx from "clsx";

export interface SearchInputProps extends Omit<ComponentPropsWithoutRef<"input">, "size" | "value" | "defaultValue" | "onChange" | "type"> {
  /** Controlled text. */
  value?: string;
  /** Uncontrolled initial text. */
  defaultValue?: string;
  /** Every keystroke (and the clear): use it to filter a list as you type. */
  onChange?: (value: string) => void;
  /** Enter, or the keyboard's Search key. */
  onSearch?: (value: string) => void;
  /** Shows a Cancel text button while the field has focus (in-sheet and full-screen search). */
  onCancel?: () => void;
  /** A round clear button once there is text. Default `true`. Escape clears too. */
  clearable?: boolean;
  /** A spinner in place of the clear button while a remote search runs. */
  loading?: boolean;
  /** `"pill"` is outlined on the page. `"flat"` is a filled panel tone for sheets and cards. Default `"pill"`. */
  variant?: "pill" | "flat";
  /** `"md"` 48px (phone) or `"lg"` 56px. Default `"md"`. */
  size?: "md" | "lg";
  /** Accessible name when there is no visible label. Default "Search". */
  "aria-label"?: string;
  /** Label of the Cancel button. Default "Cancel". */
  cancelLabel?: string;
  /** Label of the clear button. Default "Clear". */
  clearLabel?: string;
  /** Replaces the magnifier glyph (any element sized by its own `width`/`height` or `1em`). */
  icon?: ReactNode;
  /** Replaces the glyph inside the clear button. */
  clearIcon?: ReactNode;
}

function MagnifierIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1.25em" height="1.25em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

/**
 * A pill search field: icon, clear, Cancel, loading. Imitation: a standalone primitive that mirrors a
 * controlled or uncontrolled value (it reimplements its own buttons rather than importing `Button`).
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  {
    value,
    defaultValue = "",
    onChange,
    onSearch,
    onCancel,
    clearable = true,
    loading,
    variant = "pill",
    size = "md",
    className,
    disabled,
    placeholder,
    onFocus,
    onBlur,
    onKeyDown,
    cancelLabel = "Cancel",
    clearLabel = "Clear",
    icon,
    clearIcon,
    "aria-label": ariaLabel = "Search",
    ...props
  },
  ref,
) {
  const [internal, setInternal] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const commit = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => commit(event.target.value);
  const clear = () => {
    commit("");
    inputRef.current?.focus();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Enter") onSearch?.(current);
    else if (event.key === "Escape" && clearable && current) {
      event.preventDefault();
      commit("");
    }
  };

  const showClear = clearable && current !== "" && !loading && !disabled;
  const showCancel = Boolean(onCancel) && focused;

  return (
    <div
      className={clsx("rebar-search-input", className)}
      data-rebar-component="search-input"
      data-rebar-variant={variant}
      data-rebar-size={size}
      data-rebar-focused={focused ? "true" : undefined}
      data-rebar-disabled={disabled ? "true" : undefined}
      role="search"
    >
      <div className="rebar-search-input-field" data-rebar-part="field">
        <span className="rebar-search-input-icon" data-rebar-part="icon" aria-hidden="true">
          {icon ?? <MagnifierIcon />}
        </span>
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="search"
          enterKeyHint="search"
          className="rebar-search-input-control"
          data-rebar-part="input"
          value={current}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            // Moving focus to the Cancel button keeps it on screen long enough to be pressed.
            if (!e.relatedTarget || !(e.relatedTarget as HTMLElement).closest?.('[data-rebar-part="cancel"]')) setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {loading ? <span className="rebar-search-input-spinner" data-rebar-part="spinner" role="status" aria-label="Searching" /> : null}
        {showClear ? (
          <button type="button" className="rebar-search-input-clear" data-rebar-part="clear" aria-label={clearLabel} onClick={clear}>
            {clearIcon ?? (
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" focusable="false">
                <path d="M7 7l10 10M17 7L7 17" />
              </svg>
            )}
          </button>
        ) : null}
      </div>
      {showCancel ? (
        <button
          type="button"
          className="rebar-search-input-cancel"
          data-rebar-part="cancel"
          onClick={() => {
            setFocused(false);
            onCancel?.();
          }}
        >
          {cancelLabel}
        </button>
      ) : null}
    </div>
  );
});
