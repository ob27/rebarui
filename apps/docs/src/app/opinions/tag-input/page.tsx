"use client";

import { useState } from "react";
import { Heading, Stack, TagInput, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { LivePreview } from "@/components/LivePreview";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<TagInput values={tags} onValuesChange={setTags} placeholder="Add a tag..." />',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["TagInput"] ?? [] },
  {
    type: "doc-section",
    heading: "Typed entry, not a picklist",
    body: [
      {
        kind: "text",
        text: "Distinct from `MultiSelect`/`Combobox` (both pick from a supplied option list) and `Mentions` (@-autocomplete inside prose): this accepts arbitrary typed values with no fixed list behind it. Press Enter or `,` to commit the current text as a tag; Backspace on an empty field removes the last one — the same interaction most tag-entry fields already use.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Duplicates and limits",
    body: [
      {
        kind: "text",
        text: '`allowDuplicates` (default `false`) skips adding a tag that already exists, case-insensitively. `maxTags` disables the input once reached rather than silently dropping further tags.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="tag-input"` on the root; parts: `chips`, `input`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "AntD's `Select` with `mode=\"tags\"` is the closest equivalent — not yet codemod-covered, since AntD folds this into its Select component rather than a standalone field.",
      },
    ],
  },
];

export default function TagInputPage() {
  const [tags, setTags] = useState<string[]>(["design", "urgent"]);

  return (
    <Stack gap="lg">
      <Heading level={1}>TagInput</Heading>
      <Text color="secondary">Free-form typed tag entry — press Enter or comma to add one.</Text>

      <LivePreview>
        <div style={{ maxWidth: 400 }}>
          <TagInput values={tags} onValuesChange={setTags} placeholder="Add a tag..." />
        </div>
      </LivePreview>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
