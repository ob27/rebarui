import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface BackdropSectionProps extends ComponentPropsWithoutRef<"section"> {
  /** The backdrop art. Decorative unless `alt` is given. Use art at least as wide as the section. */
  image: { src: string; alt?: string };
  /** A darkening layer so the text keeps contrast. `"start"` is darker on the text side and fades
   * across. `"custom"` draws the layer but leaves its background to `--rebar-backdrop-scrim-background`
   * (any CSS background, e.g. a three-stop gradient). Default `"soft"`. */
  scrim?: "none" | "soft" | "strong" | "start" | "custom";
  /** An inset rounded panel instead of a full-bleed band. Default `false`. */
  rounded?: boolean;
  /** Keep the section's own side margin (when `rounded`) and padding. Pass `false` to drop both when the app lays the section out itself, e.g. full-bleed. Default `true`. */
  inset?: boolean;
  children: ReactNode;
}

export function BackdropSection({
  image,
  scrim = "soft",
  rounded = false,
  inset = true,
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
      data-rebar-inset={inset ? undefined : "false"}
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
