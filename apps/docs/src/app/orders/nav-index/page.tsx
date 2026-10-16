import { Box, Heading, NavIndex, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CREW } from "@/fixtures/tideline";

const CODE = `<NavIndex
  items={[
    { label: "All crew", href: "/crew" },
    { label: "Aisha Bello", href: "/crew/aisha", category: "done" },
    { label: "Niamh Byrne", href: "/crew/niamh", category: "booked", status: "Booked" },
  ]}
  categoryLabels={{ done: "Interviewed", booked: "Booked" }}
/>`;

const ITEMS = [
  { label: "All crew", href: "#" },
  ...CREW.map((c) => ({
    label: c.name,
    href: "#",
    category: c.interviewed.startsWith("Booked") ? "booked" : "done",
    ...(c.interviewed.startsWith("Booked") ? { status: "Booked" } : {}),
  })),
];
const LABELS = { done: "Interviewed", booked: "Booked" };

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["NavIndex"] ?? [] },
  {
    type: "doc-section",
    heading: "Behaviour",
    body: [
      {
        kind: "list",
        items: [
          "An item with no `category` always renders above the list, in bold, untouched by search or filters.",
          "A `status` renders as a real `Tag` next to the label, never inside the label text.",
          "Search and category chips only appear once the list passes 12 items.",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [{ kind: "text", text: "A real `<nav aria-label>`; category chips are `<button aria-pressed>`; every item is a real link via `renderLink`." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="nav-index"`; `data-rebar-part` is `"controls"`, `"search"`, `"chips"`, `"chip"` (`data-rebar-active` on the selected one), `"overview-item"`, `"item"` or `"empty"`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. A `Menu` with a controlled `Input.Search` and manual filtering is the nearest match." }],
  },
];

const PANEL = {
  border: "1px solid var(--rebar-color-border)",
  borderRadius: 8,
  padding: "var(--rebar-space-md)",
  background: "var(--rebar-color-bg-primary)",
  width: 260,
  maxWidth: "100%",
} as const;

const FLAT = { position: "static", maxHeight: "none" } as const;

export default function NavIndexPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>NavIndex</Heading>
      <Text color="secondary">A vertical list of links with search and category chips that appear once the list is long.</Text>

      <DemoStage
        title="Crew directory"
        caption="Twelve people: search and chips appear. Try filtering"
        code={CODE}
        widths={false}
        states={[
          {
            label: "Short list",
            node: (
              <Box style={PANEL}>
                <NavIndex items={ITEMS.slice(0, 5)} categoryLabels={LABELS} style={FLAT} />
              </Box>
            ),
          },
        ]}
      >
        <Box style={PANEL}>
          <NavIndex items={ITEMS} categoryLabels={LABELS} style={FLAT} />
        </Box>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Sidebar" caption="The index beside a person's page" widths={false}>
        <Stack direction="row" gap="lg" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
          <Box style={PANEL}>
            <NavIndex items={ITEMS} categoryLabels={LABELS} style={FLAT} />
          </Box>
          <Stack gap="xs" style={{ flex: 1, minWidth: 200 }}>
            <Heading level={3}>Aisha Bello</Heading>
            <Text color="secondary">Ferry deckhand, interviewed 6 Oct.</Text>
          </Stack>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
