// Copies the theme into dist/. Plain Node so it runs the same on Windows, macOS and Linux (the sibling themes use `mkdir -p && cp`).
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });
copyFileSync("src/theme.css", "dist/theme.css");
