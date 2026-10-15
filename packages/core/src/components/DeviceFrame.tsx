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
  /** Phone and tablet: a thin status strip above the content, so the app's own header clears the
   * rounded corners. Holds the camera hole-punch on a phone. Default `true`. */
  statusBar?: boolean;
  /** Phone and tablet: a home-indicator strip below the content, so the app's own tab bar clears
   * the rounded corners. Default `true`. */
  homeIndicator?: boolean;
}

export function DeviceFrame({
  variant = "phone",
  children,
  title,
  caption,
  statusBar = true,
  homeIndicator = true,
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
        {/* The bezel, camera, status strip, home-indicator strip and toolbar are decoration only; the content is never inside an aria-hidden element. */}
        <div className="rebar-device-frame-bezel" data-rebar-part="bezel" aria-hidden="true" />
        {variant === "phone" && statusBar ? (
          <div className="rebar-device-frame-notch" data-rebar-part="notch" aria-hidden="true" />
        ) : null}
        {variant === "browser" ? (
          <div className="rebar-device-frame-toolbar" data-rebar-part="toolbar" aria-hidden="true">
            <span className="rebar-device-frame-dots" />
            <span className="rebar-device-frame-address">{title}</span>
          </div>
        ) : null}
        <div className="rebar-device-frame-screen" data-rebar-part="screen">
          {variant !== "browser" && statusBar ? (
            <div className="rebar-device-frame-status" data-rebar-part="status-bar" aria-hidden="true" />
          ) : null}
          {children}
          {variant !== "browser" && homeIndicator ? (
            <div className="rebar-device-frame-home" data-rebar-part="home-indicator" aria-hidden="true" />
          ) : null}
        </div>
      </div>
      {caption ? <figcaption className="rebar-device-frame-caption">{caption}</figcaption> : null}
    </figure>
  );
}
