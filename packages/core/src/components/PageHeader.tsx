import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { Breadcrumb } from "./Breadcrumb";
import type { BreadcrumbItem } from "./Breadcrumb";

export interface PageHeaderProps extends Omit<ComponentPropsWithoutRef<"header">, "title"> {
  /** Eyebrow above the title. */
  kicker?: ReactNode;
  /** Rendered as the page `<h1>`. */
  title: ReactNode;
  /** One line under the title. */
  lede?: ReactNode;
  /** Default `"center"`. Articles use `"start"`. */
  align?: "center" | "start";
  /** Rendered above the title as a `Breadcrumb` nav landmark with 44px targets. */
  breadcrumbs?: BreadcrumbItem[];
  /** Art or an image URL. With a cover the title sits on a bottom scrim in inverse tone. */
  cover?: string | ReactNode;
  /** Byline row under the lede. */
  meta?: ReactNode;
  /** Reading column width: 680px (`md`) or 880px (`lg`). Default `"md"`. */
  maxWidth?: "md" | "lg";
}

/**
 * The one `<h1>` on a page: kicker, title, lede, with optional breadcrumbs, byline and cover. Synthetic:
 * composes `Breadcrumb`, no state.
 */
export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  { kicker, title, lede, align = "center", breadcrumbs, cover, meta, maxWidth = "md", className, ...props },
  ref,
) {
  const hasCover = cover != null && cover !== false;
  return (
    <header
      ref={ref}
      className={clsx("rebar-page-header", className)}
      data-rebar-component="page-header"
      data-rebar-align={align}
      data-rebar-max-width={maxWidth}
      data-rebar-cover={hasCover ? "true" : "false"}
      {...props}
    >
      {hasCover ? (
        <div className="rebar-page-header-cover" data-rebar-part="cover" aria-hidden="true">
          {typeof cover === "string" ? <img src={cover} alt="" /> : cover}
        </div>
      ) : null}
      <div className="rebar-page-header-body" data-rebar-part="body">
        {breadcrumbs && breadcrumbs.length > 0 ? <Breadcrumb items={breadcrumbs} className="rebar-page-header-breadcrumbs" /> : null}
        {kicker ? (
          <span className="rebar-page-header-kicker" data-rebar-part="kicker">
            {kicker}
          </span>
        ) : null}
        <h1 className="rebar-page-header-title" data-rebar-part="title">
          {title}
        </h1>
        {lede ? (
          <p className="rebar-page-header-lede" data-rebar-part="lede">
            {lede}
          </p>
        ) : null}
        {meta ? (
          <div className="rebar-page-header-meta" data-rebar-part="meta">
            {meta}
          </div>
        ) : null}
      </div>
    </header>
  );
});
