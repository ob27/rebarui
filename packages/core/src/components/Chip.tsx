import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

export interface ChipProps extends ComponentPropsWithoutRef<"button"> {
  /** `"tonal"` (tinted fill, the default), `"outline"` (hairline border, dimmed until pressed: thumbs and toggles) or
   * `"floating"` (a round, raised icon button: retry, scroll-to-latest). */
  variant?: "tonal" | "outline" | "floating";
  /** `"sm"` is the compact chip (12px, 2px 10px). Default `"md"` (13px, 7px 14px). */
  size?: "md" | "sm";
  /** Toggle state: sets `aria-pressed`, and the `outline` variant highlights. Omit for a plain button. */
  pressed?: boolean;
}

/**
 * A small pill button for secondary actions that sit beside content rather than on a form: a chat reply's Share and
 * Read more, a suggested question, a thumbs up/down toggle, a round retry. Looks come from the `--rebar-chip-*`
 * properties (tonal fill, border, pressed colours, floating size and shadow); the defaults follow the Rebar tokens.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { variant = "tonal", size = "md", pressed, className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx("rebar-chip", className)}
      data-rebar-component="chip"
      data-rebar-variant={variant}
      data-rebar-size={size === "sm" ? "sm" : undefined}
      aria-pressed={pressed === undefined ? undefined : pressed}
      {...props}
    />
  );
});
