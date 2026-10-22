"use client";

import { useState } from "react";
import { Button, Heading, ReadingView, Stack, Text, WaveformAudioPlayer } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TokenTable } from "@/components/docs/TokenTable";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { BIBLE_CREDIT, GALATIANS_3, MASS_DAY, MASS_FIRST_READING, MASS_FIRST_READING_CITATION } from "@/fixtures/athic-mobile";

const CODE = `<ReadingView title="Galatians 3" verses={verses} highlight={2}
  onVerseAction={(v) => addNote(v.num)} notedVerses={[1]} footer="Douay-Rheims translation (Challoner Revision)." />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["ReadingView"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'An `<article>` with the title as an `h2`. Verse numbers are `<sup>` text beside the verse, and each verse pill is a button named "Add Note, verse 2" (or "Note added, verse 1"), 44px tall. The error block is `role="alert"`; `loading` sets `aria-busy` with a "Loading reading" label.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="reading-view"`, `data-rebar-tone="tint-1".."tint-4" | "plain"`, `data-rebar-state="loading" | "error"`. Parts: `title`, `panel`, `citation`, `media`, `verses`, `verse` (`data-rebar-highlighted`, `data-rebar-noted`), `verse-number`, `verse-action`, `body`, `actions`, `footer`, `loading`, `empty`, `error`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Opt-in properties for a classic reading panel",
    body: [
      {
        kind: "text",
        text: "`loadingLabel` shows a text message (for example \"Loading…\") instead of the skeleton lines. `verseActions=\"below\"` puts each verse's action pill and `extra` slot on a row of their own under the number and the text, offset by `--rebar-reading-view-pill-margin-start`. Every other value is a custom property whose fallback is the previous look: `--rebar-reading-view-panel-gap`, `-citation-size/-weight/-tracking/-color`, `-message-padding/-align/-size/-style`, `-footer-size`, `-radius`, `-padding`, `-verses-gap`, `-verse-columns/-gap/-padding/-margin/-radius`, `-highlight-padding/-background`, `-num-size/-weight/-line-height/-margin-top`, `-body-size/-line-height/-max-width`, and `-pill-min-height/-padding/-background/-color/-done-color/-radius/-size/-decoration/-margin-top`.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "No equivalent. Use `Typography.Paragraph` inside a `Card` with a tinted background; the verse numbering and per-verse actions are the part to keep." }],
  },
  {
    type: "doc-section",
    heading: "Custom verse rows, extra slot and verse font",
    body: [
      {
        "kind": "text",
        "text": "A verse may carry `extra`, rendered under its text and pill inside the same row (an inline note composer). `renderVerse(verse, { highlighted, noted, content })` replaces what follows the verse number (the number, highlight and noted marks stay); `content` is the default text, pill and extra to wrap. `verseFont=\"sans\"` switches the verse text from the theme serif to the sans face."
      },
      {
        "kind": "code",
        "code": "<ReadingView verses={[{ num: 1, text: \"In the beginning\", extra: <NoteComposer /> }]} verseFont=\"sans\" />"
      }
    ],
  },
];

const pill = { minHeight: 44 } as const;

const CLASSIC_TOKENS = {
  "--rebar-reading-view-panel-gap": "10px",
  "--rebar-reading-view-citation-size": "11.5px",
  "--rebar-reading-view-citation-weight": "700",
  "--rebar-reading-view-citation-tracking": "0.14em",
  "--rebar-reading-view-citation-color": "var(--rebar-color-primary-text-ink)",
  "--rebar-reading-view-message-padding": "0",
  "--rebar-reading-view-message-align": "left",
  "--rebar-reading-view-message-size": "13px",
  "--rebar-reading-view-message-style": "italic",
  "--rebar-reading-view-verses-gap": "10px",
  "--rebar-reading-view-verse-columns": "auto 1fr",
  "--rebar-reading-view-verse-gap": "8px",
  "--rebar-reading-view-verse-padding": "0",
  "--rebar-reading-view-verse-margin": "0",
  "--rebar-reading-view-num-size": "10.8333px",
  "--rebar-reading-view-num-weight": "700",
  "--rebar-reading-view-num-line-height": "normal",
  "--rebar-reading-view-num-margin-top": "4px",
  "--rebar-reading-view-body-size": "14.5px",
  "--rebar-reading-view-body-line-height": "1.65",
  "--rebar-reading-view-body-max-width": "none",
  "--rebar-reading-view-pill-min-height": "0px",
  "--rebar-reading-view-pill-padding": "2px 10px",
  "--rebar-reading-view-pill-background": "var(--rebar-color-tint-3)",
  "--rebar-reading-view-pill-color": "var(--rebar-color-text-primary)",
  "--rebar-reading-view-pill-radius": "999px",
  "--rebar-reading-view-pill-size": "12px",
  "--rebar-reading-view-pill-decoration": "none",
  "--rebar-reading-view-pill-margin-start": "20px",
  "--rebar-reading-view-pill-margin-top": "4px",
} as React.CSSProperties;

