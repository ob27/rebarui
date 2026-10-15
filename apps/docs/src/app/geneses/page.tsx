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
        text: "Geneses are a different kind of thing from the other four tiers, not a fifth rung above Order. Imitation/Synthetic/Opinion/Order classify individual constructs — a component or a block. A genesis is a whole, complete, production-ready application built 100% with Rebar UI: not a piece you import, but a seed you clone. That's why a genesis is never a component or a block — `ConstructTier` (the type governing what a block is allowed to be) explicitly excludes Genesis, the same way it excludes Imitation, since a block is always at least a fixed composition and a genesis is always more than one.",
      },
      {
        kind: "text",
        text: "The point of a genesis isn't to demonstrate one construct in isolation — every other tier's own reference page already does that. It's to demonstrate a whole application built 100% with Rebar UI: every piece of the UI comes from the catalog, with no second component library alongside it, and project-specific constructs get added (and classified by the same tiers) only when the shipped catalog doesn't quite fit that domain. How the app is composed, hand-authored JSX against `rebar-ui` or pages printed through the placement layer's Packer, is the project's own call; a genesis isn't required to use the Packer.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "When to reach for this tier",
    narration: { src: "/narration/geneses-when-to-reach.mp3" },
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
          "Build the whole UI from Rebar UI: reach for `rebar-ui` components (and the placement layer's Packer, if it suits the project) for everything, and don't bring in a second component library alongside it. Whether pages are hand-authored JSX or composed from `Construct[]` data is the project's call.",
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
        text: "A genesis isn't ported back the way a component or a block is — there's no single file to add to `packages/core` or `packages/placement`. If building one surfaces a construct that's genuinely reusable beyond that one project (not tied to its specific domain), that construct is what gets contributed back, through the normal Imitation/Synthetic/Opinion/Order pipeline described on this catalog's other tier pages — the genesis itself stays a separate, linked seed project, not a folder inside this repo. The same fork-first path applies either way: no write access to this repo is required to start — fork it, build there, then open an issue linking your fork or branch asking for the reusable piece to be adopted into the main project.",
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
      <Heading level={2}>First genesis: AI Hive</Heading>
      <Text color="secondary">
        The first genesis is <strong>AI Hive</strong>: a wall of AI agents and services, each tile showing who it is, where it is
        working, its status and what it is doing now, with its own keyed app server and command-line client. Its screen is a
        React app built 100% with Rebar UI (the Opinion-tier agent wall running against its own live backend). It is open
        source under the MIT licence at{" "}
        <a href="https://github.com/ob27/ai-hive" className="rebar-link">
          github.com/ob27/ai-hive
        </a>
        . Rebar UI is not on npm yet, so the screen builds against a checkout of this repo next to it; the README has the
        steps. More genesis projects, such as dashboards, admin panels and content sites, will follow.
      </Text>
    </Stack>
  );
}
