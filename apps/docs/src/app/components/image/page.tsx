"use client";

import { useState } from "react";
import { Button, Heading, Image, Stack, Text } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<Image src="/photo.jpg" alt="A mountain lake at sunrise" width={240} height={160} />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Image"] ?? [] },
  {
    type: "doc-section",
    heading: "Distinct from AspectRatio",
    body: [
      {
        kind: "text",
        text: "`AspectRatio` handles ratio/placeholder/watermark framing, but has no concept of \"is this still loading\" or \"did this 404\" — `Image` is the complement: a real load/error state machine around a plain `<img>`, per ref/HEURISTICS.md #20 (loading, error, empty, and disabled states are all designed, not just the happy path). The `<img>` itself is always rendered (never conditionally unmounted), so its `alt` text stays in the accessibility tree through every state — the loading indicator and error fallback are overlays on top of it, not replacements for it.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="image"` on the root, which also carries `data-rebar-image-status="loading"|"loaded"|"error"`; parts: `img`, `loading`, `fallback`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's own `Image` is a close structural match for the loading/error states — `src`/`alt`/`fallback` map directly. AntD's `Image` also bundles a built-in fullscreen preview; this project keeps that as a separate `Lightbox` component instead of merging the two concerns.",
      },
    ],
  },
];

export default function ImagePage() {
  const [key, setKey] = useState(0);

  return (
    <Stack gap="lg">
      <Heading level={1}>Image</Heading>
      <Text color="secondary">
        A real <code>&lt;img&gt;</code> wrapper with loading and error states — a spinner while it
        loads, a real fallback if the source fails.
      </Text>

      <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", alignItems: "flex-start" }}>
        <Stack gap="xs">
          <Text size="sm" color="secondary">
            A working image
          </Text>
          <Image
            key={`ok-${key}`}
            src="https://picsum.photos/240/160"
            alt="A random placeholder photo"
            width={240}
            height={160}
          />
        </Stack>
        <Stack gap="xs">
          <Text size="sm" color="secondary">
            A broken source (real error state)
          </Text>
          <Image
            key={`broken-${key}`}
            src="https://example.invalid/does-not-exist.jpg"
            alt="This image intentionally fails to load"
            width={240}
            height={160}
          />
        </Stack>
      </Stack>
      <Button variant="secondary" onClick={() => setKey((k) => k + 1)} style={{ maxWidth: 200 }}>
        Reload both (see loading state)
      </Button>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
