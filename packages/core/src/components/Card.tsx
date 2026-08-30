import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
  /** Force bionic reading on/off for this instance, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, children, bionic, bionicOptions, ...props },
  ref,
) {
  const content = useBionicChildren(children, bionic, bionicOptions);
  return (
    <div
      ref={ref}
      className={clsx("rebar-card", className)}
      data-rebar-component="card"
      {...props}
    >
      {content}
    </div>
  );
});
