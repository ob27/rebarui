"use client";

import { useState } from "react";
import { ActionSheet, Button, MoreIcon, Heading, List, ListItem, ListSection, SearchInput, Stack, Switch, Text, ToastProvider, TopBar, confirm } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TokenTable } from "@/components/docs/TokenTable";
import { PhoneBar, athicTabs } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { ART, BIBLE_TRANSLATIONS, DISCUSSIONS, LIBRARY_ENTRIES, PROFILE } from "@/fixtures/athic";

const CODE = `<ListSection title="Your collection" footer="Saved on this device.">
  <List variant="cards">
    <ListItem title="Why do Catholics confess to a priest?" meta="2 hours ago"
      media={<Thumb />} trailing="more" onClick={open} />
    <ListItem title="Explain today’s Gospel" meta="3 days ago" selected />
  </List>
</ListSection>

<List variant="grouped">
  <ListItem title="Plan and billing" trailing="chevron" href="/billing" />
  <ListItem title="Remind me daily" trailing={<Switch aria-label="Remind me daily" onChange={save} />} />
</List>`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "List props", rows: componentProps["List"] ?? [] },
  { type: "props-table", heading: "ListItem props", rows: componentProps["ListItem"] ?? [] },
  { type: "props-table", heading: "ListSection props", rows: componentProps["ListSection"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A real `<ul>` of `<li>` rows. The media and text area of a row is the one link or button (`href` or `onClick`); trailing controls sit beside it, never inside, so a `Switch` or a menu button is never nested in an interactive element and never triggers the row. `selected` sets `aria-current`; `loading` sets `aria-busy` and a labelled spinner; `skeleton` rows are `aria-hidden`; a disabled row has no focusable control. A `ListSection` is a labelled region named by its eyebrow.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="list" | "list-item" | "list-section"`, `data-rebar-variant` on the list and its rows, `data-rebar-title-style`, `data-rebar-selected`, `data-rebar-highlight`, `data-rebar-state="loading" | "skeleton" | "disabled"`; parts `main`, `media`, `leading`, `body`, `title`, `description`, `meta`, `chip`, `chevron`, `trailing`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Leading control, inline edit and section spacing",
    body: [
      {
        "kind": "text",
        "text": "`leadingControl` puts an independent control (a round check button) before the main area, beside the row link or button and never inside it, so pressing it does not trigger the row. For inline renaming set `editing` with a `renderEditor` that returns an `Input`: the title is replaced by the editor and the main area becomes a plain element, so the row semantics stay valid (`onEdit` fires on F2 or a double-click of the title; the app owns the value and commits on Enter or blur). Consecutive `ListSection`s are spaced by `--rebar-list-section-gap` (24px), or a section's `gap` prop."
      },
      {
        "kind": "code",
        "code": "<ListItem title={task.title} leadingControl={<CheckButton aria-label=\"Done\" />} editing={editingId === task.id} onEdit={() => setEditingId(task.id)} renderEditor={() => <Input aria-label=\"Rename\" defaultValue={task.title} onBlur={commit} />} />"
      }
    ],
  },
  {
    "type": "doc-section",
    "heading": "Panel tokens and chevronIcon",
    "body": [{ "kind": "text", "text": '`ListItem chevronIcon` swaps the chevron glyph for your own. A grouped `List` can read as a warm panel through tokens: `--rebar-list-grouped-bg / -item-bg / -border-width / -radius / -padding / -divider-width / -divider-color`; row type through `--rebar-list-item-chevron-size / -chevron-color / -meta-color`; and the `ListSection` label and footer through `--rebar-list-section-title-size / -weight / -line-height / -letter-spacing / -color / -padding` and `--rebar-list-section-footer-size / -line-height / -color / -padding`. Every default is the previous look.' }],
  },
];

const thumb = (n: number) => <span style={{ display: "block", background: ART[n] }} />;
const chev = "chevron" as const;
const ic = (d: string) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const ICONS = [ic("M4 5h16v11H8l-4 4z"), ic("M7 4h10v16l-5-4-5 4z"), ic("M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12"), ic("M12 4a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v3")];

export default function ListPage() {
  const [selected, setSelected] = useState("sick");
  const [rows, setRows] = useState(DISCUSSIONS.slice(0, 4));
  const [pending, setPending] = useState<string | null>(null);
  const [remind, setRemind] = useState(false);
  const [translation, setTranslation] = useState("dr");

  async function remove(id: string) {
    if (!(await confirm({ title: "Delete this discussion?", content: "This can’t be undone.", confirmText: "Delete", destructive: true }))) return;
    setPending(id);
    await new Promise((r) => setTimeout(r, 900));
    setRows((r) => r.filter((x) => x.id !== id));
    setPending(null);
  }
  const setReminder = (on: boolean) => new Promise<void>((resolve) => setTimeout(() => { setRemind(on); resolve(); }, 900));

  const STATES = [
          { label: "Default", node: <List><ListItem title={DISCUSSIONS[0].title} meta={DISCUSSIONS[0].when} media={thumb(0)} trailing="more" onClick={() => {}} /></List> },
          { label: "Borderless cards (--rebar-list-item-border-width)", node: <div style={{ "--rebar-list-item-border-width": "0px" } as React.CSSProperties}><List><ListItem title={DISCUSSIONS[0].title} meta={DISCUSSIONS[0].when} media={thumb(0)} onClick={() => {}} /></List></div> },
          { label: "Just added (highlight, pinned)", node: <List><ListItem title={DISCUSSIONS[4].title} meta={DISCUSSIONS[4].when} media={thumb(4)} trailing="more" highlight="new" highlightPinned onClick={() => {}} /></List> },
          { label: "Selected (open item)", node: <List><ListItem title={DISCUSSIONS[2].title} meta={DISCUSSIONS[2].when} media={thumb(2)} trailing="more" selected onClick={() => {}} /></List> },
          { label: "Busy (deleting)", node: <List><ListItem title={DISCUSSIONS[0].title} meta={DISCUSSIONS[0].when} media={thumb(0)} loading /></List> },
          { label: "Long title wraps", node: <List><ListItem title={DISCUSSIONS[1].title} meta={DISCUSSIONS[1].when} media={thumb(1)} trailing="more" onClick={() => {}} /></List> },
          { label: "Skeleton", node: <List><ListItem title="" skeleton /></List> },
          { label: "Disabled", node: <List><ListItem title={DISCUSSIONS[2].title} meta={DISCUSSIONS[2].when} media={thumb(2)} trailing="more" disabled /></List> },
          { label: "Tone fill (tone={1}), a done row", node: <List><ListItem title={DISCUSSIONS[0].title} meta={DISCUSSIONS[0].when} tone={1} onClick={() => {}} /></List> },
          { label: "Plain rows from --rebar-list-plain-gap and the clipped description", node: <div style={{ "--rebar-list-plain-gap": "2px", "--rebar-list-item-min-height": "0px", "--rebar-list-item-padding-block": "6px", "--rebar-list-item-padding-start": "4px", "--rebar-list-item-padding-end": "4px", "--rebar-list-item-title-size": "12.5px", "--rebar-list-item-body-gap": "0px", "--rebar-list-item-meta-size": "12px", "--rebar-list-item-description-white-space": "nowrap", "--rebar-list-item-description-overflow": "hidden", "--rebar-list-item-description-text-overflow": "ellipsis" } as React.CSSProperties}><List variant="plain"><ListItem title="Genesis 6:8" titleStyle="sans" description="But Noe found grace before the Lord, and all that he had in the world was kept." onClick={() => {}} /><ListItem title="Exodus 33:13" titleStyle="sans" description="If therefore I have found favour in thy sight, shew me thy face." onClick={() => {}} /></List></div> },
          { label: "focusRing=\"item\" and --rebar-list-item-pressed-opacity (native ring on the whole row when keyboard-focused; 80% when pressed)", node: <div style={{ "--rebar-list-item-pressed-opacity": "0.8" } as React.CSSProperties}><List focusRing="item"><ListItem title={DISCUSSIONS[0].title} meta={DISCUSSIONS[0].when} media={thumb(0)} href="#ring" /></List></div> },
          { label: "Thumb painted as one rounded fill (--rebar-list-item-thumb-overflow: visible, --rebar-list-item-thumb-child-radius: 14px)", node: <div style={{ "--rebar-list-item-thumb-overflow": "visible", "--rebar-list-item-thumb-child-radius": "14px" } as React.CSSProperties}><List><ListItem title={DISCUSSIONS[0].title} meta={DISCUSSIONS[0].when} media={<span style={{ display: "block", background: "var(--rebar-color-bg-secondary)" }} />} onClick={() => {}} /></List></div> },
          { label: "Trailing: chevron", node: <List variant="grouped"><ListItem title="Plan and billing" trailing={chev} href="#billing" /><ListItem title="App icon" trailing={chev} href="#icon" /></List> },
          { label: "Trailing: Switch, loading", node: <List variant="grouped"><ListItem title="Remind me daily" description="Turning on…" trailing={<Switch aria-label="Remind me daily" loading defaultChecked />} /></List> },
          { label: "Trailing: value", node: <List variant="grouped"><ListItem title="Time" trailing={<span style={{ border: "1.5px solid var(--rebar-color-border)", borderRadius: 999, padding: "8px 18px", color: "var(--rebar-color-text-primary)" }}>8:00 AM</span>} /><ListItem title="Language" trailing={<span style={{ border: "1.5px solid var(--rebar-color-border)", borderRadius: 999, padding: "8px 18px", color: "var(--rebar-color-text-primary)" }}>English</span>} /></List> },
          { label: "Leading icon tile (nav card)", node: <List><ListItem title="Your Reflections" trailing={chev} leading={{ icon: ICONS[2], tone: 1 }} href="#reflections" /><ListItem title="Indulgences" trailing={chev} leading={{ icon: ICONS[1], tone: 3 }} href="#indulgences" /></List> },
          { label: "Empty", node: <List empty={<><Heading level={3}>No discussions yet</Heading><Text size="sm" color="secondary">Ask a question and it will appear here.</Text></>} /> },
          { label: "Card rows from --rebar-list-* properties, custom moreIcon", node: <div style={{ "--rebar-list-gap": "8px", "--rebar-list-item-min-height": "0px", "--rebar-list-item-padding-block": "10px", "--rebar-list-item-padding-start": "10px", "--rebar-list-item-padding-end": "14px", "--rebar-list-item-padding-end-with-trailing": "0px", "--rebar-list-item-gap": "12px", "--rebar-list-item-thumb-size": "52px", "--rebar-list-item-thumb-align": "center", "--rebar-list-item-title-size": "17px", "--rebar-list-item-title-lines": "2", "--rebar-list-item-meta-size": "12px", "--rebar-list-item-meta-line-height": "normal", "--rebar-list-item-trailing-padding": "0 14px 0 12px", "--rebar-list-item-more-size": "30px", "--rebar-list-item-more-background": "transparent" } as React.CSSProperties}><List><ListItem title={DISCUSSIONS[0].title} meta={DISCUSSIONS[0].when} trailing="more" moreIcon={<span aria-hidden="true">…</span>} media={thumb(0)} /></List></div> },
          { label: "Compact rows on a dark scope (--rebar-list-item-background, -selected-background)", node: <div style={{ background: "var(--rebar-color-bg-inverse)", padding: 12, borderRadius: 16, "--rebar-list-gap": "6px", "--rebar-list-item-background": "rgba(253,250,245,0.06)", "--rebar-list-item-selected-background": "rgba(253,250,245,0.16)", "--rebar-list-item-selected-outline": "none", "--rebar-list-item-selected-shadow": "none", "--rebar-list-item-color": "#fdfaf5", "--rebar-list-item-meta-color": "rgba(253,250,245,0.55)", "--rebar-list-item-thumb-size": "34px" } as React.CSSProperties}><List><ListItem title={DISCUSSIONS[0].title} meta={DISCUSSIONS[0].when} selected media={thumb(0)} /><ListItem title={DISCUSSIONS[1].title} meta={DISCUSSIONS[1].when} media={thumb(1)} /></List></div> },
        ];

  return (
    <ToastProvider>
    <Stack gap="lg">
      <Heading level={1}>List</Heading>
      <Text color="secondary">One row family for phone screens: thumbnail rows, settings rows and navigation cards.</Text>

      <DemoStage
        title="List, ListItem, ListSection"
        caption="Cards and grouped variants; try a row, the switch, or Delete"
        code={CODE}
        widths={false}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: 24 }}>
          <ListSection title='variant="cards"'>
            <List aria-label="Discussions">
              {rows.map((d) => (
                <ListItem
                  key={d.id}
                  title={d.title}
                  meta={d.when}
                  media={thumb(d.art)}
                  selected={selected === d.id}
                  loading={pending === d.id}
                  onClick={() => setSelected(d.id)}
                  trailing={
                    <ActionSheet
                      title="Discussion actions"
                      trigger={<Button iconOnly variant="secondary" aria-label={`Actions for ${d.title}`}><MoreIcon /></Button>}
                      closeOnSelect={false}
                      actions={[{ label: "Save to Library" }, { label: "Delete", destructive: true, onSelect: () => remove(d.id) }]}
                    />
                  }
                />
              ))}
            </List>
          </ListSection>
          <ListSection title='variant="grouped"' footer="Used for the Bible and the Mass readings. Bible search covers the Douay-Rheims only.">
            <List variant="grouped" aria-label="Settings">
              <ListItem title="Plan and billing" trailing={chev} href="#billing" />
              <ListItem title="App icon" trailing={chev} href="#icon" />
              <ListItem title="Your Details" description="Username, photo and what Athic knows about you" trailing={chev} href="#details" />
              <ListItem title="Remind me daily" description="One notification a day; tapping it opens Today." trailing={<Switch aria-label="Remind me daily" checked={remind} onChange={setReminder} />} />
            </List>
          </ListSection>
        </div>
        <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "22px 18px" }}>
          {STATES.map((state) => (
            <div key={state.label} style={{ display: "grid", gap: 8, alignContent: "start" }}>
              <Text variant="eyebrow" tone="muted">{state.label}</Text>
              {state.node}
            </div>
          ))}
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Ask, Profile and Library" caption="Just added and busy rows, settings groups, navigation cards and skeletons" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <TidelinePhone width={320} height={560} tabBar={athicTabs("ask")} bar={<PhoneBar><TopBar leading="back" title="Ask" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 12 }}>
              <SearchInput placeholder="Search your Discussions" />
              <List>
                <ListItem title={DISCUSSIONS[4].title} meta={DISCUSSIONS[4].when} media={thumb(4)} trailing="more" highlight="new" highlightPinned />
                <ListItem title={DISCUSSIONS[0].title} meta={DISCUSSIONS[0].when} media={thumb(0)} loading />
                <ListItem title={DISCUSSIONS[2].title} meta={DISCUSSIONS[2].when} media={thumb(2)} trailing="more" onClick={() => {}} />
                <ListItem title={DISCUSSIONS[3].title} meta={DISCUSSIONS[3].when} media={thumb(3)} trailing="more" onClick={() => {}} />
              </List>
            </div>
          </TidelinePhone>
          <TidelinePhone width={320} height={560} tabBar={athicTabs("me")} bar={<PhoneBar><TopBar title="Your Profile" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 16 }}>
              <ListSection title="Account">
                <List variant="grouped">
                  <ListItem title={PROFILE.username} description={PROFILE.email} trailing={chev} href="#account" />
                  <ListItem title="Plan and billing" trailing={chev} href="#billing" />
                </List>
              </ListSection>
              <ListSection title="Bible translation" footer="Used for the Bible and the Mass readings.">
                <List variant="grouped">
                  {BIBLE_TRANSLATIONS.map((t) => (
                    <ListItem key={t.value} title={t.label} onClick={() => setTranslation(t.value)} selected={translation === t.value} trailing={<span aria-hidden="true">{translation === t.value ? "●" : "○"}</span>} />
                  ))}
                </List>
              </ListSection>
            </div>
          </TidelinePhone>
          <TidelinePhone width={320} height={640} tabBar={athicTabs("library")} bar={<PhoneBar><TopBar title="Library" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 16 }}>
              <ListSection title="Your collection">
                <List>
                  {LIBRARY_ENTRIES.map((e) => (
                    <ListItem key={e.id} title={e.label} description={e.detail} trailing={chev} leading={{ icon: ICONS[e.tone - 1], tone: e.tone }} href={`#${e.id}`} />
                  ))}
                </List>
              </ListSection>
              <ListSection title="Loading">
                <List loading />
              </ListSection>
            </div>
          </TidelinePhone>
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />

      <TokenTable component="List" />
    </Stack>
    </ToastProvider>
  );
}
