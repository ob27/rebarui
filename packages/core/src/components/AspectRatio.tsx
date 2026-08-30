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
   * Shows one of Rebar's built-in placeholder photos when `src` isn't set yet — opt-in, off by
   * default. Picks whichever embedded placeholder's own ratio is numerically closest to `ratio`;
   * several placeholders share each ratio, so pass a number (e.g. a Carousel's slide index) to
   * pick a specific variant instead of always the same one — `true` defaults to the first.
   */
  placeholder?: boolean | number;
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 1, src, alt, className, placeholder },
  ref,
) {
  const imageSrc =
    src ?? (placeholder !== undefined && placeholder !== false
      ? resolveRatioPlaceholder(ratio, typeof placeholder === "number" ? placeholder : undefined)
      : undefined);

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
