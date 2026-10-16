import { Card, Heading, Stack, Text, WordCloud } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { project } from "@/fixtures/tideline";

const CODE = `<WordCloud
  title="What the crew said"
  words={[{ text: "handover", weight: 80 }, { text: "radio", weight: 65 }, { text: "tides", weight: 40 }]}
/>`;

const WORDS = [
  { text: "handover", weight: 80 },
  { text: "radio", weight: 65 },
  { text: "tides", weight: 52 },
  { text: "shifts", weight: 44 },
  { text: "weather", weight: 36 },
  { text: "signage", weight: 28 },
  { text: "offline", weight: 20 },
  { text: "rota", weight: 14 },
];

const BLOCKS: Construct[] = [
  { type: "props-table", heading: "Props", rows: componentProps["WordCloud"] ?? [] },
  {
    type: "doc-section",
    heading: "Layout",
    body: [{ kind: "text", text: "Words flow in rows, heaviest first, each with a small rotation seeded from its own text, so the same input always renders the same. Font size is sqrt-scaled between the lightest and heaviest word." }],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [{ kind: "text", text: '`data-rebar-component="word-cloud"` on the root `<figure>`.' }],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [{ kind: "text", text: "Not codemod-covered. AntD has no word cloud; use a dedicated library such as `react-wordcloud` or `d3-cloud`." }],
  },
];

export default function WordCloudPage() {
  const interviews = project("interviews");
  return (
    <Stack gap="lg">
      <Heading level={1}>WordCloud</Heading>
      <Text color="secondary">Words sized by weight.</Text>

      <DemoStage
        title="What the crew said"
        caption="Eight themes from the interviews"
        code={CODE}
        states={[
          { label: "Few words", node: <WordCloud title="Top three" width={260} height={140} words={WORDS.slice(0, 3)} /> },
          { label: "One word", node: <WordCloud title="Top theme" width={260} height={140} words={WORDS.slice(0, 1)} /> },
          { label: "Equal weights", node: <WordCloud title="All equal" width={260} height={140} words={WORDS.slice(0, 5).map((w) => ({ text: w.text, weight: 10 }))} /> },
        ]}
      >
        <WordCloud title="What the crew said" words={WORDS} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Research summary" caption="Themes beside the project's status line" widths={false}>
        <Card title={interviews.name} style={{ maxWidth: 560, margin: "0 auto" }}>
          <Stack gap="sm">
            <Text size="sm" color="secondary">{interviews.summary}</Text>
            <WordCloud title="Interview themes" words={WORDS} />
          </Stack>
        </Card>
      </DemoStage>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
