import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const CODE = `{ type: "gallery", label: "antd", dir: "/benchmark-screenshots", prefix: "antd-text" }`;

const SHAPE: Construct[] = [
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      { kind: "code", code: "{ type: \"gallery\", label: string, dir: string, prefix: string, count?: number }" },
      { kind: "text", text: "Screenshots are named `${prefix}-01.png` through `${prefix}-NN.png` inside `dir`, all the same aspect ratio." },
    ],
  },
];

export default function GalleryPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Gallery</Heading>
      <Text color="secondary">A labelled image carousel of same-shaped screenshots.</Text>

      <DemoStage
        title="Benchmark screenshots"
        caption="The text benchmark, as rendered by antd"
        code={CODE}
        widths={true}
        states={[
          { label: "Two frames", node: <NextBlockRenderer blocks={[{ type: "gallery", label: "antd", dir: "/benchmark-screenshots", prefix: "antd-text", count: 2 }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "gallery", label: "antd", dir: "/benchmark-screenshots", prefix: "antd-text" }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Benchmark report" caption="Under the report summary" widths={false}>
        <Stack gap="md">
          <Heading level={3}>Text benchmark</Heading>
          <Text size="sm" color="secondary">Same copy, same width, rendered by each library.</Text>
          <NextBlockRenderer blocks={[{ type: "gallery", label: "antd", dir: "/benchmark-screenshots", prefix: "antd-text" }]} />
        </Stack>
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
