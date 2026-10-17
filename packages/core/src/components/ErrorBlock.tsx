import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";
import { Empty } from "./Empty";
import { ErrorWarningIcon, InboxOutlined, TimeIcon, WifiOffIcon } from "./icons";

/** `"empty"` and `"info"` are neutral states (no error icon, no red tint); the others are failures. */
export type ErrorBlockStatus = "default" | "disconnected" | "empty" | "busy" | "info";

export interface ErrorBlockProps extends Omit<ComponentPropsWithoutRef<"div">, "title" | "children"> {
  /** Which failure state this is — each has its own default icon/title/description, all
   * overridable. Default `"default"`. */
  status?: ErrorBlockStatus;
  /** Overrides the status's default title. */
  title?: ReactNode;
  /** Overrides the status's default description. */
  description?: ReactNode;
  /** Overrides the status's default icon entirely. */
  icon?: ReactNode;
  /** Widens the icon and spacing for a whole-page failure state vs. an inline one (e.g. one
   * failed card in an otherwise-fine list). Default `false`. */
  fullPage?: boolean;
  /** A retry button or other recovery action, rendered below the description. */
  children?: ReactNode;
  className?: string;
  /** Force bionic reading on/off for the title/description, overriding the ambient
   * data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
}

function InfoMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.1" />
    </svg>
  );
}

const DEFAULT_CONTENT: Record<ErrorBlockStatus, { title?: string; description?: string }> = {
  default: { title: "Something went wrong", description: "An error occurred. Please try again." },
  disconnected: { title: "No connection", description: "Check your network connection and try again." },
  busy: { title: "Servers are busy", description: "Please try again in a moment." },
  empty: { title: "Nothing here yet" },
  info: { title: "For your information" },
};

const DEFAULT_ICON: Record<ErrorBlockStatus, ReactNode> = {
  default: <ErrorWarningIcon />,
  disconnected: <WifiOffIcon />,
  busy: <TimeIcon />,
  empty: <InboxOutlined />,
  info: <InfoMark />,
};

/**
 * A full failure/empty-state display — the antd-mobile `ErrorBlock` pattern: one component
 * covering the handful of states a page commonly needs to explain itself in (a generic error, no
 * network, no data, the server's overloaded), each with a sensible default icon/copy so a caller
 * only needs to pass `status` for the common case, not author copy for every failure mode by hand.
 * A bare `status="empty"` (no `title`, no `icon`) composes the real `Empty` component directly (same "no data" meaning, already
 * has its own hand-drawn illustration) rather than duplicating it. `empty` and `info` are neutral: no error icon, no red
 * tint (`data-rebar-tone="neutral"`), and `empty` given a title or icon renders the neutral icon/title layout. The failure statuses use a
 * plain icon glyph instead, since a distinct hand-drawn illustration per failure mode isn't
 * something this project has art for, and a plain icon is consistent with how every other
 * non-illustrated state (`Alert`, `Result`) already looks here.
 */
export const ErrorBlock = forwardRef<HTMLDivElement, ErrorBlockProps>(function ErrorBlock(
  { status = "default", title, description, icon, fullPage = false, children, className, bionic, bionicOptions, ...rest },
  ref,
) {
  const neutral = status === "empty" || status === "info";
  const bareEmpty = status === "empty" && title === undefined && icon === undefined;
  const titleContent = useBionicChildren(title ?? (bareEmpty ? undefined : DEFAULT_CONTENT[status].title), bionic, bionicOptions);
  const descriptionContent = useBionicChildren(
    description ?? (bareEmpty ? undefined : DEFAULT_CONTENT[status].description),
    bionic,
    bionicOptions,
  );

  if (bareEmpty) {
    return (
      <div
        ref={ref}
        className={clsx("rebar-error-block", fullPage && "rebar-error-block-full-page", className)}
        data-rebar-component="error-block"
        data-rebar-status={status}
        data-rebar-tone="neutral"
        {...rest}
      >
        <Empty description={description ?? "No data"} bionic={bionic} bionicOptions={bionicOptions}>
          {children}
        </Empty>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={clsx("rebar-error-block", fullPage && "rebar-error-block-full-page", className)}
      data-rebar-component="error-block"
      data-rebar-status={status}
      data-rebar-tone={neutral ? "neutral" : undefined}
      {...rest}
    >
      <div className="rebar-error-block-icon" data-rebar-part="icon" aria-hidden="true">
        {icon ?? DEFAULT_ICON[status]}
      </div>
      {titleContent ? (
        <div className="rebar-error-block-title" data-rebar-part="title">
          {titleContent}
        </div>
      ) : null}
      {descriptionContent ? (
        <div className="rebar-error-block-description" data-rebar-part="description">
          {descriptionContent}
        </div>
      ) : null}
      {children ? (
        <div className="rebar-error-block-action" data-rebar-part="action">
          {children}
        </div>
      ) : null}
    </div>
  );
});
