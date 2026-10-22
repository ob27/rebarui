"use client";

import { useState } from "react";
import { BottomSheet, Button, Heading, List, ListItem, SearchInput, Stack, Text, TopBar } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TokenTable } from "@/components/docs/TokenTable";
import { PhoneBar, athicTabs } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { ART, DISCUSSIONS } from "@/fixtures/athic";

const CODE = `const [query, setQuery] = useState("");
<SearchInput
  placeholder="Search your Discussions"
  value={query}
  onChange={setQuery}
  onSearch={(q) => runSearch(q)}
/>

// in a sheet, with Cancel
<SearchInput variant="flat" onCancel={close} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["SearchInput"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A `role="search"` landmark around an `<input type="search">` named `Search` (override with `aria-label`). Enter runs `onSearch` and the soft keyboard shows a Search key. The clear and Cancel buttons are real buttons (the clear target is padded to 44px); Escape clears the text. The loading spinner is a labelled status.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="search-input"`, `data-rebar-variant="pill" | "flat"`, `data-rebar-size`, `data-rebar-focused`, `data-rebar-disabled`; parts `field`, `icon`, `input`, `spinner`, `clear`, `cancel`.' }],
  },
];

const thumb = (n: number) => <span style={{ display: "block", background: ART[n] }} />;

export default function SearchInputPage() {
  const [q, setQ] = useState("pray");
  const [q2, setQ2] = useState("purgatory");
  const [sheetQ, setSheetQ] = useState("");
  const [open, setOpen] = useState(false);
  const matches = DISCUSSIONS.filter((d) => d.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <Stack gap="lg">
      <Heading level={1}>SearchInput</Heading>
      <Text color="secondary">A pill search field with icon, clear and Cancel. Filters a list or lives in a sheet.</Text>

      <DemoStage
        title="SearchInput"
        caption="onChange filters as you type, onSearch on Enter"
        code={CODE}
        widths={false}
        states={[
          { label: "Empty", node: <SearchInput placeholder="Search your Discussions" /> },
          { label: "Value", node: <SearchInput defaultValue="Confession" /> },
          { label: "Loading", node: <SearchInput defaultValue="Rosary" loading /> },
          { label: "Flat (in a sheet)", node: <SearchInput variant="flat" placeholder="Search discussions" /> },
          { label: "Large", node: <SearchInput size="lg" placeholder="Search the Library" /> },
          { label: "Disabled", node: <SearchInput disabled placeholder="Search your Discussions" /> },
          { label: "With Cancel (focus the field)", node: <SearchInput placeholder="Mass" onCancel={() => {}} /> },
        ]}
      >
        <div style={{ maxWidth: 420, margin: "0 auto", display: "grid", gap: 14 }}>
          <SearchInput placeholder="Search your Discussions" value={q} onChange={setQ} />
          <Text size="sm" color="secondary">
            {matches.length} of {DISCUSSIONS.length} discussions
          </Text>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Filtering, no matches, in a sheet" caption="The list narrows as you type; the sheet search is flat" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <TidelinePhone width={320} height={520} tabBar={athicTabs("ask")} bar={<PhoneBar><TopBar leading="back" title="Ask" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 12 }}>
              <SearchInput placeholder="Search your Discussions" value={q} onChange={setQ} />
              <List>
                {matches.map((d) => (
                  <ListItem key={d.id} title={d.title} meta={d.when} media={thumb(d.art)} trailing="more" onClick={() => {}} />
                ))}
              </List>
              {matches.length === 0 ? <Text color="secondary" style={{ textAlign: "center" }}>No matches. Try a shorter word.</Text> : null}
            </div>
          </TidelinePhone>
          <TidelinePhone width={320} height={520} tabBar={athicTabs("ask")} bar={<PhoneBar><TopBar leading="back" title="Topics" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 12 }}>
              <SearchInput value={q2} onChange={setQ2} />
              {q2 ? (
                <div style={{ display: "grid", gap: 8, justifyItems: "center", textAlign: "center", padding: "34px 12px" }}>
                  <Heading level={3}>No matches</Heading>
                  <Text size="sm" color="secondary">Nothing in your Discussions mentions “{q2}”. Try a shorter word.</Text>
                </div>
              ) : null}
            </div>
          </TidelinePhone>
        </Stack>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
          <BottomSheet open={open} onOpenChange={setOpen} title="Add to topic" trigger={<Button variant="secondary">Open the sheet</Button>}>
            <Stack gap="md">
              <SearchInput variant="flat" placeholder="Search discussions" value={sheetQ} onChange={setSheetQ} onCancel={() => setOpen(false)} />
              <List variant="grouped">
                {DISCUSSIONS.filter((d) => d.title.toLowerCase().includes(sheetQ.toLowerCase())).slice(0, 3).map((d) => (
                  <ListItem key={d.id} title={d.title} description={d.when} onClick={() => setOpen(false)} />
                ))}
              </List>
            </Stack>
          </BottomSheet>
        </div>
      </DemoStage>

            <Heading level={2}>Custom glyphs</Heading>
      <DemoStage title="icon and clearIcon" caption="Swap the glyphs; height, border, radius, fill, focus and clear-button size are --rebar-search-input-* tokens." widths={false}
        code={`<SearchInput icon={<MyGlyph />} clearIcon={<MyClear />} defaultValue="grace" />`}>
        <SearchInput aria-label="Search" defaultValue="grace" icon={<span aria-hidden="true">⌕</span>} clearIcon={<span aria-hidden="true">✕</span>} />
      </DemoStage>
      <NextBlockRenderer blocks={BLOCKS} />
      <TokenTable component="SearchInput" />
    </Stack>
  );
}
