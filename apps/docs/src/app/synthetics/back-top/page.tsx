"use client";

import { useRef } from "react";
import { BackTop, Box, Card, Heading, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { TASKS } from "@/fixtures/tideline";

const CODE = `<div style={{ position: "relative", transform: "translateZ(0)" }}>
  <div ref={scrollRef} style={{ height: 240, overflowY: "auto" }}>...</div>
  <BackTop visibilityThreshold={80} target={() => scrollRef.current ?? window} />
</div>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["BackTop"] ?? [] },
  {
    type: "doc-section",
    heading: "target",
    body: [
      {
        kind: "text",
        text: '`target?: () => HTMLElement | Window` (default `() => window`) is a deliberate function-prop exception: there is no serializable way to name the window or a scroll container. It chooses what is tracked and scrolled; the button itself is `position: fixed`, so a demo box needs a `transform` to contain it.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Reduced motion",
    body: [{ kind: "text", text: 'Scrolling back uses smooth scroll unless `prefers-reduced-motion` is set, in which case it jumps. Checked via `matchMedia`.' }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="back-top"` on the button.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "AntD's `BackTop` is a close direct equivalent: `visibilityThreshold`, `target` and `onClick` map directly." }],
  },
];

const ROWS = [...TASKS, ...TASKS, ...TASKS];

export default function BackTopPage() {
  const boxRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  return (
    <Stack gap="lg">
      <Heading level={1}>BackTop</Heading>
      <Text color="secondary">A floating button that appears after scrolling down and jumps back to the top.</Text>

      <DemoStage
        title="Task list"
        caption="Scroll the list: the button appears after 80px"
        code={CODE}
        widths={false}
      >
        <Box style={{ position: "relative", transform: "translateZ(0)", overflow: "hidden", borderRadius: 8, border: "1px solid var(--rebar-color-border)", background: "var(--rebar-color-bg-primary)" }}>
          <Box ref={boxRef} style={{ height: 240, overflowY: "auto", padding: "var(--rebar-space-md)" }}>
            <Stack gap="sm">
              {ROWS.map((t, i) => (
                <Stack key={`${t.id}-${i}`} direction="row" gap="sm" align="center" justify="between">
                  <Text size="sm">{t.title}</Text>
                  <Tag>{t.tag}</Tag>
                </Stack>
              ))}
            </Stack>
          </Box>
          <BackTop visibilityThreshold={80} target={() => boxRef.current ?? window} />
        </Box>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Inbox on a phone" caption="Scroll the screen: the button sits inside the bezel" widths={false}>
        <TidelinePhone title="Inbox" tabs={0} height={420} width={260} padding={0}>
          <Box ref={phoneRef} style={{ height: "100%", overflowY: "auto", padding: 14 }}>
            <Stack gap="sm">
              {ROWS.map((t, i) => (
                <Card key={`${t.id}-${i}`}>
                  <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>{t.title}</Text>
                  <Text size="xs" color="secondary">{t.tag}, {t.due ?? "no due date"}</Text>
                </Card>
              ))}
            </Stack>
          </Box>
          <BackTop visibilityThreshold={80} target={() => phoneRef.current ?? window} style={{ bottom: 80 }} />
        </TidelinePhone>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
