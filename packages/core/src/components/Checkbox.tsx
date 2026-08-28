import { forwardRef } from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import type { ReactNode } from "react";
import clsx from "clsx";

export interface CheckboxProps
  extends Omit<RadixCheckbox.CheckboxProps, "asChild"> {
  children?: ReactNode;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { className, children, id, ...props },
  ref,
) {
  const generatedId = id ?? undefined;

  return (
    <label className="rebar-checkbox-label" htmlFor={generatedId}>
      <RadixCheckbox.Root
        ref={ref}
        id={generatedId}
        className={clsx("rebar-checkbox", className)}
        data-rebar-component="checkbox"
        {...props}
      >
        <RadixCheckbox.Indicator className="rebar-checkbox-indicator" data-rebar-part="indicator">
          ✓
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {children ? <span data-rebar-part="label">{children}</span> : null}
    </label>
  );
});
