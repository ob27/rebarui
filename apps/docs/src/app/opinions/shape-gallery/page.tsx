"use client";

import { useState } from "react";
import { Card, Heading, ShapeGallery, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { FILES, project } from "@/fixtures/tideline";

const svg = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);

const ITEMS = [
  { id: "plate", label: "Plate", category: "Fascia", preview: svg(<rect x="3" y="6" width="18" height="12" />) },
  { id: "rounded", label: "Rounded plate", category: "Fascia", preview: svg(<rect x="3" y="6" width="18" height="12" rx="5" />) },
  { id: "roundel", label: "Roundel", category: "Fascia", preview: svg(<circle cx="12" cy="12" r="9" />) },
  { id: "arrow", label: "Arrow right", category: "Wayfinding", preview: svg(<path d="M3 12h16m-6-6l6 6l-6 6" />) },
  { id: "chevron", label: "Chevron", category: "Wayfinding", preview: svg(<path d="M9 5l7 7l-7 7" />) },
  { id: "pin", label: "Pin", category: "Wayfinding", preview: svg(<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4a2 2 0 0 0 0 4z" />) },
  { id: "diamond", label: "Diamond", category: "Hazard", preview: svg(<path d="M12 2l10 10l-10 10L2 12z" />) },
  { id: "triangle", label: "Warning triangle", category: "Hazard", preview: svg(<path d="M12 3l10 18H2z" />) },
];

const CODE = `<ShapeGallery
  items={ITEMS}
  defaultFavoriteIds={["arrow"]}
  onSelect={(item) => addToCanvas(item.id)}
/>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ShapeGallery"] ?? [] },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="shape-gallery"`; parts include `swatch`, `preview`, `label`, and `favorite-toggle`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — compose AntD's own `Tabs` + a plain grid of clickable cards directly.",
      },
    ],
  },
];

export default function ShapeGalleryPage() {
  const [picked, setPicked] = useState("arrow");
  return (
    <Stack gap="lg">
      <Heading level={1}>ShapeGallery</Heading>
      <Text color="secondary">A searchable, categorised palette of shapes with favourites, for picking one to drop on a canvas.</Text>

      <DemoStage
        title="Depot signage shapes"
        caption="Search, switch category, star the ones you reuse"
        code={CODE}
        widths={false}
        states={[
          { label: "One category", node: <ShapeGallery items={ITEMS.filter((i) => i.category === "Hazard")} onSelect={() => {}} /> },
        ]}
      >
        <ShapeGallery items={ITEMS} defaultFavoriteIds={["arrow", "roundel"]} onSelect={() => {}} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Fascia editor" caption="Pick a shape on the left, see it on the canvas" widths={false}>
        <Stack direction="row" gap="md" align="start" style={{ flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 280px", maxWidth: 360 }}>
            <ShapeGallery items={ITEMS} defaultFavoriteIds={["arrow"]} onSelect={(item) => setPicked(item.id)} />
          </div>
          <Card style={{ flex: "2 1 300px" }} title={FILES[0].name} subtitle={`${project("signage").name}, ${project("signage").due}`}>
            <div className="cs-grain" style={{ height: 180, display: "grid", placeItems: "center", borderRadius: 8, color: "var(--rebar-color-primary)" }}>
              <div style={{ transform: "scale(4)" }}>{ITEMS.find((i) => i.id === picked)?.preview}</div>
            </div>
            <Text size="sm" color="secondary" style={{ marginTop: 8 }}>Selected: {ITEMS.find((i) => i.id === picked)?.label}</Text>
          </Card>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
