import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from "react";
import clsx from "clsx";
import { renderMarkdown } from "../markdown";
import type { MarkdownComponents } from "../markdown";

export interface ProseProps extends ComponentPropsWithoutRef<"div"> {
  /** Already-rendered content. Styles p, h2 to h4, ul, ol, blockquote (with `cite`), a, code, pre, hr and table. */
  children?: ReactNode;
  /** Reading measure. Default `"68ch"`. */
  maxWidth?: string;
  /** Body size: 0.94, 1.06 or 1.2rem. Legal copy uses `sm`. Default `"md"`. */
  size?: "sm" | "md" | "lg";
  /** `inverse` for dark panels; links turn bright coral. Default `"default"`. */
  tone?: "default" | "inverse";
  /** Root element. Default `"div"`. */
  as?: ElementType;
}

/**
 * Long-form text in the theme's reading type: measure, steady vertical rhythm, styled headings, lists,
 * quotes, links, code and tables. Imitation: one wrapper element with descendant styles, no state.
 */
export const Prose = forwardRef<HTMLElement, ProseProps>(function Prose(
  { children, maxWidth, size = "md", tone = "default", as: Component = "div", className, style, ...props },
  ref,
) {
  const Root = Component as ElementType;
  return (
    <Root
      ref={ref}
      className={clsx("rebar-prose", className)}
      data-rebar-component="prose"
      data-rebar-size={size}
      data-rebar-tone={tone}
      style={maxWidth ? ({ "--rebar-prose-max-width": maxWidth, ...style } as CSSProperties) : style}
      {...props}
    >
      {children}
    </Root>
  );
});

export interface MarkdownProps extends Omit<ProseProps, "children"> {
  /** Markdown text. Raw HTML is not allowed: it renders as text. `javascript:` links render as plain text. */
  source: string;
  /** Render a node with your own component, e.g. `{ a: RouterLink }`. */
  components?: MarkdownComponents;
}

/**
 * Parses a Markdown string with the library's own `renderMarkdown` and renders it inside `Prose`.
 * Synthetic: composes `Prose`; stateless.
 */
export const Markdown = forwardRef<HTMLElement, MarkdownProps>(function Markdown({ source, components, ...props }, ref) {
  return (
    <Prose ref={ref} data-rebar-markdown="true" {...props}>
      {renderMarkdown(source, { components })}
    </Prose>
  );
});
