import { Children, cloneElement, forwardRef, isValidElement } from "react";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode, Ref } from "react";
import clsx from "clsx";
import { Spin } from "./Spin";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";
import { defaultRenderLink } from "./linkAdapter";
import type { RenderLink } from "./linkAdapter";

export interface ButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  variant?: "primary" | "secondary" | "tertiary" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children?: ReactNode;
  /** Force bionic reading on/off for this instance, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
  /** Full width (`display: flex; width: 100%`). Stacks with a 12px gap in a column. */
  block?: boolean;
  /** `"pill"` (the default look) or `"rounded"`, a smaller radius for dense forms. */
  shape?: "pill" | "rounded";
  /** Icon before the label. While `loading`, the spinner replaces it. */
  startIcon?: ReactNode;
  /** Icon after the label (an external-link glyph on a `href` button, say). */
  endIcon?: ReactNode;
  /** A round, square-footprint button (44px; 34 sm, 52 lg) holding only an icon. Give it an `aria-label`. */
  iconOnly?: boolean;
  /** Renders an anchor (or your router's `Link`, through `renderLink`) with button styling. */
  href?: string;
  /** Anchor `target`, with `href`. */
  target?: string;
  /** Anchor `rel`, with `href`. `target="_blank"` defaults it to `noopener noreferrer`. */
  rel?: string;
  /** Link adapter for `href` (a framework `Link`). Same shape as `NavBar`'s `renderLink`. */
  renderLink?: RenderLink;
  /** Applies the button look to the single child element (a router `Link`, an `<a>`) instead of rendering a `<button>`. */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    className,
    children,
    bionic,
    bionicOptions,
    type = "button",
    block,
    shape = "pill",
    startIcon,
    endIcon,
    iconOnly,
    href,
    target,
    rel,
    renderLink = defaultRenderLink,
    asChild,
    ...props
  },
  ref,
) {
  const content = useBionicChildren(children, bionic, bionicOptions);
  const marks = {
    className: clsx("rebar-button", className),
    "data-rebar-component": "button",
    "data-rebar-variant": variant,
    "data-rebar-size": size,
    "data-rebar-shape": shape === "rounded" ? "rounded" : undefined,
    "data-rebar-block": block ? "true" : undefined,
    "data-rebar-icon-only": iconOnly ? "true" : undefined,
    "data-rebar-state": loading ? "loading" : "idle",
    "aria-busy": loading || undefined,
  };
  const lead = loading ? (
    <Spin spinning size={size} variant="classic" className="rebar-button-spinner" />
  ) : startIcon ? (
    <span className="rebar-button-icon" data-rebar-part="start-icon" aria-hidden="true">
      {startIcon}
    </span>
  ) : null;
  const tail = endIcon ? (
    <span className="rebar-button-icon" data-rebar-part="end-icon" aria-hidden="true">
      {endIcon}
    </span>
  ) : null;

  if (asChild) {
    const child = Children.only(children) as ReactElement<{ className?: string; children?: ReactNode }>;
    if (isValidElement(child)) {
      return cloneElement(
        child,
        {
          ...(props as object),
          ...marks,
          className: clsx(marks.className, child.props.className),
          ref,
        } as never,
        <>
          {lead}
          {child.props.children}
          {tail}
        </>,
      );
    }
  }

  const inner = (
    <>
      {lead}
      {content}
      {tail}
    </>
  );

  if (href !== undefined) {
    const inactive = disabled || loading;
    const { onClick, ...rest } = props;
    if (inactive) {
      // A link has no `disabled`: drop the href so it cannot navigate, and say so to assistive tech.
      return (
        <a ref={ref as Ref<HTMLAnchorElement>} role="link" aria-disabled="true" tabIndex={-1} {...(rest as object)} {...marks}>
          {inner}
        </a>
      );
    }
    return (
      <>
        {renderLink({ ...(rest as object), ...marks, href, target, rel, children: inner, onClick } as never)}
      </>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled || loading}
      {...marks}
      {...props}
    >
      {/* "classic" (a plain vector spinner using stroke="currentColor") inherits this button's
         own already-variant-aware text color — the real fix for every variant/theme combination
         at once, rather than a light/dark illustrated asset pre-selected against the *page's*
         theme. Spin's own `role="status"` announces the loading state, same as `aria-busy`. */}
      {inner}
    </button>
  );
});
