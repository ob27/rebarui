import { forwardRef } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";

export interface StatisticProps {
  title?: ReactNode;
  value: number | string;
  precision?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** `"bottom"` puts the title under the value (a number with its caption below). Default `"top"`. */
  titlePlacement?: "top" | "bottom";
  className?: string;
  /** Force bionic reading on/off for the title, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
}

function formatValue(value: number | string, precision?: number): string {
  if (typeof value === "number") {
    return precision !== undefined ? value.toFixed(precision) : value.toLocaleString();
  }
  return value;
}

export const Statistic = forwardRef<HTMLDivElement, StatisticProps>(function Statistic(
  { title, value, precision, prefix, suffix, titlePlacement = "top", bionic, bionicOptions, className },
  ref,
) {
  const titleContent = useBionicChildren(title, bionic, bionicOptions);
  return (
    <div ref={ref} className={clsx("rebar-statistic", className)} data-rebar-component="statistic" data-rebar-title-placement={titlePlacement === "bottom" ? "bottom" : undefined}>
      {title ? (
        <div className="rebar-statistic-title" data-rebar-part="title">
          {titleContent}
        </div>
      ) : null}
      <div className="rebar-statistic-value" data-rebar-part="value">
        {prefix ? (
          <span className="rebar-statistic-affix" data-rebar-part="prefix">
            {prefix}
          </span>
        ) : null}
        {formatValue(value, precision)}
        {suffix ? (
          <span className="rebar-statistic-affix" data-rebar-part="suffix">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
});
