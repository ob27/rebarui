import { Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { CATALOG_COMPONENTS } from "@/data/componentCatalog";
import type { CatalogCategory } from "@/data/componentCatalog";
import { HAS_FULL_PAGE } from "@/data/hasFullPage";
import { shippedCategory } from "@/data/shippedCategory";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CATEGORY_LABEL: Record<CatalogCategory, string> = {
  web: "Web",
  mobile: "Mobile",
  diagram: "Diagram",
};

const CATEGORY_TONE: Record<CatalogCategory, "info" | "success" | "warning"> = {
  web: "info",
  mobile: "success",
  diagram: "warning",
};

const CATEGORY_ORDER: CatalogCategory[] = ["web", "mobile", "diagram"];

export default function ComponentsIndexPage() {
  // Category-first-then-alphabetical (each category visually starts its own A→Z run), not a flat
  // alphabetical list — the same ordering the catalog ("planned") grids below already use, and the
  // sidebar nav's own category filter already groups by. A category pill on every shipped item
  // (not just the "No reference page" status) is the other half of the same change: the pill row
  // is already the first place a reader's eye goes on this page, so it's the natural place to
  // surface which surface (web/mobile/diagram) a component actually targets.
  const namesByCategory = CATEGORY_ORDER.flatMap((category) =>
    Object.keys(componentProps)
      .filter((name) => shippedCategory(name) === category)
      .sort()
      .map((name) => ({ name, category })),
  );

  const shippedGrid: Block = {
    type: "card-grid",
    items: namesByCategory.map(({ name, category }) => {
      const href = HAS_FULL_PAGE[name];
      const tags = [
        { label: CATEGORY_LABEL[category], tone: CATEGORY_TONE[category] },
        ...(href ? [] : [{ label: "No reference page", tone: "warning" as const }]),
      ];
      return href
        ? { title: name, href, linkLabel: "View reference →", tags }
        : { title: name, tags };
    }),
  };

  const catalogGrids: Block[] = CATEGORY_ORDER.flatMap((category) => {
    const items = CATALOG_COMPONENTS.filter((c) => c.category === category);
    if (items.length === 0) return [];
    return [
      {
        type: "doc-section",
        heading: `${CATEGORY_LABEL[category]} (${items.length})`,
        level: 3,
        body: [],
      } satisfies Block,
      {
        type: "card-grid",
        items: items.map((item) => ({
          title: item.name,
          body: item.description,
          href: `/components/planned/${item.slug}`,
          linkLabel: "View catalog entry →",
          tags: [{ label: "Planned", tone: "warning" }],
        })),
      } satisfies Block,
    ];
  });

  return (
    <Stack gap="lg">
      <Heading level={1}>Components</Heading>
      <Text color="secondary">
        {namesByCategory.length} components exported from <code>rebar-ui</code>. Full reference pages exist
        for Button (simple), Avatar (illustrated placeholder art), Carousel (self-contained, no new
        dependency), Dialog (composite, Radix-backed), Form (the most complex, with an adapter
        migration story), and the rest of the data-display/feedback/navigation set (Badge,
        Breadcrumb, Descriptions, Divider, Empty, Rate, Result, Skeleton, Spin, Statistic, Steps,
        Tag, Timeline). The rest are listed
        here honestly as not yet written, not silently skipped.
      </Text>

      <NextBlockRenderer blocks={[shippedGrid]} />

      <Stack gap="sm">
        <Heading level={2}>Catalogued, not yet built</Heading>
        <Text color="secondary">
          {CATALOG_COMPONENTS.length} components identified by cross-referencing 180+ published UI
          libraries and design systems against rebar-ui&apos;s current set — real gaps, recorded
          and de-duplicated, not a roadmap commitment. See{" "}
          <a href="/docs/heuristics#ia-pyramid" className="rebar-link">
            information architecture as pyramid
          </a>{" "}
          for why this list gets a category filter and search in the nav once it grows this large.
        </Text>
      </Stack>

      <NextBlockRenderer blocks={catalogGrids} />
    </Stack>
  );
}
