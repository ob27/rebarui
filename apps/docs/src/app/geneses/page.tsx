import { Heading, Image, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Philosophy",
    body: [
      {
        kind: "text",
        text: "Geneses are a different kind of thing from the other four tiers, not a fifth rung above Order. Imitation/Synthetic/Opinion/Order classify individual constructs — a component or a block. A genesis is a whole, complete, production-ready application built entirely out of those constructs: not a piece you import, but a seed you clone. That's why a genesis is never a component or a block — `ConstructTier` (the type governing what a block is allowed to be) explicitly excludes Genesis, the same way it excludes Imitation, since a block is always at least a fixed composition and a genesis is always more than one.",
      },
      {
        kind: "text",
        text: "The point of a genesis isn't to demonstrate one construct in isolation — every other tier's own reference page already does that. It's to demonstrate the *composition discipline*: how a real app structures itself around the Packer, where hand-authored code is still the right call versus where it should be a printed page, and how project-specific constructs get added when the shipped catalog doesn't quite fit a particular domain.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "When to reach for this tier",
    body: [
      {
        kind: "text",
        text: "You don't \"reach for\" a genesis the way you'd pick an Imitation or an Opinion for one new piece of UI — you clone one when you're starting a new project and want a working, opinionated foundation rather than an empty repo. Once you're inside a genesis, the tier question comes right back: any new piece of UI that project needs still gets classified the normal way (Imitation → Synthetic → Opinion → Order), same as it would in the main library.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Building your own",
    body: [
      {
        kind: "list",
        items: [
          "Structure the app around `@rebar-ui/placement`'s Packer end to end — pages composed from `Construct[]` data, not hand-authored JSX against `packages/core`, the same discipline `apps/docs` itself is held to.",
          "Reach for the shipped catalog first; only add a project-specific component or block once a real requirement doesn't fit any existing tier's constructs.",
          "Keep any new project-specific construct classified honestly against the same four tiers, using the same tests described on the Imitations/Synthetics/Opinions/Orders pages — a genesis is not an excuse to skip that discipline.",
          "Document the project's own architecture decisions the way this repo documents its own (`ref/` for planning docs, a `CONTRIBUTING.md`-equivalent for anyone forking it further).",
        ],
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Porting it back to the main repo",
    body: [
      {
        kind: "text",
        text: "A genesis isn't ported back the way a component or a block is — there's no single file to add to `packages/core` or `packages/placement`. If building one surfaces a construct that's genuinely reusable beyond that one project (not tied to its specific domain), that construct is what gets contributed back, through the normal Imitation/Synthetic/Opinion/Order pipeline described on this catalog's other tier pages — the genesis itself stays a separate, linked seed project, not a folder inside this repo.",
      },
    ],
  },
];

export default function GenesesPage() {
  return (
    <Stack gap="lg">
      <Image src="/catalogue-heros/genses.jpeg" alt="Geneses hero image" style={{ width: "100%", borderRadius: "8px" }} />
      <Heading level={1}>Geneses</Heading>
      <Text color="secondary">
        Seed projects grounded in the Rebar UI framework — complete, production-ready applications
        that demonstrate the full construct-based approach in action, not individual constructs
        themselves.
      </Text>
      <NextBlockRenderer blocks={BLOCKS} />
      <Heading level={2}>Coming soon</Heading>
      <Text color="secondary">
        The first genesis projects are being prepared. Check back soon for seed applications spanning
        dashboards, admin panels, content sites, and more — each built entirely from constructs, each
        ready to fork and make your own.
      </Text>
    </Stack>
  );
}
