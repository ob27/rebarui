---
title: Rebar UI — Default heuristics and design tokens
status: living document
---

# Rebar UI — Default heuristics and design tokens

Rebar's whole pitch is that the developer never makes a visual or interaction-design decision
unless they choose to. This document is the source of truth for the defaults that make that true.

Everything numbered below is a **heuristic**, not a **Framework Rule** — a distinct, narrower
category kept elsewhere (`robot.md`, `CLAUDE.md`): a fixed, mechanical constraint on how Rebar
itself is built or used (every component forwards `data-*`/`aria-*`, theming is CSS variables
only, a block is always built from real components), binary and non-negotiable, with exactly one
correct answer. A heuristic is the opposite in kind: a general, judgment-requiring design
principle a component or block's *behavior* should satisfy, requiring interpretation to apply to
a new, non-obvious situation — recognizing that it applies, then deciding the concrete UI, not a
mechanical check. Each entry's "Component rule" line is the *result* of that judgment for one
real component, not the heuristic itself — a future component in a similar situation still needs
the same judgment applied fresh, not just that line copied.

Two kinds of heuristic, kept distinct because they're sourced and enforced differently:

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
   ~300ms of the interaction, *and* the user never has to guess what's active, selected, or current:
   active tabs, selected items, and sort direction are always visually indicated via highlight,
   checkmark, or other persistent cue, not just during the action itself. Two faces of the same
   principle — transient feedback and persistent state — not two separate rules. Component rule:
   `Tabs` highlights the active tab; `Breadcrumb` highlights the current location; `Progress` shows
   percentage or fraction; a sortable table shows a sort-direction indicator on its active column.
2. **Match with the real world** — components accept plain-language labels; no jargon in built-in
   copy.
