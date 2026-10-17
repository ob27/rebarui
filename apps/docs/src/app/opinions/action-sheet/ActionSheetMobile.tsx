"use client";

import { useState } from "react";
import { ActionSheet, Button, MoreIcon, Heading, List, ListItem, Stack, Text, TopBar } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { PhoneBar, athicTabs } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { ART, DISCUSSIONS } from "@/fixtures/athic";

const CODE = `<ActionSheet
  title="Discussion actions"
  trigger={<Button iconOnly variant="secondary" aria-label="Actions"><MoreIcon /></Button>}
  items={[
    { type: "info", label: "Saved to Library 14 October" },
    { label: "Open in browser", href: "https://athic.example/d/42", target: "_blank" },
    { label: "Generate a recording", onSelect: () => generate() },   // a promise: the row shows a spinner
    { type: "divider" },
    { label: "Download audio", disabled: true, hint: "Plus" },
    { label: "Delete", destructive: true, onSelect: confirmDelete },
  ]}
/>`;

const ic = (d: string) => (
  <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const MORE = <MoreIcon />;
const SAVE = ic("M7 4h10v16l-5-4-5 4z");
const EDIT = ic("M4 20h4L19 9l-4-4L4 16zM13 7l4 4");
const TRASH = ic("M5 7h14M10 4h4M7 7l1 13h8l1-13");
const GLOBE = ic("M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18");
const SHARE = ic("M12 3v12M8 7l4-4 4 4M5 13v6h14v-6");

const trigger = (label: string) => <Button iconOnly variant="secondary" aria-label={label}>{MORE}</Button>;

export function ActionSheetMobile() {
  const [rows, setRows] = useState(DISCUSSIONS.slice(0, 3));
  return (
    <>
      <Heading level={2}>Info, divider, link, loading</Heading>
      <DemoStage
        title="ActionSheet extras"
        caption="A static info row, a divider, a link row, a loading row, danger and disabled"
        code={CODE}
        widths={false}
        states={[
          { label: "Static info row", node: <ActionSheet title="Actions" defaultOpen={false} trigger={<Button variant="secondary" size="sm">Open: info row</Button>} items={[{ type: "info", label: "Saved to Library 14 October" }, { label: "Rename", icon: EDIT }]} /> },
          { label: "Loading item", node: <ActionSheet title="Actions" trigger={<Button variant="secondary" size="sm">Open: loading item</Button>} items={[{ label: "Generating recording…", loading: true }, { label: "Rename", icon: EDIT }]} /> },
          { label: "Danger and disabled", node: <ActionSheet title="Actions" trigger={<Button variant="secondary" size="sm">Open: danger, disabled</Button>} items={[{ label: "Delete", icon: TRASH, destructive: true }, { label: "Download audio", icon: SHARE, disabled: true, hint: "Plus" }]} /> },
        ]}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <ActionSheet
            title="Discussion actions"
            trigger={<Button variant="secondary">Open the sheet</Button>}
            items={[
              { type: "info", label: "Saved to Library 14 October" },
              { label: "Save a copy to a Topic", icon: SAVE },
              { label: "Open in browser", icon: GLOBE, href: "https://example.com", target: "_blank" },
              { label: "Generate a recording", icon: SHARE, onSelect: () => new Promise<void>((r) => setTimeout(r, 1400)) },
              { type: "divider", label: "" },
              { label: "Delete", icon: TRASH, destructive: true },
            ]}
          />
        </div>
      </DemoStage>
      <DemoStage title="Row menu and article menu" caption="In context: the ••• button opens the sheet" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <TidelinePhone width={300} height={440} tabBar={athicTabs("ask")} bar={<PhoneBar><TopBar leading="back" title="Ask" /></PhoneBar>}>
            <List>
              {rows.map((d) => (
                <ListItem
                  key={d.id}
                  title={d.title}
                  meta={d.when}
                  media={<span style={{ display: "block", background: ART[d.art] }} />}
                  trailing={<ActionSheet title="Discussion actions" trigger={trigger(`Actions for ${d.title}`)} items={[{ label: "Save to Library", icon: SAVE }, { label: "Rename", icon: EDIT }, { label: "Open in browser", icon: GLOBE, href: "https://example.com", target: "_blank" }, { type: "divider", label: "" }, { label: "Delete", icon: TRASH, destructive: true, onSelect: () => setRows((r) => r.filter((x) => x.id !== d.id)) }]} />}
                />
              ))}
            </List>
            {rows.length === 0 ? <Text color="secondary">All gone. Reload the page to bring them back.</Text> : null}
          </TidelinePhone>
        </Stack>
      </DemoStage>
    </>
  );
}
