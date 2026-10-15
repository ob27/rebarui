import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface FloatCardProps extends ComponentPropsWithoutRef<"div"> {
  /** A small uppercase heading above the content. */
  label?: string;
  children: ReactNode;
  /** `"accent"` uses the primary colour for the label and a primary-tinted border. Default `"default"`. */
  tone?: "default" | "accent";
}

/** A small elevated card for a floating UI fragment, such as a preview of a notification, a
 * citation or a check-in that sits beside a device screenshot. */
export function FloatCard({ label, children, tone = "default", className, ...props }: FloatCardProps) {
  return (
    <div
      className={clsx("rebar-float-card", className)}
      data-rebar-component="float-card"
      data-rebar-tone={tone}
      {...props}
    >
      {label ? (
        <span className="rebar-float-card-label" data-rebar-part="label">
          {label}
        </span>
      ) : null}
      <div className="rebar-float-card-body" data-rebar-part="body">
        {children}
      </div>
    </div>
  );
}
