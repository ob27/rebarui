// Builds dist/: theme.css is the token file followed by the component layer, plus the self-hosted fonts and SVG art. Plain Node so it runs the same on Windows, macOS and Linux.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync("dist", { recursive: true });
writeFileSync("dist/theme.css", readFileSync("src/theme.css", "utf8") + "\n" + readFileSync("src/components.css", "utf8"));
cpSync("src/fonts", "dist/fonts", { recursive: true });
cpSync("art", "dist/art", { recursive: true });