3. **User control and freedom** — every modal/dialog is closable via close-button, backdrop click,
   and Esc; every destructive action is confirmable, never silently auto-corrected (see
   [ARCHITECTURE.md](ARCHITECTURE.md#theming-mechanism) — this is also why Rebar never silently
   rewrites a developer's values). "Are you sure?" alone isn't a real confirmation — name the
   specific action and its consequence ("Delete 3 files permanently?", not "Are you sure?"), and
   the confirming button names the action itself ("Delete," not "OK") in the danger color, visually
   separated from safe actions nearby.
4. **Consistency and standards** — one token set, one type scale, one spacing scale, applied
   identically across every component; no per-component one-off values.
5. **Error prevention** — required fields marked, submit disabled until valid, inline validation on
   blur rather than every keystroke.
6. **Recognition over recall** — labels above inputs (never beside them — side-aligned labels force
   a zigzag scan and weaken the visual link to what they describe), visible options over hidden
   menus where feasible. Forms default to a single column for the same reason multi-column layouts
   fight recognition: a linear top-to-bottom scan is what makes a form's next required action
   obvious without backtracking.
7. **Flexibility and efficiency of use** — full keyboard operability everywhere (Tab, Enter/Space,
   Esc, arrow keys) — this is also the mechanism that makes components genuinely Playwright- and
   screen-reader-navigable, not a separate concern.
8. **Aesthetic and minimalist design** — components show only what's relevant by default (e.g. a
   data table shows a bounded column set and paginates rather than dumping everything at once). See
   also #17 (progressive disclosure) for the same principle applied to option/item counts
   specifically, and #35 (whitespace) for how it's expressed spatially.
9. **Help users recognize, diagnose, and recover from errors** — error messages are specific and
   actionable ("Email is required," not "Error 400").
10. **Proximity, similarity, closure (Gestalt)** — enforced structurally by the spacing scale and
    component composition rules below, not left to per-app judgment: related controls sit close
    together (a small gap, `--rebar-space-xs`) and unrelated groups sit apart (a larger gap,
    `--rebar-space-md` or more) — the gap itself, not a label or border, is what tells a viewer
    which controls belong together.

## Visual and component heuristics

Derived from a second-pass analysis of 176 historical GUI critiques, plus a further pass
cataloguing components across 180+ published UI libraries/design systems looking for patterns not
yet captured above. That second pass surfaced far more candidate heuristics than survived contact
with editing — many were restatements of the same underlying principle from a different library's
vocabulary, or granular enough to be a detail of an existing rule rather than a new one. What
follows is post-de-duplication: **6 heuristics below (originally distinct entries) were merged into
a broader existing one** rather than kept as separate numbered rules, specifically because keeping
near-duplicates as separate "heuristics" would have made this document read as padded to hit a
count rather than a genuinely distinct set of principles — noted inline at each merge point for
traceability, not because the merged content was wrong. Historical GUI citations ("seen failing
in") pair each rule with a real interface that got it wrong, not an invented example.

A number of the "Component rule" notes below describe a component or prop that doesn't exist in
`packages/core` yet (`Settings`, `Table` as a standalone component rather than a `@rebar-ui/
placement` archetype, `Toolbar`, `DatePicker`, `Transition`, a searchable `Combobox`/
`Autocomplete`). That's intentional and stated plainly, not an oversight: this document is forward
guidance for what a future component *should* do once built, as much as a record of current
behavior — the same "living document" status this file has always had. Where a real,
already-shipped component already satisfies a rule under a different name, the rule says so.

Two entries below were checked directly against source (`packages/core/src/components/`) during
the component-catalogue cross-reference and found to overclaim real components' current behavior —
corrected in place rather than left standing: #14 (`Dropdown` doesn't yet auto-insert separators at
an item-count threshold) and #27 (`Select` is browsing-only today, no type-to-filter).

11. **Information architecture as pyramid** — don't split related content onto different pages where
    a filter or search could reduce page count. IA should be "pointy at the top, broader the
    further down you go" — start with high-level categories, then progressively reveal detail. A
    flat list of 30+ options or deep nesting (>2 levels) signals a failed information architecture.
    Seen failing in: GEM 3.1.1 Preferences (flat list, no categories), early Mac prefs (scattered
    settings across multiple panels), Amiga "All Files" submenu (cryptic abbreviations, no
    grouping). Component rule: a settings interface uses tabbed categories or sidebar navigation;
    the `table` archetype (`@rebar-ui/placement`) and any future standalone `Table` component
    provide search/filter before pagination; avoid deep nesting in any navigation structure. This is
    the rule behind this site's own `/components` and `/docs/heuristics` nav gaining a search bar
    and category filter once their item count grew past a flat list a reader could scan directly.

12. **Visual hierarchy in every container** — every dialog, panel, or card has three zones (title,
    content, actions) with clearly differentiated visual weight (size, weight, spacing). Users
    should scan the container's purpose in under a second. A wall of same-sized text is a wall of
    same-weight text — nothing stands out, nothing is scannable. Seen failing in: GEM 2.0 About
    (all text same size/weight), A2 dialog (no visual separation between zones), DVX help (no
    differentiation between heading and body). Component rule: `Dialog` title ≥1 step larger than
    body text; action buttons separated from content by ≥1 spacing unit; primary action visually
    dominant; components use semantic type tokens (`heading`, `body`, `caption`, `label`), never
    raw font sizes. `Card` (#29 below) is this same zone structure applied to a self-contained unit.

13. **Icons require labels or tooltips** — every icon has an adjacent text label, a tooltip, or
    both. Icons alone force guesswork; labels remove ambiguity. The only exception is a small set
    of universally recognized icons (trash = delete, magnifying glass = search, hamburger = menu)
    in a context where the user has already learned them. Seen failing in: Mac desktop icons
    (unlabeled, forced inference), Cedar forest icons (no text, ambiguous meaning), GEM 2.0 desktop
    (30+ unlabeled icons). Component rule: an icon-only button requires either `aria-label`, a
    visible `label` prop, or a `title` attribute; icon-only buttons trigger a dev-mode warning.

14. **Menus manage their own complexity** — a menu with more than ~8 items auto-inserts separators
    or collapses into submenus. Related items are grouped; destructive actions are separated from
    safe ones. Deep nesting (>2 levels) is avoided — if a submenu itself needs a submenu, the
    information architecture is wrong. Seen failing in: Amiga "All Files" submenu (cryptic
    abbreviations, no grouping), TOS file manager (flat list of 15+ items without separators).
    Component rule: `Dropdown` (real, Radix-backed) supports a `danger` flag per item, giving
    destructive actions real visual separation from safe ones today; auto-inserting separators
    past an item-count threshold is not yet built (forward guidance, not current behavior) — until
    it is, keep any one `Dropdown` under the #17 ceiling by hand rather than relying on the
    component to manage overflow for you. See #17 below for the same item-count ceiling applied
    more generally, outside menus specifically.

15. **Settings are categorized, searchable, and resettable** — any preferences or settings interface
    categorizes options by purpose (Display, Sound, Network), provides search for power users,
    explains what each option does, and offers reset-to-defaults. A flat list of 30+ toggles is a
    failed settings panel. Users who've made several changes need a safe way to experiment — without
    reset, they can't undo what they don't remember changing. Seen failing in: GEM 3.1.1 Preferences
    (flat list, no categories, no explanations, no reset), TOS Preferences (no reset button).
    Component rule: a settings interface provides tabbed or sidebar categories; each setting has a
    label and optional description; the panel offers a "Reset to Defaults" button; `Form` supports a
    `reset()` method that restores initial values.

16. **Charts ship with context** — every chart, graph, or data display has a title (what), axis
    labels or legend (how to read it), and units (in what measure). A chart without context is
    decoration, not information. Seen failing in: GSX Graph chart (no title, no legend, no axis
    labels — meaningless without accompanying text). Component rule: a chart component ships with
    mandatory title, legend, and axis-label slots; render a visible placeholder when data is
    absent, never a blank area — see `/benchmarks`'s own `ScatterChart`/`LineChart` helpers for a
    real, shipped example of this (title and axis labels are required arguments, not optional).

17. **Progressive disclosure: default to ≤7-9 visible options** — show essential options first;
    reveal advanced options on demand, respecting Miller's Law (people reliably track 7±2 items at
    once). Default state shows 5-9 visible options; longer lists need search, filtering, grouping,
    or an explicit "Advanced"/expand step, not more items crammed into the default view. Multi-step
    processes (tutorials, wizards, setup) show progress and provide a visible exit. *(Merged from
    two originally separate entries — "progressive disclosure" and "limit visible options to
    7±2" — which were the same underlying constraint stated at two different levels of
    specificity.)* Seen failing in: GEM 3.1.1 Preferences (all options visible at once, no
    prioritization), Apple II Desktop dialog (three columns of options, all visible, overwhelming),
    Mac 1.1 windows tutorial (no progress indicator, no skip option), dropdowns with 30+ items and
    no search. Component rule: `Select`/`Dropdown` show a bounded default item count before
    requiring search or scrolling; `Steps` shows current step / total steps with a visible
    cancel/skip action; a settings interface defaults to ≤7 visible options with an "Advanced"
    expandable section. Built and shipped: `Wizard`'s own step header applies this to itself —
    beyond 3 steps it stops rendering one item per step (the same unbounded-list problem this rule
    already names for `Select`/`Dropdown`) and instead windows to the current step plus the next
    one, replacing everything else with a leading "N Done"/trailing "N todo" bucket item, so a
    100-step wizard's header stays exactly as wide as a 4-step one's.

18. **Menus don't obscure their content** — dropdowns, popovers, and menus position themselves to
    avoid permanently obscuring the content they control. A menu that covers the document it's
    formatting is a failed menu. Backgrounds should be solid or subtly textured, not dithered or
    noisy — dithering creates visual fatigue and reduces legibility. Background colors should be
    muted, not aggressively saturated — high-saturation backgrounds cause visual fatigue and reduce
    legibility of foreground content. Seen failing in: GS/OS text editor (Style menu covers document
    being formatted), GEM 1.1 (menu bar covers file list), A2 dialog (dithered background), DVX
    help (bright saturated background). Component rule: `Dropdown`/`Popover`/`HoverCard` position
    themselves below or above the trigger based on available space, never over the content they
    relate to (Radix's own collision-aware positioning, not reimplemented here); background colors
    use solid fills with muted, desaturated tones; saturated colors are reserved for accents, alerts,
    or interactive elements.

19. **Touch targets are at least 44×44px** — interactive elements on touch devices have a minimum
    touch target size of 44×44 CSS pixels (Apple HIG) or 48×48dp (Material Design). Smaller targets
    increase misclick rates and user frustration, especially on mobile. Applies most directly to the
    forthcoming Mobile Components set, but any web component reachable on a touch device is held to
    the same bar. Seen failing in: small icon buttons, tightly packed toolbars, links with
    insufficient padding. Component rule: every interactive element has minimum dimensions of
    44×44px; padding ensures the touch target meets this minimum even if the visual element is
    smaller; a dev-mode warning triggers for targets below 44×44px.

20. **Loading, error, empty, and disabled states are all designed, not just the happy path** — every
    component has all four states designed, not left to render blank or generic. Users encounter
    edge cases regularly; unhandled states break trust and workflows. The loading state specifically
    uses a skeleton matching the content's real layout (`Skeleton`, already shipped), not a bare
    spinner or blank area — a skeleton sets expectations for content structure in a way a spinner
    can't, and reduces perceived wait time. *(Merged from two originally separate entries — "design
    for all states" and "loading states use skeleton screens" — the latter was really the loading
    case of the former, spelled out.)* Seen failing in: components that show blank areas when
    loading, generic error messages, no empty state for lists, a disabled state visually identical
    to the enabled one. Component rule: every component documents and implements `loading`
    (`Skeleton`, or `Spin` for an in-place indicator), `error` (a specific message with a recovery
    action, per #9 above), `empty` (`Empty`, already shipped), and `disabled` (visually distinct,
    with a tooltip explaining why) states.

21. **Animation is purposeful and 200-500ms** — animation serves a purpose: providing feedback,
    showing continuity, or directing focus. Duration is 200-500ms (fast enough to feel responsive,
    slow enough to be perceived). Animation without purpose is distraction. Seen failing in:
    gratuitous animations that slow down workflows, animations >1s that feel sluggish, animations
    <100ms that are imperceptible. Component rule: any future transition/animation primitive enforces
    duration between 200-500ms by default, tied to real state changes (hover, focus, mount/unmount);
    `prefers-reduced-motion` disables non-essential animation — already true today of `Spin`'s
    illustrated variants, see `packages/core/src/styles/style.css`. Components ship with purposeful
    defaults: `Dialog` fades in, `Dropdown` slides down, `Toast` (real, shipped, via
    `ToastProvider`) slides in from the edge. One nuance the component-catalogue research
    surfaced (react-spring's design principle): an in-flight animation must be interruptible —
    re-triggering the same transition (e.g. re-hovering before a previous hover-out finished)
    should smoothly retarget from wherever the animation currently is, not restart from 0 or snap,
    since a duration alone doesn't guarantee that without deliberate handling.

22. **Controls map naturally to their effects** — spatial or logical mapping between controls and
    what they affect. A volume slider on the left controls the left speaker; a light control that
    looks like a light switch is easier to understand than a dropdown. Natural mappings reduce
    cognitive load. Seen failing in: controls arranged arbitrarily with no spatial relationship to
    their effects, abstract labels for concrete actions. Component rule: `Slider` and other spatial
    controls position themselves logically relative to their targets; `Button` labels describe the
    action verb ("Save", "Delete") not an abstract noun ("Confirmation", "Removal").

23. **Follow platform conventions** — respect platform-specific patterns (iOS tab bar at bottom,
    Android at top; macOS menus in the menu bar, Windows in the title bar). Users bring expectations
    from the platform; violating them increases cognitive load. This rule mostly targets the
    forthcoming Mobile Components set (rebar-ui today is web-only, and web has its own, looser
    convention space) — recorded now so it's a stated design constraint by the time that set exists,
    not retrofitted after the fact. Seen failing in: iOS apps with top tab bars, web apps that ignore
    browser conventions. Component rule (forward-looking): a future mobile tab bar defaults to the
    bottom on iOS, top on Android, without the app needing to specify it per-platform.

24. **Whitespace is an active design element** — whitespace separates, groups, and creates
    hierarchy; it is not wasted space. Adequate whitespace between sections, around components, and
    within components improves legibility and scannability. Seen failing in: cramped layouts with no
    breathing room, components touching each other, dense text blocks. Component rule: components
    use spacing tokens (`--rebar-space-*`) for all margins and padding; no component ships with
    `margin: 0`/`padding: 0` unless explicitly overridden by the consumer.

25. **Button hierarchy is clear** — primary, secondary, and tertiary buttons have distinct visual
    weight. One primary button per container; secondary buttons for alternative actions; tertiary
    (text/ghost) buttons for low-emphasis actions. Seen failing in: multiple primary buttons
    competing for attention, all buttons with same visual weight, unclear which action is
    recommended. Component rule: `Button` has three variants — `primary` (filled, dominant color),
    `secondary` (outlined), `tertiary` (text-only/ghost); one `primary` per dialog/form is the
    convention (a dev-mode warning, not a hard block, if a second one appears — see "Component-level
    defaults" below).

26. **Input constraints are visible** — character limits, required fields, format requirements, and
    valid ranges are shown before or during input, not after submission. Users should know
    constraints upfront to avoid errors. Seen failing in: forms that reject input after submission
    with no prior indication of constraints, character limits shown only in error messages.
    Component rule: a required field shows its indicator (asterisk or label text) before the user
    ever focuses it; `Input`'s native `maxLength`/`min`/`max`/`pattern` constraints display as helper
    text, not just a silent browser rejection; validation errors appear inline on blur (#5 above),
    not on submit.

27. **Multiple input methods are supported** — forms and data entry support both browsing/selecting
    and direct input. Users have different preferences; some want to browse a list, others want to
    type. Seen failing in: dropdowns that only allow selection, not typing; file pickers that don't
    allow pasting paths. Component rule: `Select` is browsing-only (checked against source — no
    type-to-filter); `Combobox` is the shipped answer, filling in the type-to-filter half of
    `Select` — a real WAI-ARIA combobox (search-as-you-type over its own option list), single-select
    by default or a multi-select dropdown via its `multiple` mode. `Form`'s `kind: "date"` field is
    already the manual-text-entry half of a date input (native, not a calendar popover); a future
    `DatePicker` fills in the remaining calendar-browsing half.

28. **Information scent in navigation** — navigation labels clearly indicate what's ahead, not vague
    or clever names. Users follow "information scent" — clues that lead them to their goal.
    Ambiguous labels break the scent. Seen failing in: navigation with cryptic labels ("Special",
    "Selector"), clever names that don't describe content, labels that don't match the destination
    page title. Component rule: `NavBar`/`Breadcrumb` labels match destination page titles; labels
    describe content, not abstract concepts; avoid clever metaphors unless universally understood
    (e.g., "Trash" for deletion).

29. **Cards are self-contained, independently actionable units** — a clear boundary (border,
    shadow, background) separates a card from its surroundings; it contains one coherent piece of
    content and can be acted on independently of any card next to it. The internal title/body/
    action zone structure is #12 above, applied specifically to a card — not a separate rule.
    Seen failing in: content blocks with no clear boundaries, cards that overflow or break layout,
    inconsistent card structure across a grid. Component rule: `Card` has a visible boundary
    (border or shadow) and consistent internal padding (`--rebar-space-md`); cards in a grid use
    consistent sizing so the grid doesn't break as content varies.

30. **Respect user intelligence — no condescension, no dark patterns** — treat users as capable
    problem-solvers, not children who need protecting from complexity or nudging toward a choice
    they didn't actually intend. This didn't come out of the GUI-critique corpus like #11-29 above;
    it's Shneiderman's "support internal locus of control" golden rule made concrete, and it earned
    its own numbered entry rather than folding into #3 (user control and freedom) because the two
    fail in different directions: #3 is about *recovering* from an action already taken (undo,
    confirmation, escape routes); this one is about not *manufacturing* the need for that recovery
    in the first place, by over-confirming trivial actions, hiding real functionality behind
    "simplified" layers a user can't opt out of, or wording a choice to trick rather than inform.
    Seen failing in: confirm-shaming ("No thanks, I don't want to save money"), a "decline" path
    styled to look disabled or hidden below the fold while "accept" is the only obviously-clickable
    option, a confirmation dialog for every low-stakes action regardless of consequence (which also
    trains users to reflexively click through *all* confirmations, undermining #3's real ones).
    Component rule: `Dialog`'s built-in confirmation pattern is reserved for actions with a real,
    named consequence (see #3) — Rebar ships no generic "are you sure?" wrapper a consumer could
    reach for on a trivial action; button and link copy names the actual action plainly in both the
    accept and decline directions (no asymmetric styling that makes one path harder to find or
    click); no component defaults to an opt-out pattern (e.g. a pre-checked upsell checkbox) for
    anything the user hasn't explicitly requested.

## Heuristics from the wider research pass (retro-OS critiques + framework inventories)

The same research pass that produced the component catalogue (`ref/research/`) also proposed 636
further numbered candidate heuristics beyond #1-30 above — 250 from reading historical GUI
screenshots (`ref/research/critiques/*.md`, one file per screenshot: System/2, Apple II and IIGS,
Amiga Workbench, Xerox Alto/Cedar/Vision, classic Mac, BeOS, eComStation, Visi On, and others) and
386 from cataloguing 180+ modern frameworks (`ref/research/component-inventories/*.md`). As
suspected going in, most of that volume was duplication, not signal: roughly 320 were independent
re-derivations of each other or of #1-30 above (folded into those entries' citation lists rather
than kept separate — not reproduced here to avoid bloating this document with citation lists that
don't change the guidance itself), about 140 were out of genre entirely (backend/server-framework
architecture, desktop-toolkit embedding/IPC, or component-library authoring/DX commentary — real
observations, but about building a library or a backend, not about a shipped component's visual or
behavioral contract, so they belong in `ARCHITECTURE.md` if anywhere, not here), about 69 were real
but out of rebar's scope (window managers, desktop wallpaper, browser chrome, paint tools — nothing
a web component library has or plans to have), and 4 were genre errors at the source (meta-advice
about writing a critique, not a UI rule at all). **10 survived as genuinely distinct, non-duplicate
principles** — kept to that count deliberately, the same "no padding to hit a quota" discipline
applied to the #11-30 de-dup above.

31. **Boot/init sequences show branded, phased progress, never a blank wait or an unreadable
    dump** — a system's startup sequence is itself a UI: it should communicate what phase is
    happening (hardware detection, memory init, device loading), distinguish which version of what
    is booting, and read as a deliberate, designed experience rather than either a silent blank
    screen or a stream of undifferentiated text. The app-shell-level analogue of #1 (visibility of
    system status) and #20 (designed loading states), applied to the one loading state that happens
    before any component exists yet to show it. Seen failing in: OS/2 1.3's boot screen (plain
    monospace copyright/patent dump, no phase indication), the Xerox Alto's four-stage boot sequence
    (raw memory addresses and device IDs, no consistent formatting across the four screens), Amiga
    Workbench 1.x's boot screen (mixes OS version and disk version with no visual distinction); seen
    working in Visi On's six-screen boot sequence (1983) — phased, consistently branded, ending in a
    clear hand-off to the workspace. Component rule (forward-looking): no app-shell/splash primitive
    exists in `packages/core` yet; when one does, it should reuse `Progress`/`Spin`'s existing state
    machine (already shipped) rather than inventing new plumbing, and show a phase label, not just a
    percentage.

32. **Storage/item-count context is always visible, not hidden behind a query** — any view over a
    bounded collection (a folder, a workspace, a list of files) shows its own size context — item
    count and available/used capacity — persistently in its own chrome, not only on demand. Users
    constantly need "how much is here / how much room is left" to decide whether an operation is
    safe; forcing a separate lookup breaks the flow of the primary task. Seen failing in: OS/2 1.3's
    File Manager (item count and disk space shown only in an easy-to-miss status bar, not the window
    itself), Apple II Desktop's folder windows (disk space shown inconsistently between windows),
    Amiga Workbench's title bar (omits memory/version context that "Get Info" then has to supply
    separately). Component rule: rebar already ships `Statistic`, `Descriptions`, and `Progress` — a
    future file/folder-browsing archetype (forward-looking, no such component exists yet) should
    compose these into a persistent header rather than requiring a separate dialog; `Progress` is
    the natural fit for "X of Y used" shown as a proportional bar, not a raw number.

