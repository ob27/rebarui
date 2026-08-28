import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import clsx from "clsx";

export interface BoxProps extends ComponentPropsWithoutRef<"div"> {
  as?: ElementType;
  children?: ReactNode;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(
  { as: Component = "div", className, children, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={clsx("rebar-box", className)}
      data-rebar-component="box"
      {...props}
    >
      {children}
    </Component>
  );
});
