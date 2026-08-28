# UI Design Heuristics

A portable reference for sensible UI defaults — copy this file into any project (as
`HEURISTICS.md`, alongside a `CLAUDE.md`/`AGENTS.md` if you use one) so a developer or an AI
coding agent has a concrete standard to build against, instead of re-deciding spacing, color, and
interaction defaults on every screen. Framework-agnostic: everything here is guidance, not tied to
any specific component library, though it originated as the default rules baked into Rebar UI's
components (the `rebar-ui` npm package).

Two kinds of rule, kept distinct because they're sourced differently:

- **Behavioral heuristics** — qualitative, from published usability research. Cited here for
  traceability; the exact wording of the canonical lists (Nielsen's, Shneiderman's) is their
  copyrighted expression, but the underlying principles are decades-old, standard usability
  knowledge that any project can and should apply.
- **Token values** — quantitative (pixel/color/font values), from systems that actually publish
  numbers (Material Design, IBM Carbon, USWDS). Reasonable starting values, not sacred — override
  freely once your project has its own design system.

One licensing note: **Laws of UX** (lawsofux.com) is CC BY-NC-SA-licensed. Fine to link to and be
inspired by; don't reproduce its text verbatim in anything monetized.

## Behavioral heuristics

From Nielsen's 10 usability heuristics (1994), Shneiderman's Eight Golden Rules (1998), and
Gestalt principles of visual perception (1920s psychology, public domain):

1. **Visibility of system status** — every async action shows a loading/success/error state
   within ~300ms of the interaction.
2. **Match with the real world** — plain-language labels, no jargon in UI copy.
3. **User control and freedom** — every modal/dialog is closable via close-button, backdrop click,
   and Esc; destructive actions are confirmable, never silently auto-applied.
4. **Consistency and standards** — one spacing scale, one type scale, one color-token set, applied
   identically everywhere; no per-screen one-off values.
5. **Error prevention** — required fields marked, submit disabled until valid, inline validation
   on blur rather than on every keystroke.
6. **Recognition over recall** — labels above inputs, visible options over hidden menus where
   feasible, one clearly primary action per screen.
7. **Flexibility and efficiency of use** — full keyboard operability everywhere (Tab, Enter/Space,
   Esc, arrow keys) — this is also what makes a UI genuinely screen-reader- and
   automated-test-navigable, not a separate concern from accessibility.
8. **Aesthetic and minimalist design** — show only what's relevant by default (a data table shows
   a bounded column set and paginates, rather than dumping everything at once).
9. **Help users recognize, diagnose, and recover from errors** — error messages are specific and
   actionable ("Email is required," not "Error 400").
10. **Proximity, similarity, closure (Gestalt)** — enforce these structurally via a consistent
    spacing scale and composition rules, not left to per-screen judgment.

## Token defaults

### Spacing — 8pt grid
Shared convention across Material Design, IBM Carbon, and USWDS. All spacing is a multiple of
8px; 4px exists only for micro-adjustments.

```
4px · 8px · 16px · 24px · 32px · 48px · 64px
```

### Typography
A small, locked type scale (six steps is enough for almost anything) and a system font stack by
default — don't pay a web-font loading cost until you deliberately opt into one.

```
12px  captions, metadata
14px  secondary text, inputs
16px  body text (base)
20px  subheadings
24px  section headings
32px  page titles

line-height: 1.5
```

### Color — semantic tokens only
Never a raw hex value in component usage — always a semantic role: `primary`, `danger`,
`success`, `warning`, `info`, `text-primary`, `text-secondary`, `bg-primary`, `bg-secondary`,
`border`. WCAG 2.1 AA contrast (4.5:1 body text, 3:1 large text) is the enforced minimum, not a
suggestion.

## Component-level defaults

- **Buttons** — one primary (colored, filled) action per screen or modal; everything else is
  secondary/tertiary (outlined or text-only, not colored) so the primary action stays
  recognizable. Minimum 44×44px touch target. Loading state disables the button and shows a
  spinner, preventing double-submit.
- **Forms** — labels above inputs, not beside them. Consistent gap between label and input, and a
  larger gap between separate form items (Gestalt proximity). Inline validation on blur. Errors
  render below the field, in the danger color, with specific and actionable text.
- **Tables** — paginate at a sensible default row count; add search/filter once the row count
  passes a threshold; skeleton loading state for rows, not a spinner.
- **Modals** — close button top-right, backdrop-click-to-close, Esc-to-close, focus trapped while
  open, primary action right-aligned in the footer.
- **Loading states** — skeleton loaders for content (perceived-performance win over spinners),
  spinners for short-duration button/action feedback, progress bars for anything over ~5 seconds.

## Using this with an AI coding agent

If your project has a `CLAUDE.md`/`AGENTS.md`, reference this file from it (e.g. "Follow
`HEURISTICS.md` for spacing, color, and interaction defaults unless the design system says
otherwise") so an agent building UI in your repo has a concrete standard to check its own work
against, instead of inventing spacing/color choices per screen.

---

Maintained as part of Rebar UI (the `rebar-ui` npm package) — see that project's own
`ref/HEURISTICS.md` for the fuller version with Rebar-specific implementation notes (CSS variable
names, exact component behavior) if you're using the library directly.
