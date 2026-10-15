"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { NavIndex } from "rebar-ui";
import type { NavIndexItem } from "rebar-ui";
import { DocChrome } from "@/components/docs/DocChrome";
import { PageToc } from "@/components/docs/PageToc";

export interface DocsShellSection {
  href: string;
  label: string;
  /** Optional category tag (e.g. "web" / "mobile" / "diagram"). Sections without one always show. */
  category?: string;
  status?: string;
}

interface DocsShellProps {
  sections: DocsShellSection[];
  /** Display label per category key, e.g. { web: "Web", mobile: "Mobile" }. */
  categoryLabels?: Record<string, string>;
  /** Label for the status-filter chip covering sections with no `status` set: see ref/HEURISTICS.md #42 (category and status are independent filter dimensions). */
  unstatusedLabel?: string;
  /** What this sidebar is searching, so the placeholder is not wrong on a page that lists something other than components. */
  searchPlaceholder?: string;
  children: ReactNode;
}

/**
 * The docs template: a sidebar of constructs, the page (with a breadcrumb and tier tag above it), and an "On this page" rail built
 * from the page's own headings. On a phone the sidebar folds behind a "Browse constructs" button and the rail disappears.
 */
export function DocsShell({ sections, categoryLabels, unstatusedLabel, searchPlaceholder = "Search...", children }: DocsShellProps) {
  const items: NavIndexItem[] = sections;
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="cs-docs">
      <button type="button" className="cs-docs-navtoggle" aria-expanded={navOpen} aria-controls="cs-docs-nav" onClick={() => setNavOpen((o) => !o)}>
        {navOpen ? "Hide constructs" : "Browse constructs"}
      </button>
      <aside id="cs-docs-nav" className="cs-docs-nav" data-open={navOpen ? "true" : "false"}>
        <NavIndex
          items={items}
          categoryLabels={categoryLabels}
          unstatusedLabel={unstatusedLabel}
          searchPlaceholder={searchPlaceholder}
          renderLink={({ href, children: linkChildren, className }) => (
            <Link href={href} className={className} onClick={() => setNavOpen(false)}>
              {linkChildren}
            </Link>
          )}
        />
      </aside>
      <main className="cs-docs-main" data-cs-doc>
        <DocChrome />
        {children}
      </main>
      <PageToc />
    </div>
  );
}
