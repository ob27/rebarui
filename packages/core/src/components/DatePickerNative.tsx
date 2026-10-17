import { useState } from "react";
import type { ChangeEvent } from "react";
import clsx from "clsx";

export interface DatePickerNativeProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  className?: string;
  [key: string]: unknown;
}

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/**
 * `DatePicker appearance="native"`: the platform's own date input (`<input type="date">`) dressed as a Rebar field. It takes the same
 * `Date` value API as the other date pickers (`value` / `defaultValue` / `onValueChange` / `minDate` / `maxDate`); the platform shows its
 * own picker. Single dates only (`range` is ignored). Extra props (`aria-label`, `id`, `name`, `required`) reach the input.
 */
export function DatePickerNative({ value, defaultValue, onValueChange, minDate, maxDate, disabled, className, ...rest }: DatePickerNativeProps) {
  // Strip props that belong to the other pickers.
  const { mode: _mode, range: _range, appearance: _appearance, placeholder: _placeholder, presentation: _presentation, minAge: _minAge, minAgeMessage: _minAgeMessage, yearRange: _yearRange, format: _format, title: _title, container: _container, ...inputProps } = rest as Record<string, unknown>;
  const [internal, setInternal] = useState<string>(defaultValue ? iso(defaultValue) : "");
  const controlled = value !== undefined;
  const shown = controlled ? (value ? iso(value) : "") : internal;
  const change = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!controlled) setInternal(v);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    if (m) onValueChange?.(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  };
  return (
    <input
      {...(inputProps as object)}
      type="date"
      className={clsx("rebar-input", "rebar-date-picker-native", className)}
      data-rebar-component="date-picker"
      data-rebar-appearance="native"
      value={shown}
      min={minDate ? iso(minDate) : undefined}
      max={maxDate ? iso(maxDate) : undefined}
      disabled={disabled}
      onChange={change}
    />
  );
}
