import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import clsx from "clsx";

export interface TextProps extends ComponentPropsWithoutRef<"p"> {
  as?: ElementType;
  size?: "xs" | "sm" | "md";
  color?: "primary" | "secondary";
  children?: ReactNode;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { as: Component = "p", size = "md", color = "primary", className, children, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={clsx("rebar-text", className)}
      data-rebar-component="text"
      data-rebar-size={size}
      data-rebar-color={color}
      {...props}
    >
      {children}
    </Component>
  );
});
