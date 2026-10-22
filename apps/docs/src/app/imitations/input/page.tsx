import type { ReactNode } from "react";
import { Button, Card, Heading, Input, Stack, Text } from "rebar-ui";
import type { CSSProperties } from "react";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { TokenTable } from "@/components/docs/TokenTable";
import { InputMobile } from "./InputMobile";
import { person, project } from "@/fixtures/tideline";

const CODE = `<label>
  Project name
  <Input defaultValue="Harbour rebrand" />
</label>
<Input type="search" placeholder="Search projects" aria-label="Search projects" />
<Input mask="99999 999999" placeholder="07700 900123" aria-label="Phone" />`;

const harbour = project("harbour");
const signage = project("signage");
const leo = person("leo");
const email = (name: string) => `${name.toLowerCase().replace(" ", ".")}@tideline.studio`;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <Text as="span" size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
        {label}
      </Text>
      {children}
    </label>
  );
}

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Input"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A plain `<input>`: wrap it in a `<label>` or pass `aria-label`. `mask` shapes what is typed (`9` digit, `a` letter, `*` any, other characters are literals); it does not validate, so pair it with `pattern` or `required` and say the constraint in words.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: "`data-rebar-size` on the element; otherwise a native `<input>` with every native attribute passed through." }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered: AntD's `Input` has no mask. A masked field needs a mask library alongside AntD's `Input`." }],
  },
  {
    type: "doc-section",
    heading: 'fieldStyle, revealIcons, revealStyle',
    body: [{ kind: "text", text: '`fieldStyle="translucent"` is a glass field for photo or dark surfaces (`--rebar-auth-field-*` tokens). `revealIcons={{ show, hide }}` swaps the eye glyphs and `revealStyle="plain"` makes the eye a bare 70% glyph inset by `--rebar-input-reveal-inset`.' }],
  },
];

export default function InputPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Input</Heading>
      <Text color="secondary">A text field.</Text>

      <DemoStage
        title="Text field"
        caption="Label, search, mask"
        code={CODE}
        states={[
          { label: "Empty", node: <Input placeholder="Name" aria-label="Name" /> },
          {
            label: "Error",
            node: (
              <Stack gap="xs">
                <Input defaultValue="32 Oct" aria-label="Due date" aria-invalid="true" style={{ borderColor: "var(--rebar-color-danger)" }} />
                <Text size="xs" style={{ color: "var(--rebar-color-danger)" }}>
                  Pick a date in October.
                </Text>
              </Stack>
            ),
          },
          { label: "Disabled", node: <Input disabled defaultValue={harbour.name} aria-label="Project" /> },
          { label: "Long text", node: <Input defaultValue="Crew interviews: synthesis notes for the autumn research round" aria-label="Title" /> },
          {
            label: "Sizes",
            node: (
              <Stack gap="xs">
                <Input size="sm" placeholder="Small" aria-label="Small" />
                <Input placeholder="Medium" aria-label="Medium" />
                <Input size="lg" placeholder="Large" aria-label="Large" />
              </Stack>
            ),
          },
        ]}
      >
        <Stack gap="md" style={{ maxWidth: 420, margin: "0 auto" }}>
          <Field label="Project name">
            <Input defaultValue={harbour.name} />
          </Field>
          <Field label="Search">
            <Input type="search" placeholder="Search projects" />
          </Field>
          <Field label="Phone">
            <Input mask="99999 999999" placeholder="07700 900123" inputMode="numeric" />
          </Field>
        </Stack>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Invite dialog" caption="Two fields and a primary action">
        <Card style={{ maxWidth: 440, margin: "0 auto" }} actions={[<Button key="cancel" variant="secondary">Cancel</Button>, <Button key="send">Send invite</Button>]}>
          <Stack gap="md">
            <Heading level={3}>Invite to Tideline</Heading>
            <Field label="Email">
              <Input type="email" defaultValue={email(leo.name)} />
            </Field>
            <Field label="Message">
              <Input defaultValue={`Join us on ${signage.name}.`} />
            </Field>
          </Stack>
        </Card>
      </DemoStage>

      <InputMobile />
            <Heading level={2}>Type, padding and focus tokens</Heading>
      <DemoStage title="Tokens" caption={'--rebar-input-* set size, padding, border, radius, fill, colour, focus ring and disabled look; type="date" gives the native date field.'} widths={false}>
        <Stack gap="sm"><Input aria-label="Date" type="date" style={{ "--rebar-input-font-size": "14px", "--rebar-input-padding": "6px 10px", "--rebar-input-min-height": "0", "--rebar-input-border-width": "1px", "--rebar-input-radius": "16px", width: "auto" } as CSSProperties} /></Stack>
      </DemoStage>
      <NextBlockRenderer blocks={BLOCKS} />
      <TokenTable component="Input" />
    </Stack>
  );
}
