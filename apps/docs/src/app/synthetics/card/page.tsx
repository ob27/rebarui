import type { CSSProperties } from "react";
import { AvatarGroup, Button, Card, Heading, Skeleton, Stack, Tag, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TokenTable } from "@/components/docs/TokenTable";
import { CardMobile } from "./CardMobile";
import { KPIS, PROJECTS, STATUS_TONE, avatarsOf, project } from "@/fixtures/tideline";

const CODE = `<Card cover={<div className="cover cover-brand" />}>
  <Stack gap="xs">
    <Text size="xs" color="secondary" style={KICKER}>{harbour.kicker}</Text>
    <Heading level={3}>{harbour.name}</Heading>
    <Text size="sm" color="secondary">{harbour.summary}</Text>
    <Stack direction="row" justify="between" align="center">
      <AvatarGroup size="sm" avatars={avatarsOf(["maya", "jonas", "priya"])} />
      <Tag tone="success">{harbour.status}</Tag>
    </Stack>
  </Stack>
</Card>`;

const KICKER: CSSProperties = {
  fontSize: "0.68rem",
  fontWeight: "var(--rebar-font-weight-semibold)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const GRID: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 };

/** Who is on each project, owner first. */
const CREW: Record<string, string[]> = { harbour: ["maya", "jonas", "priya"], mobile: ["jonas", "maya"], interviews: ["priya"] };
const DEFAULT_COVER = { className: "cs-grain", background: "var(--rebar-color-tint-1)" };
const COVER: Record<string, { className?: string; background: string }> = {
  harbour: DEFAULT_COVER,
  mobile: { background: "var(--rebar-color-tint-4)" },
  interviews: { className: "cs-grain cs-grain--sand", background: "var(--rebar-color-tint-3)" },
};

function Cover({ id }: { id: string }) {
  const c = COVER[id] ?? DEFAULT_COVER;
  return <div className={c.className} aria-hidden="true" style={{ height: 120, borderRadius: 0, backgroundColor: c.background }} />;
}

function ProjectCard({ id }: { id: string }) {
  const p = project(id);
  return (
    <Card cover={<Cover id={id} />}>
      <Stack gap="xs">
        <Text size="xs" color="secondary" style={KICKER}>
          {p.kicker}
        </Text>
        <Heading level={3}>{p.name}</Heading>
        <Text size="sm" color="secondary">
          {p.summary}
        </Text>
        <Stack direction="row" justify="between" align="center" style={{ marginTop: 8 }}>
          <AvatarGroup size="sm" avatars={avatarsOf(CREW[id] ?? [p.owner])} />
          <Tag tone={STATUS_TONE[p.status]}>{p.status}</Tag>
        </Stack>
      </Stack>
    </Card>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Card"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: 'A plain `<div>`: a visual grouping, not an interactive or landmark role. `aria-*` and `data-*` props pass through to the root, so add `role="article"` (or whatever the context calls for) yourself.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="card"` on the root; `data-rebar-part` is `"corner-badge"`, `"cover"`, `"header"`, `"avatar"`, `"title"`, `"subtitle"`, `"extra"`, `"labels"`, `"body"`, `"footer"`, `"actions"` or `"action"` (per item). Only the parts in use render.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "`cover`, `title`, `extra` and `actions` match AntD's `Card` props directly. `avatar` moves inside `Card.Meta`. `labels`, `footer` and `titleLines` have no AntD equivalent (recompose by hand; a CSS `line-clamp` for the title). `cornerBadge` maps to `Badge.Ribbon` wrapping the card.",
      },
    ],
  },
];

