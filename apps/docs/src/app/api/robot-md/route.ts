import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

// This site is statically exported (output: "export") — the response is deterministic (a file
// read at build time), so it's pre-rendered once into a static file rather than needing a server
// runtime, same as every other route on this site.
export const dynamic = "force-static";

/**
 * Serves the real robot.md as a download, straight from packages/core — the same file that ships
 * in the rebar-ui npm tarball — rather than a duplicated static copy under apps/docs/public. Its
 * own route segment can't literally be named "robot.md" (Next.js route segments aren't arbitrary
 * filenames), so the download filename is set explicitly via Content-Disposition instead.
 */
export function GET() {
  const filePath = path.join(process.cwd(), "..", "..", "packages", "core", "robot.md");
  const content = fs.readFileSync(filePath, "utf-8");
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="robot.md"',
    },
  });
}
