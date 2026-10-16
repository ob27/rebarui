import { Avatar, AvatarGroup, Badge, Card, Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PEOPLE, avatarOf, avatarsOf } from "@/fixtures/tideline";

// Must match `AVATAR_PLACEHOLDERS.length` in packages/core/src/assets/avatarPlaceholders.ts (kept internal, so not imported).
const PORTRAIT_COUNT = 96;

const CODE = `<Avatar alt="Maya Chen" fallback="MC" placeholder={1} size="lg" />
<Avatar alt="Jonas Weber" fallback="JW" placeholder={2} />
<Avatar alt="Priya Nair" fallback="PN" placeholder={3} size="sm" />
<Avatar fallback="LS" />`;

/** basilika gives Avatar the page's secondary background, which is also the stage's, so tint each person's circle. */
const TINT: Record<string, string> = { maya: "var(--rebar-color-tint-3)", jonas: "var(--rebar-color-tint-1)", priya: "var(--rebar-color-tint-2)", leo: "var(--rebar-color-tint-4)" };
const tinted = (id: string) => ({ ...avatarOf(id), style: { background: TINT[id] } });

const PRESENCE: Record<string, { label: string; tone: "success" | "error" | "warning" }> = {
  maya: { label: "Online", tone: "success" },
  jonas: { label: "In a meeting", tone: "error" },
  priya: { label: "Away", tone: "warning" },
  leo: { label: "Online", tone: "success" },
};

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Avatar"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "The initials are real text in the DOM, read even when no image loads. Pass a meaningful `alt` with a real `src`; with only `fallback` or `placeholder` the image is decorative and `alt` stays empty.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="avatar"`, `data-rebar-size`; `data-rebar-part="fallback"` on the initials.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered: AntD's `Avatar` takes fallback content as `children`, not a `fallback` prop, and has no illustrated `placeholder`, so a placeholder avatar needs a real `src` or plain initials.",
      },
    ],
  },
];

export default function AvatarPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Avatar</Heading>
      <Text color="secondary">A person, as initials or a portrait.</Text>

      <DemoStage
        title="Avatar"
        caption="Portraits, initials, three sizes"
        code={CODE}
        states={[
          {
            label: "Initials",
            node: (
              <Stack direction="row" gap="sm">
                {PEOPLE.map((p) => (
                  <Avatar key={p.id} alt={p.name} fallback={p.initials} style={{ background: TINT[p.id] }} />
                ))}
              </Stack>
            ),
          },
          {
            label: "Sizes",
            node: (
              <Stack direction="row" gap="sm" align="center">
                <Avatar {...tinted("maya")} size="sm" />
                <Avatar {...tinted("maya")} />
                <Avatar {...tinted("maya")} size="lg" />
              </Stack>
            ),
          },
          { label: "Group", node: <AvatarGroup avatars={avatarsOf(PEOPLE.map((p) => p.id))} /> },
          { label: "Overflow", node: <AvatarGroup max={3} avatars={avatarsOf([...PEOPLE.map((p) => p.id), "maya", "jonas"])} /> },
          {
            label: "Presence",
            node: (
              <div>
                <Badge dot tone="success">
                  <Avatar {...tinted("maya")} />
                </Badge>
              </div>
            ),
          },
          { label: "Fallback", node: <Avatar fallback="?" alt="Unknown" style={{ background: "var(--rebar-color-tint-2)" }} /> },
        ]}
      >
        <Stack direction="row" gap="lg" align="center" justify="center" style={{ flexWrap: "wrap" }}>
          {PEOPLE.map((p) => (
            <Stack key={p.id} gap="xs" align="center">
              <Avatar {...tinted(p.id)} size="lg" />
              <Text size="xs" color="secondary">
                {p.name}
              </Text>
            </Stack>
          ))}
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Crew list" caption="Portrait, name, role and presence">
        <Card style={{ maxWidth: 480, margin: "0 auto" }}>
          <Stack gap="md">
            {PEOPLE.map((p, i) => {
              const presence = PRESENCE[p.id] ?? PRESENCE.maya!;
              return (
                <Stack key={p.id} direction="row" gap="sm" align="center" style={{ paddingTop: i ? 16 : 0, borderTop: i ? "1px solid var(--rebar-color-border)" : undefined }}>
                  <Badge dot tone={presence.tone}>
                    <Avatar {...tinted(p.id)} />
                  </Badge>
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text as="span" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
                      {p.name}
                    </Text>
                    <Text as="span" size="sm" color="secondary">
                      {p.role}
                    </Text>
                  </Stack>
                  <Text as="span" size="sm" color="secondary">
                    {presence.label}
                  </Text>
                </Stack>
              );
            })}
          </Stack>
        </Card>
      </DemoStage>

      <DemoStage title="All portraits" caption={`${PORTRAIT_COUNT} built-in portraits; placeholder={n} picks one, placeholder picks by name`} widths={false}>
        <Stack direction="row" gap="sm" style={{ flexWrap: "wrap", justifyContent: "center" }} aria-label="All illustrated portraits">
          {Array.from({ length: PORTRAIT_COUNT }, (_, i) => (
            <Avatar key={i} fallback={String(i)} alt={`Portrait ${i}`} placeholder={i} />
          ))}
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
