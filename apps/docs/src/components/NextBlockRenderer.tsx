"use client";

import Link from "next/link";
import { BlockRenderer, type Block } from "@rebar-ui/placement";

/**
 * `BlockRenderer`'s `renderLink` is a function prop, and functions can't cross the Server-to-
 * Client Component boundary in Next.js's App Router — passing one from a Server Component page
 * straight into `BlockRenderer` fails the build. This wrapper binds `next/link` on the client
 * side instead, so pages only ever pass `blocks` (plain, serializable data) across that boundary.
 */
export function NextBlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <BlockRenderer
      blocks={blocks}
      renderLink={({ href, children }) => (
        <Link href={href} className="rebar-link">
          {children}
        </Link>
      )}
    />
  );
}
