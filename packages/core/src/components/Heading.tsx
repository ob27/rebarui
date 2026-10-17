import { forwardRef, useId } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";
import { Text } from "./Text";

export interface HeadingProps extends ComponentPropsWithoutRef<"h1"> {
  level?: 1 | 2 | 3;
  /** Force bionic reading on/off for this instance, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
  /** An eyebrow (`Text variant="eyebrow"`) above the heading, 8px apart. The heading's accessible name includes it (`aria-labelledby`). */
  eyebrow?: ReactNode;
  /** A hairline rule after the heading text ("Your data"): sentence case, no tracking. */
  rule?: boolean;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 1, className, children, bionic, bionicOptions, eyebrow, rule, id, ...props },
  ref,
) {
  const Component = `h${level}` as "h1" | "h2" | "h3";
  const content = useBionicChildren(children, bionic, bionicOptions);
  const uid = useId();
  const headingId = id ?? `${uid}-heading`;
  const eyebrowId = `${uid}-eyebrow`;
  const heading = (
    <Component
      ref={ref}
      id={id ?? (eyebrow ? headingId : undefined)}
      className={clsx("rebar-heading", className)}
      data-rebar-component="heading"
      data-rebar-level={level}
      data-rebar-rule={rule ? "end" : undefined}
      aria-labelledby={eyebrow ? `${eyebrowId} ${headingId}` : undefined}
      {...props}
    >
      {content}
    </Component>
  );
  if (!eyebrow) return heading;
  return (
    <div className="rebar-heading-group" data-rebar-component="heading-group">
      <Text as="span" variant="eyebrow" id={eyebrowId} data-rebar-part="eyebrow">
        {eyebrow}
      </Text>
      {heading}
    </div>
  );
});
