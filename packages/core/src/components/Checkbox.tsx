import { forwardRef, useId } from "react";
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
  /** Marks the field as failing validation: sets `aria-invalid="true"` and `data-rebar-invalid`. */
  invalid?: boolean;
  /** Force bionic reading on/off for the label, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { className, children, bionic, bionicOptions, id, invalid, description, variant = "default", "aria-describedby": describedBy, ...props },
  ref,
) {
  const generatedId = id ?? undefined;
  const descriptionId = useId();
  const describedByIds = [describedBy, description ? descriptionId : undefined].filter(Boolean).join(" ") || undefined;
  const label = useBionicChildren(children, bionic, bionicOptions);

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
