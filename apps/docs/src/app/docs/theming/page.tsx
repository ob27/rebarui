import type { Block } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  {
    type: "doc-section",
    heading: "Theming & Defaults",
    level: 1,
    body: [
      {
        kind: "text",
        text: "Rebar bakes in defaults so you never make a spacing, color, or type-scale decision unless you choose to. Every value below is a CSS custom property — fully overridable, but chosen so most projects never need to. The behavioral guidance (not the CSS specifics) is also published standalone as `HEURISTICS.md` in the repo root — copy it into any project, Rebar or not, as a design-defaults reference for developers or an AI coding agent.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Spacing — 8pt grid",
    body: [
      {
        kind: "text",
        text: "Convention shared by Material Design, IBM Carbon, and USWDS. All spacing is a multiple of 8px; 4px exists only for micro-adjustments.",
      },
      {
        kind: "list",
        items: [
          "`--rebar-space-xs` — 4px",
          "`--rebar-space-sm` — 8px",
          "`--rebar-space-md` — 16px",
          "`--rebar-space-lg` — 24px",
          "`--rebar-space-xl` — 32px",
          "`--rebar-space-2xl` — 48px",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Typography",
    body: [
      {
        kind: "text",
        text: "A six-step type scale, system font stack by default (no web-font loading cost until a theme opts in).",
      },
      {
        kind: "list",
        items: [
          "`--rebar-font-size-xs` — 12px — captions, metadata",
          "`--rebar-font-size-sm` — 14px — secondary text, inputs",
          "`--rebar-font-size-md` — 16px — body text (base)",
          "`--rebar-font-size-lg` — 20px — subheadings",
          "`--rebar-font-size-xl` — 24px — section headings",
          "`--rebar-font-size-2xl` — 32px — page titles",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Color — semantic tokens only",
    body: [
      {
        kind: "text",
        text: "Never a raw hex value in component source or usage — always a semantic role (`--rebar-color-primary`, `--rebar-color-danger`, ...). WCAG 2.1 AA contrast (4.5:1 body text, 3:1 large text) is the enforced minimum in the shipped themes.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Behavioral heuristics components satisfy",
    body: [
      {
        kind: "text",
        text: "From Nielsen's usability heuristics, Shneiderman's golden rules, and Gestalt principles — cited for traceability, not reproduced verbatim (see `ref/HEURISTICS.md` in the repo for full sourcing). See each rule stated with its rationale and a live, running example of the RebarUI DSL Packer applying it on [Design Heuristics](/docs/heuristics).",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Example: Button's full prop surface",
    body: [
      {
        kind: "text",
        text: "Generated from the real TypeScript types — see any [component reference pages](/docs/tiers) for the rest.",
      },
    ],
  },
  { type: "props-table", rows: componentProps["Button"] ?? [] },
];

export default function TheimingPage() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
