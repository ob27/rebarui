import { Heading, Image, Stack, Text } from "rebar-ui";

export default function ImitationsPage() {
  return (
    <Stack gap="lg">
      <Image src="/catalogue-heros/immitations.jpeg" alt="Imitations hero image" style={{ width: "100%", borderRadius: "8px" }} />
      <Heading level={1}>Imitations</Heading>
      <Text color="secondary">
        Static, standalone primitives — no composition of other named components, no real state
        machine beyond mirroring one caller-controlled value for the controlled/uncontrolled
        convention. A block is always at least a fixed composition of components, so this tier is
        components-only. See{" "}
        <a href="/about/agent" className="rebar-link">
          the four tiers
        </a>{" "}
        for how this relates to Synthetics, Opinions, and Orders.
      </Text>
    </Stack>
  );
}
