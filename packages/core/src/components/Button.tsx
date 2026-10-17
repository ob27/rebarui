import { Children, cloneElement, forwardRef, isValidElement } from "react";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode, Ref } from "react";
import clsx from "clsx";
import { Spin } from "./Spin";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";
import { defaultRenderLink, useRenderLink } from "./linkAdapter";
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
  /** `"classic"`: the plain mobile-UI button (7px 12px, 17px / 1.4, 1px border, a 4px radius from `--rebar-classic-button-radius`, a pressed
   * overlay, dots-only loading, 40% opacity when disabled). `primary` is solid, `secondary` an outline, `tertiary` text only. Default `"default"`. */
  appearance?: "default" | "classic";
  /** How `loading` looks. `"spinner"` (default): a spinner before the label. `"dots"`: the label is replaced by three
   * bouncing dots (the classic mobile-UI loading button), centred in a 1.4em line. */
  loadingStyle?: "spinner" | "dots";
  /** Applies the button look to the single child element (a router `Link`, an `<a>`) instead of rendering a `<button>`. */
  asChild?: boolean;
}

/** Three small squares that hop in turn (SMIL, so it needs no CSS animation and runs on any background). */
function DotsIndicator() {
  return (
    <span className="rebar-button-dots">
    <svg height="1em" viewBox="0 0 100 40" aria-hidden="true" focusable="false">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-100.000000, -71.000000)">
          <g transform="translate(95.000000, 71.000000)">
            <g transform="translate(5.000000, 0.000000)">
              {[0, 1, 2].map((i) => (
                <rect key={i} fill="currentColor" x={20 + i * 26} y="16" width="8" height="8" rx="2">
                  <animate attributeName="y" from="16" to="16" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" values="16; 6; 26; 16; 16" keyTimes="0; 0.1; 0.3; 0.4; 1" />
                </rect>
              ))}
            </g>
          </g>
        </g>
      </g>
    </svg>
    </span>
  );
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
    renderLink: renderLinkProp,
    asChild,
    loadingStyle: loadingStyleProp,
    appearance,
    ...props
  },
  ref,
) {
  const loadingStyle = loadingStyleProp ?? (appearance === "classic" ? "dots" : undefined);
  const renderLink = useRenderLink(renderLinkProp, defaultRenderLink);
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
    "data-rebar-appearance": appearance === "classic" ? "classic" : undefined,
    "data-rebar-loading-style": loading && loadingStyle === "dots" ? "dots" : undefined,
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

  const inner =
    loading && loadingStyle === "dots" ? (
      <span className="rebar-button-loading-wrapper" data-rebar-part="loading-dots">
        <DotsIndicator />
      </span>
    ) : (
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
