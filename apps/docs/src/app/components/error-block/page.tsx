"use client";

import { useState } from "react";
import { Button, ErrorBlock, Heading, SegmentedControl, Stack, Text } from "rebar-ui";
import type { ErrorBlockStatus } from "rebar-ui";
import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<ErrorBlock status="disconnected">\n  <Button onClick={retry}>Retry</Button>\n</ErrorBlock>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["ErrorBlock"] ?? [] },
  {
    type: "doc-section",
    heading: "One component for the handful of ways a page needs to explain itself",
    body: [
      {
        kind: "text",
        text: 'Each `status` ships its own default title/description, so the common case is just `<ErrorBlock status="disconnected" />` — no copy to author by hand. `status="empty"` composes the real `Empty` component directly rather than duplicating its hand-drawn illustration; the other three statuses use a plain icon glyph instead, consistent with how `Alert`/`Result` already look here.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="error-block"` with `data-rebar-status` set to the current status; parts: `icon`, `title`, `description`, `action`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — this is the antd-mobile `ErrorBlock` pattern, not part of the desktop `antd` package this project's codemod targets. AntD desktop's closest equivalent is `Result`, already the codemod's own precedent for that shape.",
      },
    ],
  },
];

const STATUSES: { value: ErrorBlockStatus; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "disconnected", label: "Disconnected" },
  { value: "empty", label: "Empty" },
  { value: "busy", label: "Busy" },
];

export default function ErrorBlockPage() {
  const [status, setStatus] = useState<ErrorBlockStatus>("default");

  return (
    <Stack gap="lg">
      <Heading level={1}>ErrorBlock</Heading>
      <Text color="secondary">
        A full failure/empty-state display covering the handful of states a page commonly needs —
        a generic error, no network, no data, an overloaded server — each with sensible default
        copy and an icon.
      </Text>

      <LivePreview>
        <Stack gap="md" style={{ maxWidth: 360 }}>
          <SegmentedControl
            options={STATUSES}
            value={status}
            onValueChange={(v) => setStatus(v as ErrorBlockStatus)}
          />
          <ErrorBlock status={status}>
            <Button onClick={() => {}}>Retry</Button>
          </ErrorBlock>
        </Stack>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
