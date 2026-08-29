# Agent guidance for `rebar-ui`

For exact prop shapes, read `dist/index.d.ts` (~220 lines, every component's interface in one
file) — do not open `src/components/*.tsx` for API lookups; that source carries implementation
detail (Radix wiring, `forwardRef` boilerplate) irrelevant to prop shapes and far more expensive
to read. See `README.md` in this package for install steps and composition recipes.