33. **File/data browsers offer both an icon-grid view and a detailed, sortable-column table view of
    the same data** — the same collection should be viewable either as labeled icons (fast visual
    scanning, good for a small/unfamiliar set) or as a sortable table (name/size/date/type columns,
    good for a large/familiar set), with the user choosing per task rather than the tool forcing
    one. Seen failing in: Apple II Desktop's Copy dialog (icon-grid only, no column sort), Amiga
    Workbench's default desktop (icon-grid only); seen working in Tandy DeskMate's file manager
    (multi-column categorized table alongside an icon launcher) and eComStation's folder browser
    (split-pane, sortable columns). Component rule (forward-looking): no file-browser component
    exists in `packages/core` yet; when built, it should default to the `table` archetype
    (`@rebar-ui/placement`, already cited in #11) for the detail view and offer an icon-grid toggle,
    not the reverse.

34. **Decision dialogs show complete, undisambiguated context — full paths, not truncated names;
    absent state marked explicitly, not omitted** — when a dialog asks the user to decide something
    (overwrite this file? which slot is which?), it must show enough to disambiguate the choice:
    full source *and* destination paths in a conflict dialog, not just filenames that might
    collide; an empty slot explicitly labeled "(empty)," not silently left out of a list. A distinct
    failure mode from showing too little too late (#26) or skipping confirmation (#3) — this one is
    about *silent incompleteness*. Seen failing in: Apple II Desktop's file-overwrite conflict
    dialog (early versions showed only filenames, not full paths, leaving it unclear which of two
    same-named files was being replaced); seen working in its own "This Apple" system-info dialog,
    which explicitly lists empty expansion slots rather than omitting them. Component rule
    (forward-looking): a future file-conflict `Dialog` variant should render full paths via
    `Descriptions` (already shipped) rather than bare filename strings; any component listing a
    fixed-size set of slots should render an explicit empty/vacant state per slot rather than
    compacting the list.

35. **Preferences/appearance controls show a live preview before commit, with commit as an explicit
    action separate from save-to-disk and from cancel/revert** — when a setting affects appearance
    or behavior in a way the user can't fully predict from its label alone (a color, a pattern, a
    calibration value), the control shows the effect live as it's adjusted, and the panel offers
    distinct actions for "try it now" (Use/Apply) versus "keep it after restart" (Save) versus "undo
    everything" (Revert/Cancel) — collapsing these into one implicit commit either surprises the
    user with an unrecoverable change or fails to persist one they thought was already applied.
    Sharpens #15 (settings offer reset-to-defaults) with a distinct nuance: live-preview-then-
    explicit-commit, not just resettability after the fact. Seen failing in: Amiga Workbench 1.x's
    Control Panel (preview and commit conflated); seen working in Workbench 2.x/3.5's Preferences
    (separate Use/Save buttons; a color wheel plus numeric RGB entry, each updating a live swatch
    before commit) and classic Mac's icon-customization dialog (a live icon preview alongside
    OK/Cancel). Component rule: rebar's shipped `Slider` and `Switch` already support live
    `onChange` feedback — a future `Settings` interface (forward-looking, per this document's
    existing disclaimer) should wire that feedback to a visible preview region and expose
    Apply/Save/Cancel as three distinct actions, not one.

