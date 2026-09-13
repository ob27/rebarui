import { Heading, Image, Stack, Text } from "rebar-ui";

export default function SyntheticsPage() {
  return (
    <Stack gap="lg">
      <Image src="/catalogue-heros/synthetics.jpeg" alt="Synthetics hero image" style={{ width: "100%", borderRadius: "8px" }} />
      <Heading level={1}>Synthetics</Heading>
      <Text color="secondary">
        Static compositions/groupings of primitives with a unified purpose, but still no real
        dynamism — a fixed layout, not a state machine. Most placement-layer blocks land here:
        plain content shapes with nothing bound to live data or a handler. See{" "}
        <a href="/docs/tiers" className="rebar-link">
          the four tiers
        </a>{" "}
        for how this relates to Imitations, Opinions, and Orders.
      </Text>
    </Stack>
  );
}
