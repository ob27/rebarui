import { createContext, useContext } from "react";
import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

export type RebarScheme = "light" | "dark";

const SchemeContext = createContext<RebarScheme | undefined>(undefined);

/**
 * The scheme a surrounding `ThemeScope` has locked, as props to spread onto the content of a
 * portaled overlay (Dialog, Drawer, Popover, Select, Tooltip ...). Overlays render into
 * `document.body`, outside the locked wrapper, so without this they would fall back to the page's
 * scheme. Returns `{}` when no scope is active, so existing overlays are unchanged.
 */
export function useSchemeAttr(): { "data-rebar-scheme"?: RebarScheme } {
  const scheme = useContext(SchemeContext);
  return scheme ? { "data-rebar-scheme": scheme } : {};
}

export interface ThemeScopeProps extends ComponentPropsWithoutRef<"div"> {
  /** `"light"` or `"dark"` re-declares the whole token set for this subtree (via
   * `data-rebar-scheme`), whatever the page scheme is. `"system"` adds nothing and passes any outer
   * scope through. */
  scheme: RebarScheme | "system";
}

/**
 * A wrapper that forces one colour scheme for its subtree. The theme layer re-declares every token
 * under `[data-rebar-scheme="light" | "dark"]`; overlays opened from inside it follow the wrapper
 * through a context (see `useSchemeAttr`). Imitation: a single element plus a context value. The
 * attribute works on any element, so an app can also set `data-rebar-scheme` by hand, but then its
 * portaled overlays will not follow.
 */
export function ThemeScope({ scheme, className, children, ...props }: ThemeScopeProps) {
  const outer = useContext(SchemeContext);
  const effective = scheme === "system" ? outer : scheme;
  return (
    <SchemeContext.Provider value={effective}>
      <div
        className={clsx("rebar-theme-scope", className)}
        data-rebar-component="theme-scope"
        data-rebar-scheme={scheme === "system" ? undefined : scheme}
        {...props}
      >
        {children}
      </div>
    </SchemeContext.Provider>
  );
}
