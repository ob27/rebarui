"use client";

import { useState } from "react";
import { Heading, ImagePicker, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TokenTable } from "@/components/docs/TokenTable";
import { PhoneSheet, TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { APP_ICONS, CHAT_ANSWER, CHAT_QUESTION, COVERS, COVER_TAGS } from "@/fixtures/athic-mobile";

const CODE = `const [cover, setCover] = useState<string | null>("cover-4");
const [tag, setTag] = useState<string | null>(null);

<ImagePicker items={covers} tags={["Scripture", "Saints", "Liturgy"]} activeTag={tag} onTagChange={setTag}
  selectedId={cover} onSelect={(item) => setCover(item.id)} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ImagePicker"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Each tile is a real `<button>` named by the image's `alt` with `aria-pressed` for the selection, 44px minimum, with a visible focus ring. Tag chips are pressed-state buttons in a labelled group. The error block is `role=\"alert\"`; `loading` sets `aria-busy` on the grid. A busy tile sets `aria-busy`, and every other tile is `aria-disabled` and ignores presses.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="image-picker"`, `data-rebar-shape="square" | "icon"`, `data-rebar-columns`. Parts: `tags`, `chip`, `grid`, `tile` (with `data-rebar-state="selected" | "busy"`), `check`, `busy`, `error`, `empty`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "No direct equivalent. Use `Radio.Group` with `optionType=\"button\"` over `Image` previews, or `Upload` in `picture-card` mode when choosing a file is the point." }],
  },
  {
    type: "doc-section",
    heading: "Multi-tag filter and disabled",
    body: [
      {
        "kind": "text",
        "text": "Pass `multiTag` and the chips toggle independently; the grid shows items carrying every active tag (`tagMatch=\"any\"` for any of them), \"All\" clears them (`activeTags`/`onActiveTagsChange` to control). `disabled` on the picker, or `disabled: true` on an `ImagePickerItem`, makes tiles ignore presses (`aria-disabled`). Each tile is named by its item `alt`."
      },
      {
        "kind": "code",
        "code": "<ImagePicker items={items} tags={[\"Scripture\", \"Saints\"]} multiTag onSelect={pick} />"
      }
    ],
  },
  {
    type: "doc-section",
    heading: 'appearance="classic", columns="auto"',
    body: [{ kind: "text", text: '`appearance="classic"` draws 10px-radius square tiles with a 3px border (bright primary when selected or busy), flat chips with a corner tick, and a plain empty message; `columns="auto"` fits tiles at least `--rebar-image-picker-tile-min` wide; `allLabel={null}` drops the All chip. Tokens: `--rebar-image-picker-gap / -max-height / -tile-radius / -tile-bg`, `--rebar-classic-chip-*`.' }],
  },
  {
    type: "doc-section",
    heading: 'appearance="ring"',
    body: [{ kind: "text", text: '`appearance="ring"` draws soft-shadow tiles (`--rebar-image-picker-tile-radius` 18px, `-shadow`, `-gap` 14px); the selected tile wears a bright ring (`--rebar-image-picker-ring`) and a corner badge (`checkIcon` replaces the glyph; `-check-size`, `-check-inset`, `-check-bg`, `-check-icon-size`), and a busy tile just fades (`--rebar-image-picker-busy-opacity`, no spinner). A tile can be selected and busy at once.' }],
  },
];

export default function ImagePickerPage() {
  const [cover, setCover] = useState<string | null>("cover-4");
  const [tag, setTag] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>("icon-4");
  const [busy, setBusy] = useState<string | null>(null);
  const choose = (id: string) => {
    setBusy(id);
    window.setTimeout(() => {
      setCover(id);
      setBusy(null);
    }, 1200);
  };
  return (
    <Stack gap="lg">
      <Heading level={1}>ImagePicker</Heading>
      <Text color="secondary">A grid of selectable image tiles with an optional tag filter. Also the app-icon picker. Tiles blur up through Image.</Text>

      <DemoStage
        title="Cover picker"
        caption="Single select; the chosen tile saves for a moment, then settles"
        code={CODE}
        states={[
          { label: "Loading", node: <ImagePicker items={[]} loading /> },
          { label: "Empty", node: <ImagePicker items={COVERS.slice(0, 2)} tags={COVER_TAGS} defaultActiveTag="Nature" /> },
          { label: "Error", node: <ImagePicker items={[]} error="Couldn’t load covers" onRetry={() => undefined} /> },
          { label: "Four columns", node: <ImagePicker items={COVERS} columns={4} defaultSelectedId="cover-2" /> },
        ]}
      >
        <div style={{ maxWidth: 380, margin: "0 auto" }}>
          <ImagePicker items={COVERS} tags={COVER_TAGS} activeTag={tag} onTagChange={setTag} selectedId={cover} busyId={busy} onSelect={(item) => choose(item.id)} aria-label="Cover images" />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Cover sheet and app icons" caption="A sheet over a discussion; the icon variant on its own screen" widths={false}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <TidelinePhone
            title="Confession to a priest"
            dim
            height={520}
            overlay={
              <PhoneSheet title="Choose a cover image">
                <ImagePicker items={COVERS} tags={COVER_TAGS} selectedId={cover} onSelect={(item) => setCover(item.id)} />
              </PhoneSheet>
            }
          >
            <Text size="sm" style={{ fontWeight: 600 }}>{CHAT_QUESTION}</Text>
            <Text size="sm" color="secondary">{CHAT_ANSWER.replace(/\*\*/g, "")}</Text>
          </TidelinePhone>
          <TidelinePhone title="App icon" height={520}>
            <Text size="sm" color="secondary" style={{ marginBottom: 12 }}>Choose how Athic looks on your home screen.</Text>
            <ImagePicker items={APP_ICONS} shape="icon" selectedId={icon} onSelect={(item) => setIcon(item.id)} aria-label="App icons" />
          </TidelinePhone>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />

      <TokenTable component="ImagePicker" />
    </Stack>
  );
}
