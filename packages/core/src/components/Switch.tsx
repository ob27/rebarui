import { forwardRef, useState } from "react";
import type { ReactNode } from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import clsx from "clsx";

export interface SwitchProps extends Omit<RadixSwitch.SwitchProps, "onChange"> {
  /** Rendered inside the thumb itself (a sun/moon glyph for a light/dark toggle, say) — a plain
   * `ReactNode` slot, not a prescribed icon set, the same "bring your own icon" convention this
   * library's other icon slots already use. Absent by default (a bare thumb, unchanged). */
  thumbIcon?: ReactNode;
  /** Spinner in the thumb, pointer events off, `aria-busy`. The switch keeps its current value until the change settles. */
  loading?: boolean;
  /**
   * Called with the next value, alongside `onCheckedChange`. If it returns a promise the switch is
   * `loading` until it settles; a rejection puts the previous value back (uncontrolled) so the
   * switch never claims a change that did not happen. A controlled `checked` stays the caller's to set.
   */
  onChange?: (checked: boolean) => void | Promise<void>;
  /** `"md"` 52 by 32 (default) or `"lg"` 60 by 36. The theme sets the real size. */
  size?: "md" | "lg";
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { className, thumbIcon, loading, onChange, size, checked, defaultChecked, onCheckedChange, ...props },
  ref,
) {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const [pending, setPending] = useState(false);
  const isControlled = checked !== undefined;
  const current = isControlled ? checked : internal;
  const busy = Boolean(loading) || pending;

  const handleChange = (next: boolean) => {
    if (busy) return;
    const previous = current;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
    const result = onChange?.(next);
    if (result && typeof (result as Promise<void>).then === "function") {
      setPending(true);
      (result as Promise<void>).then(
        () => setPending(false),
        () => {
          setPending(false);
          if (!isControlled) setInternal(previous);
        },
      );
    }
  };

  return (
    <RadixSwitch.Root
      ref={ref}
      className={clsx("rebar-switch", thumbIcon && "rebar-switch-has-thumb-icon", className)}
      data-rebar-component="switch"
      data-rebar-size={size}
      data-rebar-loading={busy ? "true" : undefined}
      aria-busy={busy || undefined}
      checked={current}
      onCheckedChange={handleChange}
      {...props}
    >
      <RadixSwitch.Thumb className="rebar-switch-thumb" data-rebar-part="thumb">
        {busy ? (
          <span className="rebar-switch-spinner" data-rebar-part="spinner" aria-hidden="true" />
        ) : thumbIcon ? (
          <span className="rebar-switch-thumb-icon" data-rebar-part="thumb-icon" aria-hidden="true">
            {thumbIcon}
          </span>
        ) : null}
      </RadixSwitch.Thumb>
    </RadixSwitch.Root>
  );
});
