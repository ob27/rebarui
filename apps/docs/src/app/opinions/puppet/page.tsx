"use client";

import { Heading, Puppet, Stack, Text } from "rebar-ui";
import type { PuppetPose } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CON, CON_CANVAS, CON_LINES } from "@/data/conLayers";

const POSES: PuppetPose[] = ["rest", "glance-left", "glance-right", "blink", "eye-roll", "wobble"];

const CODE = `const con: PuppetLayers = {
  body: "/mascot/body.png",
  wobble: [{ src: "/mascot/rod-left.png", pivot: [63.4, 14.8] }, { src: "/mascot/rod-right.png", pivot: [78.2, 21.9] }],
  pupils: "/mascot/pupils.png",
  eyesMask: "/mascot/eyes-mask.png",
  lids: "/mascot/lids.png",
};

<Puppet layers={con} canvas={[599, 846]} size={300} weight="heavy" says={["Already built. Use that one.", "Another Kanban? We have a Kanban."]} />`;

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["Puppet"] ?? [] },
  {
    type: "doc-section",
    heading: "Cutting a character into layers",
    body: [
      {
        kind: "text",
        text: "Every layer is a transparent PNG on the same canvas as the body, so they line up 1:1 with no positioning data; `canvas` only supplies the aspect ratio. `wobble[].pivot` is where a part hinges, in percent of the canvas. `eyesMask` is the white of the eyes as an alpha mask: pupils and lids are clipped to it, which keeps a glancing pupil inside the eye. `lidLine` is how far down the canvas the lids start, because a blink drops them from that line. Only `body` is required; each other layer switches on one behaviour.",
      },
      {
        kind: "text",
        text: "A white sticker outline baked into the body (and each wobble part) gives the die-cut look and lets the character sit on any background. Outline the gaps too, between legs for example, so the cut-out reads as one piece of paper.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Weight, speech, poking",
    body: [
      {
        kind: "text",
        text: '`weight="light"` (the default) is a paper book: big loose swings and a springy pop-up. `weight="heavy"` is a concrete block: swings a third the size and nearly twice as slow, with a thud when it lands. `says` is a list of lines shown in turn every `sayEvery` ms (paused while the tab is hidden); poking the puppet skips to the next line and restarts the timer. A `pose` holds one expression and stops all motion, for an empty state or a screenshot.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Under `prefers-reduced-motion` the body, parts and pupils stop and the blink slows right down. The puppet is decorative by default (`aria-hidden`); pass `label` to make it an image with a name when the character itself carries meaning. The speech bubble is flavour and hidden from assistive technology; put anything the user needs to read in the page itself.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="puppet"` on the root; `data-rebar-motion` is `idle`, `hop` or `still`; `data-rebar-weight` is `light` or `heavy`; `data-rebar-pose` is the held expression, when there is one; `data-rebar-poked` is present for a moment after a poke. Parts: `rise`, `sway`, `paper`, `wobble`, `body`, `eyes`, `pupils`, `lids`, `bubble` (with `data-rebar-side`).',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered: Ant Design has no mascot component. The component is stacked images and CSS keyframes, so it carries over unchanged." }],
  },
];

export default function PuppetPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Puppet</Heading>
      <Text color="secondary">A character as a rigid paper cut-out: it sways, glances, blinks, and talks back when poked. The art here is Con; the rig knows nothing about him.</Text>

      <DemoStage
        title="Con"
        caption="Hover or poke him"
        code={CODE}
        widths={false}
        states={POSES.map((pose) => ({ label: pose, node: <Puppet layers={CON} canvas={CON_CANVAS} size={90} weight="heavy" pose={pose} /> }))}
      >
        <div className="cs-grain" style={{ padding: "56px 24px 0", display: "flex", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ position: "relative", paddingTop: 70 }}>
            <Puppet layers={CON} canvas={CON_CANVAS} size={260} weight="heavy" says={CON_LINES} label="Con, a concrete block with rebar sticking out of its head" />
          </div>
        </div>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
