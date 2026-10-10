import { defineConfig } from "tsup";

// Per-file ESM build, shipped as `dist/esm/` and used by the package's "import" export condition.
// The bundled single-file build (`tsup.config.ts`) can't be tree-shaken by a consumer's bundler:
// importing one Button used to cost ~3.5 MB because everything in the one file is kept. Emitting one
// module per source file lets any bundler skip the components an app never imports.
// Run after the main build (it must not clean `dist/`); `scripts/add-esm-extensions.mjs` then adds
// the `.js` extensions strict ESM resolvers (webpack, Node) require.
export default defineConfig({
  entry: ["src/**/*.{ts,tsx}", "!src/**/*.test.*", "!src/test/**"],
  format: ["esm"],
  bundle: false,
  dts: false,
  sourcemap: true,
  clean: false,
  outDir: "dist/esm",
  banner: {
    js: '"use client";',
  },
});
