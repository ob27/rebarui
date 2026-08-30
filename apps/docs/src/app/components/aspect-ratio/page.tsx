import { AspectRatio, Box, Heading, Stack, Text } from "rebar-ui";
import { LivePreview } from "@/components/LivePreview";
import { PropsTable } from "@/components/PropsTable";

const RATIOS: { label: string; ratio: number }[] = [
  { label: "1:1", ratio: 1 },
  { label: "4:3", ratio: 4 / 3 },
  { label: "16:9", ratio: 16 / 9 },
  { label: "9:16", ratio: 9 / 16 },
];

export default function AspectRatioPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>AspectRatio</Heading>
      <Text color="secondary">
        Keeps content at a fixed width/height ratio (Radix underneath). An empty, low-fidelity box
        by default — Rebar stays barebones until you supply a real <code>src</code>. Set{" "}
        <code>placeholder</code> to show one of Rebar&apos;s built-in illustrated placeholder
        images instead of a bare box while you don&apos;t have a real image yet — it picks
        whichever embedded placeholder&apos;s own ratio is numerically closest to the one you ask
        for, not an exact-name match, so any ratio you pass gets <em>something</em> reasonable.
      </Text>

      <LivePreview>
        <Stack direction="row" gap="md" style={{ flexWrap: "wrap" }}>
          {RATIOS.map((r) => (
            <Stack key={r.label} gap="xs" style={{ width: 160 }}>
              <Box style={{ width: 160 }}>
                <AspectRatio ratio={r.ratio} placeholder />
              </Box>
              <Text size="xs" color="secondary" style={{ textAlign: "center" }}>
                {r.label}
              </Text>
            </Stack>
          ))}
        </Stack>
      </LivePreview>

      <Stack gap="xs">
        <Heading level={2}>Code</Heading>
        <Text
          as="pre"
          size="sm"
          style={{
            background: "var(--rebar-color-bg-secondary, #f5f5f5)",
            padding: "var(--rebar-space-md)",
            borderRadius: 4,
            overflowX: "auto",
          }}
        >
          {`<AspectRatio ratio={16 / 9} src="/photos/hero.jpg" alt="Product hero shot" />
<AspectRatio ratio={1} placeholder />
<AspectRatio />`}
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Props</Heading>
        <PropsTable component="AspectRatio" />
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Accessibility</Heading>
        <Text size="sm">
          Pass a meaningful <code>alt</code> when using a real <code>src</code>; when only{" "}
          <code>placeholder</code> is set (or neither is set), the image/box is decorative and{" "}
          <code>alt</code> is left empty automatically.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>data-rebar-* attributes</Heading>
        <Text size="sm">
          <code>data-rebar-component=&quot;aspect-ratio&quot;</code> on the root;{" "}
          <code>data-rebar-part=&quot;empty&quot;</code> on the placeholder box when neither{" "}
          <code>src</code> nor <code>placeholder</code> is set.
        </Text>
      </Stack>

      <Stack gap="xs">
        <Heading level={2}>Migrating to Ant Design</Heading>
        <Text size="sm">
          AntD has no dedicated aspect-ratio component — this one has no direct equivalent to
          rename to, similar to <code>Box</code>/<code>Stack</code>. Migrating means replacing it
          with whatever fixed-ratio container convention the target codebase already uses (a CSS
          utility class, a wrapper div with a padding-top trick, etc.), by hand or via the
          migration prompt.
        </Text>
      </Stack>
    </Stack>
  );
}
