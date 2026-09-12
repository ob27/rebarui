import { Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TierNavTabs } from "@/components/TierNavTabs";
import { tierCatalogFor, tierEntriesToCardGridItems } from "@/data/tierCatalog";
import type { Tier } from "@/data/tier.types";

export function TierCatalogPage({
  tier,
  title,
  description,
}: {
  tier: Tier;
  title: string;
  description: string;
}) {
  const { components, blocks } = tierCatalogFor(tier);

  const blocksList: Block[] = [
    { type: "doc-section", heading: title, level: 1, body: [{ kind: "text", text: description }] },
    { type: "doc-section", heading: `Components (${components.length})`, level: 2, body: [] },
    { type: "card-grid", items: tierEntriesToCardGridItems(components) },
    ...(blocks.length
      ? [
          { type: "doc-section", heading: `Blocks (${blocks.length})`, level: 2, body: [] } satisfies Block,
          { type: "card-grid", items: tierEntriesToCardGridItems(blocks) } satisfies Block,
        ]
      : []),
  ];

  return (
    <Stack gap="lg">
      <TierNavTabs />
      <NextBlockRenderer blocks={blocksList} />
      {components.length === 0 && blocks.length === 0 ? (
        <Text color="secondary">Nothing classified into this tier yet.</Text>
      ) : null}
    </Stack>
  );
}
