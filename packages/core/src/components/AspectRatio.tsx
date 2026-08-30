import { forwardRef } from "react";
import * as RadixAspectRatio from "@radix-ui/react-aspect-ratio";
import clsx from "clsx";
import { resolveRatioPlaceholder } from "./ratioPlaceholder";

export interface AspectRatioProps {
  /** width / height, e.g. 16 / 9. Defaults to 1 (square). */
  ratio?: number;
  src?: string;
  alt?: string;
  className?: string;
  /**
   * Shows one of Rebar's built-in illustrated placeholder images when `src` isn't set yet —
   * opt-in, off by default. Picks whichever embedded placeholder's own ratio is numerically
   * closest to `ratio` (there's one per standard ratio, not one per possible value), then lets
   * it crop to fit exactly via the same `object-fit: cover` any real photo would use.
   */
  placeholder?: boolean;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 1, src, alt, className, placeholder },
  ref,
) {
  const imageSrc = src ?? (placeholder ? resolveRatioPlaceholder(ratio) : undefined);

  return (
    <RadixAspectRatio.Root
      ref={ref}
      ratio={ratio}
      className={clsx("rebar-aspect-ratio", className)}
      data-rebar-component="aspect-ratio"
    >
      {imageSrc ? (
        <img className="rebar-aspect-ratio-image" src={imageSrc} alt={alt ?? ""} />
      ) : (
        <div className="rebar-aspect-ratio-empty" data-rebar-part="empty" />
      )}
    </RadixAspectRatio.Root>
  );
});