36. **A menu item needing further input before its action completes shows a trailing ellipsis
    ("…")** — a menu mixing "runs immediately" items ("Delete") with "opens a dialog first" items
    ("Rename…", "Preferences…") without visual distinction forces the user to click blind to find
    out which is which; the ellipsis convention (still standard in macOS/Windows/GNOME menus today)
    solves this with one character. Seen failing in: Apple II Desktop's Favorites menu (items that
    open a secondary dialog are visually identical to items that execute immediately). Component
    rule: `Dropdown` (real, Radix-backed, shipped) supports a `danger` flag per item (#14) but has no
    equivalent convention for "opens further input" today — a small, concrete gap: an
    `opensDialog`/ellipsis-suffix convention on `Dropdown`'s items would close it cheaply.

37. **Values entered as a set are shown as removable tokens/chips, not a raw delimited string** — a
    form field accepting multiple discrete values (tags, recipients, categories) renders each one as
    its own visible, individually-removable chip with a clear "×," rather than a single text box the
    user edits as comma-separated text and can silently mistype. Seen (as a positive pattern worth
    adopting, from the framework-inventory pass rather than a historical failure) in: GitHub
    Primer's `TextInputWithTokens` and Mantine's `TagsInput`. Component rule (forward-looking): no
    such control exists in `packages/core` yet; it's the natural companion to the `Combobox`/
    `Autocomplete` gap already noted under #27 — a "multi-select combobox" is exactly a tokenized
    input over a searchable list, so the two forward-looking components should probably ship
    together.

38. **Drag-and-drop has a visible drop-target affordance and a non-drag fallback — never drag-only**
    — a file-upload or reorderable-list interaction that only works by dragging excludes anyone who
    can't perform a drag gesture, and gives no visual cue about *where* a drop will land until
    mid-drag. A drop zone needs a persistent, labeled boundary, not an invisible hit-area revealed
    only on hover-while-dragging; every drag-only interaction needs an equivalent non-drag path — a
    "Browse…" button, or reorder buttons alongside a draggable list. A direct extension of #7 (full
    keyboard operability everywhere) applied specifically to drag-and-drop, not a new principle on
    its own. Seen as a positive pattern in: Shopify Polaris's `DropZone` (labeled dashed-boundary
    target, `Browse` button required, not optional). Component rule (forward-looking): no
    `Dropzone`/file-upload component exists in `packages/core` yet; when built, it should follow
    that same pattern as a non-optional default, matching the `FileUpload` gap already noted in the
    component catalogue.