export default function CardPage() {
  const signage = project("signage");
  return (
    <Stack gap="lg">
      <Heading level={1}>Card</Heading>
      <Text color="secondary">A surface for one thing.</Text>

      <DemoStage
        title="Project cards"
        caption="Media, kicker, title, meta"
        code={CODE}
        states={[
          {
            label: "Empty",
            node: (
              <Card>
                <Stack gap="sm" align="center" style={{ textAlign: "center" }}>
                  <Heading level={3}>No projects yet</Heading>
                  <Text size="sm" color="secondary">
                    Start with a template.
                  </Text>
                  <Button size="sm">New project</Button>
                </Stack>
              </Card>
            ),
          },
          {
            label: "Loading",
            node: (
              <Card>
                <Skeleton lines={3} />
              </Card>
            ),
          },
          {
            label: "Long title",
            node: (
              <Card>
                <Heading level={3}>Quarterly crew wellbeing and rota review for the northern depots</Heading>
              </Card>
            ),
          },
          {
            label: "Selected",
            node: (
              <Card aria-selected="true" style={{ borderColor: "var(--rebar-color-primary)", boxShadow: "0 0 0 1px var(--rebar-color-primary)" }}>
                <Heading level={3}>{project("harbour").name}</Heading>
              </Card>
            ),
          },
          {
            label: "Slots",
            node: (
              <Card
                title={signage.name}
                subtitle={`Due ${signage.due}`}
                actions={[
                  <Button key="open" variant="tertiary" size="sm">
                    Open
                  </Button>,
                  <Button key="share" variant="tertiary" size="sm">
                    Share
                  </Button>,
                ]}
              >
                <Text size="sm" color="secondary">
                  {signage.summary}
                </Text>
              </Card>
            ),
          },
          {
            label: "Hub tile (orientation=\"tile\")",
            node: (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Card orientation="tile" tone={1} href="#reflections" cover={<span aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.7)" }}>✎</span>} title="Reflections" subtitle="Your notes and prayers" />
                <Card orientation="tile" tone={3} href="#perspectives" cover={<span aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.7)" }}>◉</span>} title="Perspectives" subtitle="Essays and letters" />
              </div>
            ),
          },
          {
            label: "Feature card (orientation=\"feature\"): framed square cover, pill kicker, title, body",
            node: (
              <div style={{ maxWidth: 320 }}>
                <Card orientation="feature" href="#feature" cover={<span style={{ display: "block", width: "100%", height: "100%" }} />} eyebrow="Charism" title="A title that may wrap onto a second line">
                  <Text size="sm" color="secondary">A short excerpt of the body.</Text>
                </Card>
              </div>
            ),
          },
          {
            label: "Feature card coverFrame=\"media\": the border and radius belong to the image itself",
            node: (
              <div style={{ maxWidth: 320 }}>
                <Card orientation="feature" coverFrame="media" href="#feature-media" cover={<span style={{ display: "block", width: "100%", height: "100%", background: "linear-gradient(135deg, #8b97b5, #8ec9b4)" }} />} eyebrow="Grace" title="Border and radius on the image">
                  <Text size="sm" color="secondary">The corner is one anti-aliased edge, like a bordered picture.</Text>
                </Card>
              </div>
            ),
          },
          {
            label: "Feature card coverFrame=\"clip\": the frame clips, the image wrapper adds no radius, clip or fill",
            node: (
              <div style={{ maxWidth: 320 }}>
                <Card orientation="feature" coverFrame="clip" href="#feature-clip" cover={<span style={{ display: "block", width: "100%", height: "100%", background: "linear-gradient(135deg, #8b97b5, #8ec9b4)" }} />} eyebrow="Prayer" title="One rounded clip over a plain fill">
                  <Text size="sm" color="secondary">Border, radius and clip stay on the frame.</Text>
                </Card>
              </div>
            ),
          },
          {
            label: "Promo card with slot rows (--rebar-card-promo-header-row: 2, --rebar-card-promo-body-row: 3)",
            node: (
              <div style={{ maxWidth: 380, "--rebar-card-promo-header-row": "2", "--rebar-card-promo-body-row": "3" } as React.CSSProperties}>
                <Card promo href="#promo" cover={<span style={{ display: "block", width: "100%", height: "100%", background: "linear-gradient(135deg, #b8a7d9, #f2c4a8)" }} />} title="Upgrade to Plus">
                  5,000 tokens/month
                </Card>
              </div>
            ),
          },
          {
            label: "Border width, surface and eyebrow type from properties (--rebar-card-border-width, --rebar-card-background, --rebar-eyebrow-*)",
            node: (
              <div style={{ "--rebar-card-border-width": "0px", "--rebar-card-background": "var(--rebar-color-bg-secondary)", "--rebar-eyebrow-size": "11.5px", "--rebar-eyebrow-letter-spacing": "0.14em", "--rebar-eyebrow-line-height": "normal" } as React.CSSProperties}>
                <Card eyebrow="No border, warm surface"><Text>Body</Text></Card>
              </div>
            ),
          },
          {
            label: "Flat panel from the tone tokens (--rebar-card-tone-bg, --rebar-card-tone-border-width)",
            node: (
              <div style={{ "--rebar-card-tone-bg": "var(--rebar-color-bg-secondary)", "--rebar-card-tone-border-width": "0px" } as React.CSSProperties}>
                <Card tone={2}><Text>A plenary indulgence for the Rosary prayed in a church or family.</Text></Card>
              </div>
            ),
          },
          {
            label: "Panel from --rebar-card-* properties (26px radius, 20px padding)",
            node: (
              <div style={{ "--rebar-card-radius": "26px", "--rebar-card-header-padding": "20px 20px 10px", "--rebar-card-body-padding": "20px", "--rebar-card-body-padding-top": "0px", "--rebar-card-eyebrow-gap": "0px" } as React.CSSProperties}>
                <Card tone={1} eyebrow="Today's Mass readings"><Text>First Reading — Ephesians 1:15-23</Text></Card>
              </div>
            ),
          },
        ]}
      >
        <div style={GRID}>
          {PROJECTS.slice(0, 3).map((p) => (
            <ProjectCard key={p.id} id={p.id} />
          ))}
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="KPI row" caption="Three numbers, one card each">
        <div style={GRID}>
          {KPIS.map((k) => (
            <Card key={k.label}>
              <Stack gap="xs">
                <Text size="xs" color="secondary" style={KICKER}>
                  {k.label}
                </Text>
                <span style={{ fontFamily: "var(--rebar-font-family-display)", fontSize: "var(--rebar-font-size-2xl)", fontWeight: "var(--rebar-font-weight-semibold)", lineHeight: 1.1 }}>
                  {k.value}
                </span>
                <Text size="sm" color="secondary">
                  {k.delta}
                </Text>
              </Stack>
            </Card>
          ))}
        </div>
      </DemoStage>

      <CardMobile />
      <NextBlockRenderer blocks={BLOCKS} />
      <TokenTable component="Card" />
    </Stack>
  );
}
