import Link from "next/link";
import { Heading, Stack, Text } from "rebar-ui";

export default function IntroductionPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Introduction</Heading>
      <Text>
        Rebar is a headless-first React component library that&apos;s intentionally low-fidelity
        by default: fully functional and accessible, but visually barebones so your attention
        stays on logic and data flow, not pixels. It&apos;s built to be used through a small
        procedural placement layer — an LLM names which pre-built section shapes it needs and
        supplies content, a deterministic renderer decides the actual layout — rather than
        hand-authored component-by-component. Every visual value is a CSS variable, so re-skinning
        into a real design system later is a bounded migration, not a rewrite.
      </Text>

      <Stack gap="sm">
        <Heading level={2}>The placement layer: two heuristics, not a general layout engine</Heading>
        <Text>
          <code>@rebar-ui/placement</code> exports <code>BlockRenderer</code>, which turns a small
          typed document — a list of <strong>blocks</strong> (a banner, a checklist, a callout, a
          feature grid, ...) — into the actual component tree. An LLM authoring that document never
          writes a layout prop; it only decides which block fits each piece of content and what
          that content is. Two heuristics do the actual layout work instead:
        </Text>
        <Text>
          <strong>Anatomical order</strong> — within any one block, its internal parts always
          render in the same fixed sequence, head to toe, every time: a callout is always icon,
          then title, then subtitle, top to bottom; a banner is always icon, then text, then a
          trailing action, left to right. The model fills in the slots&apos; content; it never
          decides which slot comes first, because that was already decided when the block was
          designed.
        </Text>
        <Text>
          <strong>The magnetic heuristic</strong> — at the whole-document level, blocks are simply
          listed in the order they should appear, and the renderer snaps each one into place in
          that sequence — like magnets pulling into a line, not a grid the model has to compute
          coordinates for. Supplying order is the only placement decision the model makes; there is
          no <code>x</code>/<code>y</code>, no <code>flex</code>/<code>grid</code> value, ever, in
          the document it writes.
        </Text>
        <Text size="sm" color="secondary">
          This is genuinely this project&apos;s own homepage, not just a demo: the feature-card row
          and three-pillars grid on <Link href="/" className="rebar-link">the homepage</Link> are real{" "}
          <code>BlockRenderer</code> output, not hand-authored <code>Stack</code>/<code>Card</code>{" "}
          JSX (<code>apps/docs/src/app/page.tsx</code>, if you&apos;re reading the source). It&apos;s
          a small, fixed vocabulary of six blocks today, not a general &quot;any UI&quot; engine —
          the real, repeated measurements on <Link href="/benchmarks" className="rebar-link">/benchmarks</Link> are what
          back the three it was validated on; the rest were added to build this site with, not
          measured in isolation the same way.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>The hypothesis: most of the cost is upfront, while things are still moving</Heading>
        <Text>
          Most of the token cost of building UI with an LLM is paid early, while a project&apos;s
          flows and layouts are still volatile — screens get reshuffled, fields get added and
          removed, whole sections get rethought, often many times before anything settles. Building
          directly against a real, opinionated design system during that phase is expensive
          precisely because it&apos;s volatile: every round of change pays a styling/constraint tax
          again, reconciling the new logic with the target library&apos;s component shapes, prop
          conventions, and visual rules. That volatility is exactly where Rebar, built through its
          placement layer, is cheapest — <Link href="/benchmarks" className="rebar-link">measured, not modeled</Link>: no
          visual decisions in the loop, so iteration is fast, and (per the same benchmark&apos;s
          visual-consistency numbers) far more predictable in cost than a design-system build,
          where nominally identical requests still land on visibly different output each time.
        </Text>
        <Text>
          Once the UI has actually stabilized — the flows are settled, the project is heading to
          production — the right move is to migrate once, via{" "}
          <Link href="/docs/migration" className="rebar-link">a codemod or the migration prompt</Link>, to a real design
          system that can be customized for the long term. Rebar isn&apos;t meant to compete with a
          production design system on visual fidelity, or to be the permanent choice; it&apos;s
          meant to be the cheapest way to get through the volatile phase before you need one.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>When to reach for Rebar</Heading>
        <Text>
          Anywhere the UI is still being figured out: early-stage prototypes, internal tools, admin
          panels, or the first pass of a production app whose flows aren&apos;t settled yet — even
          when you already know the target design system you&apos;ll eventually migrate to. The
          less settled the UI, the more this approach saves; once it&apos;s genuinely stable and
          you&apos;re optimizing for final visual polish rather than iterating on logic, that&apos;s
          the signal to migrate. Rebar is designed to be replaced; that&apos;s the point, not a
          limitation.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>The three guarantees</Heading>
        <Text>
          1. <strong>Headless & accessible</strong> — Radix UI underneath every interactive
          component.
          <br />
          2. <strong>Built to be replaced</strong> — CSS-variable theming, no component logic
          depends on the current theme.
          <br />
          3. <strong>Playwright-proof</strong> — <code>data-rebar-*</code> attributes and an
          ARIA-first surface survive a full re-skin.
        </Text>
      </Stack>
    </Stack>
  );
}
