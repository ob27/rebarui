// Single source of truth for what apps/docs/scripts/generate-narration.mjs synthesizes. Kept in
// sync BY HAND with the real page copy it mirrors (packages/placement/src/schema.ts's
// `doc-section` `narration` field, and each archetype essay page's own text) — see CLAUDE.md's
// narration-regeneration rule for when to update this alongside a content edit.
//
// The five tier pages' Philosophy / "When to reach for this tier" text is copied verbatim from
// apps/docs/src/app/{imitations,synthetics,opinions,orders,geneses}/page.tsx, with each page's own
// `${count}` interpolation resolved to its real, current value (imitation=33, synthetic=49,
// opinion=94, order=14 — see apps/docs/src/data/constructTier.ts's CONSTRUCT_TIER.component map).
// If those counts change, update them here too — they're spoken text, not live-computed.
export const NARRATION_SOURCES = [
  {
    id: "imitations-philosophy",
    text: `Imitations are the floor of the tier ladder — static, standalone primitives with no composition of other named components, and no real state beyond mirroring one caller-controlled value for the controlled/uncontrolled convention. 33 ship today. Every other tier is built out of these, directly or through composition; nothing in this catalog is built out of something smaller. A block can never be an Imitation — a block is always at least a fixed composition of components, so the placement layer's Packer doesn't touch this tier at all. It's components-only.

The two tests that actually decide membership, both mechanically checkable by reading the source rather than guessing from the name: the composition test — does this component import and render another named rebar-ui component? If so, it's at least a Synthetic, not an Imitation, no matter how simple it looks. The state test — does its own useState do anything beyond mirroring one caller-owned value for controlled/uncontrolled use? If it branches into meaningfully different rendered or behavioral modes, it's not an Imitation either.`,
  },
  {
    id: "imitations-when-to-reach",
    text: `Reach for an Imitation when the thing you're building wraps one real semantic HTML element (or, occasionally, one Radix primitive) with no awareness of siblings and no internal decision-making beyond "what value do I currently hold." A Checkbox mirroring one boolean is the canonical case. The moment you find yourself importing Button to render inside your new component, or branching your JSX on more than one internal state variable, you've already left this tier — that's not a failure, it just means the thing you're building is a Synthetic or an Opinion, and should be classified and tested as one.

A real, enforced example from this codebase: Pagination, SegmentedControl, Selector, and NumberInput all deliberately reimplement their own raw button internally instead of importing the real Button component, specifically to stay Imitation. When a later audit found ToggleGroup, Carousel, and AiChatInput quietly breaking that same rule, all three were reclassified to Synthetic to match — not exceptions, the rule enforced consistently.`,
  },
  {
    id: "synthetics-philosophy",
    text: `Synthetics are static compositions and groupings of primitives with a unified purpose, but still no real dynamism — a fixed layout, not a state machine. 49 ship today, and most placement-layer blocks — roughly half the whole catalog — land here too: plain content shapes with nothing bound to live data or a handler. A Synthetic is what you get when the requirement is "arrange several things together and give them one identity," and nothing about that arrangement changes at runtime beyond whatever a parent re-render already does.

Composing one interactive sub-component as a single non-core slot doesn't automatically promote the whole thing to Opinion — only if that interactivity is the component's own defining purpose. Card, AspectRatio, and Descriptions each optionally accept an Opinion-grade child in one slot and stay Synthetic, because being a card, or a fixed-ratio box, or a label-and-value list, is still what they're for, not the interactivity riding along inside them.`,
  },
  {
    id: "synthetics-when-to-reach",
    text: `Reach for a Synthetic when you're combining multiple Imitations, or other Synthetics, into one coherent, reusable unit, and the result never needs to branch its own behavior based on internal state — a chart with no hover or selection interactivity, a fixed multi-field summary, a static progress indicator. If your design doc says "this needs to remember whether it's open," "this needs to validate as the user types," or "this needs to filter its own list," you've already crossed into Opinion territory — build it there instead of half-heartedly bolting state onto a Synthetic.`,
  },
  {
    id: "opinions-philosophy",
    text: `Opinions carry real internal state: validation, morphing, multi-step flow, drag and reorder, search and filter, open and closed with focus management. 94 ship today — the largest tier by far, since "has a real state machine" covers most of what makes a UI feel alive. The dividing line isn't state presence, it's state richness: a checkbox mirroring one caller-owned boolean stays Imitation; a component with open-closed, filtered-list, highlighted-index, and selection state, like Combobox, is an Opinion, because its internal state causes it to branch into meaningfully different rendered and behavioral modes, not just reflect one value back.

The delegated-state exception matters more here than anywhere else: you cannot determine tier by grepping a component's own file for useState. Several Opinions show zero own state because they delegate their entire state machine to a wrapped Radix primitive, a shared chart hook, or another Opinion-tier construct. Card is the one construct that genuinely needed two tier placements over one artifact: its default configuration is Synthetic, but the editable variant grafts real click-to-edit state and is an Opinion — a prop-level variant, not a forked duplicate export.

For a block, Opinion isn't a judgment call at all — it's mechanical, computed directly off the schema. A block is an Opinion if and only if its own variant in the schema declares a source field or an on-verb handler, cross-verified against the tier table at compile time — the two can't silently disagree.`,
  },
  {
    id: "opinions-when-to-reach",
    text: `Reach for an Opinion when the real requirement forces genuine internal state that changes what gets rendered or how the user can interact next — not just a value being held, but a mode being entered. If a Radix primitive already models the interaction you need — a popover, a dialog, a select, a tabs strip — delegate to it rather than reimplementing focus-trapping and keyboard navigation by hand; that's not a lesser Opinion, it's most of this tier's real membership.`,
  },
  {
    id: "orders-philosophy",
    text: `Orders are macro and page-level structural governance — constructs that arrange other things at a page or app scale, like nav bars, sidebars, tab strips that swap whole panels, page-level overlay and panel systems, and page indexes, rather than carrying their own data-shaped state as their main purpose. 14 components ship today, plus a handful of blocks. Read literally, "Order" looks like a fourth rung on the Imitation, Synthetic, Opinion complexity ladder; it isn't — it's a different axis entirely, macro governance versus behavioral complexity, which is why only a small minority of the whole placement-layer catalog is Order rather than the whole thing.

Order is judged by page-structural role, not by the absence of a state machine — SectionNav and NavIndex both have real scroll-spy and search state and are still Orders, because that state exists in service of governing where the reader's attention sits on the page, not as the construct's own defining interaction.`,
  },
  {
    id: "orders-when-to-reach",
    text: `Reach for an Order when the construct's job is to decide where other content lives, appears, or is currently focused — not to hold its own data. Ask: does this arrange the page around it, or does the page arrange around what this holds? A tab strip that swaps whole panels is an Order; a single tab's own content is whatever tier that content already is. Because this tier is deliberately small and touches shared page structure, a new Order candidate is worth extra scrutiny — open an issue before building one, since it's more likely to interact with other pages' layout than a typical new Imitation or Synthetic.`,
  },
  {
    id: "geneses-philosophy",
    text: `Geneses are a different kind of thing from the other four tiers, not a fifth rung above Order. Imitation, Synthetic, Opinion, and Order classify individual constructs — a component or a block. A genesis is a whole, complete, production-ready application built entirely out of those constructs: not a piece you import, but a seed you clone. That's why a genesis is never a component or a block.

The point of a genesis isn't to demonstrate one construct in isolation — every other tier's own reference page already does that. It's to demonstrate the composition discipline: how a real app structures itself around the Packer, where hand-authored code is still the right call versus where it should be a printed page, and how project-specific constructs get added when the shipped catalog doesn't quite fit a particular domain.`,
  },
  {
    id: "geneses-when-to-reach",
    text: `You don't reach for a genesis the way you'd pick an Imitation or an Opinion for one new piece of UI — you clone one when you're starting a new project and want a working, opinionated foundation rather than an empty repository. Once you're inside a genesis, the tier question comes right back: any new piece of UI that project needs still gets classified the normal way, Imitation through Synthetic through Opinion through Order, same as it would in the main library.`,
  },
  {
    id: "archetypes-the-button",
    text: `Every UI construct has an ancestor. Not a metaphor — an ancestor. The button didn't appear when someone drew a rectangle on a screen and decided it should be clickable. It appeared when someone first pushed a lever and watched a machine respond. The rectangle on the screen is the latest form in a lineage that stretches back through switches, levers, and the fundamental physics of mechanical advantage. And that lineage still shapes how the button works today — not as decoration, but as engineering.

The lever. Start at the beginning. A lever is one of the six classical simple machines — a rigid bar pivoting around a fulcrum, trading distance for force. Push down on one end, the other end goes up. Archimedes described it around 260 BC, but it predates any description by millennia. Every human who has ever pried a rock loose with a stick understood the lever before it had a name.

The lever's essential property is mechanical advantage: a small force applied over a large distance produces a large force over a small distance. This is not a UI concern. It is a physics concern. But it is the same physics that makes a button work — a small finger-press, amplified through a mechanism, producing a decisive state change in something much larger than your finger.

Three things matter about the lever as an archetype: input, a deliberate, directed force; transmission, the mechanism that converts that force; and output, a clear, irreversible state change. Every button inherits this three-part structure, whether the transmission is a physical lever, an electrical switch, or a JavaScript event handler.

The switch. The switch is the lever's first specialization for control. Where a lever moves things — lifts, pries, presses — a switch changes states. On or off. Connected or disconnected. The toggle switch, the rocker switch, the push-button switch: each one is a lever optimized for the binary decision. Small travel, definite endpoints, tactile confirmation at each extreme.

The switch adds something the raw lever doesn't require: state memory. A lever returns to rest when you let go. A switch stays. The toggle stays up. The rocker stays down. The push-button clicks and holds. This is the origin of the digital concept of persistent state — the idea that an interaction doesn't just produce an effect, it produces a condition that endures until the next interaction.

Notice what the switch also gives us: bistability. Two stable positions, with a clear transition between them. This is the physical prototype of the boolean. Every toggle in every UI is a physical switch's shadow — and the reason toggles feel intuitive is that everyone alive has operated a light switch before they've ever seen a screen.

The push-button. The push-button is where the lineage narrows to the form we recognize. It collapses the lever's bar to a single point of contact — a surface you press with a fingertip. The mechanical advantage is hidden inside: a spring returns it, a snap-action mechanism gives it that crisp click, a contact bridge closes an electrical circuit. But the user's experience is pure input: press here, something happens.

The push-button's critical innovation is concentration of intent. A lever's input surface is the whole bar — you can push anywhere along it, with varying force and direction. A button's input surface is one spot, one direction, down, one kind of action, press. This is not a loss — it's a gain. By removing every degree of freedom except press or don't press, the button makes the interaction unambiguous. The machine knows what you meant. You know what the machine will do.

This is the design principle that survives the transition to screens: reduce the input to a single unambiguous gesture, and the output becomes unambiguous too. The digital button inherits this constraint. It has no position, no pressure sensitivity, no direction. You tap it or you don't. And because the input is unambiguous, the system's response can be immediate and certain — the same certainty a physical button's click provides.

The digital button. When a digital button appears on screen, it carries the entire lineage with it — whether its designer knows it or not. The raised rectangle is the push-button's surface. The hover state is the pre-press — the moment your finger commits before the click. The active, pressed state is the snap-action mechanism's threshold. The release and the resulting action are the contact closing. The whole sequence is a mechanical switch's travel curve, rendered in pixels instead of springs.

This is why buttons that don't behave like buttons feel wrong. A button that doesn't respond on press but on release — technically a valid design choice — feels like a switch with a broken spring. A button with no pressed state feels like pushing a surface that doesn't move. A button that triggers on hover feels like a mechanism that fires before you've committed. Each violation is a violation of the physical archetype, not just a UI convention.

This is also why the digital button can be almost infinitely restyled and still work. Change its color, its shape, its size, its label — it still reads as a button, because the archetype is not visual. The archetype is temporal: a sequence of idle, then committed, then actuated, then returned. Get that sequence right and the button can look like anything. Get it wrong and no amount of visual polish will make it feel right.

Design implications. What does this lineage mean for someone building digital interfaces? Three things.

First: the press sequence is sacred. The lever's travel, the switch's snap, the push-button's click — these are not optional feedback. They are the mechanism's identity. A digital button needs an unambiguous pressed state, an unambiguous release, and an unambiguous result. The timing between them is the feel. Too fast and it's twitchy. Too slow and it's sluggish.

Second: bistability is a design choice, not a given. Physical switches are bistable because their mechanism requires it — the toggle must be somewhere. Digital controls don't have this constraint. A button can be momentary, press to act, release to reset, or latching, press to toggle, press again to toggle back. Choosing correctly means asking: does this action produce a state or an event? States need latching. Events need momentary.

Third: concentration of intent is the button's real power. The lever lets you push anywhere. The button lets you push here. This constraint is not a limitation — it's the reason buttons work at all. Every time you add a second action to a button, or make it context-sensitive, or give it a long-press behavior, you are un-concentrating the intent. Sometimes this is the right trade. But the cost is real: the user no longer knows what the button will do before they press it.

The archetype endures. The button is not a rectangle on a screen. The button is the latest form of a lever — a simple machine that trades distance for force, concentrates intent to a single point, and produces a decisive state change. Every design decision about a digital button — its timing, its feedback, its bistability, its constraint — is a decision about how faithfully to reproduce the archetype, or how deliberately to depart from it.

The archetype doesn't demand faithful reproduction. Digital buttons should depart from physical ones in some ways — they should be able to carry labels, to change meaning contextually, to be composed into sequences no physical button could manage. But the departures only work when the designer understands what they're departing from. A button that doesn't feel like a button isn't innovative. It's just broken in a way that a century of mechanical design had already solved.

This is the pattern for every archetype in this series. The construct's name tells you its current form. Its archetype tells you why that form works — and what breaks when you forget where it came from.`,
  },
  {
    id: "archetypes-where-interfaces-come-from",
    text: `Almost nothing in a graphical interface was invented for the screen. When computing needed a way to represent "press this to cause an effect," it didn't invent a new visual language — it borrowed one, from a century of mechanical switches, levers, and dials whose shapes already carried a shared, learned meaning. A button looks raised because a real button you could press was raised. A toggle slides because a real toggle switch slides. The digital form kept the ancestor's silhouette long after it discarded the ancestor's mechanism.`,
  },
  {
    id: "archetypes-why-ancestry-matters",
    text: `This borrowing isn't incidental decoration; it's how affordance works. James Gibson's original sense of the term — later popularized for design by Don Norman in The Design of Everyday Things — is that an object's form signals what can be done with it, because that form resembles something whose function we already understand. A raised rectangle reads as pressable before a single line of its behavior is explained, because it resembles a lever. In Peircean semiotic terms, it's functioning as an icon: a sign that means what it means by resembling its referent, not by arbitrary convention. Once a control is fully virtual, nothing physically forces it to keep that shape. A button doesn't need to look raised to be clickable; a toggle doesn't need to look like it slides. It keeps that shape because the shape is still doing communicative work — and that creates a real, practical distinction worth making deliberately rather than by habit: which features of a control's inherited form are load-bearing (they're still how a user infers its behavior) and which are just décor, carried forward because the last framework did it that way. Knowing the difference is what separates a component built on understanding from one built on imitation.`,
  },
  {
    id: "benchmarks-does-it-save-money",
    text: `Short answer: yes — real, measured savings on every model and every prompt style we've tested, from a few percent on a frontier model up to roughly three-quarters cheaper on a budget one. Everything on this page is a real number pulled from real API usage, not a guess — the methodology and every underlying data point are still here for anyone who wants to check our work, further down the page.`,
  },
  {
    id: "benchmarks-short-answer",
    text: `Building the same UI with rebar-ui instead of hand-written antd costs less, every time we've measured it — 3 to 5 percent cheaper on a top-tier model like Claude, and 25 to 75 percent cheaper on cheaper models like Qwen and Kimi. The cheaper the model you're using, the bigger rebar-ui's advantage — because most of what a model struggles with when hand-writing a UI is layout and composition decisions, and rebar-ui removes those decisions from the job entirely. The one thing rebar-ui doesn't do is look like a finished product out of the box — it's deliberately plain until you, or an agent, migrate it to a real design system once, at the end. That migration has a real cost, so the honest question is whether the savings along the way actually earn it back. We measured that too, round by round, rather than guessing: on Claude, it takes 13 to 17 rounds of revisions before rebar-ui, even counting the full cost of migrating away from it, is cheaper than antd was ever going to be. Most real projects go through more revisions than that before they ship — and if you're building something you'll never bother re-skinning at all, an internal tool, a prototype, there's no migration cost to earn back in the first place, so rebar-ui is simply cheaper, full stop.`,
  },
  {
    id: "benchmarks-conclusion",
    text: `If you're deciding whether to build with rebar-ui or hand-code against antd directly: on every model and prompt style we've tested, rebar-ui costs less and renders more consistently, from the very first build. The cheaper the model you're using, the more that matters — the gap ranges from a few percent on a frontier model up to three-quarters cheaper on a budget one. The one real cost on rebar-ui's side is migrating to a proper design system once you're done iterating — and we measured how long that takes to pay for itself rather than guess: 13 to 17 rounds of revisions, depending on complexity. Most real projects go through more revisions than that. If you're building something you won't re-skin at all, there's nothing to pay back in the first place, and rebar-ui is simply the cheaper choice throughout. Worth knowing: every number on this page compares a library the model has trained on constantly, antd, against one it's never seen before, rebar-ui — a genuinely unfair comparison in rebar-ui's favor, if anything, since it still wins despite that disadvantage.`,
  },
  {
    id: "heuristics-intro",
    text: `Every entry below is a *heuristic* — a general, judgment-requiring design principle, not a mechanical constraint. That's a deliberate distinction from a *Framework Rule* (a fixed, binary constraint on how Rebar itself is built or used — see [Agents.md](/about/agent)): a heuristic takes interpretation to apply to a new situation, where a Framework Rule has exactly one correct answer every time. These aren't just written guidance, though — they're what the *RebarUI DSL Packer* (\`@rebar-ui/placement\`'s \`BlockRenderer\`) actually does when it lays a screen out from a plain \`Construct[]\` document: given a list of named blocks and their content, it packs them onto the screen the way these heuristics say to, every time, without the author making a single layout decision. Each one below shows the real JSON fed in and the real component tree it produces — not a mockup of what it would do. For the complete list of blocks the Packer understands, independent of any one heuristic, see the [tier catalogs](/about/agent). This page groups heuristics by where they show up in the Packer's own output rather than by source — the numbered, sourced list in \`ref/HEURISTICS.md\` is the canonical one if the two ever seem to disagree on ordering.`,
  },
  {
    id: "heuristic-recognition",
    text: `Recognition over recall. Labels above inputs, visible options over hidden menus. From Nielsen's usability heuristics: a user shouldn't have to remember what a field expects — the label is always visible, always above the field it describes, in every form the Packer renders, because the form block has no code path that renders it any other way. The same reasoning is why the form block stacks fields in a single column by default: a second column forces a zigzag scan instead of a straight top-to-bottom read, and fields off the natural scan path get skipped (Luke Wroblewski's Web Form Design). Multi-column is opt-in only, for tightly related fields like first/last name.`,
  },
  {
    id: "heuristic-consistency",
    text: `Consistency and standards. One token set, one spacing scale, applied identically — no per-block one-off values. Two completely different blocks below (a callout and a data-list) share the exact same spacing rhythm and type scale, because neither one specifies its own — the Packer reads all of it from the same --rebar-* custom properties, so nothing here can drift out of sync as content changes.`,
  },
  {
    id: "heuristic-proximity",
    text: `Proximity, similarity, closure (Gestalt). Related items read as one group; the grouping comes from spacing and repetition, not a manual border or label. A checklist's items are visibly one set purely because of consistent spacing and identical card styling — Gestalt's proximity and similarity principles at work structurally, not left to per-app judgment the way a hand-authored layout could get wrong. Concretely, related items sit --rebar-space-xs (4px) apart; unrelated groups sit --rebar-space-md (16px) or more apart — the gap itself, not a label or border, is what tells a viewer which controls belong together.`,
  },
  {
    id: "heuristic-control",
    text: `User control and freedom. Every modal is closable via a close button, backdrop click, and Esc — never a dead end. Every destructive action is confirmed with the specific consequence named, never silently auto-corrected. The \`modal\` block (shown below as JSON — one of the six added for the [tier benchmarks](/about/benchmarks)) renders a real Dialog underneath (Radix UI), which wires all three closing mechanisms itself. It's deliberately rendered already-open for a static screenshot in a benchmark context, which is exactly wrong for a live documentation page stacked with other examples — a forced-open modal would cover this entire page as a fixed overlay. The [Dialog reference page](/opinions/dialog) shows the real, normally-triggered version live: click it, then try closing it all three ways. The same discipline applies to the confirmation itself: an "Are you sure?" with no other detail isn't a real confirmation — "Delete 3 files permanently?" is. \`Dialog\`'s destructive variant names the action on the confirming button ("Delete", not "OK"), renders it in the danger color, and keeps it visually separated from any safe action nearby.`,
  },
  {
    id: "heuristic-layers",
    text: `Clear layer separation. Whenever content renders in front of other content, the two need their own distinct visual surface — not just z-index stacking. This is Material Design's elevation system made explicit: a shadow, a scrim, or a background color change is what tells a viewer which layer is in front — z-index alone is invisible. Found concretely in \`Spin\`: its loading overlay originally had no background of its own, just a bare icon and label floating directly on top of the dimmed content underneath, with nothing marking it as a separate surface. Fixed by giving the overlay a real background (via \`color-mix()\` against the existing \`--rebar-color-bg-primary\` token, so it automatically resolves to the right light/dark shade — component styles reference tokens, themes own the actual colors, never the other way around), the same treatment \`Dialog\`'s backdrop and \`Dropdown\`'s panel already had.`,
  },
  {
    id: "heuristic-nav-overflow",
    text: `Nav overflow. A header's nav never consumes more than half the header — items that would cross that line collapse into a trailing "More" popover instead. Mirrors Material Design's app-bar overflow-menu guidance and Carbon's UI Shell header nav, applied as a firm width budget rather than a vague "if it doesn't fit" rule — a header's other content (branding, a version number, account controls) needs guaranteed room too. \`NavBar\` handles the collapse mechanics via real-time measurement; resize the box below (or just narrow your browser — this site's own header, above, follows the identical rule).`,
  },
  {
    id: "heuristic-minimalist",
    text: `Aesthetic and minimalist design. Show only what's relevant by default — a bounded column set, not every possible field at once. The table block takes exactly the columns you give it — there's no 'show all fields' default to opt out of, so a Packer-rendered table never dumps more than the author actually asked for.`,
  },
  {
    id: "heuristic-space-dense",
    text: `Space-dense content on a text-dominant page. More than ~4 non-text elements in a row goes in a space-minimizing container, not an inline grid. This isn't a \`Block\` block (the Packer doesn't currently lay out photo galleries), but the rule is applied literally everywhere on this site itself that has one — every screenshot gallery on [/about/benchmarks](/about/benchmarks), and the reference examples on the [Carousel](/imitations/carousel) and [AspectRatio](/synthetics/aspect-ratio) pages, use \`Carousel\` instead of a grid, specifically because a wall of thumbnails works against minimalism (heuristic #7) rather than serving it. One rule for a carousel specifically: every slide inside it shares one aspect ratio, no exceptions — its viewport has one fixed height, so a mixed-ratio slide leaves visible dead space rather than the container resizing per slide. A page that genuinely needs to show many different ratios side by side (a reference catalog of every supported ratio, say) uses a plain wrapping grid instead — that's the one case a carousel can't serve.`,
  },
  {
    id: "heuristic-index",
    text: `Long text-dominant pages need a section index. More than 3 top-level headings gets an in-page index — on the right, since the left is reserved for cross-page site navigation. This page has enough top-level sections that it needs its own index — look to the right (or, on a narrow screen, notice there's no index nav shown at all, per the same heuristic's own responsive behavior). That's not a coincidence: this page is applying the rule to itself while explaining it, the same "proof by existence" discipline the rest of this site follows. The ~3-heading threshold is a starting default, not a hard rule — judge by whether scrolling past unrelated sections to reach the one you want is actually the friction, not by the raw heading count alone.`,
  },
  {
    id: "heuristic-status-visible",
    text: `Visibility of system status. Every async action shows a loading/success/error state within ~300ms of the interaction, and the user never has to guess what's active, selected, or current. Two faces of the same principle, not two separate rules: transient feedback while something is happening, and a persistent cue for whatever's already true — active tabs, selected items, current directory, sort direction — shown via highlight, checkmark, bold, or another persistent visual cue, not just during the action itself. \`Tabs\` highlights the active tab; \`Dropdown\` shows checkmarks on toggled items; \`Breadcrumb\` highlights the current location; \`Progress\` shows percentage or fraction; a sortable table shows a sort-direction indicator on its active column.`,
  },
  {
    id: "heuristic-ia-pyramid",
    text: `Information architecture as pyramid. Don't split related content onto different pages where a filter or search could reduce page count. IA should be pointy at the top, broader the further down you go. Start with high-level categories, then progressively reveal detail. A flat list of 30+ options or deep nesting (>2 levels) signals a failed information architecture. A future \`Settings\` interface (not yet built — forward guidance) uses tabbed categories or sidebar navigation; the \`table\` block provides search/filter before pagination; deep nesting is avoided in any navigation structure. This is the rule behind this site's own tier catalog pages (e.g. [/opinions](/opinions)) and this page's nav gaining a search bar and category filter once their item count grew past a flat list a reader could scan directly.`,
  },
  {
    id: "heuristic-visual-hierarchy",
    text: `Visual hierarchy in every container. Every dialog, panel, or card has three zones (title, content, actions) with clearly differentiated visual weight — size, weight, spacing. Users should scan a container's purpose in under a second. A wall of same-sized text is a wall of same-weight text — nothing stands out, nothing is scannable. Dialog titles are ≥1 step larger than body text; action buttons are separated from content by ≥1 spacing unit; primary actions are visually dominant. Components use semantic type tokens (\`heading\`, \`body\`, \`caption\`, \`label\`), never raw font sizes. [Cards](#card-layouts) are this same zone structure applied to a self-contained unit, not a separate rule.`,
  },
  {
    id: "heuristic-icon-labels",
    text: `Icons require labels or tooltips. Every icon has an adjacent text label, a tooltip, or both. Icons alone force guesswork; labels remove ambiguity. The only exception is a small set of universally recognized icons (trash = delete, magnifying glass = search, hamburger = menu) in a context where the user has already learned them. An icon-only button requires either an \`aria-label\`, a visible \`label\` prop, or a \`title\` attribute; icon-only buttons trigger a dev-mode warning.`,
  },
  {
    id: "heuristic-menu-complexity",
    text: `Menus manage their own complexity. A menu with more than ~8 items auto-inserts separators or collapses into submenus. Related items are grouped; destructive actions are separated from safe ones. Deep nesting (>2 levels) is avoided — if a submenu itself needs a submenu, the information architecture is wrong. \`Dropdown\` (real, Radix-backed) supports a \`danger\` flag per item today, giving destructive actions real visual separation from safe ones; auto-inserting separators past an item-count threshold isn't built yet (forward guidance, not current behavior) — until it is, keep any one \`Dropdown\` under the #17 ceiling by hand. See #17 below for the same item-count ceiling applied more generally, outside menus specifically.`,
  },
  {
    id: "heuristic-settings-organization",
    text: `Settings are categorized, searchable, and resettable. Any preferences or settings interface categorizes options by purpose, provides search for power users, explains what each option does, and offers reset-to-defaults. A flat list of 30+ toggles is a failed settings panel. Users who've made several changes need a safe way to experiment — without reset, they can't undo what they don't remember changing. A future \`Settings\` component (not yet built — forward guidance, like the rest of this section) would provide tabbed or sidebar categories, a label and optional description per setting, and a "Reset to Defaults" button; \`Form\` already supports a \`reset()\` method that restores initial values today.`,
  },
  {
    id: "heuristic-chart-context",
    text: `Charts ship with context. Every chart, graph, or data display has a title (what), axis labels or legend (how to read it), and units (in what measure). A chart without context is decoration, not information. Chart components ship with mandatory title, legend, and axis-label slots; they render a visible placeholder when data is absent, never a blank area. If the data can't be shown, the user should know *why* — not wonder whether the chart broke. [/about/benchmarks](/about/benchmarks)'s own \`ScatterChart\`/\`LineChart\` helpers are a real, shipped example: title and axis labels are required arguments, not optional ones a caller could forget.`,
  },
  {
    id: "heuristic-progressive-disclosure",
    text: `Progressive disclosure: default to ≤7–9 visible options. Show essential options first; reveal advanced options on demand. Default state shows 5–9 visible options, respecting Miller's Law — people reliably track 7±2 items at once before missing one or losing their place. A settings panel that shows everything at once overwhelms casual users while not serving power users (who want search or keyboard shortcuts instead). Longer lists need search, filtering, grouping, or an explicit "Advanced"/expand step — not more items crammed into the default view. Multi-step processes (tutorials, wizards, setup) show progress and provide a visible exit. \`Select\`/\`Dropdown\` show a bounded default item count before requiring scrolling or search; \`Steps\` shows current step / total steps with a visible cancel/skip action; a future \`Settings\` interface defaults to ≤7 visible options with an "Advanced" expandable section.`,
  },
  {
    id: "heuristic-menu-content-separation",
    text: `Menus don't obscure their content. Dropdowns, popovers, and menus position themselves to avoid permanently obscuring the content they control. A menu that covers the document it's formatting is a failed menu. Backgrounds should be solid or subtly textured, not dithered or noisy — dithering creates visual fatigue and reduces legibility. Background colors should be muted, not aggressively saturated — high-saturation backgrounds cause visual fatigue and reduce legibility of foreground content. \`Dropdown\`/\`Popover\`/\`HoverCard\` position themselves below or above the trigger based on available space, never over the content they relate to — Radix's own collision-aware positioning, not reimplemented here; saturated colors are reserved for accents, alerts, or interactive elements.`,
  },
  {
    id: "heuristic-touch-targets",
    text: `Touch targets ≥ 44×44 px. Every interactive element has a hit area of at least 44×44 CSS pixels — the Apple HIG minimum — even when the visible glyph is smaller. Fitts's Law: smaller targets take longer to acquire and produce more errors. On touch devices, fat-finger errors are the dominant failure mode. This applies most directly to the forthcoming Mobile Components set, but any web component reachable on a touch device is held to the same bar: \`Button\`, \`Checkbox\`, and \`Toggle\` all enforce a minimum \`min-block-size\` of 44px via component-level styles; icons inside buttons can be visually smaller, but the clickable area never is.`,
  },
  {
    id: "heuristic-all-states",
    text: `Design all states — loading, error, empty, disabled. Every component has loading, error, empty, and disabled states designed — not just the "happy path." Users encounter edge cases regularly; unhandled states break trust and workflows. A table that shows nothing when empty looks broken. A form that silently fails on error loses data. The loading state specifically uses a skeleton matching the content's real layout — a skeleton sets expectations for content structure in a way a spinner can't, and reduces perceived wait time. Every component documents and implements \`loading\` (\`Skeleton\`, already shipped, or \`Spin\` for an in-place indicator), \`error\` (a specific message with a recovery action), \`empty\` (\`Empty\`, already shipped), and \`disabled\` (visually distinct, with a tooltip explaining why) states.`,
  },
  {
    id: "heuristic-purposeful-animation",
    text: `Animation communicates, not decorates. Every animation serves a purpose: orient (where did this come from?), feedback (did my action register?), or continuity (what changed?). Purely decorative animation is removed or made optional. From Val Head's *Designing Interface Animation*: animation that doesn't answer one of those three questions is noise — and worse, it slows down users who just want to get things done. All transitions respect \`prefers-reduced-motion\` — already true today of \`Spin\`'s illustrated variants; durations are 200–500ms (fast enough to feel responsive, slow enough to be perceived); easing is \`ease-out\` for entrances, \`ease-in\` for exits. Components ship with purposeful defaults: \`Dialog\` fades in, \`Dropdown\` slides down, \`Toast\` slides in from the edge.`,
  },
  {
    id: "heuristic-natural-mappings",
    text: `Natural mappings. Controls are arranged so their spatial layout maps to what they affect — the same principle as stove burners matching their burner positions. From Don Norman's *Design of Everyday Things*: a mapping is "natural" when the relationship between control and effect is spatially obvious. A volume slider that goes up for louder, a brightness control that goes right for brighter, a tab bar whose order matches the content order — these need no labels or instructions. \`Slider\` and other spatial controls position themselves logically relative to their targets; \`Tabs\` render in document order; \`Button\` labels describe the action verb ("Save", "Delete"), not an abstract noun.`,
  },
  {
    id: "heuristic-platform-conventions",
    text: `Follow platform conventions. Respect platform-specific patterns: iOS tab bar at bottom, Android at top; macOS menus in the menu bar, Windows in the title bar. Users bring expectations from the platform; violating them increases cognitive load. This rule mostly targets the forthcoming Mobile Components set — rebar-ui today is web-only, and web has its own, looser convention space — recorded now so it's a stated design constraint by the time that set exists, not retrofitted after the fact. Forward guidance: a future mobile tab bar defaults to the bottom on iOS, top on Android, without the app needing to specify it per-platform.`,
  },
  {
    id: "heuristic-whitespace",
    text: `Whitespace is an active design element. Whitespace separates, groups, and creates hierarchy — it is not wasted space. Adequate margins and padding improve legibility and scannability. Whitespace (negative space) is one of the most powerful tools in visual design. It reduces cognitive load by giving the eye resting points and creating clear visual groups. Components use spacing tokens (\`--rebar-space-*\`) for all margins and padding; default component margin is \`--rebar-space-md\` (16px); internal padding is \`--rebar-space-sm\` (8px) or \`--rebar-space-md\` (16px). No component ships with \`margin: 0\` or \`padding: 0\` unless explicitly overridden by the consumer.`,
  },
  {
    id: "heuristic-button-hierarchy",
    text: `Button hierarchy is clear. Primary, secondary, and tertiary buttons have distinct visual weight. One primary button per container; secondary for alternatives; tertiary for low-emphasis actions. When every button looks the same, users can't tell which action is the intended one. \`Button\` has three variants: \`primary\` (filled, dominant color), \`secondary\` (outlined or subtle fill), \`tertiary\` (text-only or ghost). One \`primary\` button per dialog or form is the convention (a dev-mode warning, not a hard block, if a second one appears).`,
  },
  {
    id: "heuristic-input-constraints",
    text: `Input constraints are visible. Character limits, required fields, format requirements, and valid ranges are shown before or during input — not after submission. From *Web Form Design*: users should know constraints upfront to avoid errors. Discovering a constraint after submission wastes the user's time and causes frustration. The \`form\` block shows a \`required\` indicator before the user ever focuses a field; native \`maxLength\`/\`min\`/\`max\`/\`pattern\` constraints display as helper text, not just a silent browser rejection; validation errors appear inline on blur, not on submit.`,
  },
  {
    id: "heuristic-multiple-input-methods",
    text: `Multiple input methods. Forms and data entry support both browsing/selecting and direct input. Users have different preferences — some want to browse a list, others want to type. From *About Face*: power users want keyboard shortcuts and direct manipulation; novice users want visible options and guided workflows. Supporting both in the same component serves everyone. \`Select\` is browsing-only, with no type-to-filter — \`Combobox\` is the shipped answer for that: a real WAI-ARIA combobox (search-as-you-type over its own option list), single-select by default or a multi-select dropdown via its \`multiple\` mode. Dates get the same split across two distinct, already-shipped components rather than one that tries to do both: \`DatePicker\` is the fast, keyboard-first direct-entry shape (a bounded day/month/year numeric triplet — closer to \`NumberInput\` than a calendar), and \`Calendar\` is the browsing/visual-picking shape (a real month grid), reachable in a \`Popover\` when a trigger-button shape is wanted.`,
  },
  {
    id: "heuristic-information-scent",
    text: `Information scent in navigation. Navigation labels clearly indicate what's ahead — not vague or clever names. Users follow "information scent": clues that lead them to their goal. From the Information Foraging theory (Pirolli & Card): users behave like predators following a scent trail. When a link's label doesn't clearly match what the user is looking for, the scent goes cold and they leave. \`NavBar\` and \`Breadcrumb\` labels match destination page titles; labels describe content, not abstract concepts; clever metaphors are avoided unless universally understood (e.g. "Trash" for deletion).`,
  },
  {
    id: "heuristic-card-layouts",
    text: `Cards are self-contained units. Card-based layouts for modular, scannable content. Each card has a clear boundary (border, shadow, background), contains related information, and is independently actionable. Cards work because they combine proximity (related info in one container), closure (clear boundary), and the same title/content/actions zone structure as [heuristic #12](#visual-hierarchy) — not a separate rule. \`Card\` has a visible boundary (border or shadow) and consistent internal padding (\`--rebar-space-md\`); cards in a grid use consistent sizing or flexible layouts that don't break at any viewport width.`,
  },
  {
    id: "heuristic-respect-intelligence",
    text: `Respect user intelligence. Treat users as capable problem-solvers, not children who need to be protected from complexity or nudged toward a choice they didn't actually intend. This is Shneiderman's "support internal locus of control" golden rule made concrete, and it earns its own entry rather than folding into heuristic #4 (user control and freedom) because the two fail in different directions: #4 is about *recovering* from an action already taken; this one is about not *manufacturing* the need for that recovery in the first place — by over-confirming trivial actions, hiding real functionality behind "simplified" layers a user can't opt out of, or wording a choice to trick rather than inform. Rebar ships no generic "are you sure?" wrapper a consumer could reach for on a trivial action — the destructive-confirmation pattern in #4 is reserved for actions with a real, named consequence; button and link copy names the actual action plainly in both the accept and decline directions, with no asymmetric styling that makes one path harder to find or click.`,
  },
  {
    id: "heuristic-boot-sequences",
    text: `Boot/init sequences show branded, phased progress. A startup sequence is itself a UI: it should communicate what phase is happening, not render a silent blank wait or an unreadable dump of raw state. The app-shell-level analogue of #10 (visibility of system status) and #20 (designed loading states), applied to the one loading state that happens before any component exists yet to show it — the first of ten heuristics this section adds from a much larger research pass (636 raw candidates from historical GUI critiques and framework inventories, de-duplicated down to these ten genuinely distinct ones — see \`ref/HEURISTICS.md\` for the full accounting of what didn't survive and why). Component rule (forward-looking): no app-shell/splash primitive exists yet; when one does, it should reuse \`Progress\`/\`Spin\`'s existing state machine rather than inventing new plumbing, and show a phase label, not just a percentage.`,
  },
  {
    id: "heuristic-storage-context",
    text: `Storage/item-count context is always visible. Any view over a bounded collection shows its own size context — item count, available capacity — persistently in its own chrome, not only on demand. Users constantly need "how much is here, how much room is left" to decide whether an operation is safe; forcing a separate lookup breaks the flow of the primary task. Component rule: rebar already ships \`Statistic\`, \`Descriptions\`, and \`Progress\` — a future file/folder-browsing block should compose these into a persistent header rather than requiring a separate dialog.`,
  },
  {
    id: "heuristic-grid-and-table-views",
    text: `Icon-grid and sortable-table views of the same data. File/data browsers offer both an icon-grid view (fast visual scanning, a small or unfamiliar set) and a sortable-column table view (a large or familiar set) of the same underlying collection. The user chooses per task rather than the tool forcing one. Component rule (forward-looking): no file-browser component exists yet; when built, it should default to the \`table\` block (\`@rebar-ui/placement\`, already cited in #11) for the detail view and offer an icon-grid toggle, not the reverse.`,
  },
  {
    id: "heuristic-undisambiguated-context",
    text: `Decision dialogs show complete, undisambiguated context. Full source and destination paths in a conflict dialog, not just filenames that might collide; an empty slot explicitly labeled, not silently omitted from a list. A distinct failure mode from showing too little too late (#26) or skipping confirmation (#4) — this one is about *silent incompleteness*. Component rule (forward-looking): a future file-conflict \`Dialog\` variant should render full paths via \`Descriptions\` (already shipped) rather than bare filename strings.`,
  },
  {
    id: "heuristic-live-preview-commit",
    text: `Live preview before commit, commit as its own explicit action. A setting affecting appearance or behavior unpredictably from its label alone shows the effect live as it's adjusted, with "try it now," "keep it," and "undo everything" as three distinct actions, not one implicit commit. Sharpens #15 (settings offer reset-to-defaults) with a distinct nuance — live-preview-then-explicit-commit, not just resettability after the fact. Component rule: rebar's shipped \`Slider\` and \`Switch\` already support live \`onChange\` feedback — a future \`Settings\` interface should wire that feedback to a visible preview region and expose Apply/Save/Cancel as three distinct actions.`,
  },
  {
    id: "heuristic-ellipsis-convention",
    text: `Ellipsis marks menu items that need further input. A menu item that opens a dialog before its action completes ("Rename…") is visually distinguished from one that runs immediately ("Delete") with a trailing ellipsis. Still the standard convention in macOS/Windows/GNOME menus today, solving the blind-click problem with one character. Component rule: \`Dropdown\` (real, Radix-backed, shipped) supports a \`danger\` flag per item (#14) but has no equivalent convention for "opens further input" yet — a small, concrete gap.`,
  },
  {
    id: "heuristic-token-inputs",
    text: `Multi-value inputs render as removable tokens, not a raw string. A form field accepting multiple discrete values (tags, recipients) renders each as its own visible, individually-removable chip, rather than a single text box edited as comma-separated text. A raw delimited string is easy to silently mistype and hard to scan. Component rule: a multi-select dropdown renders each selected value as its own removable \`Tag\` chip inline with the input, not a comma-separated string — \`Combobox\`'s \`multiple\` mode is exactly this, already shipped.`,
  },
  {
    id: "heuristic-drag-and-drop-fallback",
    text: `Drag-and-drop always has a non-drag fallback. A file-upload or reorderable-list interaction that only works by dragging excludes anyone who can't perform a drag gesture, and gives no cue about where a drop will land until mid-drag. A direct extension of Nielsen's flexibility and efficiency of use (full keyboard operability everywhere, see \`ref/HEURISTICS.md\` #7) applied specifically to drag-and-drop, not a new principle on its own — a drop zone needs a persistent, labeled boundary, and every drag-only interaction needs an equivalent non-drag path (a "Browse…" button, or reorder buttons). Component rule (forward-looking): no drag-and-drop component exists yet, matching the \`FileUpload\` gap already noted in the component catalogue.`,
  },
  {
    id: "heuristic-copyable-code",
    text: `Copyable code ships with a one-click copy and visible confirmation. Any code block, command, or copyable identifier renders with an attached copy button that gives immediate, visible feedback on click, rather than a silent clipboard write. A small, sharply-scoped pattern this very docs site is a direct, immediate consumer of — every \`Code\` block on this page is a candidate. Component rule (forward-looking): no dedicated \`CodeBlock\` component exists yet; its confirmation should reuse \`Toast\`'s existing timing conventions (#21) for the transition itself, with a deliberately longer dwell time for the confirmation text.`,
  },
  {
    id: "heuristic-internationalization",
    text: `Internationalization: RTL and locale-aware formatting. Components support right-to-left layout mirroring and locale-aware date/number/currency formatting, not just English left-to-right. Checked directly against source rather than assumed: rebar-ui's stylesheet has no \`dir\`/RTL handling and no locale-formatting layer today — a genuine, currently-unaddressed gap, not a restatement of an existing rule. Component rule (forward-looking): logical CSS properties (\`margin-inline-start\` rather than \`margin-left\`) and a documented locale-formatting hook for \`Statistic\`/date-bearing components are the concrete first steps; neither exists today.`,
  },
  {
    id: "heuristic-status-pill",
    text: `Lifecycle status is a pill, never inline parenthetical text. An item's build/lifecycle status (planned, deprecated, unmeasured) renders as its own \`Tag\`, never appended into the name ("Avatar (planned)") or spelled out as a full sentence. Caught on this project's own component catalog pages, where two different ad hoc string patterns did this same job inconsistently. Component rule: \`NavIndex\`'s status field, and anywhere else an item's build status needs surfacing, renders via the real \`Tag\` component — never string concatenation.`,
  },
  {
    id: "heuristic-filter-dimensions",
    text: `Filter UI matches how many independent dimensions a list varies along, and each dimension's control matches how many values it has. A search box alone suffices only when every item shares one category; each further way items differ is a second, independent dimension needing its own filter — and that filter's control scales to its own size, in three real tiers, not two. A small fixed few is a toggle; a larger but still-scannable set where more than one value may need selecting at once is a closed-menu multi-select; a set large enough that scanning it is itself the friction is a searchable multi-select. These are genuinely different, separately-established patterns, not one restyled three ways — using the wrong tier is this same heuristic's failure, one level down. Caught on this project's own tier catalog sidebar (e.g. [/opinions](/opinions)), twice: once for having no status filter at all, and again when the toggle added for it overflowed its column once one label ran longer than its neighbors. Component rule: \`NavIndex\` picks \`SegmentedControl\` or \`MultiSelect\` per dimension based on its real cardinality, never a hand-rolled row of buttons.`,
  },
  {
    id: "heuristic-scroll-mist",
    text: `A scrollable list fades into a "mist" at whichever edge still has more content. A hard-cropped, especially hidden-scrollbar, edge on an overflowing list gives no signal that content continues past it — a soft fade-to-transparent gradient at that edge does, tracking real scroll position rather than rendering unconditionally. Reaching the true end of a list is signaled precisely by the mist's *absence* at the bottom, not a separate "you've reached the end" label — a static CSS-only fade that never reacts to scroll position fails this. Component rule: \`SectionNav\` tracks its own scroll position and toggles the top/bottom mist independently; the same treatment is owed to any other fixed-height scrollable region this library ships (several don't have it yet — a real, open gap, not a solved case). This very page's own right-hand index, now 46 entries long, is the live example — scroll it to see the mist react.`,
  },
  {
    id: "heuristic-beacon-point",
    text: `A tracking indicator below the fold stays visible, or returns shortly after a manual override. A highlight showing "where you are" in a long, independently-scrollable list is a beacon — it should stay in view as it moves, and yield to (never fight) a deliberate manual scroll of that list, resuming only once the person is done with it. If the list's own rail scrolls far enough to carry the beacon out of its visible area, that's a silent failure worse than never highlighting anything — it stops working with no sign it has. But a beacon that fights every manual scroll, snapping back the instant someone tries to look elsewhere, is worse than one that disappears — the fix has to yield to that override and resume only once it has genuinely ended. Component rule: \`SectionNav\` scrolls its own rail to keep the active item in view, deferring for a short pause after a real manual scroll of its own rail before resuming. Try it here — scroll this right-hand rail yourself, then stop scrolling the main page; after 5 idle seconds it recenters on whichever heading is currently in view.`,
  },
  {
    id: "heuristic-bounded-footprint",
    text: `A control's own footprint stays bounded, however much data it holds. A component whose content depends on open-ended data (a growing selection, a long list) is pinned to a fixed size — a set width/height, or an edge of its container — rather than left to grow indefinitely and push the surrounding layout around. Content that could genuinely be unbounded goes *inside* that fixed footprint via contained scrolling (#43, #44), not by growing the footprint itself. "Infinite scroll" is license for a page-level feed to keep loading, not for an individual control to keep growing with it. Caught live in this project's own first draft of [MultiSelect](/opinions/multi-select), whose trigger summarized a selection by joining every picked label end to end — its own width growing without bound as more got checked, not a hypothetical failure. Component rule: \`MultiSelect\`'s trigger shows a plain count once there's more than one pick, never a growing joined string.`,
  },
  {
    id: "heuristic-beacon-pointer-easing",
    text: `A beacon out of view gets a directional hint that reacts to motion, and the scroll that follows it eases rather than snaps. #44 established that a beacon should stay visible or return to view — this refines how both halves actually feel: a hint reacts to scroll motion to name the direction to look while it's out of view, and the scroll that brings it back eases smoothly rather than snapping in one frame. A beacon's *absence* alone is a weak signal, but a *static* hint at the edge it's past still blends into static chrome — what actually reads as "something is happening over there" is the hint reacting to motion itself: resting while nothing is scrolling, animating only while a scroll that could be moving the beacon is actually in progress. And the scroll that restores a beacon should ease smoothly toward its new position rather than snap in one frame — a snap reads as the list jumping to a new state, an eased scroll reads as the beacon being *followed*. Component rule: \`SectionNav\` renders a small dot-or-bar marker (sized by recent scroll speed) at whichever edge the beacon sits past, and calls \`scrollTo({ behavior: "smooth" })\` for every follow or recenter rather than assigning scroll position directly. Try it here: scroll this right-hand rail down by hand a little, then keep scrolling the main page — the beacon moves out of the rail's visible area while your manual scroll is still "in effect" (#44), and a marker appears at whichever edge it's past for as long as that lasts; stop scrolling the main page and wait, and once the idle pause elapses the rail eases back to the beacon and the marker disappears.`,
  },
];
