import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface DeviceFrameProps extends ComponentPropsWithoutRef<"figure"> {
  /** Which bezel to draw. Default `"phone"`. */
  variant?: "phone" | "tablet" | "browser";
  /** The screen content, usually an `<img>`. */
  children: ReactNode;
  /** Browser variant only: text shown in the address bar. Ignored otherwise. */
  title?: string;
  /** Optional `<figcaption>`. */
  caption?: ReactNode;
}

export function DeviceFrame({
  variant = "phone",
  children,
  title,
  caption,
  className,
  ...props
}: DeviceFrameProps) {
  return (
    <figure
      className={clsx("rebar-device-frame", className)}
      data-rebar-component="device-frame"
      data-rebar-variant={variant}
      {...props}
    >
      <div className="rebar-device-frame-device">
        {/* The bezel, notch and toolbar are decoration only; the screen is a sibling so it stays accessible. */}
        <div className="rebar-device-frame-bezel" data-rebar-part="bezel" aria-hidden="true" />
        {variant === "phone" ? (
          <div className="rebar-device-frame-notch" data-rebar-part="notch" aria-hidden="true" />
        ) : null}
        {variant === "browser" ? (
          <div className="rebar-device-frame-toolbar" data-rebar-part="toolbar" aria-hidden="true">
            <span className="rebar-device-frame-dots" />
            <span className="rebar-device-frame-address">{title}</span>
          </div>
        ) : null}
        <div className="rebar-device-frame-screen" data-rebar-part="screen">
          {children}
        </div>
      </div>
      {caption ? <figcaption className="rebar-device-frame-caption">{caption}</figcaption> : null}
    </figure>
  );
}
