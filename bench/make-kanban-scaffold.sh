#!/bin/bash
# Creates a fresh, empty bench/<name> scaffold for the Kanban benchmark (components-only —
# no @rebar-ui/placement dependency, since this benchmark deliberately isolates
# primitive-assembly vs. complete-unit cost, independent of the DSL wrapper question).
# Usage: ./make-kanban-scaffold.sh kanban-primitives-01
set -e
NAME="$1"
if [ -z "$NAME" ]; then echo "usage: $0 <scaffold-name>"; exit 1; fi
DIR="$(dirname "$0")/$NAME"
if [ -d "$DIR" ]; then echo "already exists: $DIR"; exit 1; fi
mkdir -p "$DIR/src"

cat > "$DIR/package.json" <<EOF
{
  "name": "bench-$NAME",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build" },
  "dependencies": {
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "rebar-ui": "workspace:*",
    "@rebar-ui/theme-clean": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.0.7"
  }
}
EOF

cat > "$DIR/vite.config.ts" <<'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
EOF

cat > "$DIR/tsconfig.json" <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
EOF

cat > "$DIR/index.html" <<EOF
<!doctype html>
<html lang="en" data-rebar-theme="clean">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>bench-$NAME</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

cat > "$DIR/src/main.tsx" <<'EOF'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "rebar-ui/style.css";
import "@rebar-ui/theme-clean/theme.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
EOF

cat > "$DIR/src/App.tsx" <<'EOF'
// Build the Sprint Board here (see bench/KANBAN_BENCHMARK_SPEC.md for the exact spec and your
// condition's constraint). Split into additional files under src/ as you see fit.
export default function App() {
  return null;
}
EOF

echo "created $DIR"
