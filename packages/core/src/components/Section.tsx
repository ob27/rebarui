import { forwardRef, useId } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import clsx from "clsx";

export interface SectionProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  /** Band background. `tint` is full-bleed; `panel` and `dark` are rounded surfaces inset from the edge. Default `"default"`. */
  tone?: "default" | "tint" | "panel" | "dark";
  /** Content max width: 640, 880, 1160px or unbounded. Default `"lg"`. */
  width?: "sm" | "md" | "lg" | "full";
  /** Vertical padding: 32, 56 or 88px. Default `"default"`. */
  spacing?: "tight" | "default" | "loose";
  /** Large radius and an inset margin. Default `true` for `panel` and `dark`, `false` otherwise. */
  rounded?: boolean;
  /** Small-caps kicker above the title. */
  eyebrow?: ReactNode;
  /** Section heading, rendered as an `<h2>`. */
  title?: ReactNode;
  /** One supporting line under the title. */
  lede?: ReactNode;
  /** Alignment of the heading group. `dark` and `panel` default to `"center"`. */
  align?: "start" | "center";
  /** The root element. Default `"section"`. */
  as?: ElementType;
  children?: ReactNode;
}

/**
 * A page band: background tone, vertical rhythm, a max-width column and an optional eyebrow, h2 and lede.
 * Imitation: plain elements only, no state, composes no other named construct (same reasoning as
 * `BackdropSection`). With a `title` the section is labelled by it (`aria-labelledby`) unless an
 * `aria-label` or `aria-labelledby` is passed.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    tone = "default",
    width = "lg",
    spacing = "default",
    rounded,
    eyebrow,
    title,
    lede,
    align,
    as: Component = "section",
    className,
    children,
    ...props
  },
  ref,
) {
  const titleId = useId();
  const isRounded = rounded ?? (tone === "panel" || tone === "dark");
  const alignment = align ?? (tone === "panel" || tone === "dark" ? "center" : "start");
  const hasHeader = Boolean(eyebrow || title || lede);
  const labelled = title && !props["aria-label"] && !props["aria-labelledby"];
  const Root = Component as ElementType;
  return (
    <Root
      ref={ref}
      className={clsx("rebar-section", className)}
      data-rebar-component="section"
      data-rebar-tone={tone}
      data-rebar-width={width}
      data-rebar-spacing={spacing}
      data-rebar-rounded={isRounded ? "true" : "false"}
      aria-labelledby={labelled ? titleId : undefined}
      {...props}
    >
      <div className="rebar-section-inner" data-rebar-part="inner">
        {hasHeader ? (
          <header className="rebar-section-header" data-rebar-part="header" data-rebar-align={alignment}>
            {eyebrow ? (
              <span className="rebar-section-eyebrow" data-rebar-part="eyebrow">
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h2 id={titleId} className="rebar-section-title" data-rebar-part="title">
                {title}
              </h2>
            ) : null}
            {lede ? (
              <p className="rebar-section-lede" data-rebar-part="lede">
                {lede}
              </p>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </Root>
  );
});