39. **Code snippets ship with a one-click copy action and visible confirmation** — any block of
    code, a command, or a copyable identifier (an API key, a config value) renders with an attached
    copy button; clicking it gives immediate, visible feedback (a checkmark or "Copied!" label
    reverting after ~1-2s) rather than a silent clipboard write the user has to trust happened. A
    small, sharply-scoped pattern rebar's own docs site is a direct, immediate consumer of. Seen as a
    positive pattern in: IBM Carbon's `CodeSnippet` and its copy-button convention. Component rule:
    built as `CodeBlock` (`packages/core/src/components/CodeBlock.tsx`) — a "Copy" button that
    flips to "Copied!" for 2s on click, no separate fade transition (it's a plain label swap, not a
    toast element, so #21's 200-500ms transition convention doesn't apply here — there's no
    transition to time, only the dwell, which stays within the ~1-2s range this rule calls for).
    Deliberately no syntax highlighting or line numbers — this project's own code samples are short
    and illustrative, and a heavier code-block library would solve a problem this one doesn't have.
    Wired into `@rebar-ui/placement`'s `doc-section` `case "code":` rendering, so every printed code
    sample sitewide gets the copy button for free, not just new call sites.

40. **Components support internationalization: RTL layout mirroring and locale-aware formatting,
    not just English LTR** — a component library that hard-codes left-to-right assumptions
    (padding/margin on a fixed side, icons implying a reading direction, dates/numbers baked to one
    locale) breaks completely for right-to-left languages and silently misformats dates/numbers/
    currency for every other locale, rather than degrading gracefully. Checked directly against
    source: rebar-ui's `style.css` has no `dir`/RTL handling and no locale-formatting layer today —
    confirmed absent, not merely undocumented, so this is a genuine, currently-unaddressed gap, not
    a restatement of an existing rule. Seen as a stated design goal in: SAP's OpenUI5, whose
    component set is built RTL- and locale-aware from the start because its enterprise customer base
    spans both. Component rule (forward-looking): logical CSS properties (`margin-inline-start`
    rather than `margin-left`) in `packages/core`'s stylesheets, and a documented locale-formatting
    hook for `Statistic`/date-bearing components, would be the concrete first steps; neither exists
    today.

