import { forwardRef } from "react";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import type { ReactNode } from "react";
import clsx from "clsx";

export type RadioGroupProps = RadixRadioGroup.RadioGroupProps;

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { className, ...props },
  ref,
) {
  return (
    <RadixRadioGroup.Root
      ref={ref}
      className={clsx("rebar-radio-group", className)}
      data-rebar-component="radio-group"
      {...props}
    />
  );
});

export interface RadioProps extends Omit<RadixRadioGroup.RadioGroupItemProps, "asChild"> {
  children?: ReactNode;
}

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { className, children, id, ...props },
  ref,
) {
  return (
    <label className="rebar-radio-label" htmlFor={id}>
      <RadixRadioGroup.Item
        ref={ref}
        id={id}
        className={clsx("rebar-radio", className)}
        data-rebar-component="radio"
        {...props}
      >
        <RadixRadioGroup.Indicator className="rebar-radio-indicator" data-rebar-part="indicator" />
      </RadixRadioGroup.Item>
      {children ? <span data-rebar-part="label">{children}</span> : null}
    </label>
  );
});
