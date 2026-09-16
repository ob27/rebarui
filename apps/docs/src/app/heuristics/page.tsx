import { Heading, Image, Stack, Text } from "rebar-ui";

export default function HeuristicsPage() {
  return (
    <Stack gap="lg" style={{ maxWidth: 800 }}>
      <Image src="/catalogue-heros/heuristics.jpeg" alt="Heuristics hero" style={{ width: "100%", borderRadius: "8px" }} />

      <Heading level={1}>Design Heuristics</Heading>
      <Text color="secondary">
        Condensed from <code>ref/HEURISTICS.md</code> — one line each. Read the full file for
        sourced reasoning and component-specific guidance.
      </Text>

      <Heading level={2}>Behavioral heuristics</Heading>
      <Text size="xs" color="secondary" style={{ marginTop: -16, marginBottom: 8 }}>
        From Nielsen, Shneiderman, Gestalt
      </Text>

      <Stack gap="sm">
        {[
          ["Visibility of system status", "every async action shows loading/success/error within ~300ms; active/selected/current state is always visually indicated."],
          ["Match with the real world", "plain-language labels; no jargon in built-in copy."],
          ["User control and freedom", "every modal/dialog is closable via close-button, backdrop click, and Esc; every destructive action is confirmable."],
          ["Consistency and standards", "one token set, one type scale, one spacing scale, applied identically everywhere."],
          ["Error prevention", "required fields marked, submit disabled until valid, inline validation on blur."],
          ["Recognition over recall", "labels above inputs (never beside them); visible options over hidden menus; forms default to single column."],
          ["Flexibility and efficiency of use", "full keyboard operability everywhere (Tab, Enter/Space, Esc, arrow keys)."],
          ["Aesthetic and minimalist design", "show only what's relevant by default; paginate rather than dump everything."],
          ["Help users recover from errors", "specific, actionable messages ('Email is required,' not 'Error 400')."],
          ["Proximity, similarity, closure (Gestalt)", "related controls close (--rebar-space-xs); unrelated groups apart (--rebar-space-md+)."],
        ].map(([title, desc]) => (
          <Stack key={title} gap="xs">
            <Text style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>{title}</Text>
            <Text color="secondary">{desc}</Text>
          </Stack>
        ))}
      </Stack>

      <Heading level={2}>Visual and interaction heuristics</Heading>

      <Stack gap="sm">
        {[
          ["IA as pyramid", "don't split related content across pages where a filter/search could reduce page count."],
          ["Visual hierarchy in every container", "title, content, actions zones with differentiated visual weight."],
          ["Icons require labels or tooltips", "icons alone force guesswork."],
          ["Menus manage their own complexity", "8+ items auto-insert separators or collapse into submenus."],
          ["Settings are categorized, searchable, and resettable", ""],
          ["Charts ship with context", "title, axis labels/legend, units; hover surfaces exact values; selecting persists the tag."],
          ["Progressive disclosure: ≤7-9 visible options", "essentials first, advanced on demand."],
          ["Menus don't obscure their content", "solid, muted backgrounds, not dithered or saturated."],
          ["Touch targets ≥ 44×44px", "Apple HIG minimum for interactive elements."],
          ["All states designed, not just happy path", "loading (skeleton, not spinner), error, empty, disabled."],
          ["Animation is purposeful and 200-500ms", "interruptible, serves feedback/continuity/focus."],
          ["Controls map naturally to their effects", "button labels are action verbs ('Save', 'Delete')."],
          ["Follow platform conventions", "iOS tab bar bottom, Android top; macOS menus in menu bar, etc."],
          ["Whitespace is active", "separates, groups, creates hierarchy; not wasted space."],
          ["Button hierarchy is clear", "primary/secondary/tertiary distinct; one primary per container."],
          ["Input constraints are visible", "character limits, required fields, format requirements shown before/during input."],
          ["Multiple input methods", "Select for browsing, Combobox for type-to-filter; DatePicker for entry, Calendar for picking."],
          ["Information scent in navigation", "labels indicate what's ahead, not vague or clever names."],
          ["Cards are self-contained, independently actionable units", ""],
          ["Respect user intelligence", "no condescension, no dark patterns."],
        ].map(([title, desc]) => (
          <Stack key={title} gap="xs">
            <Text style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>{title}</Text>
            {desc ? <Text color="secondary">{desc}</Text> : null}
          </Stack>
        ))}
      </Stack>

      <Heading level={2}>Extended heuristics</Heading>

      <Stack gap="sm">
        {[
          ["Boot/init sequences show branded, phased progress", "never a blank wait."],
          ["Storage/item-count context is always visible", "not hidden behind a query."],
          ["File/data browsers offer both icon-grid and sortable table views", "of the same data."],
          ["Keyboard shortcuts are discoverable and consistent", "Ctrl/Cmd+S always saves."],
          ["Drag-and-drop has a clear drop target and non-destructive cancel path", ""],
          ["Undo/redo for every state-changing action", ""],
          ["Multi-selection is explicit and visible", "checkbox, highlight, counter; 'select all' available."],
          ["Drag-and-drop is never the only way", "every drag has a non-drag equivalent."],
          ["Tooltips don't obscure the element they describe", ""],
          ["Error messages are specific, actionable, adjacent to their field", ""],
          ["Lifecycle status is a pill (Tag), never inline parenthetical text", ""],
          ["Filter UI matches independent dimensions", "search for one category, add filter controls per additional dimension; control type scales to cardinality (toggle → closed-menu multi-select → searchable multi-select)."],
          ["Scrollable lists fade into a 'mist' at edges with more content", "reaching the true end is signaled by the mist's absence."],
          ["A tracking beacon below the fold stays visible, or returns after manual override", "yields to deliberate scroll, resumes after idle."],
          ["A control's footprint stays bounded", "however much data it holds — pinned size with contained scrolling, not growing indefinitely."],
          ["A beacon out of view gets a directional hint that reacts to motion", "the scroll that restores it eases, doesn't snap."],
        ].map(([title, desc]) => (
          <Stack key={title} gap="xs">
            <Text style={{ fontWeight: "var(--rebar-font-weight-semibold, 600)" }}>{title}</Text>
            {desc ? <Text color="secondary">{desc}</Text> : null}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
