// Generates apps/docs/src/generated/component-props.json from packages/core's actual
// TypeScript prop types, so the docs site's props tables can't silently drift from the real
// component signatures (the whole reason ref/MARKETING_SITE.md calls for generation over
// hand-maintained tables). Run via predev/prebuild — the output is derived data, gitignored,
// not committed, same treatment as .next/.
import { withCustomConfig } from "react-docgen-typescript";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coreDir = path.resolve(__dirname, "../../../packages/core");
const tsconfigPath = path.join(coreDir, "tsconfig.json");

const parser = withCustomConfig(tsconfigPath, {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  propFilter: (prop) => {
    if (!prop.parent) return true;
    return !prop.parent.fileName.includes("node_modules");
  },
});

const COMPONENT_FILES = [
  "Box.tsx",
  "Stack.tsx",
  "Text.tsx",
  "Heading.tsx",
  "Button.tsx",
  "Input.tsx",
  "Card.tsx",
  "Alert.tsx",
  "Dialog.tsx",
  "Tabs.tsx",
  "Form.tsx",
];

const result = {};

for (const file of COMPONENT_FILES) {
  const filePath = path.join(coreDir, "src/components", file);
  const docs = parser.parse(filePath);
  for (const doc of docs) {
    result[doc.displayName] = Object.values(doc.props).map((prop) => ({
      name: prop.name,
      type: prop.type?.raw ?? prop.type?.name ?? "unknown",
      required: prop.required,
      defaultValue: prop.defaultValue?.value ?? null,
      description: prop.description || null,
    }));
  }
}

const outDir = path.resolve(__dirname, "../src/generated");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "component-props.json"),
  JSON.stringify(result, null, 2) + "\n",
);

console.log(
  `Generated props for ${Object.keys(result).length} components: ${Object.keys(result).join(", ")}`,
);
