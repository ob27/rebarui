import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";

export interface AlertProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  type?: "info" | "success" | "warning" | "error";
  title?: ReactNode;
  children?: ReactNode;
  /** A leading icon: pass any node, or `true` for the default glyph for `type`. Default off. */
  icon?: ReactNode | boolean;
  /** Renders a close button (top-right) that calls this. The Alert doesn't hide itself: the caller owns visibility. */
  onClose?: () => void;
  /** Force bionic reading on/off for this instance, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
}

const DEFAULT_ICONS: Record<NonNullable<AlertProps["type"]>, string> = {
  info: "i",
  success: "✓",
  warning: "!",
  error: "✕",
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { type = "info", title, className, children, icon, onClose, bionic, bionicOptions, ...props },
  ref,
) {
  const titleContent = useBionicChildren(title, bionic, bionicOptions);
  const bodyContent = useBionicChildren(children, bionic, bionicOptions);
  const iconNode = icon === true ? DEFAULT_ICONS[type] : icon === false || icon === null || icon === undefined ? null : icon;
  return (
    <div
      ref={ref}
      className={clsx("rebar-alert", className)}
      data-rebar-component="alert"
      data-rebar-type={type}
      data-rebar-has-icon={iconNode !== null ? "true" : undefined}
      data-rebar-closable={onClose ? "true" : undefined}
      role={type === "error" || type === "warning" ? "alert" : "status"}
      {...props}
    >
      {iconNode !== null ? (
        <span className="rebar-alert-icon" data-rebar-part="icon" aria-hidden="true">
          {iconNode}
        </span>
      ) : null}
      {title ? (
        <span className="rebar-alert-title" data-rebar-part="title">
          {titleContent}
        </span>
      ) : null}
      {children ? (
        <div data-rebar-part="description">{bodyContent}</div>
      ) : null}
      {onClose ? (
        <button type="button" className="rebar-alert-close" data-rebar-part="close" aria-label="Close" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </div>
  );
});
