import { Heading, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { HAS_FULL_PAGE } from "@/data/hasFullPage";
import { shippedCategory } from "@/data/shippedCategory";
import { tierComponentNames } from "@/data/tierSections";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CATEGORY_LABEL = { web: "Web", mobile: "Mobile", diagram: "Diagram" } as const;
const CATEGORY_TONE = { web: "info", mobile: "success", diagram: "warning" } as const;

export default function ImitationsPage() {
  const names = tierComponentNames("imitation");

  const grid: Block = {
    type: "card-grid",
    items: names.map((name) => {
      const href = HAS_FULL_PAGE[name];
      const category = shippedCategory(name);
      return { title: name, href, linkLabel: "View reference →", tags: [{ label: CATEGORY_LABEL[category], tone: CATEGORY_TONE[category] }] };
    }),
  };

  return (
    <Stack gap="lg">
      <Heading level={1}>Imitations</Heading>
      <Text color="secondary">
        Static, standalone primitives — no composition of other named components, no real state
        machine beyond mirroring one caller-controlled value for the controlled/uncontrolled
        convention. A block is always at least a fixed composition of components, so this tier is
        components-only. See{" "}
        <a href="/docs/tiers" className="rebar-link">
          the four tiers
        </a>{" "}
        for how this relates to Synthetics, Opinions, and Orders.
      </Text>

      <Heading level={2}>Components ({names.length})</Heading>
      <NextBlockRenderer blocks={[grid]} />
    </Stack>
  );
}
