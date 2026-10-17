import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import clsx from "clsx";
import { Heading } from "./Heading";

export interface AuthScreenProgress {
  /** Caption above the title, e.g. "Set up". */
  label?: ReactNode;
  /** Current step, 1-based. */
  value: number;
  total: number;
}

export interface AuthScreenProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  /** Centred mark above the title. Omit for gate screens that use a TopBar. */
  logo?: ReactNode;
  title?: ReactNode;
  /** One supporting line under the title (240px measure). */
  description?: ReactNode;
  /** The form column: inputs, buttons, error text. Full width, 10px rhythm. */
  children?: ReactNode;
  /** Ghost links pinned to the bottom (Sign up, Back, Sign out). Keep 44px targets. */
  footer?: ReactNode;
  /** `"navy"` is the navy gradient with cream controls; `"cream"` is the cream page. */
  tone?: "navy" | "cream";
  /** `"center"`: the form sits in the middle (sign-in, consent). `"start"`: left-aligned reading
   * layout (agreements, passphrase gate). */
  align?: "center" | "start";
  /** Optional TopBar for gates entered from inside the app (Reconciliation). */
  header?: ReactNode;
  /** Step bars and a "Step 2 of 3" caption above the title. */
  progress?: AuthScreenProgress;
  /** Locks the form (fields disabled, footer links inert) while a request runs. */
  busy?: boolean;
  /** Opt-in photo backdrop: `image` is painted `cover` and centred behind the screen, and `overlay` (any
   * CSS `background` value, usually a gradient) is laid over it. The same values are exposed as
   * `--rebar-auth-backdrop-image` / `--rebar-auth-backdrop-overlay` on the root. Default: none. */
  backdrop?: { image: string; overlay?: string };
  /** `"translucent"`: glass fields (a tinted fill and hairline in the inverse text colour, no focus ring,
   * sized by the `--rebar-auth-field-*` tokens) for use over a backdrop. Default `"solid"`: the themed pill field. */
  fieldStyle?: "solid" | "translucent";
  /** `"classic"`: compact buttons in the form column (7px 12px, 17px / 1.4, 1px border; the primary is the
   * inverse (cream) fill, the secondary an outline), with a pressed overlay and a dots-only loading state. Default `"default"`. */
  buttonStyle?: "default" | "classic";
  /** `"plain"`: ghost links (tertiary buttons in the form column and the footer) render as small plain
   * text, 13px at reduced opacity, no hit-area padding or hover fill. Default `"default"`. */
  linkStyle?: "default" | "plain";
  /** `"inline"`: the footer follows the form in the same centred column (with the column gap) instead of
   * sitting pinned to the bottom edge. Default `"pinned"`. */
  footerPlacement?: "pinned" | "inline";
}

/**
 * A full-screen gate: logo, title, form column, ghost footer links. The screen owns layout only,
 * never the logic; sign-in, consent, passphrase and delete-confirm are the same shell with
 * different children. Synthetic: a static composition (`Heading` plus slots) with no state machine
 * of its own. `busy` just disables the form column through a `<fieldset>` and blocks the footer.
 */
export const AuthScreen = forwardRef<HTMLElement, AuthScreenProps>(function AuthScreen(
  {
    logo,
    title,
    description,
    children,
    footer,
    tone = "cream",
    align = "center",
    header,
    progress,
    busy = false,
    backdrop,
    fieldStyle,
    buttonStyle,
    linkStyle,
    footerPlacement,
    className,
    style,
    ...props
  },
  ref,
) {
  const blockWhenBusy = (event: MouseEvent<HTMLElement>) => {
    if (!busy) return;
    event.preventDefault();
    event.stopPropagation();
  };
  const footerNode = footer ? (
    <div
      className="rebar-auth-screen-footer"
      data-rebar-part="footer"
      aria-disabled={busy || undefined}
      onClickCapture={blockWhenBusy}
    >
      {footer}
    </div>
  ) : null;
  const inlineFooter = footerPlacement === "inline";
  const backdropStyle = backdrop
    ? ({
        "--rebar-auth-backdrop-image": `url(${JSON.stringify(backdrop.image)})`,
        ...(backdrop.overlay ? { "--rebar-auth-backdrop-overlay": backdrop.overlay } : null),
      } as Record<string, string>)
    : undefined;
  return (
    <section
      ref={ref}
      className={clsx("rebar-auth-screen", className)}
      data-rebar-component="auth-screen"
      data-rebar-tone={tone}
      data-rebar-align={align}
      data-rebar-busy={busy || undefined}
      data-rebar-backdrop={backdrop ? "photo" : undefined}
      data-rebar-field-style={fieldStyle && fieldStyle !== "solid" ? fieldStyle : undefined}
      data-rebar-button-style={buttonStyle && buttonStyle !== "default" ? buttonStyle : undefined}
      data-rebar-link-style={linkStyle && linkStyle !== "default" ? linkStyle : undefined}
      data-rebar-footer={inlineFooter ? "inline" : undefined}
      aria-busy={busy || undefined}
      style={backdropStyle ? { ...backdropStyle, ...style } : style}
      {...props}
    >
      {backdrop ? <div className="rebar-auth-screen-backdrop" data-rebar-part="backdrop" aria-hidden="true" /> : null}
      {header ? (
        <div className="rebar-auth-screen-header" data-rebar-part="header">
          {header}
        </div>
      ) : null}
      <div className="rebar-auth-screen-main" data-rebar-part="main">
        {logo ? (
          <div className="rebar-auth-screen-logo" data-rebar-part="logo">
            {logo}
          </div>
        ) : null}
        {progress ? (
          <div className="rebar-auth-screen-progress" data-rebar-part="progress">
            <div className="rebar-auth-screen-progress-caption">
              <span>{progress.label}</span>
              <span>
                Step {progress.value} of {progress.total}
              </span>
            </div>
            <div
              className="rebar-auth-screen-progress-bars"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={progress.total}
              aria-valuenow={progress.value}
              aria-label={`Step ${progress.value} of ${progress.total}`}
              style={{ ["--rebar-auth-steps" as string]: progress.total }}
            >
              {Array.from({ length: progress.total }, (_, i) => (
                <i key={i} data-rebar-on={i < progress.value || undefined} />
              ))}
            </div>
          </div>
        ) : null}
        {title ? (
          <Heading level={1} className="rebar-auth-screen-title" data-rebar-part="title">
            {title}
          </Heading>
        ) : null}
        {description ? (
          <p className="rebar-auth-screen-description" data-rebar-part="description">
            {description}
          </p>
        ) : null}
        {children ? (
          <fieldset className="rebar-auth-screen-form" data-rebar-part="form" disabled={busy}>
            {children}
          </fieldset>
        ) : null}
        {inlineFooter ? footerNode : null}
      </div>
      {inlineFooter ? null : footerNode}
    </section>
  );
});
