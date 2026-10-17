import { forwardRef, useEffect, useId, useRef } from "react";
import type { Ref } from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import type { ReactNode } from "react";
import clsx from "clsx";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";

export interface CheckboxProps
  extends Omit<RadixCheckbox.CheckboxProps, "asChild"> {
  children?: ReactNode;
  /** Secondary line under the label (a hint or consequence). Linked with `aria-describedby`. */
  description?: ReactNode;
  /** `"card"` makes the whole label a bordered, padded card that tints when checked (for option lists such as plans or permissions). Default `"default"`. */
  variant?: "default" | "card";
  /**
   * `"custom"` (default): Rebar's own drawn box. `"native"`: the platform's `<input type="checkbox">` (the browser's own
   * box and tick, sized by `--rebar-checkbox-native-size` and tinted by `--rebar-checkbox-accent`). The label, `variant`,
   * `description`, `checked` / `onCheckedChange` and `invalid` work the same; the ref then points at the `<input>`.
   */
  appearance?: "custom" | "native";
  /** Marks the field as failing validation: sets `aria-invalid="true"` and `data-rebar-invalid`. */
  invalid?: boolean;
  /** Force bionic reading on/off for the label, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { className, children, bionic, bionicOptions, id, invalid, description, variant = "default", appearance = "custom", "aria-describedby": describedBy, ...props },
  ref,
) {
  const nativeRef = useRef<HTMLInputElement | null>(null);
  const indeterminate = props.checked === "indeterminate";
  useEffect(() => {
    if (appearance === "native" && nativeRef.current) nativeRef.current.indeterminate = indeterminate;
  }, [appearance, indeterminate]);
  const generatedId = id ?? undefined;
  const descriptionId = useId();
  const describedByIds = [describedBy, description ? descriptionId : undefined].filter(Boolean).join(" ") || undefined;
  const label = useBionicChildren(children, bionic, bionicOptions);

  if (appearance === "native") {
    const { checked, defaultChecked, onCheckedChange, disabled, required, name, value, form, ...rest } = props;
    return (
      <label className="rebar-checkbox-label" htmlFor={generatedId} data-rebar-variant={variant === "card" ? "card" : undefined} data-rebar-appearance="native">
        <input
          {...(rest as object)}
          ref={(node) => {
            nativeRef.current = node;
            if (typeof ref === "function") (ref as unknown as (n: HTMLInputElement | null) => void)(node);
            else if (ref) (ref as unknown as { current: HTMLInputElement | null }).current = node;
          }}
          type="checkbox"
          id={generatedId}
          className={clsx("rebar-checkbox", "rebar-checkbox-native", className)}
          data-rebar-component="checkbox"
          aria-invalid={invalid ? true : undefined}
          data-rebar-invalid={invalid ? "true" : undefined}
          aria-describedby={describedByIds}
          checked={checked === undefined ? undefined : checked === true}
          defaultChecked={defaultChecked === undefined ? undefined : defaultChecked === true}
          disabled={disabled}
          required={required}
          name={name}
          value={value as string | undefined}
          form={form}
          onChange={(event) => onCheckedChange?.(event.target.checked)}
        />
        {children || description ? (
          <span className="rebar-checkbox-text" data-rebar-part="text">
            {children ? <span data-rebar-part="label">{label}</span> : null}
            {description ? (
              <span id={descriptionId} className="rebar-checkbox-description" data-rebar-part="description">
                {description}
              </span>
            ) : null}
          </span>
        ) : null}
      </label>
    );
  }

  return (
    <label className="rebar-checkbox-label" htmlFor={generatedId} data-rebar-variant={variant === "card" ? "card" : undefined}>
      <RadixCheckbox.Root
        ref={ref}
        id={generatedId}
        className={clsx("rebar-checkbox", className)}
        data-rebar-component="checkbox"
        aria-invalid={invalid ? true : undefined}
        data-rebar-invalid={invalid ? "true" : undefined}
        aria-describedby={describedByIds}
        {...props}
      >
        <RadixCheckbox.Indicator className="rebar-checkbox-indicator" data-rebar-part="indicator">
          {/* Radix renders this Indicator for both "checked" and "indeterminate" `data-state` —
              picking the right glyph via CSS (keyed off the real `data-state` Radix itself sets)
              rather than inspecting the `checked` prop in JS means this works whether the caller
              drives `checked`/`defaultChecked` in controlled or uncontrolled mode. Previously
              always rendered "✓" regardless of state, and with no `data-state="indeterminate"`
              CSS rule for a colored background either, an indeterminate checkbox (e.g. Table's own
              partial-selection "select all") rendered a real, invisible white-on-white checkmark —
              silently broken, not just visually plain. */}
          <span className="rebar-checkbox-icon-checked" aria-hidden="true">
            ✓
          </span>
          <span className="rebar-checkbox-icon-indeterminate" aria-hidden="true">
            −
          </span>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {children || description ? (
        <span className="rebar-checkbox-text" data-rebar-part="text">
          {children ? <span data-rebar-part="label">{label}</span> : null}
          {description ? (
            <span id={descriptionId} className="rebar-checkbox-description" data-rebar-part="description">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
});
