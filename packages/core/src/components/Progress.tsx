import { forwardRef } from "react";
import * as RadixProgress from "@radix-ui/react-progress";
import clsx from "clsx";

export interface ProgressProps {
  /** Current value. Optional (ignored) when `indeterminate`. */
  value?: number;
  max?: number;
  /** Colors the bar: `"error"` in the danger tone, `"success"` in the success tone. Default `"normal"`. */
  status?: "normal" | "error" | "success";
  /** Unknown duration: no value is reported (`aria-valuenow` omitted) and the bar animates. */
  indeterminate?: boolean;
  /** Track thickness: `sm` 4px, `md` 8px (default), `lg` 12px. */
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = 0, max = 100, status = "normal", indeterminate, size = "md", className, ...props },
  ref,
) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <RadixProgress.Root
      ref={ref}
      className={clsx("rebar-progress", className)}
      data-rebar-component="progress"
      data-rebar-status={status === "normal" ? undefined : status}
      data-rebar-size={size}
      data-rebar-indeterminate={indeterminate ? "true" : undefined}
      value={indeterminate ? null : value}
      max={max}
      {...props}
    >
      <RadixProgress.Indicator
        className="rebar-progress-indicator"
        data-rebar-part="indicator"
        style={indeterminate ? undefined : { transform: `translateX(-${100 - percent}%)` }}
      />
    </RadixProgress.Root>
  );
});
