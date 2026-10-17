"use client";

import { useState } from "react";
import { Button, Heading, Stack, Text, Textarea, TopBar } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PhoneBar } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { FEEDBACK_PLACEHOLDER, REFLECTION, REFLECTION_PLACEHOLDER } from "@/fixtures/athic";

const CODE = `<Textarea aria-label="Reflection" rows={4} maxLength={600} showCount value={text} onChange={(e) => setText(e.target.value)} />

// grows with its content, up to four rows
<Textarea aria-label="Prayer" autoSize={{ minRows: 2, maxRows: 4 }} />

<Textarea aria-label="Feedback" invalid />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Textarea"] ?? [] },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "A native `<textarea>`: name it with a `<label>` or `aria-label`. `invalid` sets `aria-invalid`; `showCount` links the counter with `aria-describedby`. Type stays at 16px or more so iOS does not zoom on focus. The `Tab` key moves on; there is no trap.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="textarea"` on the field; `data-rebar-size`, `data-rebar-resize`, `data-rebar-autosize`, `data-rebar-invalid`; parts `field` (the wrapper) and `count` (with `data-rebar-at-limit`).' }],
  },
];

const label = { font: "700 .72rem/1 var(--rebar-font-family-sans)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--rebar-color-text-secondary)", paddingBottom: 8, display: "block" } as const;

export default function TextareaPage() {
  const [text, setText] = useState(REFLECTION);
  const [msg, setMsg] = useState("");
  const [touched, setTouched] = useState(false);
  const empty = touched && msg.trim().length === 0;
  return (
    <Stack gap="lg">
      <Heading level={1}>Textarea</Heading>
      <Text color="secondary">Multi-line text for reflections, feedback and journal entries.</Text>

      <DemoStage
        title="Textarea"
        caption="Multi-line, count, auto size"
        code={CODE}
        widths={false}
        states={[
          { label: "Empty", node: <Textarea aria-label="Empty" placeholder={REFLECTION_PLACEHOLDER} /> },
          { label: "Count", node: <Textarea aria-label="Counted" defaultValue="Lord, help me start again." maxLength={600} showCount /> },
          { label: "Error", node: <Textarea aria-label="Error" invalid placeholder={FEEDBACK_PLACEHOLDER} /> },
          { label: "Disabled", node: <Textarea aria-label="Disabled" disabled placeholder="Saving…" /> },
          { label: "Read only", node: <Textarea aria-label="Read only" readOnly defaultValue="Peter asked for faith." /> },
          { label: "Auto size (max 4 rows)", node: <Textarea aria-label="Auto" autoSize={{ minRows: 2, maxRows: 4 }} defaultValue="Dear Lord, thank you for the retreat weekend. I want to remember the quiet of the chapel and the homily on trust, and bring it back to my family on Sunday." /> },
        ]}
      >
        <div style={{ maxWidth: 460, margin: "0 auto", display: "grid", gap: 6 }}>
          <label htmlFor="reflection" style={label}>
            Reflection
          </label>
          <Textarea id="reflection" rows={5} maxLength={600} showCount value={text} onChange={(e) => setText(e.target.value)} />
          <Text size="xs" color="secondary" style={{ padding: "0 8px" }}>
            Only you can read this
          </Text>
        </div>
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Reflection composer and feedback form" caption="Counted field; an error once the message is left empty" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <TidelinePhone width={320} height={520} bar={<PhoneBar><TopBar leading="back" title="New reflection" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label htmlFor="ctx-reflection" style={label}>Reflection</label>
                <Textarea id="ctx-reflection" rows={6} maxLength={600} showCount value={text} onChange={(e) => setText(e.target.value)} />
              </div>
              <Button block>Save reflection</Button>
            </div>
          </TidelinePhone>
          <TidelinePhone width={320} height={520} bar={<PhoneBar><TopBar leading="back" title="Feedback" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 14 }}>
              <Text color="secondary">Tell us what is working and what is not. We read every note.</Text>
              <div>
                <label htmlFor="ctx-feedback" style={label}>Your message</label>
                <Textarea id="ctx-feedback" rows={5} maxLength={600} showCount placeholder={FEEDBACK_PLACEHOLDER} invalid={empty} value={msg} onChange={(e) => setMsg(e.target.value)} onBlur={() => setTouched(true)} />
                {empty ? <Text size="sm" style={{ color: "var(--rebar-color-danger)", padding: "6px 8px 0" }}>Add a few words so we can help.</Text> : null}
              </div>
              <Button block disabled={msg.trim().length === 0}>Send feedback</Button>
            </div>
          </TidelinePhone>
        </Stack>
      </DemoStage>

            <Heading level={2}>Compact counter</Heading>
      <DemoStage title="countSeparator" caption={'countSeparator="/" prints 59/2000; --rebar-textarea-* tokens set type, padding, border, radius and focus.'} widths={false}
        code={`<Textarea showCount maxLength={2000} countSeparator="/" />`}>
        <Textarea aria-label="Feedback" showCount maxLength={2000} countSeparator="/" defaultValue="Short note" resize="vertical" />
      </DemoStage>
      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
