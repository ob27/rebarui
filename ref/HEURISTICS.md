---
title: Rebar UI — Default heuristics and design tokens
status: living document
---

# Rebar UI — Default heuristics and design tokens

Rebar's whole pitch is that the developer never makes a visual or interaction-design decision
unless they choose to. This document is the source of truth for the defaults that make that true.
Two kinds of rule, kept distinct because they're sourced and enforced differently:

- **Behavioral heuristics** — qualitative, from published usability research. Nielsen's and
  Shneiderman's exact wording is their copyrighted expression; the underlying principles are
  standard, decades-old usability knowledge and are what Rebar's component *behavior* (not
  copy-pasted text) must satisfy. Cited here for traceability, not reproduced as their original
  text.
- **Token values** — quantitative (pixel/color/font values). These come from systems that actually
  publish numbers (Material Design, IBM Carbon, USWDS), used as reasonable starting values.
  Nothing here is sacred — a project migrating off Rebar overrides all of it via the CSS variables
  it's defined as.

Licensing note: **Laws of UX** (lawsofux.com) is CC BY-NC-SA-licensed. Fine to link to for further
reading; don't reproduce its text verbatim in Rebar's shipped docs if Rebar or its docs are ever
monetized.

## Behavioral heuristics components must satisfy

From Nielsen's 10 usability heuristics (1994) and Shneiderman's Eight Golden Rules (1998), plus
Gestalt principles of visual perception (1920s psychology, public domain):

1. **Visibility of system status** — every async action shows a loading/success/error state within
   ~300ms of the interaction.
2. **Match with the real world** — components accept plain-language labels; no jargon in built-in
   copy.
3. **User control and freedom** — every modal/dialog is closable via close-button, backdrop click,
   and Esc; every destructive action is confirmable, never silently auto-corrected (see
   [ARCHITECTURE.md](ARCHITECTURE.md#theming-mechanism) — this is also why Rebar never silently
   rewrites a developer's values).
4. **Consistency and standards** — one token set, one type scale, one spacing scale, applied
   identically across every component; no per-component one-off values.
5. **Error prevention** — required fields marked, submit disabled until valid, inline validation on
   blur rather than every keystroke.
6. **Recognition over recall** — labels above inputs, visible options over hidden menus where
   feasible.
7. **Flexibility and efficiency of use** — full keyboard operability everywhere (Tab, Enter/Space,
   Esc, arrow keys) — this is also the mechanism that makes components genuinely Playwright- and
   screen-reader-navigable, not a separate concern.
8. **Aesthetic and minimalist design** — components show only what's relevant by default (e.g. a
   data table shows a bounded column set and paginates rather than dumping everything at once).
9. **Help users recognize, diagnose, and recover from errors** — error messages are specific and
   actionable ("Email is required," not "Error 400").
10. **Proximity, similarity, closure (Gestalt)** — enforced structurally by the spacing scale and
    component composition rules below, not left to per-app judgment.

## Token values (defaults, fully overridable)

### Spacing — 8pt grid
Convention shared by Material Design, IBM Carbon, and USWDS. All spacing is a multiple of 8px;
4px exists only for micro-adjustments.

```css
--rebar-space-0: 0px;
--rebar-space-xs: 4px;
--rebar-space-sm: 8px;
--rebar-space-md: 16px;
--rebar-space-lg: 24px;
--rebar-space-xl: 32px;
--rebar-space-2xl: 48px;
--rebar-space-3xl: 64px;
```

### Typography
Six-step type scale (Material/Carbon convention), system font stack by default (no web-font
loading cost until a theme opts in — the sketch theme opts in explicitly, to a hand-drawn-style
font).

```css
--rebar-font-size-xs: 12px;   /* captions, metadata */
--rebar-font-size-sm: 14px;   /* secondary text, inputs */
--rebar-font-size-md: 16px;   /* body text (base) */
--rebar-font-size-lg: 20px;   /* subheadings */
--rebar-font-size-xl: 24px;   /* section headings */
--rebar-font-size-2xl: 32px;  /* page titles */
--rebar-line-height: 1.5;
```

### Color — semantic tokens only
Never a raw hex value in component source or usage; always a semantic role.

```css
--rebar-color-primary: #0066cc;
--rebar-color-danger: #d32f2f;
--rebar-color-success: #2e7d32;
--rebar-color-warning: #f57c00;
--rebar-color-text-primary: #212121;
--rebar-color-text-secondary: #757575;
--rebar-color-bg-primary: #ffffff;
--rebar-color-bg-secondary: #f5f5f5;
--rebar-color-border: #e0e0e0;
```

WCAG 2.1 AA contrast (4.5:1 body text, 3:1 large text) is the enforced minimum for the shipped
`clean` and `sketch` themes; a dev-mode warning (not a silent rewrite) fires if a custom override
drops below that ratio.

### Breakpoints
```css
--rebar-breakpoint-sm: 640px;
--rebar-breakpoint-md: 768px;
--rebar-breakpoint-lg: 1024px;
--rebar-breakpoint-xl: 1280px;
```

## Component-level defaults (behavior, not just tokens)

- **Buttons** — one `variant="primary"` per screen/modal is the convention (dev-mode warning, not
  a hard block, if a second primary appears); minimum 44×44px touch target; loading state disables
  the button and shows a spinner, preventing double-submit.
- **Forms** — labels above inputs; `md` spacing between label/input, `lg` spacing between form
  items; inline validation on blur; errors render below the field in the danger color.
- **Tables** — paginate at a sensible default row count; search/filter appears automatically past a
  size threshold; skeleton loading state, not a spinner, for row-level loading.
- **Modals** — close button top-right, backdrop-click-to-close, Esc-to-close, focus trap while
  open, primary action right-aligned in the footer.
- **Clear layer separation** — whenever one piece of content renders in front of another on the
  same screen (a modal over the page, a dropdown over a list, a loading overlay over dimmed
  content), the two layers need their own distinct visual surface, not just z-index stacking. This
  is Material Design's elevation system made explicit: shadow, a scrim, a background color change,
  or a blur are what tell a viewer which layer is "in front" — z-index alone is invisible, so
  without one of these, content on both layers can visually blend into an ambiguous mess, especially
  if the front layer has no background of its own and just floats directly over the back layer's
  content. Found concretely in `Spin`: its loading overlay originally had no background at all — a
  bare icon and label floating directly on top of the dimmed content underneath, with nothing
  marking it as a separate surface — fixed by giving the overlay its own background (see
  `.rebar-spin-overlay` in `packages/core/src/styles/style.css`), the same treatment `Dialog`'s
  backdrop and `Dropdown`'s panel already had.
- **Space-dense content on a text-dominant page** — once a page whose content is mostly prose
  needs to show more than ~4 non-text elements in a row (screenshots, photos, cards), they belong
  in a space-minimizing container (`Carousel` is the default) rather than an inline grid. A wall of
  thumbnails breaks reading flow and works against heuristic #8 above (aesthetic and minimalist
  design) — showing all of them at once isn't more informative, it's more to scroll past. The ~4
  threshold is a starting default, not a hard rule; override it per page if the content genuinely
  needs to be scannable all at once (e.g. a dedicated gallery page, where images *are* the content).
