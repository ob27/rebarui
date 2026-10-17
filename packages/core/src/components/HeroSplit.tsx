import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import clsx from "clsx";

export interface HeroSplitProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  /** Kicker above the title. Coral on the backdrop, muted on a plain surface. */
  eyebrow?: ReactNode;
  /** Rendered as the page `<h1>`. One per page. */
  title: ReactNode;
  /** Supporting line under the title. */
  lede?: ReactNode;
  /** Buttons or `Button href` links. Full width on phones. */
  actions?: ReactNode;
  /** Small print under the actions. */
  note?: ReactNode;
  /** Device slot, usually a `DeviceStage` with floating chips. Omit for a copy-only hero. */
  media?: ReactNode;
  /** Art behind the copy: an image URL or your own node. A start-side scrim is added automatically. Only used with `tone="inverse"`. */
  backdrop?: string | ReactNode;
  /** `inverse` sits on the art; `default` and `tint` drop the backdrop (the app page variant). Default `"inverse"` with a backdrop, otherwise `"default"`. */
  tone?: "inverse" | "default" | "tint";
  /** Phone layout. `art-first` shows the art alone, then the copy on the page surface, then the media. `stack` keeps the art behind the copy and stacks the media under it. `overlay` is `stack` with an even scrim. Default `art-first` when a backdrop is set. */
  narrow?: "art-first" | "stack" | "overlay";
  /** Wide-layout height. Default `"540px"` (`"420px"` without media). */
  minHeight?: string;
}

/**
 * Headline, actions and a device on art. Synthetic: a static composition (the title, lede and actions are
 * slots you fill with `Button`s and the like; `media` is usually a `DeviceStage`), no state. The layout
 * reflows from the hero's own width (a container query), not the viewport, so it also works in a narrow
 * column and in the docs' width presets.
 */
export const HeroSplit = forwardRef<HTMLElement, HeroSplitProps>(function HeroSplit(
  { eyebrow, title, lede, actions, note, media, backdrop, tone, narrow, minHeight, className, style, ...props },
  ref,
) {
  const resolvedTone = tone ?? (backdrop ? "inverse" : "default");
  const showBackdrop = resolvedTone === "inverse" && backdrop != null;
  const resolvedNarrow = narrow ?? (showBackdrop ? "art-first" : "stack");
  const heroStyle = {
    ...(minHeight ? { "--rebar-hero-split-min-height": minHeight } : null),
    ...style,
  } as CSSProperties;
  return (
    <section
      ref={ref}
      className={clsx("rebar-hero-split", className)}
      data-rebar-component="hero-split"
      data-rebar-tone={resolvedTone}
      data-rebar-narrow={resolvedNarrow}
      data-rebar-media={media ? "true" : "false"}
      data-rebar-backdrop={showBackdrop ? "true" : "false"}
      style={heroStyle}
      {...props}
    >
      <div className="rebar-hero-split-surface" data-rebar-part="surface">
        {showBackdrop ? (
          <div className="rebar-hero-split-backdrop" data-rebar-part="backdrop" aria-hidden="true">
            {typeof backdrop === "string" ? <img src={backdrop} alt="" /> : backdrop}
          </div>
        ) : null}
        <div className="rebar-hero-split-copy" data-rebar-part="copy">
          {eyebrow ? (
            <span className="rebar-hero-split-eyebrow" data-rebar-part="eyebrow">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="rebar-hero-split-title" data-rebar-part="title">
            {title}
          </h1>
          {lede ? (
            <p className="rebar-hero-split-lede" data-rebar-part="lede">
              {lede}
            </p>
          ) : null}
          {actions ? (
            <div className="rebar-hero-split-actions" data-rebar-part="actions">
              {actions}
            </div>
          ) : null}
          {note ? (
            <p className="rebar-hero-split-note" data-rebar-part="note">
              {note}
            </p>
          ) : null}
        </div>
        {media ? (
          <div className="rebar-hero-split-media" data-rebar-part="media">
            {media}
          </div>
        ) : null}
      </div>
    </section>
  );
});
