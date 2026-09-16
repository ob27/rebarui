import { Heading, Image, Stack, Text } from "rebar-ui";

export default function HeuristicsPage() {
  return (
    <Stack gap="lg" style={{ maxWidth: 800, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Image src="/catalogue-heros/heuristics.jpeg" alt="Heuristics hero" style={{ width: "100%", borderRadius: "8px" }} />

      <Heading level={1}>UI Design Heuristics</Heading>

      <Text>
        A portable reference for sensible UI defaults — copy this file into any project (as{" "}
        <code>HEURISTICS.md</code>, alongside a <code>CLAUDE.md</code>/<code>AGENTS.md</code> if you
        use one) so a developer or an AI coding agent has a concrete standard to build against,
        instead of re-deciding spacing, color, and interaction defaults on every screen.
        Framework-agnostic: everything here is guidance, not tied to any specific component library,
        though it originated as the default rules baked into Rebar UI&apos;s components.
      </Text>

      <Text>
        Two kinds of rule, kept distinct because they&apos;re sourced differently:
      </Text>

      <Stack gap="sm" style={{ paddingLeft: "var(--rebar-space-md)" }}>
        <Text>
          <strong>Behavioral heuristics</strong> — qualitative, from published usability research.
          Cited here for traceability; the exact wording of the canonical lists (Nielsen&apos;s,
          Shneiderman&apos;s) is their copyrighted expression, but the underlying principles are
          decades-old, standard usability knowledge that any project can and should apply.
        </Text>
        <Text>
          <strong>Token values</strong> — quantitative (pixel/color/font values), from systems that
          actually publish numbers (Material Design, IBM Carbon, USWDS). Reasonable starting values,
          not sacred — override freely once your project has its own design system.
        </Text>
      </Stack>

      <Text color="secondary" size="sm">
        One licensing note: <strong>Laws of UX</strong> (lawsofux.com) is CC BY-NC-SA-licensed.
        Fine to link to and be inspired by; don&apos;t reproduce its text verbatim in anything
        monetized.
      </Text>

      <Heading level={2}>Behavioral heuristics</Heading>

      <Text>
        From Nielsen&apos;s 10 usability heuristics (1994), Shneiderman&apos;s Eight Golden Rules
        (1998), and Gestalt principles of visual perception (1920s psychology, public domain):
      </Text>

      <Stack gap="sm">
        {[
          ["Visibility of system status", "every async action shows a loading/success/error state within ~300ms of the interaction."],
          ["Match with the real world", "plain-language labels, no jargon in UI copy."],
          ["User control and freedom", "every modal/dialog is closable via close-button, backdrop click, and Esc; destructive actions are confirmable, never silently auto-applied."],
          ["Consistency and standards", "one spacing scale, one type scale, one color-token set, applied identically everywhere; no per-screen one-off values."],
          ["Error prevention", "required fields marked, submit disabled until valid, inline validation on blur rather than on every keystroke."],
          ["Recognition over recall", "labels above inputs, visible options over hidden menus where feasible, one clearly primary action per screen."],
          ["Flexibility and efficiency of use", "full keyboard operability everywhere (Tab, Enter/Space, Esc, arrow keys) — this is also what makes a UI genuinely screen-reader- and automated-test-navigable, not a separate concern from accessibility."],
          ["Aesthetic and minimalist design", "show only what's relevant by default (a data table shows a bounded column set and paginates, rather than dumping everything at once)."],
          ["Help users recognize, diagnose, and recover from errors", 'error messages are specific and actionable ("Email is required," not "Error 400").'],
          ["Proximity, similarity, closure (Gestalt)", "enforce these structurally via a consistent spacing scale and composition rules, not left to per-screen judgment."],
        ].map(([title, desc], i) => (
          <Stack key={i} gap="xs">
            <Text>
              <strong>{i + 1}. {title}</strong> — {desc}
            </Text>
          </Stack>
        ))}
      </Stack>

      <Heading level={3}>Additional heuristics from empirical research</Heading>

      <Text>
        Synthesized from analysis of 22+ design books and historical GUI systems (documented in{" "}
        <code>ref/research/patterns.md</code> and <code>ref/research/anti-patterns.md</code>):
      </Text>

      <Stack gap="sm">
        {[
          ["Respect user intelligence", "treat users as capable problem-solvers, not children who need to be protected from complexity or manipulated into decisions. Avoid condescending UI patterns: excessive confirmations, hidden advanced features, dark patterns that trick users into actions they didn't intend."],
          ["Design for honesty", "the interface should never mislead, hide costs, or make the easy path the wrong one. No dark patterns (disguised ads, hidden costs, forced continuity, privacy zuckering). Make the user's intended action clear and easy, not buried under opt-out checkboxes and misleading button labels."],
          ["Co-locate related controls", "controls that affect the same object or task should be physically near each other, not scattered across the screen. Toolbar buttons for text formatting should be near the text, playback controls near the media, filter options near the filtered content. Avoid control-device misalignment where the control and the thing it controls are separated by distance or hierarchy."],
          ["Make displays distinctive", "different modes, states, and content types should look visually distinct, not interchangeable. Use color, iconography, layout, or typography to make state changes obvious. Avoid display confusion where different states look so similar that users can't distinguish them without reading tiny labels or hovering for tooltips."],
          ["Make controls visible", "if a control exists, the user should be able to see it — not have to guess it's there or discover it by accident. Hidden affordances are a failure of design. Controls should be visible by default, or at minimum, there should be a clear visual indicator that something is there to be discovered."],
          ["Communicate unambiguously", 'labels, messages, and feedback should be specific and clear, not vague or open to interpretation. Error messages should be actionable ("Email is required"), status messages should be specific ("3 files uploaded successfully"), and labels should be unambiguous ("Delete" not "Remove" when the action is permanent).'],
          ["Context-aware design", "the interface should adapt to the user's situation: device, task, environment, and experience level. A mobile interface shouldn't be a shrunken desktop. A novice user shouldn't see the same density of options as an expert. A user in a bright environment shouldn't struggle with low-contrast text."],
          ["Accessible by default", "accessibility is not a feature to add later; it's the baseline. If it's not accessible, it's broken. Keyboard navigation, screen reader support, sufficient color contrast, focus management, and operable controls are not 'nice to haves' — they're the minimum viable interface."],
          ["Prevent errors before they happen", "the best error message is the one the user never sees. Design to prevent mistakes, not just recover from them. Required fields should be marked before the user tries to submit. Destructive actions should require confirmation. Invalid input should be caught on blur, not on submit."],
        ].map(([title, desc], i) => (
          <Stack key={i} gap="xs">
            <Text>
              <strong>{i + 11}. {title}</strong> — {desc}
            </Text>
          </Stack>
        ))}
      </Stack>

      <Heading level={2}>Token defaults</Heading>

      <Heading level={3}>Spacing — 8pt grid</Heading>
      <Text>
        Shared convention across Material Design, IBM Carbon, and USWDS. All spacing is a multiple
        of 8px; 4px exists only for micro-adjustments.
      </Text>
      <Text>
        <code>4px · 8px · 16px · 24px · 32px · 48px · 64px</code>
      </Text>

      <Heading level={3}>Typography</Heading>
      <Text>
        A small, locked type scale (six steps is enough for almost anything) and a system font stack
        by default — don&apos;t pay a web-font loading cost until you deliberately opt into one.
      </Text>
      <Stack gap="xs" style={{ paddingLeft: "var(--rebar-space-md)" }}>
        <Text><code>12px</code> — captions, metadata</Text>
        <Text><code>14px</code> — secondary text, inputs</Text>
        <Text><code>16px</code> — body text (base)</Text>
        <Text><code>20px</code> — subheadings</Text>
        <Text><code>24px</code> — section headings</Text>
        <Text><code>32px</code> — page titles</Text>
        <Text><code>line-height: 1.5</code></Text>
      </Stack>

      <Heading level={3}>Color — semantic tokens only</Heading>
      <Text>
        Never a raw hex value in component usage — always a semantic role: <code>primary</code>,{" "}
        <code>danger</code>, <code>success</code>, <code>warning</code>, <code>info</code>,{" "}
        <code>text-primary</code>, <code>text-secondary</code>, <code>bg-primary</code>,{" "}
        <code>bg-secondary</code>, <code>border</code>. WCAG 2.1 AA contrast (4.5:1 body text, 3:1
        large text) is the enforced minimum, not a suggestion.
      </Text>

      <Heading level={2}>Component-level defaults</Heading>

      <Stack gap="sm">
        <Text>
          <strong>Buttons</strong> — one primary (colored, filled) action per screen or modal;
          everything else is secondary/tertiary (outlined or text-only, not colored) so the primary
          action stays recognizable. Minimum 44×44px touch target. Loading state disables the button
          and shows a spinner, preventing double-submit.
        </Text>
        <Text>
          <strong>Forms</strong> — labels above inputs, not beside them. Consistent gap between
          label and input, and a larger gap between separate form items (Gestalt proximity). Inline
          validation on blur. Errors render below the field, in the danger color, with specific and
          actionable text.
        </Text>
        <Text>
          <strong>Tables</strong> — paginate at a sensible default row count; add search/filter once
          the row count passes a threshold; skeleton loading state for rows, not a spinner.
        </Text>
        <Text>
          <strong>Modals</strong> — close button top-right, backdrop-click-to-close, Esc-to-close,
          focus trapped while open, primary action right-aligned in the footer.
        </Text>
        <Text>
          <strong>Loading states</strong> — skeleton loaders for content (perceived-performance win
          over spinners), spinners for short-duration button/action feedback, progress bars for
          anything over ~5 seconds.
        </Text>
      </Stack>

      <Heading level={2}>Using this with an AI coding agent</Heading>

      <Text>
        If your project has a <code>CLAUDE.md</code>/<code>AGENTS.md</code>, reference this file
        from it (e.g. &quot;Follow <code>HEURISTICS.md</code> for spacing, color, and interaction
        defaults unless the design system says otherwise&quot;) so an agent building UI in your repo
        has a concrete standard to check its own work against, instead of inventing spacing/color
        choices per screen.
      </Text>

      <Text color="secondary" size="sm">
        Maintained as part of Rebar UI (the <code>rebar-ui</code> npm package) — see that
        project&apos;s own <code>ref/HEURISTICS.md</code> for the fuller version with
        Rebar-specific implementation notes (CSS variable names, exact component behavior) if
        you&apos;re using the library directly.
      </Text>
    </Stack>
  );
}
