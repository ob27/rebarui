import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  /** `BentoCard`s. */
  children: ReactNode;
}

/** A 6-column grid from 960px up and a single column below. Rows size to their content. */
export function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div className={clsx("rebar-bento-grid", className)} data-rebar-component="bento-grid" {...props}>
      {children}
    </div>
  );
}
