/**
 * Builds each tier page's own `DocsShell` sidebar: every component AND every block belonging to
 * that tier, so a reader browsing e.g. `/opinions/table` sees only its 86 Opinion-tier siblings —
 * not all 173 components regardless of tier, which is what the old, now-removed `/components`
 * page's shared sidebar did. Blocks link to their own anchor on the tier's own index page (they
 * have no separate detail page — see `ConstructEntry`), tagged with a "block" pseudo-category so the
 * existing category filter can isolate them from real components.
 */
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { HAS_FULL_PAGE } from "./hasFullPage";
import { constructTier } from "./constructTier";
import { BLOCK_TIER } from "./blockTier";
import { shippedCategory } from "./shippedCategory";
import type { Tier } from "./tier.types";
import type { DocsShellSection } from "@/components/DocsShell";

export const TIER_ROUTE: Record<Tier, string> = {
  imitation: "/imitations",
  synthetic: "/synthetics",
  opinion: "/opinions",
  order: "/orders",
  genesis: "/geneses",
};

export const TIER_LABEL: Record<Tier, string> = {
  imitation: "Imitations",
  synthetic: "Synthetics",
  opinion: "Opinions",
  order: "Orders",
  genesis: "Geneses",
};

export function tierComponentNames(tier: Tier): string[] {
  return Object.keys(componentProps)
    .filter((name) => constructTier(name) === tier)
    .sort();
}

export function tierBlockTypes(tier: Tier): Construct["type"][] {
  return (Object.keys(BLOCK_TIER) as Construct["type"][]).filter((type) => BLOCK_TIER[type] === tier).sort();
}

/**
 * Sub-components that share a page with their parent — excluded from the left nav to avoid
 * duplicate entries pointing to the same URL. Each of these is documented on its parent's page
 * (e.g. FormItem on /opinions/form, Radio on /imitations/radio-group).
 */
const SUB_COMPONENT_EXCLUSIONS = new Set([
  "FormItem",        // documented on /opinions/form with Form
  "Radio",           // documented on /imitations/radio-group with RadioGroup
  "AccordionItem",   // documented on /opinions/accordion with Accordion
  "ToastProvider",   // documented on /opinions/toast with Toast
  "TabList",         // documented on /opinions/tabs with Tabs
  "Tab",             // documented on /opinions/tabs with Tabs
  "TabPanel",        // documented on /opinions/tabs with Tabs
]);

export function tierDocsShellSections(tier: Tier): DocsShellSection[] {
  const route = TIER_ROUTE[tier];
  const componentSections: DocsShellSection[] = tierComponentNames(tier)
    .filter((name) => !SUB_COMPONENT_EXCLUSIONS.has(name))
    .map((name) => {
      const href = HAS_FULL_PAGE[name];
      const category = shippedCategory(name);
      return href ? { href, label: name, category } : { href: route, label: name, category, status: "No reference page" };
    });
  const blockSections: DocsShellSection[] = tierBlockTypes(tier).map((type) => ({
    href: `${route}/${type}`,
    label: type,
    category: "block",
  }));
  return [{ href: route, label: "All in this tier" }, ...componentSections, ...blockSections];
}

export const TIER_CATEGORY_LABELS = { web: "Web", mobile: "Mobile", diagram: "Diagram", block: "Block" };
