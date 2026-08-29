# @rebar-ui/migrate-antd

A codemod that migrates `rebar-ui` usage to [Ant Design v6](https://ant.design/). The first
instance of Rebar's migration-adapter pattern — see
[ref/ARCHITECTURE.md#migration-adapters](../../../ref/ARCHITECTURE.md#migration-adapters) for why
this exists as a template for future adapters (`migrate-mui`, `migrate-shadcn`, ...), not a
one-off.

Targets v6 specifically (not v5) because v6 actually changed two things this codemod cares about,
verified directly against the live v6 API docs rather than assumed: the `size` enum is now
`small`/`medium`/`large` (`middle` is deprecated), and `Alert`'s heading prop was renamed back to
`title` — which happens to match Rebar's own prop name, so that one's no longer a rename at all.
v6 is backward-compatible with v5-style props in general, so output from an older version of this
codemod still works on v6, just with deprecation warnings on those two.

## Use

```
npx @rebar-ui/migrate-antd src/
```

Or, to preview without writing anything:

```
npx @rebar-ui/migrate-antd --dry --print src/some-file.tsx
```

Runs [jscodeshift](https://github.com/facebook/jscodeshift) under the hood with the `tsx` parser
— any flag jscodeshift accepts (`--dry`, `--print`, `--extensions`, a glob instead of a single
file) works here too.

**Run your formatter afterward.** The codemod produces syntactically correct output but doesn't
try to preserve your original formatting when it rewrites attributes/children — expect it to need
a Prettier pass.

## What this actually does (verified against real code, not just fixtures)

This was dogfooded against `apps/docs/src/app/page.tsx` in this repo during development, which
caught a real bug the synthetic test fixtures missed (see below) — treat that as the standard to
hold any changes here to, not just passing the unit tests.

- **`Button`** — `variant="primary"|"secondary"|"tertiary"` → `type="primary"|"default"|"text"`;
  `variant="destructive"` → `danger` (shorthand boolean); `size="sm"|"md"|"lg"` →
  `"small"|"medium"|"large"`. If the element already has a native HTML `type` (e.g.
  `type="submit"`), that's moved to AntD's `htmlType` prop **first** — AntD's own `type` prop
  means visual variant, not HTML button type, so without this step the naive rename produces an
  invalid duplicate `type` attribute. (This is the bug dogfooding caught.)
- **`Input`** — same `size` mapping as `Button`.
- **`Alert`** — no rename: AntD v6's `title` prop matches Rebar's own name directly (v5 called it
  `message`; v6 renamed it back to `title`).
- **`Dialog` → `Modal`** — `open`/`title`/`footer` are unchanged (already-compatible names).
  `onOpenChange` is renamed to `onCancel`, but a review comment is inserted above it: AntD's
  `onCancel` takes no argument, while Rebar's `onOpenChange(open: boolean)` does — this needs a
  human or LLM look, not a blind rename. A `description` prop (which `Modal` doesn't have) is
  moved into a `<p>` prepended to the children instead of dropped.
- **`Form`** — `onSubmit` → `onFinish` (compatible signature, both `(values) => void`).
- **`FormItem` → `Form.Item`** — `required` is kept (AntD supports it cosmetically) and a
  matching `rules={[{ required: true, message: "..." }]}` is added alongside it, since AntD's
  actual validation lives in `rules`, not the boolean alone. The render-prop children pattern
  (`{(field) => <Input {...field} />}`) is unwrapped into a plain child (`<Input />`) when it's a
  single arrow function returning one JSX element — AntD's `Form.Item` clones a single direct
  child rather than calling a render function.
- **`Checkbox`** — `onCheckedChange` → `onChange`, flagged for review: AntD's `onChange` receives
  a `CheckboxChangeEvent` (`checked` is `e.target.checked`), not a plain boolean.
- **`RadioGroup` → `Radio.Group`** — same flagged rename for `onValueChange` → `onChange`
  (AntD's carries a `RadioChangeEvent`, `value` is `e.target.value`). `Radio` itself is unchanged.
- **`Switch`, `Select`, `Slider`** — `onValueChange` → `onChange`, **not** flagged: each of these
  AntD components' `onChange` receives the new value as its first argument already (`Switch`:
  `(checked, event)`; `Select`: `(value, option)`; `Slider`: `(value)`), so the rename alone is
  compatible — unlike `Checkbox`/`Radio` above, where the whole first-argument shape differs.
- **`Tooltip`** — `content` → `title` (AntD's prop name for the same thing).

## What this does **not** migrate (by design, not oversight)

`Box`, `Stack`, `Text`, `Heading`, `Tabs`/`Tab`/`TabList`/`TabPanel`,
`Accordion`/`AccordionItem`, `Popover`, `Dropdown`, `Progress`, `Avatar`, `Toast`/`ToastProvider`
are left importing from `rebar-ui` untouched — each for a distinct, real reason, not just
"not gotten to yet":

- **`Box`/`Stack`/`Text`/`Heading`** — no direct AntD equivalent (AntD has
  `Typography.Text`/`Typography.Title`, not a generic layout primitive).
- **`Tabs` and `Accordion`** — both AntD's `Tabs` and `Collapse` use an items-array API
  (`<Tabs items={[...]} />`), which Rebar's composition (`Tabs`/`TabList`/`Tab`/`TabPanel`,
  `Accordion`/`AccordionItem`) doesn't map onto at the syntax level — flattening that safely
  needs semantic understanding of which panel pairs with which tab/section.
- **`Popover` and `Dropdown`** — a *structural* mismatch, not just a naming one: Rebar's `trigger`
  prop holds the trigger element, but AntD's `trigger` prop is an interaction-mode string
  (`"hover"|"click"`) with the trigger element passed as `children` instead. Renaming our
  `trigger` prop would silently produce broken code (an element where AntD expects a string),
  which is worse than leaving it alone.
- **`Progress`** — AntD's `percent` assumes a 0–100 scale; Rebar's `Progress` has a separate `max`
  that isn't necessarily 100, so a value needs *computing* (`(value / max) * 100`), not renaming.
- **`Avatar`** — AntD's fallback content is `children`; Rebar's is a `fallback` prop — a
  prop-to-children structural move, not a rename.
- **`Toast`/`ToastProvider`** — AntD doesn't have a `Toast` component at all; it has imperative
  `message.success()`/`notification.open()` function calls. Different paradigm entirely, not a
  naming gap.

Don't attempt to extend this codemod to guess at any of these — hand them to
[`MIGRATION_PROMPT.md`](../../../MIGRATION_PROMPT.md) (the LLM-assisted path) instead, where a
model can actually reason about the restructuring each one needs.
