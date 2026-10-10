import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface BackdropSectionProps extends ComponentPropsWithoutRef<"section"> {
  /** The backdrop art. Decorative unless `alt` is given. Use art at least as wide as the section. */
  image: { src: string; alt?: string };
  /** A darkening layer so the text keeps contrast. `"start"` is darker on the text side and fades
   * across. Default `"soft"`. */
  scrim?: "none" | "soft" | "strong" | "start";
  /** An inset rounded panel instead of a full-bleed band. Default `false`. */
  rounded?: boolean;
  children: ReactNode;
}

export function BackdropSection({
  image,
  scrim = "soft",
  rounded = false,
  children,
  className,
  ...props
}: BackdropSectionProps) {
  const alt = image.alt ?? "";
  return (
    <section
      className={clsx("rebar-backdrop-section", className)}
      data-rebar-component="backdrop-section"
      data-rebar-scrim={scrim}
      data-rebar-rounded={rounded ? "true" : "false"}
      {...props}
    >
      <img
        className="rebar-backdrop-section-image"
        data-rebar-part="image"
        src={image.src}
        alt={alt}
        aria-hidden={alt === "" ? "true" : undefined}
      />
      {scrim !== "none" ? (
        <div className="rebar-backdrop-section-scrim" data-rebar-part="scrim" aria-hidden="true" />
      ) : null}
      <div className="rebar-backdrop-section-content" data-rebar-part="content">
        {children}
      </div>
    </section>
  );
}