function ClassicReading() {
  return (
    <div style={{ ...CLASSIC_TOKENS, display: "grid", gap: 16 }}>
      <ReadingView tone="plain" citation={MASS_FIRST_READING_CITATION} empty="Not available inline: look this citation up in your own Bible or an approved online edition." />
      <ReadingView tone="plain" verseFont="sans" verseActions="below" verses={GALATIANS_3} onVerseAction={() => {}} />
    </div>
  );
}

function Mass({ saved }: { saved?: boolean }) {
  return (
    <ReadingView
      citation={MASS_FIRST_READING_CITATION}
      media={<WaveformAudioPlayer src="/narration-first-reading.mp3" aria-label="Narration, first reading" barCount={24} skipSeconds={0} trailingAction={<Button size="sm" variant="tertiary" aria-label={saved ? "Saved" : "Save to Library"}>{saved ? "Saved" : "Save"}</Button>} />}
      actions={
        <>
          <Button size="sm" variant="secondary" style={pill}>Reflect on this reading</Button>
          <Button size="sm" variant="secondary" style={pill}>Share</Button>
          <Button size="sm" variant="secondary" style={pill}>Discuss this reading</Button>
        </>
      }
    >
      {MASS_FIRST_READING}
    </ReadingView>
  );
}

export default function ReadingViewPage() {
  const [noted, setNoted] = useState<number[]>([1]);
  return (
    <Stack gap="lg">
      <Heading level={1}>ReadingView</Heading>
      <Text color="secondary">A reading panel for Scripture and Mass readings: optional narration bar, numbered verses or free text, an actions row and a credit.</Text>

      <DemoStage
        title="Bible chapter"
        caption="Verse 2 is highlighted; Add Note turns the pill into Note added"
        code={CODE}
        states={[
          { label: "Loading", node: <ReadingView title="Galatians 3" loading /> },
          { label: "Translation unavailable", node: <ReadingView title="Galatians 3" error={<Stack gap="sm" align="center"><b>Translation unavailable</b><span>The Douay-Rheims text isn’t downloaded. Connect once to fetch it.</span><Button size="sm" variant="secondary">Try again</Button></Stack>} /> },
          { label: "No reading", node: <ReadingView citation="Oct 11" empty="The missal hasn’t published Oct 11 yet. Try another day." /> },
          { label: "Loading with a label (loadingLabel)", node: <ReadingView tone="plain" citation={MASS_FIRST_READING_CITATION} loading loadingLabel="Loading…" /> },
          { label: "Classic reading panel from --rebar-reading-view-* properties (kicker, italic note, verseActions=\"below\", chip pill)", node: <ClassicReading /> },
          { label: "Plain tone", node: <ReadingView tone="plain" citation={MASS_FIRST_READING_CITATION}>{MASS_FIRST_READING.slice(0, 120)}…</ReadingView> },
        ]}
      >
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <ReadingView
            title="Galatians 3"
            verses={GALATIANS_3}
            highlight={2}
            onVerseAction={(v) => setNoted((n) => (n.includes(v.num) ? n : [...n, v.num]))}
            notedVerses={noted}
            footer={BIBLE_CREDIT}
          />
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Today’s Missal" caption="A Mass reading with narration, saved to the Library" widths={false}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <TidelinePhone title="Today’s Missal" height={560} tabs={false}>
            <Heading level={2} style={{ fontSize: 20, marginBottom: 12 }}>{MASS_DAY}</Heading>
            <Mass />
          </TidelinePhone>
          <TidelinePhone title="Bible" height={560}>
            <ReadingView title="Galatians 3" verses={GALATIANS_3} highlight={[2, 3]} footer={BIBLE_CREDIT} actions={<Button size="sm" variant="secondary" style={pill}>Reflect on this chapter</Button>} />
          </TidelinePhone>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />

      <TokenTable component="ReadingView" />
    </Stack>
  );
}
