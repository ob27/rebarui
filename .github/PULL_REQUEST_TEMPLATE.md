## What changed and why

<!-- One or two sentences. Link the issue this addresses, if there is one. -->

## Checklist

- [ ] `pnpm run lint`, `test`, `build`, and `typecheck` all pass locally
- [ ] New/changed behavior has test coverage (role/name, keyboard operability, `data-rebar-*`
      attributes — see `CONTRIBUTING.md`)
- [ ] Styled only through `--rebar-*` custom properties — no hardcoded pixel/color values
- [ ] If this adds a component: exported from `packages/core/src/index.ts`
- [ ] If this adds a `@rebar-ui/placement` archetype: added to the `Block` union, a `BlockRenderer`
      case, and the archetype table in `packages/placement/README.md`
- [ ] If this changes visual output: a screenshot or a link to the relevant `/components/*`
      reference page after the change

## Notes for the reviewer

<!-- Anything you're unsure about, alternatives you considered, or how you verified this works. -->