41. **Lifecycle status is a pill, never inline parenthetical text or a full sentence** — an
    item's build/lifecycle status (planned, deprecated, experimental, unmeasured) renders as a
    distinct badge next to its name, never appended into the name itself ("Avatar (planned)") and
    never spelled out as a sentence competing with the item's own content for attention. Caught on
    this project's own `/components` page, where two different ad hoc string patterns did this
    same job inconsistently across the same list. Component rule: `NavIndex`'s status field, and
    anywhere else an item's build status needs surfacing, renders via the real `Tag` component —
    never string concatenation.

42. **Filter UI matches how many independent dimensions a list varies along, and each dimension's
    control matches how many values it has** — a search box alone suffices only when every item
    belongs to one category; each further way items differ (category, then status, ...) is a
    second, independent dimension needing its own filter, not folded into the first. The control
    for a given dimension then scales to that dimension's own size, in three real tiers: a small
    fixed few is a toggle; a larger but still-scannable set where more than one value may need
    selecting at once is a closed-menu multi-select; a set large enough that scanning it (checked
    or not) is itself the friction is a searchable multi-select. These three are genuinely
    different, separately-established interaction patterns, not one restyled three ways — using
    the wrong tier for a dimension's real size is this same heuristic's failure mode, one level
    down (the same reasoning as #17, progressive disclosure, and #11, IA as pyramid, applied to
    filter controls specifically). Caught on this project's own `/components` sidebar, twice: once
    for having no status filter at all, and again when the toggle added for it overflowed its
    column once one label ran longer than its neighbors. Component rule: `NavIndex` picks
    `SegmentedControl` or `MultiSelect` per dimension based on its real cardinality, never a
    hand-rolled row of buttons.