- **A carousel holds one aspect ratio, never mixed, no exceptions** — every slide in a single
  `Carousel` must share the same aspect ratio (e.g. all 16:9, or all square). This isn't just a
  coherence preference: `Carousel`'s viewport has one fixed height sized to its content, so a
  shorter-ratio slide next to a taller one leaves visible dead space rather than the container
  resizing per slide — a real layout bug, not a matter of taste. If a page has both, e.g. portrait
  photos and landscape photos to show, that's two separate `Carousel` instances (each internally
  consistent), not one mixed one. A reference catalog that needs to show many *different* ratios
  side by side (e.g. "here is every supported aspect ratio") is exactly the case a `Carousel` can't
  serve — use a plain wrapping grid instead (each item sized to its own ratio, no shared viewport
  height to break), same as the space-dense-content heuristic's own gallery-page exception above.
- **Long text-dominant pages need a section index** — once a text-dominant page has more than 3
  sections (top-level headings), add an index nav linking to each one, so a reader can jump
  straight to the part they need rather than scrolling past everything else — this is heuristic #6
  above (recognition over recall) applied at the page-navigation level, not just within a
  component. Side convention: **left is reserved for cross-page/site navigation** (switching to a
  *different* page — the existing sidebar pattern on `/components/*` and `/docs/*`); an in-page
  section index (jumping between headings on the *current* page) goes on the **right**, so the two
  kinds of navigation never compete for the same slot. The ~3 threshold is a starting default, not
  a hard rule; a short page that happens to have 4 brief headings doesn't need one if it's all one
  scroll's worth of content anyway — judge by whether scrolling past unrelated sections to reach
  the target one is actually the friction, not by the raw heading count alone.

These defaults live in `packages/core` component implementations and `packages/theme-*`
stylesheets — this document is the reference for what those values *should* be and why, kept in
sync as the implementation evolves.
