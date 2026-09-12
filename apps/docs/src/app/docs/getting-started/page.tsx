import type { Block } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Block[] = [
  { type: "doc-section", heading: "Getting Started", level: 1, body: [] },
  {
    type: "doc-section",
    heading: "1. Install",
    body: [
      { kind: "code", code: "npm install rebar-ui @rebar-ui/theme-sketch" },
      {
        kind: "text",
        text: "Rebar is headless-first: the component logic lives in `rebar-ui`, the look lives in a separate theme package. Swap `@rebar-ui/theme-sketch` for `@rebar-ui/theme-clean` any time without touching component code.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "2. Import the stylesheets and set a theme attribute",
    body: [
      { kind: "code", code: 'import "rebar-ui/style.css";\nimport "@rebar-ui/theme-sketch/theme.css";' },
      {
        kind: "text",
        text: 'Then set `data-rebar-theme="sketch"` on your root element (`<html>` in Next.js\'s App Router). Dark mode is orthogonal — add `data-theme="dark"` alongside it.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "3. Use a component",
    body: [
      {
        kind: "code",
        code: 'import { Button } from "rebar-ui";\n\nexport function SaveButton() {\n  return <Button variant="primary">Save changes</Button>;\n}',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Next",
    body: [
      {
        kind: "text",
        text: "Browse the [component reference](/docs/tiers), or read about [the default heuristics baked in](/docs/theming).",
      },
    ],
  },
];

export default function GettingStartedPage() {
  return <NextBlockRenderer blocks={BLOCKS} />;
}
