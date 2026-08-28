import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/transform.ts", "src/cli.ts"],
  format: ["cjs"],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ["jscodeshift"],
});
