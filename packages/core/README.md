# rebar-ui

Headless-first, intentionally low-fidelity React components — real Radix UI underneath, styled
purely via `--rebar-*` CSS custom properties (swap `@rebar-ui/theme-sketch` for
`@rebar-ui/theme-clean`, or write your own, without touching component code).

## For coding agents: read this first, not the source

**The exact prop shape of every component is in `dist/index.d.ts`** (~220 lines, one file, every
interface) — read that, not the individual files under `src/components/`. The `.tsx` source files
carry full implementation (Radix wiring, `forwardRef` boilerplate, JSX) that's irrelevant to "what
props does this take" and costs far more to read than the type declarations alone.

```
node_modules/rebar-ui/dist/index.d.ts
```

## Install

```
npm install rebar-ui @rebar-ui/theme-clean
```

```tsx
import "rebar-ui/style.css";
import "@rebar-ui/theme-clean/theme.css";
```

Set `data-rebar-theme="clean"` (or `"sketch"`) on `<html>` or any wrapping element.

## Composition recipes

**A banner row with a trailing action** (info/warning/error banner, icon + message on the left,
a button on the right — `Alert`'s `children` renders in a plain `<div>`, so any layout works
inside it, and `Stack`'s `justify="between"` handles the split without a manual style override):

```tsx
<Alert type="info">
  <Stack direction="row" align="center" justify="between">
    <Stack direction="row" align="center" gap="sm">
      <InfoIcon />
      <Text as="span" size="sm">Nothing here is saved yet.</Text>
    </Stack>
    <Button variant="secondary" size="sm" onClick={reset}>Reset</Button>
  </Stack>
</Alert>
```

**A bordered card list** (a row per item, each its own `Card`):

```tsx
<Stack gap="sm">
  {items.map((item) => (
    <Card key={item.id}>
      <Checkbox checked={item.done} onCheckedChange={(v) => toggle(item.id, v === true)}>
        {item.label}
      </Checkbox>
    </Card>
  ))}
</Stack>
```

**An icon + label row** — prefer a plain inline SVG or a Unicode glyph (`×`, `✓`, `⏳` are used
internally, e.g. `Button`'s loading state) over adding an icon package; reach for a real icon
library only if visual fidelity genuinely demands it.

## Full API reference

`dist/index.d.ts` is the source of truth. `Box`/`Stack`/`Text`/`Heading`/`Card` are generic
layout/display primitives with no external equivalent (not wrapping anything — Rebar's own
design). `Checkbox`/`Radio`/`RadioGroup`/`Switch`/`Tabs`/`Accordion` wrap the matching Radix UI
primitive directly, same prop names, so Radix's own docs apply to those unmodified. `Dialog`,
`Select`, `Tooltip`, `Popover`, `Dropdown`, `Slider`, `Progress`, `Avatar`, `Toast`/`ToastProvider`,
`Form`/`FormItem` (React Hook Form underneath) have Rebar-specific shapes — check the type first.

## Migration

`@rebar-ui/migrate-antd` codemods most components to Ant Design v6 automatically;
`MIGRATION_PROMPT.md` (repo root) covers the rest, and any other target library.
