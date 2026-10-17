"use client";

import { Avatar, Heading, PageHeader, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { ART_BLUE, ART_CRIMSON, athicArt } from "@/fixtures/athic-marketing";

const CODE = `<PageHeader kicker="Perspectives" title="Reflections worth sitting with." lede="Essays, dialogues and letters on the Faith." />

<PageHeader
  align="start"
  breadcrumbs={[{ label: "Athic", href: "/" }, { label: "Perspectives", href: "/perspectives" }, { label: "Ethics" }]}
  title="To Be Sorted At The Harvest"
  lede="What the parable of the wheat and the weeds asks of us now."
  meta={<>Athic team · 12 Oct 2026 · 6 min read</>}
/>

<PageHeader kicker="Dialogues" title="Motherhood" lede="…" cover={artUrl} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["PageHeader"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      { kind: "text", text: "Renders a `<header>` with the page's `<h1>`. Breadcrumbs are the real `Breadcrumb` (a `nav` landmark named \"Breadcrumb\", the last item `aria-current=\"page\"`) with 44px targets. A cover is decorative and sits under a bottom scrim so the inverse title keeps contrast on any art." },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="page-header"` with `data-rebar-align`, `data-rebar-max-width` and `data-rebar-cover`. Parts: `cover`, `body`, `kicker`, `title`, `lede`, `meta`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Ant Design's `PageHeader` (`title`, `subTitle`, `breadcrumb`) maps to `title`, `lede`, `breadcrumbs`; there is no kicker, meta or cover prop." }],
  },
];

const byline = (
  <>
    <Avatar size="sm" fallback="AT" alt="Athic team" />
    <span>Athic team</span>
    <span aria-hidden="true">·</span>
    <span>12 Oct 2026</span>
    <span aria-hidden="true">·</span>
    <span>6 min read</span>
  </>
);
const crumbs = [{ label: "Athic", href: "#" }, { label: "Perspectives", href: "#" }, { label: "Ethics" }];

export default function PageHeaderPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>PageHeader</Heading>
      <Text color="secondary">The one h1 on a page: kicker, title and lede, with optional breadcrumbs, byline or cover.</Text>

      <DemoStage
        title="Header variants"
        caption="Centred, with breadcrumbs and byline, with cover"
        code={CODE}
      >
        <Stack gap="lg">
          <PageHeader kicker="Perspectives" title="Reflections worth sitting with." lede="Essays, dialogues and letters on the Faith, from the Athic team." />
          <PageHeader
            align="start"
            breadcrumbs={crumbs}
            title="To Be Sorted At The Harvest"
            lede="What the parable of the wheat and the weeds asks of us now."
            meta={byline}
            maxWidth="lg"
          />
          <PageHeader kicker="Dialogues" title="Motherhood" lede="A conversation about a mother, a doubt and a lighted window." cover={athicArt("dusk", ART_CRIMSON)} />
        </Stack>
      </DemoStage>

      <DemoStage title="Small variants" caption="Kicker only, start-aligned, long title" widths={false}>
        <Stack gap="md">
          <PageHeader kicker="Contact" title="Get in touch" style={{ padding: 0 }} />
          <PageHeader align="start" kicker="Mission" title="Why Athic exists" lede="Independent, and honest about it." style={{ padding: 0 }} />
          <PageHeader kicker="Letters" title="On the Perils of Conscience and the Quiet Work of Examination" style={{ padding: 0 }} />
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Article header on a phone" caption="Breadcrumbs, title, lede, byline, then the cover art" defaultWidth="phone" widths>
        <Stack gap="md">
          <PageHeader align="start" breadcrumbs={crumbs} title="To Be Sorted At The Harvest" lede="What the parable of the wheat and the weeds asks of us now." meta={byline} />
          <img src={athicArt("hills", ART_BLUE)} alt="" style={{ display: "block", width: "100%", height: 190, objectFit: "cover", borderRadius: 22 }} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
