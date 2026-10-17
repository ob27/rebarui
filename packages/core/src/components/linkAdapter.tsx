import { createContext, useContext } from "react";
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

const RenderLinkContext = createContext<RenderLink | undefined>(undefined);

export interface RebarLinkProviderProps {
  /** The router adapter every Rebar link-capable component uses unless it gets its own `renderLink` prop. */
  renderLink: RenderLink;
  children?: ReactNode;
}

/**
 * Sets the link adapter for a whole subtree: `Button`, `Card`, `ListItem`, `ActionSheet` items,
 * `Breadcrumb`, `NavBar`, `MobileTabBar`, `SidebarNav`, `NavIndex`, `Footer` and `ConstructSearch`
 * all render their `href` through it, so one react-router/Next adapter gives client-side
 * navigation everywhere. An explicit `renderLink` prop on a component still wins.
 */
export function RebarLinkProvider({ renderLink, children }: RebarLinkProviderProps) {
  return <RenderLinkContext.Provider value={renderLink}>{children}</RenderLinkContext.Provider>;
}

/** Resolves the link adapter: the explicit prop, else the `RebarLinkProvider` one, else `fallback`. */
export function useRenderLink<T = RenderLink>(explicit: T | undefined, fallback: T): T {
  const fromContext = useContext(RenderLinkContext) as unknown as T | undefined;
  return explicit ?? fromContext ?? fallback;
}
