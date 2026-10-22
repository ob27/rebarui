# Consuming Rebar UI from release tarballs

Pushing a tag `vX.Y.Z` runs `.github/workflows/release-tarballs.yml`, which builds the packages
with `node scripts/pack-release.mjs` and attaches these to the GitHub release:

- `rebar-ui-X.Y.Z.tgz` (core)
- `rebar-ui-placement-X.Y.Z.tgz` (`@rebar-ui/placement`)
- `rebar-ui-theme-basilika-X.Y.Z.tgz` (`@rebar-ui/theme-basilika`)

Locally: `corepack pnpm install; node scripts/pack-release.mjs` writes them to `release-artifacts/`
(gitignored). The tag must equal the version in `packages/core/package.json`.

## Install in an app

Download the assets into the app (e.g. `vendor/`, as getcodex does) or point at the URLs. For a
private repo the asset URLs need a token, so prefer downloading with `gh release download vX.Y.Z -R ob27/rebarui -D vendor`
and using `file:` paths:

```json
{
  "dependencies": {
    "rebar-ui": "file:vendor/rebar-ui-1.1.0.tgz",
    "@rebar-ui/placement": "file:vendor/rebar-ui-placement-1.1.0.tgz",
    "@rebar-ui/theme-basilika": "file:vendor/rebar-ui-theme-basilika-1.1.0.tgz"
  },
  "overrides": { "rebar-ui": "file:vendor/rebar-ui-1.1.0.tgz" },
  "pnpm": { "overrides": { "rebar-ui": "file:vendor/rebar-ui-1.1.0.tgz" } }
}
```

The override is required: `@rebar-ui/placement` depends on `rebar-ui@1.1.0` (the `workspace:*`
range is rewritten at pack time), which is not on the npm registry. Keep only the block for your
package manager (`overrides` for npm, `pnpm.overrides` for pnpm).

Import `rebar-ui/style.css` and `@rebar-ui/theme-basilika/theme.css`. React 18.3+ or 19 is a peer
dependency.
