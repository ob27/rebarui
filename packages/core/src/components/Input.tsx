import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  size?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={clsx("rebar-input", className)}
      data-rebar-component="input"
      data-rebar-size={size}
      {...props}
    />
  );
});
