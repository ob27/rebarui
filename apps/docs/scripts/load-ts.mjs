// Minimal TypeScript module loader for scripts: transpiles .ts/.tsx on the fly (typescript is a docs devDependency),
// resolves "@/..." to src/, JSON imports, and leaves bare packages to Node. No bundler needed.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

export function makeLoader(root) {
  const nodeRequire = createRequire(path.join(root, "package.json"));
  const cache = new Map();
  const EXT = [".ts", ".tsx", ".js", ".json"];
  function resolveFile(base) {
    if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
    for (const e of EXT) if (fs.existsSync(base + e)) return base + e;
    for (const e of EXT) if (fs.existsSync(path.join(base, "index" + e))) return path.join(base, "index" + e);
    return null;
  }
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const mod = { exports: {} };
    cache.set(file, mod);
    if (file.endsWith(".json")) {
      mod.exports = JSON.parse(fs.readFileSync(file, "utf8"));
      return mod.exports;
    }
    const out = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      fileName: file,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const req = (spec) => {
      let p = null;
      if (spec.startsWith("@/")) p = resolveFile(path.join(root, "src", spec.slice(2)));
      else if (spec.startsWith(".")) p = resolveFile(path.resolve(path.dirname(file), spec));
      return p ? load(p) : nodeRequire(spec);
    };
    vm.runInThisContext(`(function(exports, require, module, __filename){${out}\n})`, { filename: file })(mod.exports, req, mod, file);
    return mod.exports;
  }
  return (rel) => load(path.join(root, rel));
}
