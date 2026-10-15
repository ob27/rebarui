"use client";

import { Heading, Puppet, Stack, Text } from "rebar-ui";
import type { PuppetPose } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { CON, CON_CANVAS, CON_LINES } from "@/data/conLayers";

const POSES: { pose: PuppetPose; label: string }[] = [
  { pose: "rest", label: "rest" },
  { pose: "glance-left", label: "glance-left" },
  { pose: "glance-right", label: "glance-right" },
  { pose: "blink", label: "blink" },
  { pose: "eye-roll", label: "eye-roll" },
  { pose: "wobble", label: "wobble" },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: 'const con: PuppetLayers = {\n  body: "/mascot/body.png",\n  wobble: [{ src: "/mascot/rod-left.png", pivot: [63.4, 14.8] }, { src: "/mascot/rod-right.png", pivot: [78.2, 21.9] }],\n  pupils: "/mascot/pupils.png",\n  eyesMask: "/mascot/eyes-mask.png",\n  lids: "/mascot/lids.png",\n};\n\n<Puppet\n  layers={con}\n  canvas={[599, 846]}\n  size={300}\n  weight="heavy"\n  says={["Already built. Use that one.", "Another Kanban? We have a Kanban."]}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["Puppet"] ?? [] },
  {
    type: "doc-section",
    heading: "What it's for",
    body: [
      {
        kind: "text",
        text: "A mascot that feels alive without being a video. The character is cut into plain transparent images on one shared canvas and `Puppet` stacks them: a **body**, parts that **wobble** on their own (antennae, a tail), **pupils** that glance around inside an **eyes mask**, and **lids** that blink. It is a rigid paper cut-out on an unseen stick: it never squashes or stretches, it pivots from below its feet, and it pops up when it appears. Poking it wiggles it and skips to its next line.",
      },
      {
        kind: "text",
        text: "Only `body` is required; every other layer switches on one behaviour. A character with no eyes layers is still a swaying cut-out. The art is yours: the component knows nothing about any particular character, so the same rig runs a light paper book and a heavy concrete block.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Cutting a character into layers",
    body: [
      {
        kind: "text",
        text: "Every layer must be the **same size** as the body (a transparent PNG on the same canvas) so they line up 1:1 with no positioning data. `canvas` only supplies the aspect ratio. `wobble[].pivot` is where the part hinges, in percent of the canvas. `eyesMask` is the white of the eyes as an alpha mask: the pupils and lids are clipped to it, which is what keeps a glancing pupil inside the eye. `lidLine` is how far down the canvas the lids start, in percent, because a blink drops the lids from that line.",
      },
      {
        kind: "text",
        text: "A white sticker outline baked into the body (and into each wobble part) gives the die-cut look and lets the character sit on any background. Outline the gaps too, between legs for example, so the cut-out reads as one piece of paper.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Weight",
    body: [
      {
        kind: "text",
        text: '`weight="light"` (the default) is a paper book: big loose swings and a springy pop-up. `weight="heavy"` is a concrete block: swings a third the size and nearly twice as slow, with a thud when it lands. Both are plain CSS variables (`--rebar-puppet-swing`, `--rebar-puppet-flop`, `--rebar-puppet-sway-s`, `--rebar-puppet-rise-ms`) set from the `data-rebar-weight` hook, so a theme can tune either.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Speech and poking",
    body: [
      {
        kind: "text",
        text: "`says` is a list of lines. The first opens, the rest follow every `sayEvery` ms (paused while the tab is hidden), looping. Poking the puppet (pointer down) skips to the next line and restarts the timer, so a poked line is never cut short. The bubble is flavour and is hidden from assistive technology; put anything the user needs to read in the page itself.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Expressions (poses)",
    body: [
      {
        kind: "text",
        text: "A `pose` holds one expression and stops all motion, for an empty state, an avatar or a screenshot: `rest`, `glance-left`, `glance-right`, `blink`, `half-blink`, `eye-roll` and `wobble`. All of them are the same layers, so a character that can blink can act without any extra art.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Reduced motion and accessibility",
    body: [
      {
        kind: "text",
        text: "Under `prefers-reduced-motion` the body, parts and pupils stop and the blink slows right down; nothing else changes. By default the puppet is decorative (`aria-hidden`). Pass `label` to make it an image with a name, for when the character itself carries meaning (a logo, an error illustration).",
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
    body: [
      {
        kind: "text",
        text: "Not codemod-covered: Ant Design has no mascot or puppet component. The component is stacked images and CSS keyframes, so it carries over unchanged.",
      },
    ],
  },
];

export default function PuppetPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Puppet</Heading>
      <Text color="secondary">
        A character as a rigid paper cut-out on an unseen stick: it sways, its eyes glance and blink under a mask, parts like antennae wobble a beat
        behind, and poking it wiggles it and skips to its next line. Hover or click Con.
      </Text>

      <div
        className="cs-poster"
        style={{
          background: "#1181ff",
          border: "2px solid #0b0b14",
          borderRadius: 12,
          padding: "56px 24px 0",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", paddingTop: 70 }}>
          <Puppet layers={CON} canvas={CON_CANVAS} size={260} weight="heavy" says={CON_LINES} label="Con, a concrete block with rebar sticking out of its head" />
        </div>
      </div>
      <Text size="sm" color="secondary">
        The art is Con, cut into layers; the component itself knows nothing about the character.
      </Text>

      <Heading level={2}>Expressions</Heading>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
        {POSES.map(({ pose, label }) => (
          <figure key={pose} style={{ margin: 0, background: "#1181ff", border: "2px solid #0b0b14", borderRadius: 10, padding: "12px 0 0", display: "grid", justifyItems: "center", overflow: "hidden" }}>
            <Puppet layers={CON} canvas={CON_CANVAS} size={96} weight="heavy" pose={pose} />
            <figcaption style={{ width: "100%", background: "var(--rebar-color-bg-primary, #fff)", color: "var(--rebar-color-text-primary, #212121)", padding: "6px 10px", fontFamily: "monospace", fontSize: 12, borderTop: "2px solid #0b0b14" }}>
              {label}
            </figcaption>
          </figure>
        ))}
      </div>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
