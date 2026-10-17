"use client";

import { Accordion, AccordionItem, Heading, Stack, Text, useHashTarget } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TRANSPARENCY } from "@/fixtures/athic";

const CODE = `const ids = ["model", "journal", "data", "regions", "age"];
const { target, open, setOpen } = useHashTarget(ids, { offset: "auto", focus: true });

<Accordion type="multiple" value={open} onValueChange={setOpen}>
  {rows.map((r) => (
    <AccordionItem key={r.id} id={r.id} value={r.id} trigger={r.title}>{r.body}</AccordionItem>
  ))}
</Accordion>`;

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "API",
    body: [
      { kind: "code", code: `useHashTarget(ids: readonly string[], options?: {\n  offset?: number | "auto";      // default "auto"\n  behavior?: "smooth" | "auto";  // default "smooth", instant under reduced motion\n  focus?: boolean;               // default false\n  defaultOpen?: string[];\n  highlightMs?: number;          // default 2400\n}): { target: string | null; open: string[]; setOpen }` },
      { kind: "text", text: "Reads `location.hash` on mount and on `hashchange`. An id that is not in `ids` is ignored and the page stays where it is. For a known id it returns it as `target`, adds it to `open` (for a multiple `Accordion`), waits for the item to open and lay out, sets `scroll-margin-top` on the element, scrolls it into view, and marks it `data-hash-target=\"true\"` for a short ring (style hook only)." },
      { kind: "text", text: "`offset: \"auto\"` reads `--rebar-header-height` from `<html>` and adds 20px. The `site-header` block publishes that variable and keeps it current with a `ResizeObserver`; with a header of your own, set it yourself. Give each target an `id`: `AccordionItem` takes an `id` prop for this." },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      { kind: "text", text: "With `focus: true` the target gets `tabindex=\"-1\"` and focus (without a second scroll), so screen readers announce it. Scrolling is instant under `prefers-reduced-motion`. The browser's own back and forward still work because the hook only listens." },
    ],
  },
];

export default function UseHashTargetPage() {
  const { target, open, setOpen } = useHashTarget(TRANSPARENCY.map((r) => r.id), { focus: true });
  return (
    <Stack gap="lg">
      <Heading level={1}>useHashTarget</Heading>
      <Text color="secondary">Opens and scrolls to the section named in the URL, clear of a sticky header.</Text>

      <DemoStage
        title="Transparency page"
        caption="Use the links to change the hash: the item opens and is highlighted"
        code={CODE}
        widths={false}
        states={[
          { label: "Current target", node: <Text size="sm">{target ?? "None: open this page with #journal"}</Text> },
          { label: "Unknown id", node: <Text size="sm" color="secondary">Ignored. The page stays where it is.</Text> },
        ]}
      >
        <Stack gap="md">
          <nav aria-label="On this page">
            <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
              {TRANSPARENCY.map((r) => (
                <a key={r.id} href={`#${r.id}`} style={{ minHeight: 44, display: "inline-flex", alignItems: "center" }}>
                  {r.title}
                </a>
              ))}
            </Stack>
          </nav>
          <Accordion type="multiple" value={open} onValueChange={setOpen}>
            {TRANSPARENCY.map((r) => (
              <AccordionItem key={r.id} id={r.id} value={r.id} trigger={r.title}>
                {r.body}
              </AccordionItem>
            ))}
          </Accordion>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
