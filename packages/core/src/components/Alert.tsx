import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface AlertProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  type?: "info" | "success" | "warning" | "error";
  title?: ReactNode;
  children?: ReactNode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { type = "info", title, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx("rebar-alert", className)}
      data-rebar-component="alert"
      data-rebar-type={type}
      role={type === "error" || type === "warning" ? "alert" : "status"}
      {...props}
    >
      {title ? (
        <span className="rebar-alert-title" data-rebar-part="title">
          {title}
        </span>
      ) : null}
      {children ? (
        <div data-rebar-part="description">{children}</div>
      ) : null}
    </div>
  );
});