43. **A scrollable list fades into a "mist" at whichever edge still has more content, and only
    that edge** — a hard-cropped edge on an overflowing list gives no visual signal that content
    continues past it, especially with a scrollbar styled thin or hidden; a soft fade-to-
    transparent gradient does, without adding scrollbar chrome of its own. The mist must track
    real scroll position, not render unconditionally: the *absence* of mist at an edge is what
    signals "nothing more that way," not a separate label — a static CSS-only fade that never
    reacts to scroll position fails this outright. Component rule: `SectionNav` toggles its
    top/bottom mist from its own real scroll position; the same treatment is owed to any other
    fixed-height scrollable region this library ships (several don't have it yet — a real, open
    gap, not a solved case).

44. **A tracking indicator below the fold stays visible, or returns to view shortly after a
    manual override** — a highlight showing "where you are" in a long, independently-scrollable
    list is a beacon: the one fixed point a reader re-orients around. If the list's own rail
    scrolls far enough to carry the beacon out of its visible area, that's a silent failure worse
    than never highlighting anything — it stops working with no sign it has. But a beacon that
    fights every manual scroll of that rail, snapping back the instant someone tries to look
    elsewhere, is worse than one that disappears; the fix must yield to a deliberate override and
    resume only once that override has genuinely ended. Component rule: `SectionNav` scrolls
    itself to keep the active item in view, deferring for a short pause after a real manual scroll
    of its own rail before resuming, rather than fighting it immediately.

