import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

export interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  level?: 1 | 2 | 3;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 1, className, children, ...props },
  ref,
) {
  const Component = `h${level}` as "h1" | "h2" | "h3";
  return (
    <Component
      ref={ref}
      className={clsx("rebar-heading", className)}
      data-rebar-component="heading"
      data-rebar-level={level}
      {...props}
    >
      {children}
    </Component>
  );
});
