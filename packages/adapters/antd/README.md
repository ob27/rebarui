# @rebar-ui/migrate-antd

A codemod that migrates `rebar-ui` usage to [Ant Design v5](https://ant.design/). The first
instance of Rebar's migration-adapter pattern — see
[ref/ARCHITECTURE.md#migration-adapters](../../../ref/ARCHITECTURE.md#migration-adapters) for why
this exists as a template for future adapters (`migrate-mui`, `migrate-shadcn`, ...), not a
one-off.

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
  `"small"|"middle"|"large"`. If the element already has a native HTML `type` (e.g.
  `type="submit"`), that's moved to AntD's `htmlType` prop **first** — AntD's own `type` prop
  means visual variant, not HTML button type, so without this step the naive rename produces an
  invalid duplicate `type` attribute. (This is the bug dogfooding caught.)
- **`Input`** — same `size` mapping as `Button`.
- **`Alert`** — `title` → `message` (AntD's prop name for the same thing).
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

## What this does **not** migrate (by design, not oversight)

`Box`, `Stack`, `Text`, `Heading`, `Tabs`, `Tab`, `TabList`, `TabPanel` are left importing from
`rebar-ui` untouched. `Box`/`Stack`/`Text`/`Heading` have no direct AntD equivalent (AntD has
`Typography.Text`/`Typography.Title`, not a generic layout primitive) and `Tabs`' composition API
(`Tabs`/`TabList`/`Tab`/`TabPanel`) doesn't map onto AntD v5's items-array API
(`<Tabs items={[...]} />`) at the syntax level — flattening that safely needs semantic
understanding of which `TabPanel` pairs with which `Tab`, which is exactly what
[`MIGRATION_PROMPT.md`](../../../MIGRATION_PROMPT.md) (the LLM-assisted path) is for. Don't
attempt to extend this codemod to guess at those — hand them to the prompt instead.
