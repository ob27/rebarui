import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactElement, ReactNode, Ref } from "react";
import clsx from "clsx";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";

interface TextOwnProps {
  size?: "xs" | "sm" | "md";
  color?: "primary" | "secondary";
  children?: ReactNode;
  /** Force bionic reading on/off for this instance, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
  /**
   * `"eyebrow"`: a small uppercase, tracked, one-line kicker (12px, 700, 0.16em) above a heading or a
   * group. `"section-label"`: the same type with a hairline rule filling the rest of the row. Both set
   * their own size and colour; `size` and `color` are ignored. Default `"body"` (plain text).
   */
  variant?: "body" | "eyebrow" | "section-label";
  /**
   * Colour of an `eyebrow` or `section-label`. `"primary"` is the coral ink (`--rebar-color-primary-text-ink`,
   * 4.5:1 on the page and the tints), `"muted"` the secondary text colour, `"inverse"` for images and navy.
   * Default `"primary"` for an eyebrow and `"muted"` for a section label.
   */
  tone?: "primary" | "muted" | "inverse";
  /** Where a `section-label` draws its hairline: after the text (`"end"`, default) or on both sides. `false` draws none. */
  rule?: "end" | "both" | false;
}

/**
 * Polymorphic props: `as="label"` types `htmlFor` (and the rest of a `<label>`'s attributes);
 * `as="span"`/`"div"`/... take that element's own props; no `as` is a `<p>`.
 */
export type TextProps<E extends ElementType = "p"> = TextOwnProps & { as?: E } & Omit<ComponentPropsWithoutRef<E>, keyof TextOwnProps | "as">;

type TextComponent = (<E extends ElementType = "p">(props: TextProps<E> & { ref?: Ref<Element> }) => ReactElement | null) & { displayName?: string };

export const Text = forwardRef(function Text(
  {
    as: Component = "p",
    size = "md",
    color = "primary",
    className,
    children,
    bionic,
    bionicOptions,
    variant = "body",
    tone,
    rule = "end",
    ...props
  }: TextProps<ElementType>,
  ref: Ref<Element>,
) {
  const content = useBionicChildren(children, bionic, bionicOptions);
  const styled = variant !== "body";
  const effectiveTone = styled ? (tone ?? (variant === "eyebrow" ? "primary" : "muted")) : undefined;
  return (
    <Component
      ref={ref}
      className={clsx("rebar-text", className)}
      data-rebar-component="text"
      data-rebar-size={size}
      data-rebar-color={color}
      data-rebar-variant={styled ? variant : undefined}
      data-rebar-tone={effectiveTone}
      data-rebar-rule={variant === "section-label" && rule ? rule : undefined}
      {...props}
    >
      {content}
    </Component>
  );
}) as unknown as TextComponent;
