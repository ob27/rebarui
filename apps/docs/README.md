# Rebar UI — docs / marketing site

Currently a live workbench, not the finished site — see `src/app/page.tsx` for a running
component check and build-progress checklist. Grows into the real docs/marketing site described
in [`ref/MARKETING_SITE.md`](../../ref/MARKETING_SITE.md) at Phase 6.

Built with Next.js (App Router, static export — `output: "export"`), styled entirely by
`rebar-ui` + `@rebar-ui/theme-sketch` (both workspace packages, see `package.json`). Deploys to
Firebase Hosting on the `rebarui` project (config in `.env.local`, gitignored — see
`.env.example` for the shape).

## Dev

From the repo root:

```
pnpm --filter docs dev
```

Or, since this is a Turborepo pipeline task: `pnpm run dev` from the repo root runs every app's
`dev` script, including this one.
