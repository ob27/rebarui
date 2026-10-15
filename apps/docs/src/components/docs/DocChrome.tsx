"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONSTRUCT_TIER } from "@/data/constructTier";
import { HAS_FULL_PAGE } from "@/data/hasFullPage";
import { NEW_CONSTRUCTS } from "@/data/newConstructs";
import type { Tier } from "@/data/tier.types";

const ROUTE_TIER: Record<string, Tier> = { imitations: "imitation", synthetics: "synthetic", opinions: "opinion", orders: "order", geneses: "genesis" };
const ROUTE_LABEL: Record<string, string> = { imitations: "Imitations", synthetics: "Synthetics", opinions: "Opinions", orders: "Orders", geneses: "Geneses" };

// route -> component name, from the same table the sidebar uses (a "#section" suffix is dropped; the first name for a route wins)
const NAME_BY_ROUTE: Map<string, string> = (() => {
  const m = new Map<string, string>();
  for (const [name, href] of Object.entries(HAS_FULL_PAGE)) {
    const path = href.split("#")[0] ?? href;
    if (!m.has(path)) m.set(path, name);
  }
  return m;
})();

const prettify = (slug: string) => slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

/**
 * What every reference page shares above its own content: a breadcrumb, the construct's tier tag and, for this release line's
 * additions, a "new" tag. It reads the route, so the 200-odd pages need no edits of their own.
 */
export function DocChrome() {
  const pathname = usePathname() ?? "";
  const [route, slug] = pathname.split("/").filter(Boolean);
  const tierLabel = route ? ROUTE_LABEL[route] : undefined;
  if (!route || !tierLabel) return null;
  const name = slug ? NAME_BY_ROUTE.get(`/${route}/${slug}`) : undefined;
  const registered = name ? (CONSTRUCT_TIER.component as Record<string, string>)[name] : undefined;
  const tier = (registered as Tier | undefined) ?? ROUTE_TIER[route];
  const title = slug ? (name ?? prettify(slug)) : undefined;
  const isNew = name ? NEW_CONSTRUCTS.has(name) : false;
  return (
    <div className="cs-chrome">
      <nav className="cs-crumbs" aria-label="Breadcrumb">
        <span>Construct Library</span>
        <span aria-hidden="true"> / </span>
        {title ? <Link href={`/${route}`}>{tierLabel}</Link> : <span aria-current="page">{tierLabel}</span>}
        {title ? (
          <>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{title}</span>
          </>
        ) : null}
      </nav>
      {title && tier ? (
        <span className="cs-chrome-tags">
          <span className={`cs-tag cs-tag--${tier}`}>{tier}</span>
          {isNew ? <span className="cs-tag cs-tag--new">new</span> : null}
        </span>
      ) : null}
    </div>
  );
}
