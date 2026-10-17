import type { ReactNode } from "react";

/**
 * The link adapter shared by `Button`, `Card`, `ListItem` and `ActionSheet` items: the same shape as
 * `NavBar`'s and `MobileTabBar`'s `renderLink`, so one router adapter serves every construct. The
 * props carry the `href`, the construct's class name and `data-rebar-*` attributes, and the content;
 * a framework `Link` receives them and must render an element that forwards them.
 */
export interface RenderLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: (event: never) => void;
  [attribute: string]: unknown;
}

export type RenderLink = (props: RenderLinkProps) => ReactNode;

/** A plain anchor. `target="_blank"` gets `rel="noopener noreferrer"` unless you pass your own `rel`. */
export const defaultRenderLink: RenderLink = ({ href, children, rel, target, ...rest }) => (
  <a href={href} target={target} rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)} {...(rest as object)}>
    {children}
  </a>
);
