"use client";

import Link from "next/link";
import { NavBar } from "rebar-ui";

const TIER_PAGES = [
  { href: "/tiers", label: "Overview" },
  { href: "/imitations", label: "Imitations" },
  { href: "/synthetics", label: "Synthetics" },
  { href: "/opinions", label: "Opinions" },
  { href: "/orders", label: "Orders" },
];

/** A small shared nav linking the four tier catalogs and their relational overview page to each
 * other — real navigation between distinct routes, not a same-page tab-panel switch, so this
 * wraps the real `NavBar` (which already supports `renderLink` for client-side routing) rather
 * than `SegmentedControl`/`Tabs` (single-page value pickers with no href/link semantics). Each of
 * the five pages is a flat catalog listing with no per-item detail sub-route, so a full
 * `DocsShell`/`BenchmarksShell`-style left-rail `NavIndex` would be disproportionate here — this
 * is deliberately just a header strip. */
export function TierNavTabs() {
  return (
    <NavBar
      items={TIER_PAGES}
      aria-label="Tier catalogs"
      renderLink={({ href, children, className }) => (
        <Link href={href} className={className}>
          {children}
        </Link>
      )}
    />
  );
}
