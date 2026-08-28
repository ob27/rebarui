import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx("rebar-card", className)}
      data-rebar-component="card"
      {...props}
    >
      {children}
    </div>
  );
});
