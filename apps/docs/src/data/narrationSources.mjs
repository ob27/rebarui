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
];
