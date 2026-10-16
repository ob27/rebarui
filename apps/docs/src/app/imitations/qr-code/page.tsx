"use client";

import { Button, Card, Heading, Input, QRCode, SegmentedControl, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";
import { useEffect, useMemo, useRef, useState } from "react";
import type { QRCodePictogramModule } from "rebar-ui";

const LINK = "https://tideline.example/launch/harbour";
const CODE = `<QRCode value="https://tideline.example/launch/harbour" size={160} errorCorrectionLevel="H" />`;

// A small heart drawn in the code's own modules: 1 forces a module dark, 0 forces it light.
const HEART_BITMAP = [
  [0, 1, 1, 0, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
];

function buildHeartPictogram(moduleCount: number): QRCodePictogramModule[][] {
  const grid: QRCodePictogramModule[][] = Array.from({ length: moduleCount }, () => Array<QRCodePictogramModule>(moduleCount).fill(undefined));
  const rowOffset = Math.floor((moduleCount - HEART_BITMAP.length) / 2);
  const colOffset = Math.floor((moduleCount - HEART_BITMAP[0].length) / 2);
  HEART_BITMAP.forEach((row, r) => {
    row.forEach((bit, c) => {
      const tr = rowOffset + r;
      const tc = colOffset + c;
      if (tr >= 0 && tr < moduleCount && tc >= 0 && tc < moduleCount) grid[tr][tc] = bit === 1 ? "var(--rebar-color-error)" : false;
    });
  });
  return grid;
}

// A plain two-tone dot logo on a 24x24 viewBox, passed as inline SVG content.
const DOT_LOGO_ICON = (
  <>
    <circle cx={12} cy={12} r={11} fill="var(--rebar-color-primary)" />
    <circle cx={12} cy={12} r={5} fill="var(--rebar-color-bg)" />
  </>
);

type CenterMode = "none" | "icon" | "pictogram";

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["QRCode"] ?? [] },
  {
    type: "doc-section",
    heading: "Overlaying an icon",
    body: [
      {
        kind: "text",
        text: '`icon` accepts either an image URL/data URI, or raw inline SVG content authored against a 24×24 viewBox — no data-URI encoding needed for a plain vector logo. Default size is 20% of the code\'s width, via `iconSizeRatio` — pair it with `errorCorrectionLevel="H"` so enough of the code survives being partly covered to still scan reliably.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Drawing a pictograph in the code's own modules",
    body: [
      {
        kind: "text",
        text: '`pictogram` is a grid of per-module overrides, indexed `[row][col]`: `true`/a color string forces that module dark (with that color); `false` forces it light even where the real data is dark; `undefined` leaves the real encoded value alone. Recoloring an already-dark module is always safe — it never changes what the code decodes to. Forcing a module light or dark that disagrees with the real data spends into the same error-correction budget `icon` does, so heavier use pairs with `errorCorrectionLevel="H"`, and it\'s worth actually testing that the result still scans, the same way this project verified `QRCode` itself with a real decoder before shipping it.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="qrcode"` on the root `<svg>`, which also carries `data-rebar-module-count` (the real module grid size — useful for sizing a `pictogram` grid to the actual code, as the demo above does). Each rendered module carries `data-rebar-part="module"`; the overlay carries `data-rebar-part="icon"`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `QRCode` component is a close structural match (`value`/`size`/`color`/`bgColor`/`icon`/`errorCorrectionLevel`) for the core props — `pictogram` has no AntD equivalent, since it's not a shape AntD's own component supports; a migration keeping that effect needs to reimplement it or drop it.",
      },
    ],
  },
];

export default function QRCodePage() {
  const harbour = project("harbour");
  const [value, setValue] = useState(LINK);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [centerMode, setCenterMode] = useState<CenterMode>("icon");
  const [moduleCount, setModuleCount] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // The pictogram grid must match the real module count, which depends on the value and level.
  useEffect(() => {
    const svg = containerRef.current?.querySelector('[data-rebar-component="qrcode"]');
    const count = svg?.getAttribute("data-rebar-module-count");
    setModuleCount(count ? Number(count) : null);
  }, [value, level, centerMode]);

  const pictogram = useMemo(() => (centerMode === "pictogram" && moduleCount ? buildHeartPictogram(moduleCount) : undefined), [centerMode, moduleCount]);

  return (
    <Stack gap="lg">
      <Heading level={1}>QRCode</Heading>
      <Text color="secondary">A real, scannable QR code drawn as SVG.</Text>

      <DemoStage title="Crew check-in" caption="Edit the link, the error correction and the centre mark" code={CODE} widths={false}
        states={[
          { label: "Level L", node: <QRCode value={LINK} size={96} errorCorrectionLevel="L" /> },
          { label: "Level H with logo", node: <QRCode value={LINK} size={96} errorCorrectionLevel="H" icon={DOT_LOGO_ICON} /> },
          { label: "Tinted", node: <QRCode value={LINK} size={96} color="var(--rebar-color-primary)" /> },
        ]}
      >
        <Stack direction="row" gap="xl" align="center" style={{ flexWrap: "wrap", justifyContent: "center" }}>
          <Stack gap="md" style={{ width: 300 }}>
            <Input aria-label="Value to encode" value={value} onChange={(e) => setValue(e.target.value)} />
            <Stack gap="xs">
              <Text size="sm" color="secondary">Error correction</Text>
              <SegmentedControl
                value={level}
                onValueChange={(v) => setLevel(v as "L" | "M" | "Q" | "H")}
                options={(["L", "M", "Q", "H"] as const).map((l) => ({ value: l, label: l }))}
              />
            </Stack>
            <Stack gap="xs">
              <Text size="sm" color="secondary">Centre mark</Text>
              <SegmentedControl
                value={centerMode}
                onValueChange={(v) => setCenterMode(v as CenterMode)}
                options={[
                  { value: "none", label: "None" },
                  { value: "icon", label: "Logo" },
                  { value: "pictogram", label: "Heart" },
                ]}
              />
            </Stack>
          </Stack>
          <div ref={containerRef} style={{ padding: "var(--rebar-space-md)", background: "var(--rebar-color-bg)", borderRadius: 8 }}>
            {value ? (
              <QRCode value={value} size={200} errorCorrectionLevel={level} icon={centerMode === "icon" ? DOT_LOGO_ICON : undefined} pictogram={pictogram} />
            ) : (
              <Text size="sm" color="secondary">Enter a value to encode.</Text>
            )}
          </div>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Pass for the launch" caption="Scanned at the harbour gate" widths={false}>
        <Card style={{ maxWidth: 360, margin: "0 auto" }} title={`${harbour.name} launch`} subtitle="24 Oct, 09:00" actions={[<Button key="save">Save to wallet</Button>, <Button key="share" variant="tertiary">Share</Button>]}>
          <Stack gap="sm" align="center">
            <QRCode value={LINK} size={160} errorCorrectionLevel="Q" />
            <Text size="sm" color="secondary">Maya Chen, crew</Text>
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