45. **A control's own footprint stays bounded, however much data it holds** — a component whose
    content depends on open-ended data (a growing selection, a long list) is pinned to a fixed
    size rather than left to grow indefinitely and push surrounding layout around as more gets
    added; content that could genuinely be unbounded goes *inside* that fixed footprint via
    contained scrolling (#43, #44), not by growing the footprint itself. "Infinite scroll" is
    license for a page-level feed to keep loading, not for an individual control to keep growing
    with it. Caught live in this project's own first draft of `MultiSelect`, whose trigger
    summarized a selection by joining every picked label end to end — its own width growing
    without bound as more got checked, not a hypothetical failure. Component rule: `MultiSelect`'s
    trigger shows a plain count once there's more than one pick, never a growing joined string.

46. **A beacon out of view gets a directional hint that reacts to motion, and the scroll that
    follows it eases rather than snaps** — #44 established that a beacon should stay visible or
    return to view; this refines how both halves actually feel. A beacon's *absence* alone is a
    weak signal, but a *static* hint at the edge it's past still blends into static chrome — what
    actually reads as "something is happening over there" is the hint reacting to motion itself:
    resting while nothing is scrolling, animating only while a scroll that could be moving the
    beacon is actually in progress. And the scroll that restores a beacon should ease smoothly
    toward its new position rather than snap in a single frame — a snap reads as the list jumping
    to a new state, an eased scroll reads as the beacon being *followed*. Component rule:
    `SectionNav` renders a small dot-or-bar marker (sized by recent scroll speed) at whichever
    edge the beacon sits past, and calls `scrollTo({ behavior: "smooth" })` for every follow or
    recenter rather than assigning scroll position directly.

47. **A drop zone expands as a compatible drag nears it, to push a successful placement toward
    100%** — Fitts's Law applied to drag-and-drop: a target's *effective* size, not its resting
    size, is what determines whether a drop lands. A drop zone that stays a small, fixed hit area
    the entire time a compatible item is being dragged toward it makes a successful drop a matter
    of pixel-precise aim; growing the zone (and giving it a clear, animated visual signal) the
    moment a compatible drag is in reach removes that precision tax entirely, at the one moment it
    matters most. Never expand a zone that's about to reject the drop anyway (already at its
    limit) — that would be actively misleading, not helpful. Component rule: `Kanban`'s section
    drop targets track `dragenter`/`dragleave` (filtered so hovering between cards inside the same
    section doesn't flicker the expansion) and grow their own padding the moment a compatible drag
    enters, paired with `activeBorder` (an animated light beam traveling the target's edge,
    `Card`'s own `activeBorder` flag — see below) as the visual signal. A flag on `Card` and
    similarly-shaped elements generally, not a Kanban-only style, so any "this is an active target"
    signal in this library looks and behaves the same way.

48. **Every mouse-only interaction needs a real touch equivalent, not just a desktop affordance** —
    `onDoubleClick` is the concrete, recurring case: a touch device never fires a real `dblclick`
    at all, so a feature gated behind one is simply unreachable on a phone or tablet, not merely
    awkward. A long touch-press (hold without releasing or dragging, past a short delay) is the
    real substitute users already expect from touch interfaces generally — this is a known, easy
    gap to miss when a feature is built and tested mouse-first, not a hypothetical edge case.
    Touch content also needs to stay natively scrollable (real `overflow`/momentum scrolling, never
    `touch-action: none` applied broadly enough to block it) wherever a mouse user could otherwise
    scroll with a wheel. Component rule: `useLongPress` (`packages/core/src/useLongPress.ts`) is the
    shared hook — cancels itself if the touch moves or ends before the delay elapses (the same
    "moved past a threshold means this wasn't the gesture" discipline `Kanban`'s own click-vs-drag
    conflict resolution already uses), so it never fires mid-scroll or mid-drag. `Kanban`'s
    default-variant cards pair `onDoubleClick` (opens the card's edit modal) with this hook on the
    same element — two independent triggers for the same action, not one replacing the other,
    since a touch device never fires the mouse event and a mouse never fires a touch one. Any
    future double-click-gated feature should follow the same pairing.

    Audited directly against this rule, not assumed clean: every `onDoubleClick` usage in
    `packages/core` (`Kanban`'s default-variant cards, the only one) already has its `useLongPress`
    pairing. Every `touch-action`/`overflow: hidden` in `packages/core`'s stylesheet was checked for
    whether it blocks legitimate scroll content: `Slider`'s `touch-action: none` is correct as-is
    (prevents page-scroll interference while dragging its own thumb, not a scrollable content area
    a mouse user could otherwise wheel-scroll); `Carousel`'s viewport `overflow: hidden` is its
    slide-windowing mechanism, not a blocked scroll area (it has no native swipe-scroll to block);
    `Card`'s title `overflow: hidden` is a line-clamp, not a scroll container; `Table`'s own
    `.rebar-table-scroll` wrapper already sets `overflow: auto` (both axes, touch-scrollable by
    default), so a wide table — including the wide comparison tables on `/benchmarks`' printed
    `stats-table`/`table` blocks — scrolls within itself on a narrow viewport rather than forcing
    the page to scroll horizontally. No gap found.

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
  size threshold; skeleton loading state, not a spinner, for row-level loading. Pagination and
  virtualization solve different problems, not the same one — pagination is for a bounded,
  navigable collection; virtualization (rendering only the rows near the viewport) is for a single
  very tall scroll a user is meant to move through continuously without page breaks. A future
  standalone `Table` component should support both, not treat virtualization as a bigger pagination.
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

- **Nav overflow: a header's nav never consumes more than half the header** — no single nav item
  should ever cause the horizontal nav to extend past the halfway point of its containing header;
  once an item would cross that line, it (and everything after it) collapses into a trailing
  "More" popover instead, stacked vertically inside. This mirrors Material Design's app-bar
  overflow-menu guidance (low-priority actions collapse into an overflow icon once the bar can't
  fit them) and Carbon's UI Shell header nav, applied as a firm width budget rather than a vague
  "if it doesn't fit" rule — a header's other content (branding, a version number, account
  controls) needs guaranteed room too, not whatever's left over after nav claims it. `NavBar`
  (`packages/core`) implements the collapse mechanics via real-time measurement (`ResizeObserver`);
  the 50%-of-header budget itself is enforced by whoever places it, via a `max-width: 50%`
  container — see `packages/core/src/components/NavBar.tsx`'s own doc comment for why that split
  exists. Dogfooded on this site's own header (`SiteHeader.tsx`).

These defaults live in `packages/core` component implementations and `packages/theme-*`
stylesheets — this document is the reference for what those values *should* be and why, kept in
sync as the implementation evolves.
