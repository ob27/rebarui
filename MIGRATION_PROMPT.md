# Rebar migration prompt

Paste this to a coding agent (Cursor, Copilot, Claude Code, etc.) along with the files you want
migrated off `rebar-ui`, and the name of the target design system. It's the general-purpose
complement to codemods like `@rebar-ui/migrate-antd`: use it for anything a syntax-level codemod
can't safely automate — component shapes that differ structurally (not just prop names), and any
target system that doesn't have a dedicated adapter package yet.

**If a `@rebar-ui/migrate-<target>` package exists for your target (currently: `antd`), run that
first.** It handles the purely mechanical renames faster and more reliably than an LLM pass. Use
this prompt afterward to finish what the codemod explicitly leaves alone, and to review anything
it flagged with a `rebar-migrate:` comment.

---

## The prompt

> You are migrating a React codebase off `rebar-ui` (a headless, low-fidelity component library)
> onto **`<TARGET_SYSTEM>`**. Rebar's whole design is built so this migration is mechanical, not a
> rewrite — every component wraps a real semantic HTML element or an accessible headless
> primitive, carries `data-rebar-*` attributes for testing, and is styled purely through CSS
> variables with no component logic depending on the current theme.
>
> **Rules:**
>
> 1. Replace each `rebar-ui` component with its closest `<TARGET_SYSTEM>` equivalent. Prefer an
>    exact 1:1 prop rename where the concept is the same (e.g. a visual-emphasis prop, a
>    controlled-open boolean) over introducing new behavior.
> 2. **Never delete a `data-rebar-*` or `data-testid` attribute.** Pass it through to the
>    replacement component's root DOM node — every one of these libraries accepts arbitrary
>    `data-*` props on their components. Existing Playwright/testing-library selectors depend on
>    these surviving the migration untouched.
> 3. Preserve every ARIA role, label, and keyboard interaction exactly. If `<TARGET_SYSTEM>`'s
>    equivalent component renders different DOM/ARIA output, call it out explicitly rather than
>    silently changing it — don't assume it's fine.
> 4. Where a Rebar component has no direct equivalent (a generic layout primitive like `Box` or
>    `Stack`, for instance), replace it with plain semantic HTML and CSS (flexbox/grid) rather
>    than forcing it into an unrelated `<TARGET_SYSTEM>` component. Don't invent a component that
>    doesn't exist in the target library.
> 5. Where a Rebar component's *composition shape* differs from the target's (e.g. Rebar's
>    `Tabs`/`TabList`/`Tab`/`TabPanel` vs. an items-array API), read every `Tab`/`TabPanel` pair
>    carefully and reconstruct the equivalent structure completely — don't drop any tab or
>    silently merge content.
> 6. Do not change business logic, state management, or event-handler bodies unless the target
>    component's callback signature genuinely requires it (e.g. a handler that received an `open`
>    boolean but the target's callback takes no argument) — and when you do change one, leave a
>    comment explaining exactly why, so it's reviewable.
> 7. If you see a comment starting with `rebar-migrate:`, it was left by an automated codemod
>    flagging something it deliberately didn't try to fix itself (usually a semantic mismatch
>    between two callback signatures). Resolve it thoughtfully, then remove the comment.
> 8. After migrating, the CSS variable theme (`--rebar-*` tokens, `data-rebar-theme` attribute)
>    becomes dead weight for anything you migrated — remove the now-unused theme imports and
>    attribute only once every component on the page has been migrated, not before.

---

## Why this exists as a prompt and not only a codemod

A codemod (AST-level, syntactic) is faster and more reliable for purely mechanical renames, but
can't safely do things that require understanding *what the code means* — reconstructing an
items-array from loose composition, or judging whether an event handler's behavior still makes
sense after a signature change. See
[ref/ASSESSMENT.md](ref/ASSESSMENT.md#keep-but-change) for why Rebar leans on both: codemods for
what's safe to automate, this prompt for what needs judgment.
