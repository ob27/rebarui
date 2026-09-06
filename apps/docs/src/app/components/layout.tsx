import type { ReactNode } from "react";
import { DocsShell } from "@/components/DocsShell";
import componentProps from "@/generated/component-props.json";
import { HAS_FULL_PAGE } from "@/data/hasFullPage";
import { CATALOG_COMPONENTS } from "@/data/componentCatalog";
import { shippedCategory } from "@/data/shippedCategory";

// Derived from the same `componentProps`/`HAS_FULL_PAGE` data the `/components` grid uses, so the
// sidebar can never silently diverge from what the grid actually shows. Undocumented components
// get a real "No reference page" status instead of being omitted from this list entirely (see
// ref/HEURISTICS.md #42 — status is a real, independently filterable dimension). Each component's
// real category (web/mobile/diagram) comes from `shippedCategory` — not hardcoded to "web", which
// is what silently broke the Mobile/Diagram sidebar filter once those categories' components
// actually shipped (see that file's own doc comment for the full story).
const SHIPPED_SECTIONS = [
  { href: "/components", label: "All components" },
  ...Object.keys(componentProps)
    .sort()
    .map((name) => {
      const href = HAS_FULL_PAGE[name];
      const category = shippedCategory(name);
      return href
        ? { href, label: name, category }
        : { href: "/components", label: name, category, status: "No reference page" };
    }),
];

const CATALOG_SECTIONS = CATALOG_COMPONENTS.map((c) => ({
  href: `/components/planned/${c.slug}`,
  label: c.name,
  category: c.category,
  // A pill, not a label suffix — see ref/HEURISTICS.md #41.
  status: "Planned",
}));

const COMPONENT_SECTIONS = [...SHIPPED_SECTIONS, ...CATALOG_SECTIONS];

const CATEGORY_LABELS = { web: "Web", mobile: "Mobile", diagram: "Diagram" };

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      sections={COMPONENT_SECTIONS}
      categoryLabels={CATEGORY_LABELS}
      unstatusedLabel="Documented"
    >
      {children}
    </DocsShell>
  );
}
