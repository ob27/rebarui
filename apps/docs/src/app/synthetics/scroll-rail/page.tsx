import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: `{ type: "scroll-rail", label: string, items: { image: { src: string, alt: string }, eyebrow?: string, title?: string, href?: string }[], autoScroll?: boolean | number, loop?: boolean, controls?: boolean, itemWidth?: string }`,
      },
      {
        kind: "text",
        text: "The block renders the `ScrollRail` component, documented on `/opinions/scroll-rail`. The block itself is static data with no `source` or `onX` field, so it is a Synthetic by the mechanical rule even though the component is an Opinion.",
      },
    ],
  },
];

const CODE = `{
  type: "scroll-rail",
  label: "Harbour livery",
  itemWidth: "12rem",
  items: [
    { image: { src: "/art/grain-dawn.svg", alt: "Dawn grain" }, eyebrow: "Livery", title: "Dawn" },
    { image: { src: "/art/grain-dusk.svg", alt: "Dusk grain" }, eyebrow: "Livery", title: "Dusk" },
    { image: { src: "/art/grain-sand.svg", alt: "Sand grain" }, eyebrow: "Livery", title: "Sand" },
  ],
}`;

const ART = [
  { src: "/art/grain-dawn.svg", name: "Dawn" },
  { src: "/art/grain-dusk.svg", name: "Dusk" },
  { src: "/art/grain-sand.svg", name: "Sand" },
  { src: "/art/grain-periwinkle.svg", name: "Periwinkle" },
];

const items = (count: number, link = false) =>
  Array.from({ length: count }, (_, i) => {
    const a = ART[i % ART.length]!;
    return { image: { src: a.src, alt: `${a.name} grain` }, eyebrow: "Livery", title: `${a.name} ${i + 1}`, ...(link ? { href: "/opinions/scroll-rail" } : {}) };
  });

export default function ScrollRailBlockPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Scroll Rail</Heading>
      <Text color="secondary">A horizontally scrolling rail of image cards, each a link when it has an href.</Text>

      <DemoStage
        title="Livery rail"
        caption="Six cards; scroll or use the arrows"
        code={CODE}
        states={[
          { label: "Linked cards", node: <NextBlockRenderer blocks={[{ type: "scroll-rail", label: "Linked livery", itemWidth: "12rem", items: items(5, true) }]} /> },
          { label: "No controls", node: <NextBlockRenderer blocks={[{ type: "scroll-rail", label: "Livery without controls", itemWidth: "12rem", controls: false, items: items(5) }]} /> },
          { label: "Narrow cards", node: <NextBlockRenderer blocks={[{ type: "scroll-rail", label: "Narrow livery", itemWidth: "8rem", items: items(6) }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "scroll-rail", label: "Harbour livery", itemWidth: "12rem", items: items(6) }]} />
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}